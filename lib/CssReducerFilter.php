<?php
use Assetic\Filter\FilterInterface;
use Assetic\Asset\AssetInterface;

/**
 * Filters assets through CssMin.
 *
 * @link http://code.google.com/p/cssmin
 * @author Kris Wallsmith <kris.wallsmith@gmail.com>
 */
class CssReducerFilter implements FilterInterface
{
    private $filters;
    private $plugins;

    public function __construct()
    {
        $this->filters = array();
        $this->plugins = array();
    }

    public function setFilters(array $filters)
    {
        $this->filters = $filters;
    }

    public function setFilter($name, $value)
    {
        $this->filters[$name] = $value;
    }

    public function setPlugins(array $plugins)
    {
        $this->plugins = $plugins;
    }

    public function setPlugin($name, $value)
    {
        $this->plugins[$name] = $value;
    }

    public function filterLoad(AssetInterface $asset)
    {
    }

    public function filterDump(AssetInterface $asset)
    {
        $min = new \CssReducer\Minifier;
        $asset->setContent($min->minify($asset->getContent(), [
			'remove_comments' => true,
			'remove_whitespaces' => true,
			'remove_tabs' => true,
			'remove_newlines' => true,
        ]));
    }
}
 
