<?php
namespace Controllers;

use Amf\Application;

/**
 * @default_action index
 */
class Home extends Base{
	/**
	 * @action
	 */
	public function index() {
		return $this->_renderLayout('home_index');
	}
}
