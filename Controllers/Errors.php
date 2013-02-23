<?php
namespace Controllers;

use Amf\Application;
use Amf\Response\Http;

class Errors {
	/**
	 * @action
	 * @render 400.tpl
	 */
	public function bad_request() {}

	/**
	 * @action
	 * @render 403.tpl
	 */
	public function forbidden() {}

	/**
	 * @action
	 * @render 404.tpl
	 */
	public function not_found() {
		// handle resources 404 with a minimalist message
		$request = Application::get('request');
		if ($request->header('referer', false) !== false && preg_match("/\.(jpe?g|gif|bmp|png|tiff|svg|css|js|otf|ttf|woff)$/i", $request->parent->path, $matches)) {
			$response = new Http\NotFound("<h1>404 - Not Found</h1>");
			$response->break = true;
			return $response;
		}

		$catched_responses = Application::get('catched_responses', array());
		$last_catched_response = array_pop($catched_responses);
		if ($last_catched_response !== null)
			return array('message' => $last_catched_response->content);
	}

	/**
	 * @action
	 * @render 500.tpl
	 */
	public function internal_server_error() {}
}
