<?php
namespace Controllers;

use Amf\Application;

/**
 * @default_action view
 */
class Image {
	/**
	 * @action
	 */
	public function view($filename, $w=0, $h=0) {
		$request = Application::get('request');
		$response = Application::get('response');

		$_cacheImages = Application::$basedir.'/var/cache/images/';
		if (!file_exists($_cacheImages)) {
			mkdir($_cacheImages);
			chmod($_cacheImages, 0777);
		}

		$file = Application::$basedir."/uploads/images/$filename";

		if (!file_exists($file)) {
			$response->code = 404;
			$filename = 'not_found.gif';
			$file = Application::$basedir."/public/images/$filename";
		}

		$requested_file = new \SplFileInfo($filename);

		// Calcolo un etag e lo comunico al client
		$file = new \SplFileInfo($file);
		$etag = $file->getSize().$file->getMTime();

		if ($response->code != 404) {
			if (!Application::get('config')->debug)
				$response->expiresIn(7*24*60*60);
			$response->throwIfNotModified($request, $etag, $file->getMTime());
		}

		$image = \Amf\Image::create($file->getRealPath());
		$orig_size = $image->size();

		$maxwidth = empty($w) ? $orig_size['width'] : $w;
		$maxheight = empty($h) ? $orig_size['height'] : $h;

		if ($orig_size['height'] > $maxheight || $orig_size['width'] > $maxwidth) {
			//calcolo le nuove dimensioni mantenendo il rapporto
			$height = $maxheight;
			$width = $height * ($orig_size['width'] / $orig_size['height']);
			if ($width > $maxwidth) {
				$height = $maxwidth * ($orig_size['height'] / $orig_size['width']);
				$width = $maxwidth;
			}

			$width = round($width);
			$height = round($height);

			$cachefile = $requested_file->getPathinfo()->getPathname() . '/' . $requested_file->getBasename( '.'.$requested_file->getExtension() );
			$cachefile = str_replace('/', '⁄', $cachefile);
			$cachefile = new \SplFileInfo( "{$_cacheImages}{$width}x{$height}-{$cachefile}.".strtolower($file->getExtension()) );

			if (!$cachefile->isFile()) {
				$image->resize($width, $height);
				$image->save($cachefile);
			}
		} else {
			$cachefile = $file;
		}

		$response->headers['Content-type'] = mime_content_type((string)$cachefile);
		return file_get_contents($cachefile);
	}
}
