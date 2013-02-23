/*
---

script: Log.js

description: Provides basic logging functionality for plugins to implement.

license: MIT-style license

authors:
- Guillermo Rauch
- Thomas Aylott
- Scott Kyle

requires:
- core:1.2.4/Class
- /MooTools.More

provides: [Log]

...
*/

(function(){
	var global = this;

	var log = function(){
		if (global.console && console.log){
			try {
				console.log.apply(console, arguments);
			} catch(e) {
				console.log(Array.slice(arguments));
			}
		} else {
			Log.logged.push(arguments);
		}
		return this;
	};

	var disabled = function(){
		this.logged.push(arguments);
		return this;
	};

	this.Log = new Class({

		logged: [],

		log: disabled,

		resetLog: function(){
			this.logged.empty();
			return this;
		},

		enableLog: function(){
			this.log = log;
			this.logged.each(function(args){
				this.log.apply(this, args);
			}, this);
			return this.resetLog();
		},

		disableLog: function(){
			this.log = disabled;
			return this;
		}

	});

	Log.extend(new Log).enableLog();
})();

String.implement({
	startsWith: function(s) {
		return this.substr(0,s.length)==s;
	},
	replaceAll: function(searchValue, replaceValue, regExOptions) {
		return this.replace(new RegExp(searchValue, [regExOptions,"gi"].pick()), replaceValue);
	},
	gsub: function(search, replace) {
		return this.split(search).join(replace);
	},
	urlEncode: function() {
		if (this.indexOf("%") > -1) return this;
		else return escape(this);
	},
	htmlEntitiesEncode: function() {
		var enc = this.toString();
		enc = enc.gsub("&","&amp;");
		enc = enc.gsub("<","&lt;");
		enc = enc.gsub(">","&gt;");
		return enc;
	},
	injectHTML: function(inside, excludeScripts) {
		var els = Elements.from(this.toString(), excludeScripts);
		els.inject(inside);
		return els;
	},
	toClipboard: function() {
		try {
			document.execCommand('Copy', this.toString());
		} catch(e) {
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			} catch(e) {
				if (Browser.Engine.gecko)
					alert("Browser security settings doesn't allow this action to be taken.\n\nSet the 'signed.applets.codebase_principal_support' property in the 'about:config' page to true/1 if you want to enable this feature.");
				return this;
			}
			try {
				clip = Components.classes["@mozilla.org/widget/clipboard;1"].createInstance(Components.interfaces.nsIClipboard);
			} catch(e) {
				return this;
			}
			try {
				transf = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
			} catch(e) {
				return this;
			}
			transf.addDataFlavor("text/unicode");
			suppstr = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
			suppstr.data = this.toString();
			transf.setTransferData("text/unicode",suppstr,this.length*2);
			try {
				clipi = Components.interfaces.nsIClipboard;
			} catch(e) {
				return this;
			}
			clip.setData(transf,null,clipi.kGlobalClipboard);
		}
		return this;
	},
	camelToTitle: function() {
		return this.replace(/([A-Z])/g, ' $1').trim();
	}
});

Element.tDataRegExp = new RegExp("_\\|JS:(.*)\\|_");

