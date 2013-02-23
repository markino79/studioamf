var CoolDialog = new Class({
	Implements: [Options, Events],

	options: {
		id: "",
		buttons: 0,
		title: "Alert",
		movable: false,
		mask: false,
		closeButton: true
	},

	initialize: function(options) {
		this.setOptions(options);

		if (typeof(this.options.buttons) == 'number') {
			var buttons = [];
			if ([CoolDialog.Ok, CoolDialog.OkCancel].contains(this.options.buttons))
				buttons.push( "OK" );
			if ([CoolDialog.YesNo, CoolDialog.YesNoCancel].contains(this.options.buttons)) {
				buttons.push( "No" );
				buttons.push( "Yes" );
			}
			if ([CoolDialog.OkCancel, CoolDialog.YesNoCancel].contains(this.options.buttons))
				buttons.push( "Cancel" );
			this.options.buttons = buttons;
		}
	},

	build: function() {
		this.element = new Element('DIV', {'class': "cool-dialog", id: this.options.id}).store("cool-dialog", this);
		if (this.options.closeButton)
			new Element('DIV', {'class': "cool-dialog-close", html: "×"}).addEvent('click', this.close.bind(this)).inject(this.element);
		this.title = new Element('DIV', {'class': "cool-dialog-title", html: this.options.title}).inject(this.element);
		this.content = new Element('DIV', {'class': "cool-dialog-content", html: this.options.message}).inject(this.element);

		var buttonsArea = new Element('DIV', {'class': "cool-dialog-buttonsarea"}).inject(this.element);

		this.options.buttons.each(function(button) {
			new Element('BUTTON', {
				'class': "cool-dialog-button",
				html: button
			}).addEvent('click', function() {
				this.close();
				this.fireEvent(button);
			}.bind(this)).inject(buttonsArea);
		}, this);

		new Element('DIV', {styles: {clear: "both"}}).inject(this.element);

		this.element.inject(document.body);

		if (this.options.movable) {
			var cursor_grab = "move", cursor_grabbing = "move";
			if (Browser.chrome || Browser.safari) {
				cursor_grab = "-webkit-grab";
				cursor_grabbing = "-webkit-grabbing";
			} else if (Browser.firefox) {
				cursor_grab = "-moz-grab";
				cursor_grabbing = "-moz-grabbing";
			} else if (Browser.ie) {
				cursor_grab = "url(http://www.google.com/intl/en_ALL/mapfiles/openhand.cur), move";
				cursor_grabbing = "url(http://www.google.com/intl/en_ALL/mapfiles/closedhand.cur), move";
			}

			this.title.setStyle('cursor', cursor_grab);
			this.title.addEvent('mousedown', function() {
				this.title.setStyle('cursor', cursor_grabbing);
				this.element.setStyle('cursor', cursor_grabbing);
			}.bind(this));
			this.title.addEvent('mouseup', function() {
				this.title.setStyle('cursor', cursor_grab);
				this.element.setStyle('cursor', "");
			}.bind(this));

			new Drag.Move(this.element, {
				handle: this.title
			});
		}

		return this;
	},

	show: function() {
		if (!this.element)
			this.build();
		this.element.position({
			position: "center"
		});
		document.body.mask();
		this.element.show();
		return this;
	},

	close: function() {
		if (this.element && this.element.isVisible()) {
			this.element.hide();
			document.body.unmask();
			this.fireEvent("close");
		}
		return this;
	},

	setTitle: function(title) {
		if (!this.element)
			this.build();
		this.title.set("html", title);
		return this;
	},

	setMessage: function(message) {
		if (!this.element)
			this.build();
		this.content.set("html", message);
		return this;
	}
});

CoolDialog.Ok = 0;
CoolDialog.OkCancel = 1;
CoolDialog.YesNo = 2;
CoolDialog.YesNoCancel = 3;

function alert(message) {
	if (!CoolDialog.alert_dialog)
		CoolDialog.alert_dialog = new CoolDialog({buttons: CoolDialog.Ok, mask: true, closeButton: false});
	CoolDialog.alert_dialog.setMessage(message).show();
}