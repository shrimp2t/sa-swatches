<?php

namespace SASW_SWATCHES\API\Product;

add_action('sasw_api/get_variants', __NAMESPACE__ . '\rest_get_variants');
function rest_get_variants()
{
	$pid = isset($_GET['pid']) ? sanitize_text_field($_GET['pid']) : ''; // phpcs:ignore
	$data = [];
	$product = wc_get_product($pid);
	if (method_exists($product, 'get_available_variations')) {
		$data = $product->get_available_variations();
	}
	wp_send_json_success($data);
	die();
}
