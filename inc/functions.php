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


function get_custom_attr_data($attr_id)
{
	global $wpdb;
	$table = $wpdb->prefix . 'sa_attr_tax_data';

	$row = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE attr_id = %d LIMIT 1", $attr_id), ARRAY_A);
	$row = wp_parse_args($row, [
		'attr_id' => 0,
		'title' => '',
		'description' => '',
		'button_label' => '',
	]);
	return $row;
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
			$custom_data = get_custom_attr_data($tax->attribute_id);
			$attr_map_types[$name] = [
				'type' => $tax->attribute_type,
				'id' => $tax->attribute_id,
				'name' => $tax->attribute_name,
				'label' => $tax->attribute_label,
				'data' => $custom_data,
			];
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


function remove_empty_from_array($array)
{
	if (!is_array($array)) {
		return $array;
	}
	foreach ($array as $k => $v) {
		if (!$v) {
			unset($array[$k]);
		}
		if (is_array($v)) {
			$array[$k] = remove_empty_from_array($v);
		}
	}

	return $array;
}
