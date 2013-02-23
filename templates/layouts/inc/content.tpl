{if count($contents)}
	<section class="span9 pagecontent">
		{foreach $contents as $block}
			{partial name=$block['type'] template=$block['template']}
				{include file=$template }
			{/partial}
		{/foreach}
	</section>
{/if} 
