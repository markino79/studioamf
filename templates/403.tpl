{extends "layouts/base.tpl"}

{block "content" append}
	<h1>403 - Forbidden</h1>

	<p>{$message|default:"You don't have the necessary authorizations to access the requested resource."}</p>
{/block}