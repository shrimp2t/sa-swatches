<?php

namespace SA_WC_SWATCHES\API\Attrs;

use function SA_WC_SWATCHES\get_wc_tax_attrs;
use function SA_WC_SWATCHES\remove_empty_from_array;

add_action('sa_wc_api/update_term_swatch', __NAMESPACE__ . '\rest_update_term_swatch');
add_action('sa_wc_api/update_custom_swatch', __NAMESPACE__ . '\rest_update_custom_swatch');
add_action('sa_wc_api/get_terms', __NAMESPACE__ . '\rest_get_tax_terms');
add_action('sa_wc_api/get_attr_settings', __NAMESPACE__ . '\rest_get_attr_settings');
add_action('sa_wc_api/add_term', __NAMESPACE__ . '\rest_add_term');
add_action('sa_wc_api/get_product_attrs', __NAMESPACE__ . '\rest_get_product_attrs');

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

	$data = json_decode(get_term_meta($term_id, '_sa_wc_swatch', true), true);
	if (!is_array($data)) {
		$data = [];
	}

	$data = wp_parse_args($data, [
		'value' => '',
		'type' => '',
	]);

	if ($type === 'sa_image' && $data['value']) {
		$image = get_image_data($data['value'], $image_size);
		$data = array_merge($data, $image);
	}

	return $data;
}


function get_terms_data($terms, $type = null, $pid = null, $tax = null, $image_size = 'thumbnail')
{

	$list = [];
	$overwrite_all =  $pid ? get_post_meta($pid, '_sa_custom_swatches', true) : [];
	if (!is_array($overwrite_all)) {
		$overwrite_all = [];
	}

	$tax = sanitize_title($tax);
	$overwrite =  $tax && isset($overwrite_all[$tax]) ? $overwrite_all[$tax] : [];

	foreach ($terms as $term) {
		$swatch = get_swatch_data($term->term_id, $type, $image_size);
		$swatch['type'] = $type;
		$item_data =  [
			'id' => $term->term_id,
			'name' => $term->name,
			'slug' => $term->slug,
			'tax' => $term->taxonomy,
			'swatch' => $swatch,
		];

		if (isset($overwrite[$item_data['id']]) && $overwrite[$item_data['id']]) {
			$custom =  $overwrite[$item_data['id']];
			if (isset($custom['name']) && $custom['name']) {
				$item_data['custom_name'] = $custom['name'];
			}
			if (isset($custom['swatch'])) {
				$item_data['custom_swatch'] = $custom['swatch'];
				if ($custom['swatch']['type'] === 'sa_image' && isset($custom['swatch']['value'])) {
					$image = get_image_data($custom['swatch']['value'], $image_size);
					$item_data['custom_swatch'] = array_merge($item_data['custom_swatch'], $image);
				}
			}
		}

		$list[] = $item_data;
	}

	return $list;
}


function get_custom_terms_data($terms, $type = null, $pid = null, $tax = null, $image_size = 'thumbnail')
{

	$list = [];
	$overwrite_all =  $pid ? get_post_meta($pid, '_sa_custom_swatches', true) : [];
	if (!is_array($overwrite_all)) {
		$overwrite_all = [];
	}
	$tax = sanitize_title($tax);
	$overwrite =  $tax && isset($overwrite_all[$tax]) ? $overwrite_all[$tax] : [];

	foreach ($terms as $term) {
		$swatch = [];
		$swatch['type'] = $type;
		$item_data =  [
			'id' => $term->term_id,
			'name' => $term->name,
			'slug' => $term->slug,
			'tax' => $term->taxonomy,
			'swatch' => $swatch,
		];

		if (isset($overwrite[$item_data['id']]) && $overwrite[$item_data['id']]) {
			$custom =  $overwrite[$item_data['id']];
			if (isset($custom['name']) && $custom['name']) {
				$item_data['custom_name'] = $custom['name'];
			}
			if (isset($custom['swatch'])) {
				$item_data['custom_swatch'] = $custom['swatch'];
				if ($custom['swatch']['type'] === 'sa_image' && isset($custom['swatch']['value'])) {
					$image = get_image_data($custom['swatch']['value'], $image_size);
					$item_data['custom_swatch'] = array_merge($item_data['custom_swatch'], $image);
				}
			}
		}

		$list[] = $item_data;
	}

	return $list;
}




