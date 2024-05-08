<?php

namespace SA_WC_SWATCHES;

use Exception;

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



function get_image_data($image_id, $image_size = 'thumbnail')
{
	$data = [];
	$thumb =  wp_get_attachment_image_src($image_id, $image_size);
	if ($thumb) {
		$data['thumbnail'] =  $thumb[0];
	}
	$full =  wp_get_attachment_image_src($image_id, 'full');
	if ($thumb) {
		$data['full'] =  $full[0];
	}
	return $data;
}

function get_swatch_data($term_id, $type = null, $image_size = 'thumbnail')
{
	$data = get_term_meta($term_id, '_sa_wc_swatch', true);

	if (!is_array($data) && is_string($data)) {
		$data = json_decode($data, true);
	}


	if (!is_array($data)) {
		$data = [];
	}

	$data = wp_parse_args($data, [
		'value' => '',
		'type' => '',
	]);

	if (!$type) {
		$type = $data['type'];
	}

	if ($type === 'sa_image' && $data['value']) {
		$image = get_image_data($data['value'], $image_size);
		$data = array_merge($data, $image);
	}

	return $data;
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
			'separate' => __('Separate', 'sa-wc-swatches'),
			'inline' => __('Inline', 'sa-wc-swatches'),
			'drawer' => __('Drawer', 'sa-wc-swatches'),
			'popover' => __('Popover', 'sa-wc-swatches'),
		],

		'option_layout' => [
			'' => __('Default', 'sa-wc-swatches'),
			'inline' => __('Inline', 'sa-wc-swatches'),
			'box' => __('Box', 'sa-wc-swatches'),
			'checkbox' => __('Checkbox', 'sa-wc-swatches'),
		],

		'position' => [
			'before@loop/add-to-cart.php' => __('Before add cart', 'sa-wc-swatches'),
			'after@loop/add-to-cart.php' => __('After add cart', 'sa-wc-swatches'),

			// 'before@loop/price.php' => __('Before price', 'sa-wc-swatches'),
			// 'after@loop/price.php' => __('After price', 'sa-wc-swatches'),

		],


		'align' => [
			'' => __('Default', 'sa-wc-swatches'),
			'center' => __('Center', 'sa-wc-swatches'),
			'left' => __('Left', 'sa-wc-swatches'),
			'right' => __('Right', 'sa-wc-swatches'),
		],

		'swatch_style' => [
			'' => __('Default', 'sa-wc-swatches'),
			'box' => __('Box', 'sa-wc-swatches'),
			'circle' => __('Circle', 'sa-wc-swatches'),
		],
		'yes_no' => [
			'' => __('Default', 'sa-wc-swatches'),
			'yes' => __('Yes', 'sa-wc-swatches'),
			'no' => __('No', 'sa-wc-swatches'),
		],
		'show_hide' => [
			'' => __('Default', 'sa-wc-swatches'),
			'show' => __('Show', 'sa-wc-swatches'),
			'hide' => __('Hide', 'sa-wc-swatches'),
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