(function() {
	function isBody(element){
		return (/^(?:body|html)$/i).test(element.tagName);
	};

	Element.implement({
		searchAttachedData: function() {
			this.getElements("[title]").each( function(elem) {
				elem.storeAttachedData();
			} );
		},

		// Cerca dati json inclusi nel parametro title e ne fa lo store in "tData". I dati json devono essere racchiusi tra "_|JS:" e "|_"
		storeAttachedData: function() {
			var t = this.get("title");
			var matches = Element.tDataRegExp.exec(t);
			if (matches) {
				try {
					var data = JSON.decode(matches[1]);
					this.store("tData", data);
					this.set("title", t.gsub(matches[0],""));
				} catch(e) {
					Log.log("storeAttachedData", e);
				}
			}
		},

		inlineEdit: function(options) {
			return new InlineEdit(this, options);
		},

		hide: function(){
			var d;
			try {
				// IE fails here if the element is not in the dom
				if ((d = this.getStyle('display')) == 'none') d = null;
			} catch(e){}

			return this.store('originalDisplay', d || '').setStyle('display', 'none');
		},

		show: function(display){
			return this.setStyle('display', display || this.retrieve('originalDisplay') || '');
		},

		enable: function() {
			return this.set('disabled','');
		},

		disable: function() {
			return this.set('disabled','disabled');
		},

		tabify: function(options) {
			var ts = new TabSwapper(Object.merge({
				tabs: this.getElement(".tabs").getChildren(),
				sections: this.getElement(".contents").getChildren(),
				smooth: true
			}, options)).showSection(0);
			return this.store("tabSwapper", ts);
		},

		getCells: function() {
			if (this.cells)
				return this.cells;
			else
				return this.getElements("td");
		},

		getSiblings: function() {
			return this.getAllPrevious().extend(this.getAllNext());
		},

		toQueryString: function(){
			var queryString = [];
			this.getElements('input[name][type!=submit], select[name], textarea[name]').each(function(el){
				if (el.disabled) return;
				var value = (el.tagName.toLowerCase() == 'select') ? Element.getSelected(el).map(function(opt){
					return opt.value;
				}) : ((el.type == 'radio' || el.type == 'checkbox') && !el.checked) ? (el.type == 'checkbox' ? '' : null) : el.value;
				Array.from(value).each(function(val){
					queryString.push(el.name + '=' + encodeURIComponent(val));
				});
			});
			return queryString.join('&');
		},

		toHash: function(){
			var hash = {};
			this.getElements('input[name][type!=submit], select[name], textarea[name]').each(function(el){
				if (el.disabled) return;
				var value = (el.tagName.toLowerCase() == 'select' && el.multiple) ? Element.getSelected(el).map(function(opt){
					return opt.value;
				}) : ((el.type == 'radio' || el.type == 'checkbox') && !el.checked) ? null : el.value;
				if (el.type != 'radio' || value != null || !hash[el.name])
					hash[el.name] = value;
			});
			return hash;
		},

		toggleClass: function(className) {
			if (this.hasClass(className))
				this.removeClass(className);
			else
				this.addClass(className);
			return this;
		},

		cloneWithEvents: function(contents, keepid, type) {
			return this.clone(contents, keepid).cloneEvents(this, type);
		},

		fxBlindDown: function(options) {
			options = Array.from({
				direction: 'auto'
			}, options);

			if (!this.fullHeight) this.fullHeight = this.getDimensions().y;

			if (options.direction == 'auto')
				options.direction = this.getHeight() == 0 ? 'down' : 'up';

			var dim;
			if (options.direction == 'down')
				dim = [0, this.fullHeight];
			else
				dim = [this.fullHeight, 0];

			return this.setStyles({height: dim[0]+"px", overflow: 'hidden'}).show().tween('height', dim);
		},

		highlightOpacity: function() {
			var fx = this.retrieve("highlightOpacityFx");
			if (!fx) {
				fx = new Fx.Morph(this, {
					link: "cancel",
					duration:500
				});
				fx.addEvent("onChainComplete", function() {
					this.start({
						'opacity':1
					});
				}.bind(fx));
				this.store("highlightOpacityFx", fx);
			}
			fx.start({
				'opacity':0
			});
			return this;
		},
		blinkFx: function(index, frequency, recurse) {
			if (!recurse) {
				index = [index,4].pick() * 2;
				frequency = [frequency,150].pick();
			}

			(function(){
				this.toggleClass('blinked');
				index--;
				if (index>0)
					this.blinkFx(index, frequency, true);
			}).delay(frequency,this);
		},
		getFxFadedShowHide: function() {
			var fx = this.retrieve("fxFadedShowHide");
			if (!fx) {
				fx = new Fx.Morph(this, {
					link: "cancel"
				}).addEvent("onChainComplete", function() {
					if (this.getStyle("opacity") == 0) {
						this.hide();
					} else {
						this.setStyle("height","");
					}
				}.bind(this));
				this.store("fxFadedShowHide", fx);
			}
			return fx;
		},
		fxFadedHide: function() {
			if (this.isVisible()) {
				this.store("fxFadedShowHide-Height", this.getSize().y);
				this.getFxFadedShowHide().start({
					opacity: 0,
					height: 0
				});
			}
			return this;
		},
		fxFadedShow: function() {
			if (!this.isVisible()) {
				var h = [this.retrieve("fxFadedShowHide-Height"), 0].pick();
				this.store("fxFadedShowHide-Height", 0);
				var morph = {opacity:1};
				if (h>0)
					morph.height = h;
				this.setStyles({
					display: '',
					opacity: 0
				}).getFxFadedShowHide().start(morph);
			}
			return this;
		}
	});
})();

