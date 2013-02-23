{extends "layouts/structure.tpl"}

{block "body"}
	{include file='layouts/inc/header.tpl' }
	
	<div class="container-fluid">
		<div class="row-fluid">
			{include file='layouts/inc/column-left.tpl' }
			{include file='layouts/inc/content.tpl' }
		</div>
	</div>
	{include file='layouts/inc/footer.tpl' }

{/block} 
