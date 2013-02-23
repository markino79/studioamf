<?php
use Amf\Application,
	Amf\Router,
	Amf\Route\Route,
	Amf\Route\Simple as SimpleRoute;
use Amf\Template\Smarty\Markdown as SmartyMarkdown;

require_once '../vendor/autoload.php';

SmartyMarkdown::$onPostConvertBlock[] = function($e) {
	$e->content = str_replace('<table>', '<table class="table table-condensed table-hover">', $e->content);
};

Application::bootstrap();
Application::dispatch("routes.yml");
