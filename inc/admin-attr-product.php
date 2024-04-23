<?php

namespace SA_WC_BLOCKS\Attr\Post;

use Exception;

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
	<select multiple="multiple" data-return_id="id" data-title="<?php echo esc_attr(wc_attribute_label($attribute->get_name())) ?>" data-selected="<?php echo json_encode($attribute->get_options()); ?>" data-placeholder="<?php esc_attr_e('Select values', 'woocommerce'); ?>" class="sa_attr_swatches multiselect attribute_values" name="attribute_values[<?php echo esc_attr($i); ?>][]" data-taxonomy="<?php echo esc_attr($attribute->get_taxonomy()); ?>">
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


function extra_fields($attribute, $i)
{
?>
	<tr style="display:none !important;">
		<td><input type="hidden" class="sa_overwrite_swatches checkbox" name="sa_overwrite_swatches[<?php echo esc_attr($i); ?>]" /></td>
	</tr>
<?php
}

add_action('woocommerce_product_option_terms', __NAMESPACE__ . '\woocommerce_product_option_terms', 10, 3);
add_action('woocommerce_after_product_attribute_settings', __NAMESPACE__ . '\extra_fields', 10, 2);






// $attributes[] = apply_filters( 'woocommerce_admin_meta_boxes_prepare_attribute', $attribute, $data, $i );

add_action('woocommerce_after_product_object_save', __NAMESPACE__ . '\save_attribute_custom_meta', 10, 1);

function save_attribute_custom_meta($product)
{
	if (!isset($_POST['action']) || 'woocommerce_save_attributes' != $_POST['action']) {
		return;
	}

	$post_id = $product->get_id();
	$key = '_sa_custom_swatches';
	try {
		parse_str(wp_unslash($_POST['data']), $data);
		if (!is_array($data)) {
			$data = [];
		}
		$attribute_names = isset($data['attribute_names']) ?  $data['attribute_names'] : [];
		if (!is_array($attribute_names)) {
			$attribute_names = [];
		}

		$overwrite_swatches = isset($data['sa_overwrite_swatches']) && is_array($data['sa_overwrite_swatches']) ? $data['sa_overwrite_swatches'] : [];
		$save_data = [];
		foreach ($overwrite_swatches  as $k => $v) {
			$name = isset($attribute_names[$k]) ? $attribute_names[$k] : false;
			if ($name) {
				$save_data[$name] = json_decode($v, true);
			}
		}
		update_post_meta($post_id, $key, $save_data);
	} catch (Exception $e) {

		update_post_meta($post_id, $key, []);
	}
}
