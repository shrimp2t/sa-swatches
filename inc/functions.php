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
		$assets['files']['js'] =  SA_WC_BLOCKS_URL . 'build/' . $path . '.js';
	}

	$css_file = SA_WC_BLOCKS_PATH . "/build/{$path}.css";
	if (file_exists($css_file)) {
		$assets['files']['css'] =  SA_WC_BLOCKS_URL . 'build/' . $path . '.css';
	}

	return $assets;
}



function get_wc_tax_attrs()
{
	$key = 'sa_attr_map_types';
	if (isset($GLOBALS[$key])) {
		return $GLOBALS[$key];
	}
	$attribute_taxonomies = wc_get_attribute_taxonomies();
	$attr_map_types = [];
	if (!empty($attribute_taxonomies)) {
		foreach ($attribute_taxonomies as $tax) {
			$name =  wc_attribute_taxonomy_name($tax->attribute_name);
			$attr_map_types[$name] = $tax->attribute_type;
		}
	}
	$GLOBALS[$key] = $attr_map_types;
	return $attr_map_types;
}


function get_ajax_configs()
{

	$config =  [
		'root' => esc_url_raw(rest_url()),
		'ajax' => add_query_arg(['action' => 'sa_wc_ajax', 'nonce' => wp_create_nonce('sa_wc_ajax')], admin_url('admin-ajax.php')),
		'nonce' => wp_create_nonce('wp_rest'),
	];

	return $config;
}
