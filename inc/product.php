<?php

namespace SA_WC_SWATCHES\Frontend\Product;

use Exception;
use WC_Product_Simple;
use WC_Product_Variable;
use WC_Product_Variation;

use function SA_WC_SWATCHES\get_assets;

function get_option_settings()
{

	$key = 'sa_swatches_settings';
	if (isset($GLOBALS[$key])) {
		return $GLOBALS[$key];
	}
	$all_settings = json_decode(get_option('sa_swatches_settings', ''), true);
	if (!is_array($all_settings)) {
		$all_settings = [];
	}

	$GLOBALS[$key] = $all_settings;
	return $all_settings;
}


function get_swatches_position()
{
	$settings =  get_option_settings();
	try {
		if ($settings['shop']['show'] != 'yes') {
			return false;
		}

		$pos = isset($settings['shop']['position']) ? $settings['shop']['position'] : 'before@loop/add-to-cart.php';
		return $pos;
	} catch (Exception $e) {
		return false;
	}
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

	// var_dump($settings);

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
	$pos = get_swatches_position();
	// global $product;
	$id = $product->get_id();
	$type = $product->get_type();
	if ('variable' != $type) {
		return $html;
	}

	$link  = apply_filters('woocommerce_loop_product_link', get_the_permalink(), $product);
	$html_swatches = '<div class="sa_loop_swatches" data-link="' . esc_url($link) . '" data-id="' . esc_attr($id) . '" data-type="' . esc_attr($type) . '"></div>';
	switch ($pos) {
		case 'after@loop/add-to-cart.php':
			return  $html . $html_swatches;
			break;
		case 'before@loop/add-to-cart.php':
			return $html_swatches . $html;
			break;
	}
	return $html_swatches . $html;
}

// add_filter('woocommerce_loop_add_to_cart_link', __NAMESPACE__ . '\loop_swatches', 1, 3);



function get_the_swatches()
{
	global $product;
	$id = $product->get_id();
	$type = $product->get_type();
	if ('variable' != $type) {
		return null;
	}

	$link  = apply_filters('woocommerce_loop_product_link', get_the_permalink(), $product);
	$html_swatches = '<div class="sa_loop_swatches" data-link="' . esc_url($link) . '" data-id="' . esc_attr($id) . '" data-type="' . esc_attr($type) . '"></div>';

	return $html_swatches; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}

function loop_swatches_before($template_name)
{
	$pos = get_swatches_position();
	if (strpos($pos, $template_name) > 0) {
		maybe_add_swatches();
	}
	if ('before@' . $template_name != $pos) {
		return;
	}
	echo get_the_swatches();
}


function loop_swatches_after($template_name)
{

	if ('after@' . $template_name !== get_swatches_position()) {
		return;
	}
	echo get_the_swatches();
}

add_action('woocommerce_before_template_part', __NAMESPACE__ . '\loop_swatches_before', 1, 3);
add_action('woocommerce_after_template_part', __NAMESPACE__ . '\loop_swatches_after', 1, 3);
add_action('woocommerce_after_shop_loop_item', __NAMESPACE__ . '\maybe_remove_swatches', 9999999, 3);


function loop_classes($classes, $product)
{
	$pos = get_swatches_position();

	if (!$pos) {
		return $classes;
	}


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

function loop_is_purchaseable($is_purchasable, $product)
{
	return true;
}

function loop_is_in_stock($is_instock, $product)
{
	return true;
}
function loop_product_supports($is_support,  $feature, $product)
{
	if ('ajax_add_to_cart' === $feature) {
		return true;
	}
	return $is_support;
}


add_filter('pre_render_block', function ($content, $parsed_block, $parent_block) {
	if ($parsed_block['blockName'] == 'woocommerce/product-button') {
		maybe_add_swatches();
	}
	return $content;
}, 1, 3);

add_filter('render_block', function ($content, $parsed_block, $parent_block) {
	if ($parsed_block['blockName'] == 'woocommerce/product-button') {
		$pos = get_swatches_position();
		if (!$pos) {
			return $content;
		}
		// maybe_add_swatches();
		$html_swatches = get_the_swatches(false);
		if (!$html_swatches) {
			return $content;
		}

		switch ($pos) {
			case 'after@loop/add-to-cart.php':
				return  '<div class="sa_loop_wc_block">' . $content . $html_swatches . '</div>';
				break;
			case 'before@loop/add-to-cart.php':
				return '<div class="sa_loop_wc_block">' . $html_swatches . $content . '</div>';
				break;
		}

		maybe_remove_swatches();
	}
	return $content;
}, 1, 3);



function maybe_add_swatches()
{
	$pos = get_swatches_position();
	if (!$pos) {
		return;
	}

	add_filter('woocommerce_is_purchasable', __NAMESPACE__ . '\loop_is_purchaseable',  9696, 2);
	add_filter('woocommerce_product_is_in_stock', __NAMESPACE__ . '\loop_is_in_stock',  9696, 2);
	add_filter('woocommerce_product_supports', __NAMESPACE__ . '\loop_product_supports',  9696, 3);
}

function maybe_remove_swatches()
{
	$pos = get_swatches_position();
	if (!$pos) {
		return;
	}
	remove_filter('woocommerce_is_purchasable', __NAMESPACE__ . '\loop_is_purchaseable',  9696, 2);
	remove_filter('woocommerce_product_is_in_stock', __NAMESPACE__ . '\loop_is_in_stock',  9696, 2);
	remove_filter('woocommerce_product_supports', __NAMESPACE__ . '\loop_product_supports',  9696, 3);
}



function wp_script_attributes($attributes)
{

	if ($attributes['id'] == 'wc-product-button-interactivity-frontend-js') {
		$attributes['src'] = SA_WC_SWATCHES_URL . '/assets/wc-js/product-button-interactivity-frontend.js';
	}
	return $attributes;
}
add_filter('wp_script_attributes', __NAMESPACE__ . '\wp_script_attributes', 100, 1);



// add_filter('render_block', function ($content, $parsed_block) {
// 	if (strpos($parsed_block['blockName'], 'woocommerce/') === 0) {
// 		var_dump($parsed_block['blockName']);
// 		var_dump($parsed_block['attrs']);
// 	}

// 	// var_dump($parsed_block['blockName']);
// 	// var_dump($parsed_block['attrs']);


// 	return $content;
// }, 10, 2);

// render_block

// pre_render_block

// $block_content = apply_filters( 'render_block', $block_content, $this->parsed_block, $this );
