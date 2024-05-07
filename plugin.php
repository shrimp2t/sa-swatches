<?php

/**
 * Plugin Name:       SaSwatches - Product Variation Swatches For WooCommerce
 * Description:       Add more blocks with advanced settings for WooCommerce.
 * Requires at least: 6.5
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            shrimp2t
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       sa-wc-swatches
 *
 * @package           SaSwatches
 */

namespace SA_WC_SWATCHES;


define('SA_WC_SWATCHES_BASEFILE', __FILE__);
define('SA_WC_SWATCHES_URL', plugins_url('/', __FILE__));
define('SA_WC_SWATCHES_PATH', dirname(__FILE__));
define('SA_WC_SWATCHES_VERSION', '0.1.0');

require_once SA_WC_SWATCHES_PATH . '/inc/functions.php';
require_once SA_WC_SWATCHES_PATH . '/api/api.php';
require_once SA_WC_SWATCHES_PATH . '/inc/admin-attr.php';
require_once SA_WC_SWATCHES_PATH . '/inc/admin-attr-product.php';
require_once SA_WC_SWATCHES_PATH . '/inc/wc-settings.php';
require_once SA_WC_SWATCHES_PATH . '/inc/install.php';
require_once SA_WC_SWATCHES_PATH . '/inc/product.php';


register_activation_hook(__FILE__, __NAMESPACE__ . '\install');
add_action('init', __NAMESPACE__ . '\load_textdomain');

function load_textdomain()
{
	load_plugin_textdomain('sa-wc-swatches', false, SA_WC_SWATCHES_PATH . '/languages');
	wp_set_script_translations('sa_wc_admin_settings', 'sa-wc-swatches');
	wp_set_script_translations('sa_wc_admin_attr_manager', 'sa-wc-swatches');
	wp_set_script_translations('sa_wc_swatches', 'sa-wc-swatches');
	wp_set_script_translations('sa_wc_admin_product_attr', 'sa-wc-swatches');
}


/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function blocks_init()
{
	$blocks = [
		'products',
	];
	foreach ($blocks as $block) {
		register_block_type(SA_WC_SWATCHES_PATH . '/build/blocks/' . $block);
	}
	wp_enqueue_style('sa_wc_swatches-plugins', SA_WC_SWATCHES_URL . "/build/plugins.css", false);
}


add_action('init', __NAMESPACE__ . '\blocks_init');


function add_attribute_types($options)
{
	$options['sa_color'] = __('Color', 'sa-wc-swatches');
	$options['sa_image'] = __('Image', 'sa-wc-swatches');
	return $options;
}
add_filter('product_attributes_type_selector', __NAMESPACE__ . '\add_attribute_types', 9999);


function plugin_add_settings_link($links)
{
	$url = admin_url('admin.php?page=wc-settings&tab=advanced&section=sa_swatches');
	$settings_link = '<a href="' . esc_url($url) . '">' . __('Settings', 'sa-wc-swatches') . '</a>';
	array_push($links, $settings_link);
	return $links;
}
$plugin = plugin_basename(__FILE__);
add_filter("plugin_action_links_$plugin", __NAMESPACE__ . '\plugin_add_settings_link');
