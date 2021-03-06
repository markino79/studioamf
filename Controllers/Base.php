<?php
namespace Controllers;

use Amf\Application;

class Base {
	public function __construct() {
	}
	protected function _renderLayout($layout_section){
		$conf = Application::get('config');
		$s = Application::get('template');
		$s->assign('contents',$conf['layout'][$layout_section]['content']);
		$s->assign('left',$conf['layout'][$layout_section]['left']);
		return $s->fetch($conf['layout'][$layout_section]['root']);
	}
}
