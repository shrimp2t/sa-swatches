<?php

namespace SA_WC_BLOCKS\Attr\Post;

use function SA_WC_BLOCKS\get_assets;



function admin_scripts()
{

	$screen    = get_current_screen();
	$screen_id = $screen ? $screen->id : '';

	if (!in_array($screen_id, array('product'), true)) {
		return;
	}

	$assets = get_assets('attr-product');
	if (!$assets) {
		return;
	}

	$assets['dependencies'][] = 'jquery';
	wp_enqueue_media();
	wp_register_script('sa_attr_product', $assets['files']['js'], $assets['dependencies'], $assets['version'], ['in_footer' => true]);
	wp_register_style('sa_attr_product', $assets['files']['css'], [], $assets['version']);

	global $post;

	$config =  [
		'root' => esc_url_raw(rest_url()),
		'ajax' => add_query_arg(['action' => 'sa_wc_ajax', 'nonce' => wp_create_nonce('sa_wc_ajax')], admin_url('admin-ajax.php')),
		'nonce' => wp_create_nonce('wp_rest'),
		'pid' => $post->ID,
	];

	wp_localize_script('sa_attr_product', 'SA_WC_BLOCKS', $config);
	wp_enqueue_script('sa_attr_product');
	wp_enqueue_style('sa_attr_product');
}

add_action('admin_enqueue_scripts', __NAMESPACE__ . '\admin_scripts');

/**
 * @see plugins\woocommerce\assets\js\admin\meta-boxes-product.js
 */

/**
 * WC_Product_Attribute
 */



function woocommerce_product_option_terms($attribute_taxonomy, $i, $attribute)
{
	if (strpos($attribute_taxonomy->attribute_type, 'sa_') === false) {
		return;
	}
?>
	<select multiple="multiple" data-return_id="id" data-title="<?php echo esc_attr(wc_attribute_label($attribute->get_name())) ?>" data-selected="<?php echo json_encode($attribute->get_options()); ?>" data-placeholder="<?php esc_attr_e('Select values', 'woocommerce'); ?>" class="sa_attr_swatches multiselect attribute_values wc-taxonomy-term-search----" name="attribute_values[<?php echo esc_attr($i); ?>][]" data-taxonomy="<?php echo esc_attr($attribute->get_taxonomy()); ?>">
		<?php
		$selected_terms = $attribute->get_options();
		if ($selected_terms) {
			foreach ($selected_terms as $term_id) {
				echo '<option value="' . esc_attr($term_id) . '" selected="selected">' . esc_html($term_id) . '</option>';
			}
		}
		?>
	</select>
<?php
}

add_action('woocommerce_product_option_terms', __NAMESPACE__ . '\woocommerce_product_option_terms', 10, 3);