function rest_add_term($post)
{
	if (!current_user_can('edit_products')) {
		wp_die(-1);
	}
	$tax = isset($post['taxonomy']) ? sanitize_text_field($post['taxonomy']) : '';
	$name = isset($post['name']) ? sanitize_text_field($post['name']) : '';
	if (!$name) {
		wp_send_json([
			'success' => false,
		]);
		die();
	}

	$r = wp_insert_term($name, $tax);
	if (isset($r['term_id'])) {
		$attrs = get_wc_tax_attrs();
		$type =  $tax && isset($attrs[$tax]) ? $attrs[$tax]['type'] : false;
		$term = get_term($r['term_id'], $tax);
		$swatch = get_swatch_data($term->term_id, $type);
		$data =  [
			'id' => $term->term_id,
			'name' => $term->name,
			'slug' => $term->slug,
			'tax' => $term->taxonomy,
			'swatch' => $swatch,
		];

		wp_send_json([
			'success' => true,
			'data' => $data,
		]);
		die();
	}
	wp_send_json([
		'success' => false,
	]);
	die();
}



function rest_get_tax_terms($post)
{
	if (!current_user_can('edit_products')) {
		wp_die(-1);
	}
	$tax = isset($post['taxonomy']) ? sanitize_text_field($post['taxonomy']) : '';
	$is_custom = isset($post['is_custom']) ? sanitize_text_field($post['is_custom']) : '';
	$selected = isset($post['selected']) ? wp_unslash($post['selected']) : false;
	$search = isset($post['search']) ? sanitize_text_field($post['search']) : '';
	$pid = isset($post['pid']) ? sanitize_text_field($post['pid']) : '';
	$type = isset($post['type']) ? sanitize_text_field($post['type']) : '';
	$attrs = get_wc_tax_attrs();
	if (!$type) {
		$type =  $tax && isset($attrs[$tax]) ? $attrs[$tax]['type'] : false;
	}

	$terms = [];
	$terms_selected = [];
	if (!$is_custom) {
		$terms = get_terms(array(
			'taxonomy' => $tax, //Custom taxonomy name
			'hide_empty' => false,
			'orderby'  => 'name',
			'order'  => 'ASC',
			'number' => 30,
			'search' => $search,
		));
	}


	if ($selected) {
		if (!$is_custom) {
			$terms_selected = get_terms(array(
				'taxonomy' => $tax, //Custom taxonomy name
				'hide_empty' => false,
				'orderby'  => 'include',
				'include' => $selected,
			));
		} else {
			foreach ($selected as $term) {
				$terms_selected[] = (object) [
					'term_id' => $term,
					'name' => $term,
					'slug' => $term,
					'taxonomy' => $tax,
				];
			}
		}
	}

	if (is_wp_error($terms)) {
		$terms  = [];
	}

	if (is_wp_error($terms_selected)) {
		$terms_selected = [];
	}

	$data = [];
	$selected_data = [];
	if (!$is_custom) {
		$data = get_terms_data($terms, $type, $pid, $tax);
		$selected_data = get_terms_data($terms_selected, $type, $pid, $tax);
	} else {
		$data = get_custom_terms_data($terms, $type, $pid, $tax);
		$selected_data = get_custom_terms_data($terms_selected, $type, $pid, $tax);
	}

	wp_send_json([
		'success' => true,
		'type' => $type,
		'tax' => $tax,
		'data' => $data,
		'pid' => $pid,
		'selected' => $selected_data,
	]);
}
function rest_get_attr_settings($post)
{
	if (!current_user_can('edit_products')) {
		wp_die(-1);
	}

	$pid = isset($post['pid']) ? absint($post['pid']) : 0;

	$data =  get_post_meta($pid, '_sa_attr_settings', true);
	if (!is_array($data)) {
		$data = [];
	}
	wp_send_json([
		'success' => true,
		'data' => (object) $data,
		'pid' => $pid,
	]);
}

function rest_update_term_swatch($post)
{
	if (!current_user_can('edit_products')) {
		wp_die(-1);
	}
	$tax = isset($post['tax']) ? sanitize_text_field($post['tax']) : '';
	$term_id = isset($post['term_id']) ? absint($post['term_id']) : '';

	$value = isset($post['value']) ? sanitize_text_field($post['value']) : '';
	$type = isset($post['type']) ? sanitize_text_field($post['type']) : '';
	$more = isset($post['more']) ? wp_unslash($post['more']) : '';

	$data = [
		'type' => $type,
		'value' => $value,
	];

	if ($more) {
		$data['more'] = $more;
	}

	if ($type === 'sa_image') {
		$data['value'] = absint($data['value']);
	}

	update_term_meta(
		$term_id,
		'_sa_wc_swatch',
		json_encode($data)
	);

	$term = get_term($term_id, $tax);
	$swatch = get_swatch_data($term->term_id, $type);
	$data =  [
		'id' => $term->term_id,
		'name' => $term->name,
		'slug' => $term->slug,
		'swatch' => $swatch,
	];

	wp_send_json([
		'success' => true,
		'data' => $data,
	]);
}

