<?php

namespace SA_WC_BLOCKS\Frontend\Product;

use WC_Product_Simple;

use function SA_WC_BLOCKS\get_assets;

function get_option_settings()
{

	$keys = [
		'sa_swatches_layout',
		'sa_swatches_option_layout',
		'sa_swatches_option_col',
		'sa_swatches_option_size',
		'sa_swatches_option_layout',
		'sa_swatches_option_label',
		'sa_swatches_option_drawer_layout',
		'sa_swatches_option_drawer_size',
		'sa_swatches_option_drawer_label',
		'sa_swatches_shop_show',
		'sa_swatches_shop_selection',
		'sa_swatches_shop_position',
		'sa_swatches_shop_max',
		'sa_swatches_shop_size',
	];

	$singe_options = [];
	$shop_options = [];
	$shop_key = 'sa_swatches_shop_';
	$single_key = 'sa_swatches_';
	foreach ($keys as $k) {
		$new_key = false;
		if (strpos($k, $shop_key) === 0) {
			$new_key = substr($k, strlen($shop_key));
			$shop_options[$new_key] = get_option($k);
		} else {
			$new_key = substr($k, strlen($single_key));
			$singe_options[$new_key] = get_option($k);
		}
	}

	return [$singe_options, $shop_options];
}



function scripts()
{
	$assets = get_assets('frontend/swatches');
	if (!$assets) {
		return;
	}
	$assets['dependencies'][] = 'jquery';
	wp_enqueue_media();
	wp_register_script('sa_wc_swatches', $assets['files']['js'], $assets['dependencies'], $assets['version'], ['in_footer' => true]);
	wp_register_style('sa_wc_swatches', $assets['files']['css'], [], $assets['version']);
	wp_enqueue_script('sa_wc_swatches');
	wp_enqueue_style('sa_wc_swatches');

	$settings =  get_option_settings();
	$sample_product = new WC_Product_Simple();
	$sample_product->set_status('publish');
	$sample_product->set_regular_price(99);
	$sample_product->set_price(99);
	$sample_product->set_stock_status('instock');
	$sample_product->set_id(1);


	$configs =  [
		'ajax' => add_query_arg(['action' => 'sa_wc_ajax', 'nonce' => wp_create_nonce('sa_wc_ajax')], admin_url('admin-ajax.php')),
		'single' => (object) $settings[0],
		'loop' => (object) $settings[1],
		'i10n' => [
			'add_cart' => $sample_product->add_to_cart_text(),
		],
	];

	wp_localize_script('sa_wc_swatches', 'SA_WC_SWATCHES', $configs);
}

add_action('wp_enqueue_scripts', __NAMESPACE__ . '\scripts');


function always_use_ajax()
{
	return 0;
}

add_filter('woocommerce_ajax_variation_threshold', __NAMESPACE__ . '\always_use_ajax');


function loop_swatches()
{
	global $product;
	$id = $product->get_id();
	$type = $product->get_type();
	if ('variable' != $type) {
		return;
	}

	$link  = apply_filters('woocommerce_loop_product_link', get_the_permalink(), $product);
?>
	<div class="sa_loop_swatches" data-link="<?php echo esc_url($link); ?>" data-id="<?php echo esc_attr($id); ?>" data-type="<?php echo esc_attr($type); ?>"></div>
<?php
}

add_action('woocommerce_after_shop_loop_item', __NAMESPACE__ . '\loop_swatches', 1);


function loop_classes($classes, $product)
{
	$type = $product->get_type();
	if ('variable' != $type) {
		// return $classes;
	}
	$classes[] = 'sa_product_loop_wrap';
	return $classes;
}

add_filter('woocommerce_post_class', __NAMESPACE__ . '\loop_classes', 99999, 2);


function product_get_image($image, $product)
{
	return '<span class="sa_loop_thumb">' . $image . '</span>';
}

add_filter('woocommerce_product_get_image', __NAMESPACE__ . '\product_get_image', 999, 2);
