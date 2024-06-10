<?php

/**
 * Plugin Name:       SaSwatches - Product Variation Swatches For WooCommerce
 * Description:       Variation Swatches for WooCommerce the ultimate solution to enhance your WooCommerce store's product presentation.
 * Requires at least: 6.5
 * Requires PHP:      7.0
 * Version: 					0.1.5
 * Author:            shrimp2t
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       sa-swatches
 * Requires Plugins: 	woocommerce
 *
 * @package           SaSwatches
 */

namespace SASW_SWATCHES;


define('SASW_SWATCHES_BASEFILE', __FILE__);
define('SASW_SWATCHES_URL', plugins_url('/', __FILE__));
define('SASW_SWATCHES_PATH', dirname(__FILE__));
define('SASW_SWATCHES_VERSION', '0.1.0');

require_once SASW_SWATCHES_PATH . '/inc/functions.php';
require_once SASW_SWATCHES_PATH . '/api/api.php';
require_once SASW_SWATCHES_PATH . '/inc/admin-attr.php';
require_once SASW_SWATCHES_PATH . '/inc/admin-attr-product.php';
require_once SASW_SWATCHES_PATH . '/inc/wc-settings.php';
require_once SASW_SWATCHES_PATH . '/inc/install.php';
require_once SASW_SWATCHES_PATH . '/inc/product.php';


register_activation_hook(__FILE__, __NAMESPACE__ . '\install');
add_action('init', __NAMESPACE__ . '\load_textdomain');

function load_textdomain()
{
	load_plugin_textdomain('sa-swatches', false, SASW_SWATCHES_PATH . '/languages');
	wp_set_script_translations('sasw_admin_settings',"sa-swatches");
	wp_set_script_translations('sasw_admin_attr_manager',"sa-swatches");
	wp_set_script_translations('sasw_swatches',"sa-swatches");
	wp_set_script_translations('sasw_admin_product_attr',"sa-swatches");
}


/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */

function add_attribute_types($options)
{
	$options['sasw_color'] = __('Color',"sa-swatches");
	$options['sasw_image'] = __('Image',"sa-swatches");
	return $options;
}
add_filter('product_attributes_type_selector', __NAMESPACE__ . '\add_attribute_types', 9999);


function plugin_add_settings_link($links)
{
	$url = admin_url('admin.php?page=wc-settings&tab=advanced&section=sasw_swatches');
	$settings_link = '<a href="' . esc_url($url) . '">' . __('Settings',"sa-swatches") . '</a>';
	array_push($links, $settings_link);
	return $links;
}
$plugin = plugin_basename(__FILE__);
add_filter("plugin_action_links_$plugin", __NAMESPACE__ . '\plugin_add_settings_link');



add_filter('get_object_terms', function ($terms, $object_ids, $taxonomies, $args) {
	if (!isset($_GET['debug'])) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		return  $terms;
	}
	if (!is_countable($terms) || !count($terms)) {
		return $terms;
	}

	$post_id = $object_ids[0];
	$taxonomy = $taxonomies[0];

	$meta = get_post_meta($post_id, '_sasw_attr_options_order', true);
	if ($meta && is_array($meta)) {
		if (!isset($meta[$taxonomy])) {
			return $terms;
		}

		$customs = $meta[$taxonomy];
		if (!is_array($customs) || !count($customs)) {
			return $terms;
		}

		$array_keys = [];
		foreach ($terms as $t) {
			if (is_a($t, 'WP_Term')) {
				$id = $t->term_id;
			} else {
				$id = $t;
			}
			$array_keys[$id] = $t;
		}

		$values = [];

		foreach ($customs as $cid) {
			if (isset($array_keys[$cid])) {
				$values[] = $array_keys[$cid];
				unset($array_keys[$cid]);
			}
		}

		$values =  array_merge($values,  array_values($array_keys));
		return $values;
	}

	return $terms;
}, 100, 4);