function rest_update_custom_swatch($post)
{

	if (!current_user_can('edit_products')) {
		wp_die(-1);
	}

	$tax = isset($post['tax']) ? sanitize_text_field($post['tax']) : '';
	$term_id = isset($post['term_id']) ? absint($post['term_id']) : '';
	$value = isset($post['value']) ? sanitize_text_field($post['value']) : '';
	$type = isset($post['type']) ? sanitize_text_field($post['type']) : '';
	$pid = isset($post['pid']) ? absint($post['pid']) : 0;

	$data = [
		'type' => $type,
		'value' => $value,
	];
	if ($type === 'sa_image') {
		$data['value'] = absint($data['value']);
	}

	update_term_meta(
		$term_id,
		'_sa_wc_swatch',
		json_encode($data)
	);

	$term = get_term($term_id, $tax);
	$swatch = get_swatch_data($term->term_id, $type);
	$data =  [
		'id' => $term->term_id,
		'name' => $term->name,
		'slug' => $term->slug,
		'swatch' => $swatch,
	];

	wp_send_json([
		'success' => true,
		'data' => $data,
	]);
}

function parserSettings($all_settings)
{
	if (!is_array($all_settings)) {
		return $all_settings;
	}

	$key = 'drawer_';
	$settings = [];
	$drawer = [];
	foreach ($all_settings as $k => $v) {
		if (strpos($k, $key) === 0) {
			$new_key = substr($k, strlen($key));
			$drawer[$new_key] = $v;
		} else {
			$settings[$k] = $v;
		}
	}

	return [$settings, $drawer];
}

function get_product_attributes($product)
{
	$attributes = $product->get_variation_attributes();
	$attrs = get_wc_tax_attrs();
	$attr_data = [];
	$all_settings =  get_post_meta($product->get_id(), '_sa_attr_settings', true);
	$image_size = 'woocommerce_thumbnail';

	foreach ($attributes as $attribute_name => $attr_options) {
		$key =  sanitize_title($attribute_name);
		$wc_attr = $attribute_name && isset($attrs[$attribute_name]) ? $attrs[$attribute_name] : null;
		$type =  $wc_attr ? $wc_attr['type'] : null;
		$parser_settings = parserSettings(isset($all_settings[$key]) ?  $all_settings[$key] : []);

		$attr_data[$key] = [
			'label' => wc_attribute_label($attribute_name),
			'name' => 'attribute_' . $key,
			'id' => $key,
			'default' => $product->get_variation_default_attribute($attribute_name),
			'selected' => false,
			'type' => $type,
			'settings' => (object) remove_empty_from_array($parser_settings[0]),
			'drawer' => (object)remove_empty_from_array($parser_settings[1]),
			'data' => (object) $wc_attr ? remove_empty_from_array($wc_attr['data']) : [],
		];
		$options = [];


		$attr_data[$key]['selected'] = isset($_REQUEST[$attr_data[$key]['name']]) ? wc_clean(wp_unslash($_REQUEST[$attr_data[$key]['name']])) : $attr_data[$key]['default'];

		if ($product && taxonomy_exists($attribute_name)) {
			$attr_data[$key]['tax'] = $attribute_name;
			// Get terms if this is a taxonomy - ordered. We need the names too.
			$terms = wc_get_product_terms(
				$product->get_id(),
				$attribute_name,
				array(
					'fields' => 'all',
				)
			);

			$options = get_terms_data($terms, $type, $product->get_id(), $attribute_name, $image_size);
		} else {
			$attr_data[$key]['tax'] = false;
			$custom_terms = [];
			foreach ($attr_options as $term) {
				$custom_terms[] = (object) [
					'term_id' => $term,
					'name' => $term,
					'slug' => $term,
					'taxonomy' => $attribute_name,
				];
			}

			$options = get_custom_terms_data($custom_terms, $type, $product->get_id(), $attribute_name, $image_size);
		}
		$attr_data[$key]['options'] = $options;
	}

	return $attr_data;
}


function rest_get_product_attrs($post)
{
	$pid = isset($_GET['pid']) ? sanitize_text_field($_GET['pid']) : '';
	$product = wc_get_product($pid);

	$data = get_product_attributes($product);
	wp_send_json_success($data);
	die();
}
