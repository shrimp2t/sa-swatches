<?php

namespace SA_WC_BLOCKS;


function get_assets($path)
{
  $file = SA_WC_BLOCKS_PATH . "/build/{$path}.asset.php";
  if (!file_exists($file)) {
    return false;
  }

  $assets =  include $file;
  $assets['files'] = [];
  $js_file = SA_WC_BLOCKS_PATH . "/build/{$path}.js";
  if (file_exists($js_file)) {
    $assets['files']['js'] =  SA_WC_BLOCKS_URL . '/build/' . $path . '.js';
  }

  $css_file = SA_WC_BLOCKS_PATH . "/build/{$path}.css";
  if (file_exists($css_file)) {
    $assets['files']['css'] =  SA_WC_BLOCKS_URL . '/build/' . $path . '.css';
  }

  return $assets;
}
