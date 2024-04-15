<?php

/**
 * Plugin Name:       WooCommerce Blocks by Sa
 * Description:       Add more blocks with advanced settings for WooCommerce.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            shrimp2t
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       sa_wc_blocks
 *
 * @package           sa_wc_blocks
 */

namespace SA_WC_BLOCKS;


define('SA_WC_BLOCKS_BASEFILE', __FILE__);
define('SA_WC_BLOCKS_URL', plugins_url('/', __FILE__));
define('SA_WC_BLOCKS_PATH', dirname(__FILE__));
define('SA_WC_BLOCKS_VERSION', '0.1.0');

require_once SA_WC_BLOCKS_PATH . '/inc/functions.php';
require_once SA_WC_BLOCKS_PATH . '/api/api.php';
require_once SA_WC_BLOCKS_PATH . '/inc/admin-attr.php';
require_once SA_WC_BLOCKS_PATH . '/inc/admin-attr-product.php';

function render_block_core_archives()
{
?>
	test
<?php
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

		register_block_type(SA_WC_BLOCKS_PATH . '/build/blocks/' . $block);
	}
	wp_enqueue_style('sa_wc_blocks-plugins', SA_WC_BLOCKS_URL . "/build/plugins.css", false);
}




function add_blocks_css()
{
	// $asset_file = include SA_WC_BLOCKS_PATH . '/build/plugins.asset.php';
	// wp_enqueue_script(
	// 	'sa_wc_blocks-plugins',
	// 	SA_WC_BLOCKS_URL . '/build/plugins.js',
	// 	array_merge($asset_file['dependencies'], []),
	// 	$asset_file['version'],
	// 	true
	// );
}


/**
 * @see wp_enqueue_block_style()
 *
 * @see /wp-includes/class-wp-block.php
 *
 * @param [type] $block_content
 * @param [type] $block
 * @return void
 */
function add_blocks_render_css($block_content, $block)
{
	return;
	// var_dump($block);
	// $css = isset($block['attrs']['pm_style']) ? $block['attrs']['pm_style'] : false;
	/**
	 * Add style support
	 *
	 * file wp-includes/block-supports/elements.php
	 *
	 * add_filter( 'the_content', 'do_blocks', 9 );
	 * Can use wp_enqueue_style() here.
	 */
	// if ($css) {
	// 	wp_enqueue_block_support_styles($css);
	// }
	return $block_content;
}




// register custom meta tag field
function register_post_meta()
{
	// $post_types = get_post_types();
	// foreach ($post_types as $type) {
	// 	register_post_meta($type, 'sa_wc_blocks_css', array(
	// 		'show_in_rest' => true,
	// 		'single' => true,
	// 		'type' => 'object',
	// 	));
	// }
}


add_action('init', __NAMESPACE__ . '\blocks_init');
// add_action('enqueue_block_editor_assets', __NAMESPACE__ . '\add_blocks_css', 1);
// add_filter('render_block', __NAMESPACE__ . '\add_blocks_render_css', 66, 2);
// add_action('init', __NAMESPACE__ . '\register_post_meta', 999);




// app\public\wp-content\plugins\woocommerce\assets\js\admin\meta-boxes-product.js
// app\public\wp-content\plugins\woocommerce\includes\admin\meta-boxes\views\html-product-attribute-inner.php
// app\public\wp-content\plugins\woocommerce\includes\admin\class-wc-admin-assets.php
// https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/media-upload/README.md
// https://dev.to/diballesteros/how-to-create-a-stunning-side-drawer-with-react-spring-bja

function add_attribute_types($options)
{
	$options['sa_select'] = __('Select 2');
	$options['sa_color'] = __('Color');
	$options['sa_image'] = __('Image');
	$options['sa_button'] = __('Buton');
	return $options;
}
add_filter('product_attributes_type_selector', __NAMESPACE__ . '\add_attribute_types', 9999);


