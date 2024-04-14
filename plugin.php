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


// do_action( 'woocommerce_product_option_terms', $attribute_taxonomy, $i, $attribute );

function woocommerce_product_option_terms($attribute_taxonomy, $i, $attribute)
{
	if (strpos($attribute_taxonomy->attribute_type, 'sa_') === false) {
		return;
	}
?>
	<select multiple="multiple"  data-return_id="id"
	data-placeholder="<?php esc_attr_e('Select values', 'woocommerce'); ?>"
	class="multiselect attribute_values wc-taxonomy-term-search----" name="attribute_values[<?php echo esc_attr($i); ?>][]" data-taxonomy="<?php echo esc_attr($attribute->get_taxonomy()); ?>">
		<?php
		$selected_terms = $attribute->get_terms();
		if ($selected_terms) {
			foreach ($selected_terms as $selected_term) {
				/**
				 * Filter the selected attribute term name.
				 *
				 * @since 3.4.0
				 * @param string  $name Name of selected term.
				 * @param array   $term The selected term object.
				 */
				echo '<option value="' . esc_attr($selected_term->term_id) . '" selected="selected">' . esc_html(apply_filters('woocommerce_product_attribute_term_name', $selected_term->name, $selected_term)) . '</option>';
			}
		}
		?>
	</select>
	<button class="button plus select_all_attributes"><?php esc_html_e('Select all', 'woocommerce'); ?></button>
	<button class="button minus select_no_attributes"><?php esc_html_e('Select none', 'woocommerce'); ?></button>
	<button class="button fr plus add_new_attribute"><?php esc_html_e('Create value', 'woocommerce'); ?></button>

<?php

}

add_action('woocommerce_product_option_terms', __NAMESPACE__ . '\woocommerce_product_option_terms', 10, 3);
