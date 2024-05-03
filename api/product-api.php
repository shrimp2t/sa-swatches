<?php

namespace SA_WC_SWATCHES\API\Product;

add_action('sa_wc_api/get_variants', __NAMESPACE__ . '\rest_get_variants');
function rest_get_variants()
{
	$pid = isset($_GET['pid']) ? sanitize_text_field($_GET['pid']) : '';
	$product = wc_get_product($pid);
	$data = [];
	if (method_exists($product, 'get_available_variations')) {
		$data = $product->get_available_variations();
	}
	wp_send_json_success($data);
	die();
}
