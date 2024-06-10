<?php

namespace SASW_SWATCHES\Attr\Post;

use Exception;

use function SASW_SWATCHES\get_assets;
use function SASW_SWATCHES\get_text_settings_for_admin;
use function SASW_SWATCHES\remove_empty_from_array;


function admin_scripts()
{

	$screen    = get_current_screen();
	$screen_id = $screen ? $screen->id : '';

	if (!in_array($screen_id, array('product'), true)) {
		return;
	}

	$assets = get_assets('attr/attr-product');
	if (!$assets) {
		return;
	}

	$assets['dependencies'][] = 'jquery';
	wp_enqueue_media();
	wp_register_script('sasw_attr_product', $assets['files']['js'], $assets['dependencies'], $assets['version'], ['in_footer' => true]);
	wp_register_style('sasw_attr_product', $assets['files']['css'], [], $assets['version']);

	global $post;

	$config =  [
		'root' => esc_url_raw(rest_url()),
		'ajax' => add_query_arg(['action' => 'sasw_ajax', 'nonce' => wp_create_nonce('sasw_ajax')], admin_url('admin-ajax.php')),
		'nonce' => wp_create_nonce('wp_rest'),
		'pid' => $post->ID,
		'att_types' => wc_get_attribute_types(),
		'configs' => get_text_settings_for_admin(),
	];

	wp_localize_script('sasw_attr_product', 'SASW_SWATCHES', $config);
	wp_enqueue_script('sasw_attr_product');
	wp_enqueue_style('sasw_attr_product');
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
	if (strpos($attribute_taxonomy->attribute_type, 'sasw_') === false) {
		return;
	}

?>
	<select multiple="multiple" data-return_id="id" data-title="<?php echo esc_attr(wc_attribute_label($attribute->get_name())) ?>" data-selected="<?php echo wp_json_encode($attribute->get_options()); ?>" data-placeholder="<?php esc_attr_e('Select values', "sa-swatches"); ?>" class="sasw_attr_swatches multiselect attribute_values" name="attribute_values[<?php echo esc_attr($i); ?>][]" data-taxonomy="<?php echo esc_attr($attribute->get_taxonomy()); ?>">
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
		<td>
			<input type="hidden" class="sasw_overwrite_swatches checkbox" name="sasw_overwrite_swatches[<?php echo esc_attr($i); ?>]" />
			<input type="hidden" class="sasw_attribute_settings checkbox" name="sasw_attr_settings[<?php echo esc_attr($i); ?>]" />
		</td>
	</tr>
<?php
}

add_action('woocommerce_product_option_terms', __NAMESPACE__ . '\woocommerce_product_option_terms', 10, 3);
add_action('woocommerce_after_product_attribute_settings', __NAMESPACE__ . '\extra_fields', 10, 2);
add_action('woocommerce_after_product_object_save', __NAMESPACE__ . '\save_attribute_custom_meta', 10, 1);



function save_attribute_custom_meta($product)
{
	// Just check if has action.
	if (!isset($_POST['action']) || 'woocommerce_save_attributes' != $_POST['action']) { // phpcs:ignore WordPress.Security.NonceVerification.Missing
		return;
	}

	$post_id = $product->get_id();
	$key = '_sasw_custom_swatches';
	$key_settings = '_sasw_attr_settings';
	try { 
		parse_str(wp_unslash($_POST['data']), $data); // phpcs:ignore WordPress.Security.NonceVerification.Missing
		if (!is_array($data)) {
			$data = [];
		}
		$attribute_names = isset($data['attribute_names']) ?  $data['attribute_names'] : [];
		$attribute_values = isset($data['attribute_values']) ?  $data['attribute_values'] : [];

		if (!is_array($attribute_names)) {
			$attribute_names = [];
		}

		if (!is_array($attribute_values)) {
			$attribute_values = [];
		}

		$overwrite_swatches = isset($data['sasw_overwrite_swatches']) && is_array($data['sasw_overwrite_swatches']) ? $data['sasw_overwrite_swatches'] : [];
		$settings = isset($data['sasw_attr_settings']) && is_array($data['sasw_attr_settings']) ? $data['sasw_attr_settings'] : [];
		$save_data = [];
		$save_settings = [];
		$save_options_order = [];
		foreach ($overwrite_swatches  as $k => $v) {
			$name = isset($attribute_names[$k]) ? $attribute_names[$k] : false;

			if ($name) {
				$name = sanitize_title($name);
				$save_data[$name] = remove_empty_from_array(json_decode($v, true));

				$tax_name = wc_sanitize_taxonomy_name($name);
				$save_options_order[$tax_name] = isset($attribute_values[$k]) ? $attribute_values[$k] : [];
			}
		}
		foreach ($settings  as $k => $v) {
			$name = isset($attribute_names[$k]) ? $attribute_names[$k] : false;
			if ($name) {
				$name = sanitize_title($name);
				$save_settings[$name] = remove_empty_from_array(json_decode($v, true));
				unset($save_settings[$name]['_t']);
			}
		}
		update_post_meta($post_id, $key, $save_data);
		update_post_meta($post_id, $key_settings, $save_settings);
		update_post_meta($post_id, '_sasw_attr_options_order', $save_options_order);
	} catch (Exception $e) {
		update_post_meta($post_id, $key, []);
	}
}
