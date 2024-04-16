<?php

namespace SA_WC_BLOCKS\API\Attrs;

use function SA_WC_BLOCKS\get_wc_tax_attrs;

add_action('sa_wc_api/update_term_swatch', __NAMESPACE__ . '\update_term_swatch');
add_action('sa_wc_api/get_terms', __NAMESPACE__ . '\get_tax_terms');

function get_swatch_data($term_id)
{

	$data = json_decode(get_term_meta($term_id, '_sa_wc_swatch', true), true);
	if (!is_array($data)) {
		$data = [];
	}

	$data = wp_parse_args($data, [
		'value' => '',
		'type' => '',
	]);

	if ($data['type'] === 'sa_image' && $data['value']) {
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



function get_tax_terms($post)
{

	$tax = isset($post['taxonomy']) ? sanitize_text_field($post['taxonomy']) : '';
	$selected = isset($post['selected']) ? sanitize_text_field($post['selected']) : '';
	// $selected = explode(',', $selected);
	// $selected = array_map('absint', $selected);
	$list = [];


	$attrs = get_wc_tax_attrs();
	// $t = strpos($tax, 'pa_') ? substr($tax, 3) : $tax;
	$type =  $tax && isset($attrs[$tax]) ? $attrs[$tax] : false;


	$terms = get_terms(array(
		'taxonomy' => $tax, //Custom taxonomy name
		'hide_empty' => false,
		'orderby'  => 'name',
		'order'  => 'ASC',
		'number' => 30,
	));

	$terms_selected = get_terms(array(
		'taxonomy' => $tax, //Custom taxonomy name
		'hide_empty' => false,
		'orderby'  => 'include',
		'include' => $selected,
	));

	if (is_wp_error($terms)) {
		$terms  = [];
	}

	if (is_wp_error($terms_selected)) {
		$terms_selected = [];
	}

	$terms =  array_merge($terms, $terms_selected);

	if ($terms) {
		foreach ($terms as $term) {
			$swatch = get_swatch_data($term->term_id);
			$swatch['type'] = $type;
			$list[] = [
				'id' => $term->term_id,
				'name' => $term->name,
				'slug' => $term->slug,
				'swatch' => $swatch,
			];
		}
	}



	wp_send_json([
		'success' => true,
		'type' => $type,
		'tax' => $tax,
		'data' => $list,
	]);
}

function update_term_swatch($post)
{
	$tax = isset($post['tax']) ? sanitize_text_field($post['tax']) : '';
	$term_id = isset($post['term_id']) ? absint($post['term_id']) : '';
	$value = isset($post['value']) ? sanitize_text_field($post['value']) : '';
	$type = isset($post['type']) ? sanitize_text_field($post['type']) : '';

	$data = [
		'type' => $type,
		'value' => $value,
	];

	update_term_meta(
		$term_id,
		'_sa_wc_swatch',
		json_encode($data)
	);

	wp_send_json([
		'success' => true,
		'term_id' => $term_id,
		'data' => $data,
	]);
}
