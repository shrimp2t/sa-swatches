<?php

namespace SA_WC_SWATCHES\Frontend\Product;

use WC_Product_Simple;
use WC_Product_Variable;
use WC_Product_Variation;

use function SA_WC_SWATCHES\get_assets;

function get_option_settings()
{

	$all_settings = json_decode(get_option('sa_swatches_settings', ''), true);
	if (!is_array($all_settings)) {
		$all_settings = [];
	}

	return $all_settings;
}


function scripts()
{

	$assets = get_assets('frontend/swatches');
	if (!$assets) {
		return;
	}
	$assets['dependencies'][] = 'jquery';

	$settings = get_option_settings();

	wp_register_script('sa_wc_swatches', $assets['files']['js'], $assets['dependencies'], $assets['version']);
	wp_enqueue_script('sa_wc_swatches');

	wp_register_style('sa_wc_swatches', $assets['files']['css'], ['wp-components'], $assets['version']);
	wp_enqueue_style('sa_wc_swatches');

	$sample_product = new WC_Product_Variation();
	$sample_product->set_parent_data([
		'title'              => '',
		'status'             => 'publish',
		'catalog_visibility' => 'visible',
	]);
	$sample_product->set_status('publish');
	$sample_product->set_regular_price(99);
	$sample_product->set_price(99);
	$sample_product->set_stock_status('instock');
	$sample_product->set_id(1);


	$variable_product = new WC_Product_Variable();
	$variable_product->set_status('publish');
	$variable_product->set_regular_price(99);
	$variable_product->set_price(99);
	$variable_product->set_stock_status('instock');
	$variable_product->set_id(1);

	$configs =  [
		'ajax' => add_query_arg(['action' => 'sa_wc_ajax', 'nonce' => wp_create_nonce('sa_wc_ajax')], admin_url('admin-ajax.php')),
		'settings' => (object) $settings,
		'i18n' => [
			'add_cart' => $sample_product->add_to_cart_text(),
			'select_options' => $variable_product->add_to_cart_text(),
			'select_attr' => __('Select %s', 'sa-wc-swatches'),
			'btn_details' => __('Details', 'sa-wc-swatches'),
		],
	];

	wp_localize_script('jquery', 'SA_WC_SWATCHES', $configs);
}

add_action('wp_enqueue_scripts', __NAMESPACE__ . '\scripts');


function always_use_ajax()
{
	return 0;
}

add_filter('woocommerce_ajax_variation_threshold', __NAMESPACE__ . '\always_use_ajax');


/**
 * Must add before/after add to cart link btn
 */
function loop_swatches($html, $product, $args)
{
	// global $product;
	$id = $product->get_id();
	$type = $product->get_type();
	if ('variable' != $type) {
		return $html;
	}

	$link  = apply_filters('woocommerce_loop_product_link', get_the_permalink(), $product);
	$html_swatches = '<div class="sa_loop_swatches" data-link="' . esc_url($link) . '" data-id="' . esc_attr($id) . '" data-type="' . esc_attr($type) . '"></div>';

	return $html_swatches . $html;
}

// add_action('woocommerce_after_shop_loop_item', __NAMESPACE__ . '\loop_swatches', 1);
add_filter('woocommerce_loop_add_to_cart_link', __NAMESPACE__ . '\loop_swatches', 1, 3);


function loop_classes($classes, $product)
{
	$type = $product->get_type();
	if ('variable' != $type) {
		// return $classes;
	}
	$classes[] = 'sa_p_loop_wrap';
	return $classes;
}

add_filter('woocommerce_post_class', __NAMESPACE__ . '\loop_classes', 99999, 2);


function product_get_image($image, $product)
{
	return '<span class="sa_loop_thumb">' . $image . '</span>';
}
add_filter('woocommerce_product_get_image', __NAMESPACE__ . '\product_get_image', 999, 2);



// --- Test ------------------------------------
add_filter('woocommerce_is_purchasable', function ($is_purchasable, $product) {
	return true;
},  9999, 2);
add_filter('woocommerce_product_is_in_stock', function ($is_instock, $product) {

	return true;
},  9999, 2);

add_filter('woocommerce_product_supports', function ($is_support,  $feature, $product) {

	if ('ajax_add_to_cart' === $feature) {
		return true;
	}
	return $is_support;
},  9999, 3);


function wp_script_attributes($attributes)
{

	if ($attributes['id'] == 'wc-product-button-interactivity-frontend-js') {
		$attributes['src'] = SA_WC_SWATCHES_URL . '/assets/wc-js/product-button-interactivity-frontend.js';
	}

	return $attributes;
}
add_filter('wp_script_attributes', __NAMESPACE__ . '\wp_script_attributes', 100, 1);
