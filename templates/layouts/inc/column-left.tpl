{if count($left)}
	<section class="span3">
		{foreach $left as $block}
			{partial name=$block['type'] template=$block['template']}
				{include file=$template }
			{/partial}
		{/foreach}
	</section>
{/if} 