Number.format_regex = /(\d+)(\d{3})/;
Number.implement({
	format: function(precision, decimal_point, thousands_sep) {
		decimal_point = [decimal_point, "."].pick();
		thousands_sep = [thousands_sep, ""].pick();

		var x = this.toFloat().round(precision).toString().split("."), x1, x2;
		x1 = x[0];
		if (precision > 0) {
			if (x.length > 1) {
				if (x[1].length < precision)
					x[1] += "0".repeat( precision-x[1].length )
				x2 = x.length > 1 ? decimal_point + x[1] : "";
			} else {
				x2 = decimal_point+"0".repeat(precision);
			}
		} else {
			x2 = "";
		}
		if (thousands_sep != "") {
			while (Number.format_regex.test(x1)) {
				x1 = x1.replace(Number.format_regex, "$1" + thousands_sep + "$2");
			}
		}
		return x1 + x2;
	},

	humanize: function(precision, options) {
		options = Object.merge({startUnit: "", machineK: false, unitType: ""}, options);

		precision = [precision, 0].pick();
		num = this.toFloat();

		var units = ["","K","M","G","T","P"];
		var unitX = units.indexOf(options.startUnit);
		var divisor = options.machineK ? 1024 : 1000;

		while (num>=divisor && unitX<units.length) {
			unitX++;
			num /= divisor;
		}
		return num.localized()+units[unitX]+options.unitType;
	},

	localized: function (monetary) {
		var n = "", num = this.toFloat(), sign, sign_posn, sep_by_space, cs_precedes;
		if (num>=0) {
			sign = localeconv['positive_sign'];
			sign_posn = localeconv['p_sign_posn'];
			sep_by_space = localeconv['p_sep_by_space'];
			cs_precedes = localeconv['p_cs_precedes'];
		} else {
			sign = localeconv['negative_sign'];
			sign_posn = localeconv['n_sign_posn'];
			sep_by_space = localeconv['n_sep_by_space'];
			cs_precedes = localeconv['n_cs_precedes'];
		}

		if (monetary) {
			var symbol = localeconv['currency_symbol'];
			//-€ -#- €-
			//012345678
			var a = new Array(9);

			switch(sign_posn) {
				case 1: a[3] = sign; break;
				case 2: a[5] = sign; break;
				case 3: symbol = sign+symbol; break;
				case 4: symbol += sign; break;
				default: n += " [error sign_posn="+sign_posn+"&nbsp;!]";
			}

			if (cs_precedes) {
				a[1] = symbol;
				if (sep_by_space) a[2] = " ";
			} else {
				if (sep_by_space) a[6] = " ";
				a[7] = symbol;
			}
			a[4] = Math.abs(num).format(localeconv['frac_digits'], localeconv['mon_decimal_point'], localeconv['mon_thousands_sep']);
			n = a.join("");
		} else {
			n = Math.abs(num).format(localeconv['frac_digits'], localeconv['decimal_point'], localeconv['thousands_sep']);
			switch(sign_posn) {
				case 0: n = "("+n+")"; break;
				case 2: case 4: n += sign; break;
				case 1: case 3: n = sign+n; break;
				default: n += " [error sign_posn="+sign_posn+"&nbsp;!]";
			}
		}

		return n;
	}
});

Window.implement({
	getMedia: function() {
		var el = new Element("DIV", {"class": "no_print", styles: {"height":"0","width":"0"}}).inject(this.document.documentElement);
		var media = (el.getStyle("display") == "none") ? "print" : "screen";
		el.dispose();
		return media;
	}
});

Element.Events.valuechange = {
	base: "keyup",
	condition: function(event) {
		if ( [event.target.retrieve("last_value"), ""].pick() != event.target.value) {
			event.target.store("last_value", event.target.value);
			return true;
		} else return false;
	}
};

/* Fix per evento scroll in mootools 1.2.4, in attesa di chiusura bug #795 https://mootools.lighthouseapp.com/projects/2706/tickets/795-custom-events-based-on-scroll-dont-check-for-condition */
Element.NativeEvents.scroll = 2;
Element.Events.scrollend = {
	base: "scroll",
	condition: function(event) {
		return event.target.getHeight() + event.target.getScroll().y >= event.target.getScrollHeight();
	}
};

// http://blog.kassens.net/outerclick-event
(function(){
	var events;
	var check = function(e){
		var target = document.id(e.target);
		var parents = target.getParents();
		events.each(function(item){
			var element = item.element;
			if (element != target && !parents.contains(element))
				item.fn.call(element, e);
		});
	};
	Element.Events.outerClick = {
		onAdd: function(fn){
			if(!events) {
				window.addEvent('click', check);
				events = [];
			}
			events.push({element: this, fn: fn});
		},
		onRemove: function(fn){
			events = events.filter(function(item){
				return item.element != this || item.fn != fn;
			}, this);
			if (!events.length) {
				window.removeEvent('click', check);
				events = null;
			}
		}
	};
})();

