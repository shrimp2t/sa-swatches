<?php

namespace SA_WC_BLOCKS\API\Attrs;

use function SA_WC_BLOCKS\get_wc_tax_attrs;

add_action('sa_wc_api/update_term_swatch', __NAMESPACE__ . '\rest_update_term_swatch');
add_action('sa_wc_api/get_terms', __NAMESPACE__ . '\rest_get_tax_terms');
add_action('sa_wc_api/add_term', __NAMESPACE__ . '\rest_add_term');

function get_swatch_data($term_id, $type = null)
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
		$thumb =  wp_get_attachment_image_src($data['value'], 'thumbnail');
		if ($thumb) {
			$data['thumbnail'] =  $thumb[0];
		}
		$full =  wp_get_attachment_image_src($data['value'], 'full');
		if ($thumb) {
			$data['full'] =  $full[0];
		}
	}

	return $data;
}


function get_terms_data($terms, $type = null)
{

	$list = [];
	foreach ($terms as $term) {
		$swatch = get_swatch_data($term->term_id, $type);
		$swatch['type'] = $type;
		$list[] = [
			'id' => $term->term_id,
			'name' => $term->name,
			'slug' => $term->slug,
			'swatch' => $swatch,
		];
	}

	return $list;
}

function rest_add_term($post)
{
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
		$type =  $tax && isset($attrs[$tax]) ? $attrs[$tax] : false;
		$term = get_term($r['term_id'], $tax);
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
		die();
	}
	wp_send_json([
		'success' => false,
	]);
	die();
}

function rest_get_tax_terms($post)
{

	$tax = isset($post['taxonomy']) ? sanitize_text_field($post['taxonomy']) : '';
	$selected = isset($post['selected']) ? sanitize_text_field($post['selected']) : '';
	$search = isset($post['search']) ? sanitize_text_field($post['search']) : '';
	// $selected = explode(',', $selected);
	// $selected = array_map('absint', $selected);

	$attrs = get_wc_tax_attrs();
	// $t = strpos($tax, 'pa_') ? substr($tax, 3) : $tax;
	$type =  $tax && isset($attrs[$tax]) ? $attrs[$tax] : false;


	$terms = get_terms(array(
		'taxonomy' => $tax, //Custom taxonomy name
		'hide_empty' => false,
		'orderby'  => 'name',
		'order'  => 'ASC',
		'number' => 30,
		'search' => $search,
	));

	if ($selected) {
		$terms_selected = get_terms(array(
			'taxonomy' => $tax, //Custom taxonomy name
			'hide_empty' => false,
			'orderby'  => 'include',
			'include' => $selected,
		));
	} else {
		$terms_selected = [];
	}


	if (is_wp_error($terms)) {
		$terms  = [];
	}

	if (is_wp_error($terms_selected)) {
		$terms_selected = [];
	}


	wp_send_json([
		'success' => true,
		'type' => $type,
		'tax' => $tax,
		'data' => get_terms_data($terms, $type),
		'selected' => get_terms_data($terms_selected, $type),
	]);
}

function rest_update_term_swatch($post)
{
	$tax = isset($post['tax']) ? sanitize_text_field($post['tax']) : '';
	$term_id = isset($post['term_id']) ? absint($post['term_id']) : '';
	$value = isset($post['value']) ? sanitize_text_field($post['value']) : '';
	$type = isset($post['type']) ? sanitize_text_field($post['type']) : '';

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
