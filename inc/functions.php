<?php

namespace SA_WC_SWATCHES;


function get_assets($path)
{
	$file = SA_WC_SWATCHES_PATH . "/build/{$path}.asset.php";
	if (!file_exists($file)) {
		return false;
	}

	$assets =  include $file;
	$assets['files'] = [];
	$js_file = SA_WC_SWATCHES_PATH . "/build/{$path}.js";
	if (file_exists($js_file)) {
		$assets['files']['js'] =  SA_WC_SWATCHES_URL . 'build/' . $path . '.js';
	}

	$css_file = SA_WC_SWATCHES_PATH . "/build/{$path}.css";
	if (file_exists($css_file)) {
		$assets['files']['css'] =  SA_WC_SWATCHES_URL . 'build/' . $path . '.css';
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




function get_text_settings_for_admin()
{
	$config = [

		'main_layout' => [
			'separate' => __('Separate', 'domain'),
			'inline' => __('Inline', 'domain'),
			'drawer' => __('Drawer', 'domain'),
		],

		'option_layout' => [
			'' => __('Default', 'domain'),
			'inline' => __('Inline', 'domain'),
			'box' => __('Box', 'domain'),
			'checkbox' => __('Checkbox', 'domain'),
		],

		'position' => [
			'before_add_cart' => __('Before add cart', 'domain'),
			'after_add_cart' => __('After add cart', 'domain'),
		],


		'align' => [
			'' => __('Default', 'domain'),
			'center' => __('Center', 'domain'),
			'left' => __('Left', 'domain'),
			'right' => __('Right', 'domain'),
		],

		'swatch_style' => [
			'' => __('Default', 'domain'),
			'box' => __('Box', 'domain'),
			'circle' => __('Circle', 'domain'),
		],
		'yes_no' => [
			'' => __('Default', 'domain'),
			'yes' => __('Yes', 'domain'),
			'no' => __('No', 'domain'),
		],
		'show_hide' => [
			'' => __('Default', 'domain'),
			'show' => __('Show', 'domain'),
			'hide' => __('Hide', 'domain'),
		],


	];

	return $config;
}