if (typeof(Tips) != 'undefined') {
	Tips = Class.refactor(Tips, {
		initialize: function(){
			this.previous.pass(arguments, this)();
			document.id(this).hide();
		},

		position: function(event){
			if (!this.tip) document.id(this);

			var size = window.getSize(), scroll = window.getScroll(),
				tip = {x: this.tip.offsetWidth, y: this.tip.offsetHeight},
				props = {x: 'left', y: 'top'},
				bounds = {y: false, x2: false, y2: false, x: false},
				obj = {},
				alignOffsets = {x:this.options.offset.x, y:this.options.offset.y};

			var alignment = [this.options.alignment, 'right'].pick();

			if (alignment == 'left')
				alignOffsets.x += -this.tip.getDimensions().x;
			else if (alignment == 'center')
				alignOffsets.x += this.eventElement.getDimensions().x/2 - this.tip.getDimensions().x/2;

			if ( [this.options.verticalAlignment, 'bottom'].pick() == 'top')
				alignOffsets.y += -this.tip.getDimensions().y;

			for (var z in props){
				obj[props[z]] = event.page[z] + alignOffsets[z];
				if (obj[props[z]] < 0) bounds[z] = true;
				if ((obj[props[z]] + tip[z] - scroll[z]) > size[z] - this.options.windowPadding[z]){
					obj[props[z]] = event.page[z] - alignOffsets[z] - tip[z];
					bounds[z+'2'] = true;
				}
			}

			this.fireEvent('bound', bounds);
			this.tip.setStyles(obj);
		},

		// Fix per mootools more 1.2.4.[12], rimuovere in versioni successive
		fireForParent: function(event, element){
			if( element && typeof element.getParent() == 'function' ) {
				parentNode = element.getParent();
				if (parentNode == document.body) return;
				if (parentNode.retrieve('tip:enter')) parentNode.fireEvent('mouseenter', event);
				else this.fireForParent(parentNode, event);
			} else return;
		},

		elementEnter: function(event, element){
			this.eventElement = element;
			return this.previous(event, element);
		}
	});
}

if (Browser.Features.Touch && typeof(Drag) != 'undefined') {
	Drag = Class.refactor(Drag, {
		options: {
			preventDefault: true
		},

		move: function(x, y) {
			var fxOptions = {
				position: 'upperLeft',
				offset: {x:x, y:y},
				duration: 50,
				transition: Fx.Transitions.Linear,
				onComplete: function() {
					this.moveFx = null;
					if (this.nextMoveFx) {
						this.nextMoveFx.start();
						this.moveFx = this.nextMoveFx;
						this.nextMoveFx = null;
					}
				}.bind(this)
			};

			if (this.moveFx) {
				this.nextMoveFx = new Fx.Move(this.element, fxOptions);
			} else {
				this.moveFx = new Fx.Move(this.element, fxOptions).start();
			}
		},

		attach: function() {
			this.handles.addEvent('touchstart', this.bound.start);
			return this.previous();
		},

		detach: function() {
			this.handles.removeEvent('touchstart', this.bound.start);
			return this.previous();
		},

		start: function(event){
			this.previous(event);
			this.document.addEvents({
				touchmove: this.bound.check,
				touchend: this.bound.cancel
			});
		},

		check: function(event){
			if (this.options.preventDefault) event.preventDefault();
			var distance = Math.round(Math.sqrt(Math.pow(event.page.x - this.mouse.start.x, 2) + Math.pow(event.page.y - this.mouse.start.y, 2)));
			if (distance > this.options.snap){
				this.cancel();
				this.document.addEvents({
					touchmove: this.bound.drag,
					touchend: this.bound.stop
				});
				this.fireEvent('start', [this.element, event]).fireEvent('snap', this.element);
			}
		},

		drag: function(event){
			var options = this.options;

			if (options.preventDefault) event.preventDefault();
			this.mouse.now = event.page;

			var offset = {};

			for (var i=0; i<2; i++) {
				var z = ['x', 'y'][i];
				this.value.now[z] = this.mouse.now[z] - this.mouse.pos[z];

				if (options.invert) this.value.now[z] *= -1;

				if (options.limit && this.limit[z]){
					if ((this.limit[z][1] || this.limit[z][1] === 0) && (this.value.now[z] > this.limit[z][1])){
						this.value.now[z] = this.limit[z][1];
					} else if ((this.limit[z][0] || this.limit[z][0] === 0) && (this.value.now[z] < this.limit[z][0])){
						this.value.now[z] = this.limit[z][0];
					}
				}

				if (options.grid[z]) this.value.now[z] -= ((this.value.now[z] - (this.limit[z][0]||0)) % options.grid[z]);

				offset[z] = this.value.now[z];
			}

			this.move(offset['x'], offset['y']);

			this.fireEvent('drag', [this.element, event]);
		},

		cancel: function(event){
			this.document.removeEvents({
				touchmove: this.bound.check,
				touchend: this.bound.cancel
			});
			this.previous(event);
		},

		stop: function(event){
			this.document.removeEvents({
				touchmove: this.bound.drag,
				touchend: this.bound.stop
			});
			this.previous(event);
		}
	});
}

Locale.use("it-IT");
