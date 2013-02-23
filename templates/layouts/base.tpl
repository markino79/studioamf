{extends "layouts/structure.tpl"}

{block "body"}
	<header class="navbar navbar-fixed-top">
		<div class="navbar-inner">
			<div class="container-fluid">
				<a class="brand" href="/">Artera Micro Framework</a>
				<ul class="nav">
					<li class="active"><a href="/"><i class="icon-white icon-home"></i> Home</a></li>
					<li><a href="/apidocs/"><i class="icon-white icon-book"></i> API Docs</a></li>
					<li><a href="/docs/faq.html"><i class="icon-white icon-question-sign"></i> FAQ</a></li>
					<li><a href="mailto:info@artera.it"><i class="icon-white icon-envelope"></i> Contact</a></li>
				</ul>
			</div>
		</div>
	</header>
	
	<div class="container-fluid">
		<div class="row-fluid">

			<section class="span3">
				<div class="well">
					{block "sidebar"}{markdown}
##### Documentation #####

- [Setup](/docs/setup.html)
	- [Clone from git](/docs/setup.html#clone-from-git)
	- [Webserver Setup](/docs/setup.html#webserver-setup)
	- [PHP Webserver](/docs/setup.html#php-webserver)
	- [Directory Permissions](/docs/setup.html#directory-permissions)
	- [PHP Requirements](/docs/setup.html#php-requirements)
- [Tutorial: First project](/docs/first-project.html)
	- [Layout](/docs/first-project.html#layout)
	- [Bootstrap](/docs/first-project.html#bootstrap)
	- [Configuration](/docs/first-project.html#configuration)
- [Configuration Options](/docs/configuration-options.html)
- Components
	- [Assetic](/docs/components/assetic.html)
	- [Crypt](/docs/components/crypt.html)
		- [Bcrypt](/docs/components/crypt.html#bcrypt)
		- [SSHA](/docs/components/crypt.html#ssha)
	- [ProxyClass](/docs/components/proxyclass.html)
	- [Registry](/docs/components/registry.html)
	- [StringIterator](/docs/components/stringiterator.html)
- [FAQ](/docs/faq.html)
{/markdown}{/block}
				</div>
			</section>

			<section class="span9 pagecontent">
				{block "content"}{/block}
			</section>
		</div>
	</div>
	
	<footer class="footer">
		<div class="container">
			<p id="html5logo" class="pull-right"><a href="http://www.w3.org/html/logo/">
				<img src="/images/html5-badge-h-css3-semantics.png" width="165" height="64" alt="HTML5 Powered with CSS3 / Styling, and Semantics" title="HTML5 Powered with CSS3 / Styling, and Semantics">
			</a></p>
			
			<p>Designed with <a href="http://twitter.github.com/bootstrap" rel="external">Twitter Bootstrap</a></p>
			<p>&copy;2011&dash;2013 <a href="http://www.artera.it" rel="external">Artera S.r.l.</a></p>
		</div>
	</footer>
{/block}
