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
				</div>
			</section>
			{if count($contents)}
				<section class="span9 pagecontent">
					{foreach $contents as $block}
						{partial name=$block['type'] template=$block['template']}
							{include file=$template }
						{/partial}
					{/foreach}
				</section>
			{/if}
			
			
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
