<!DOCTYPE html>
<html lang="{$language}">
<head>
	<meta charset="utf-8">
	<title>{block "title"}Artera Micro Framework{/block}</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content="{block "description"}{/block}">
	<meta name="author" content="">

	{block "css"}
		<link rel="stylesheet" href="/main.css" type="text/css">
	{/block}

</head>
<body>
	{block "body"}{/block}
	{block "javascript"}
		<script src="/main.js" async></script>
	{/block}
	{if $console}{$console->display()}{/if}
</body>
</html>
