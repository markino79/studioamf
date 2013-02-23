{extends "layouts/base.tpl"}

{block "content" append}
	<h1>400 - Bad Request</h1>

	<p>{$message|default:"The received request is invalid!"}</p>
{/block}