{extends "layouts/base.tpl"}

{block "content" append}
	<h1>404 - Not Found</h1>

	<p>{$message|default:"Oops, page not found!"}</p>
{/block}