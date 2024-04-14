<?php

namespace SA_WC_BLOCKS\API\Attrs;

add_action('sa_wc_api/update_term_swatch', __NAMESPACE__ . '\update_term_swatch');

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
