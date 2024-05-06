<?php

namespace SA_WC_SWATCHES\Admin\Attr;

use function SA_WC_SWATCHES\get_assets;
use function SA_WC_SWATCHES\get_wc_tax_attrs;
use function SA_WC_SWATCHES\get_ajax_configs;
use function SA_WC_SWATCHES\get_custom_attr_data;
use function SA_WC_SWATCHES\get_swatch_data;



function get_current_tax()
{
	if (isset($_GET['taxonomy'])) {
		return sanitize_text_field($_GET['taxonomy']);
	}
	return false;
}



function get_current_tax_type()
{

	$key = 'sa_current_tax_type';
	if (isset($GLOBALS[$key])) {
		return $GLOBALS[$key];
	}

	$t = get_current_tax();
	$attrs = get_wc_tax_attrs();
	$type =  $t && isset($attrs[$t]) ? $attrs[$t]['type'] : false;
	$GLOBALS[$key] = [
		'tax' => $t,
		'type' => $type,
	];

	return $GLOBALS[$key];
}

function save_term_fields($term_id)
{

	if (isset($_POST['sa_wc_attr_swatch'])) {
		$data = wp_unslash(json_decode(wp_unslash($_POST['sa_wc_attr_swatch']), true));
		update_term_meta(
			$term_id,
			'_sa_wc_swatch',
			$data,
		);
	}
}


function get_term_swatch($term_id)
{

	return get_swatch_data( $term_id );


	$data = get_term_meta($term_id, '_sa_wc_swatch', true);
	if (!is_array($data)) {
		$data = json_decode($data);
	}

	if (!is_array($data)) {
		$data = [];
	}

	$data = wp_parse_args($data, ['value' => '', 'type' => '']);
	return $data;
}


function column_content($content, $column_name, $term_id)
{
	switch ($column_name) {
		case 'swatch':
			$tax =  get_current_tax_type();
			$data = get_swatch_data($term_id);
			if (in_array($tax['type'], ['sa_color', 'sa_image'])) {
				$content =  '<div data-tax="' . esc_attr($tax['tax']) . '" data-swatch="' . esc_attr(json_encode($data)) . '" data-tax-type="' . esc_attr($tax['type']) . '" data-term_id="' . esc_attr($term_id) . '"  class="sa_wc_swatch"></div>';
			} else {
				$content = esc_html($data['value']);
			}
			break;
		default:
			break;
	}

	return $content;
}

function add_columns($columns)
{
	$columns['swatch'] = __('Swatch');
	return $columns;
}


function add_term_fields_text($taxonomy)
{
?>
	<div class="form-field">
		<label for="sa_wc_attr_swatch"><?php _e('Swatch label') ?></label>
		<div id="sa_wc_attr_swatch_el">
			<input type="text" name="sa_wc_attr_swatch" id="sa_wc_attr_swatch" />
		</div>
	</div>
<?php
}

function add_term_fields_color($taxonomy)
{
?>
	<div class="form-field">
		<label for="sa_wc_attr_swatch"><?php _e('Swatch color', 'domain') ?></label>
		<div id="sa_wc_attr_swatch_el">
			<input type="hidden" name="sa_wc_attr_swatch" id="sa_wc_attr_swatch" />
		</div>
	</div>
<?php
}

function add_term_fields_image($taxonomy)
{
?>
	<div class="form-field">

		<label for="sa_wc_attr_swatch"><?php _e('Swatch image', 'domain') ?></label>
		<div id="sa_wc_attr_swatch_el">
			<input type="hidden" name="sa_wc_attr_swatch" id="sa_wc_attr_swatch" />
		</div>
	</div>
<?php
}

function edit_term_fields_text($term, $taxonomy)
{

	// get meta data value
	$data = get_swatch_data($term->term_id);

?><tr class="form-field">
		<th><label for="sa_wc_attr_swatch"><?php _e('Swatch label') ?></label></th>
		<td>
			<div id="sa_wc_attr_swatch_el">
				<input type="hidden" name="sa_wc_attr_swatch" id="sa_wc_attr_swatch" />
			</div>
		</td>
	</tr>
<?php
}

function edit_term_fields_color($term, $taxonomy)
{

	// get meta data value
	$data = get_term_swatch($term->term_id);
?><tr class="form-field">
		<th><label for="sa_wc_attr_swatch_color"><?php _e('Swatch label') ?></label></th>
		<td>
			<div id="sa_wc_attr_swatch_el">
				<input name="sa_wc_attr_swatch" id="sa_wc_attr_swatch" type="hidden" value="<?php echo esc_attr(json_encode($data)) ?>" />
			</div>
		</td>
	</tr>
<?php

}
function edit_term_fields_image($term, $taxonomy)
{

	$data = get_term_swatch($term->term_id);
?><tr class="form-field">
		<th><label for="sa_wc_attr_swatch_image"><?php _e('Swatch image') ?></label></th>
		<td>
			<div id="sa_wc_attr_swatch_el">
				<input name="sa_wc_attr_swatch" id="sa_wc_attr_swatch" type="hidden" value="<?php echo esc_attr(json_encode($data)) ?>" />
			</div>
		</td>
	</tr>
<?php
}



function manage_attr_columns()
{

	$attrs = wc_get_attribute_taxonomies();

	foreach ($attrs as $attr) {
		$tax = "pa_{$attr->attribute_name}";
		$field = '_text';
		switch ($attr->attribute_type) {
			case 'sa_color':
				$field = '_color';
				break;
			case 'sa_image':
				$field = '_image';
				break;
		}

		add_filter("manage_edit-{$tax}_columns", __NAMESPACE__ . '\add_columns');
		add_filter("manage_{$tax}_custom_column", __NAMESPACE__ . '\column_content', 10, 3);
		add_action("{$tax}_add_form_fields", __NAMESPACE__ . "\add_term_fields{$field}");
		add_action("{$tax}_edit_form_fields", __NAMESPACE__ . '\edit_term_fields' . $field, 10, 2);
		add_action("created_{$tax}", __NAMESPACE__ . '\save_term_fields');
		add_action("edited_{$tax}", __NAMESPACE__ . '\save_term_fields');
	}
}

add_filter('plugins_loaded', __NAMESPACE__ . '\manage_attr_columns', 10, 3);


add_action('admin_enqueue_scripts', __NAMESPACE__ . '\admin_scripts');

/**
 * Change admin tags js to update some js events.
 * @see /wp-admin/js/tags.js
 *
 * @param [type] $src
 * @param [type] $handle
 * @return void
 */
function maybe_change_admin_js($src, $handle)
{
	if ($handle === 'admin-tags') {
		$src = SA_WC_SWATCHES_URL . '/assets/wp-admin-js/tags.js';
	}
	return $src;
}

function attr_terms_scripts()
{
	$assets = get_assets('attr/attr-manager');
	if (!$assets) {
		return;
	}

	$assets['dependencies'][] = 'jquery';
	wp_enqueue_media();
	wp_register_script('sa_wc_admin_attr_manager', $assets['files']['js'], $assets['dependencies'], $assets['version'], ['in_footer' => true]);
	wp_register_style('sa_wc_admin_attr_manager', $assets['files']['css'], [], $assets['version']);

	$config = get_ajax_configs();
	$config['current_tax'] = get_current_tax_type();

	if (isset($_GET['tag_ID'])) {
		$config['current_term'] = get_swatch_data(absint($_GET['tag_ID']));
	}

	wp_localize_script('sa_wc_admin_attr_manager', 'SA_WC_SWATCHES', $config);
	wp_enqueue_script('sa_wc_admin_attr_manager');
	wp_enqueue_style('sa_wc_admin_attr_manager');

	add_filter('script_loader_src', __NAMESPACE__ . '\maybe_change_admin_js', 10, 2);
}


function product_attr_scripts()
{
	$assets = get_assets('attr/product-attributes');
	if (!$assets) {
		return;
	}

	$assets['dependencies'][] = 'jquery';
	wp_enqueue_media();
	wp_register_script('sa_wc_admin_product_attr', $assets['files']['js'], $assets['dependencies'], $assets['version'], ['in_footer' => true]);
	wp_register_style('sa_wc_admin_product_attr', $assets['files']['css'], [], $assets['version']);


	$config = get_ajax_configs();
	if (isset($_GET['edit'])) {
		$config['id'] = absint($_GET['edit']);
	}

	wp_localize_script('sa_wc_admin_product_attr', 'SA_WC_SWATCHES', $config);
	wp_enqueue_script('sa_wc_admin_product_attr');
	wp_enqueue_style('sa_wc_admin_product_attr');
}



function admin_scripts()
{

	$screen    = get_current_screen();
	$taxonomy = $screen ? $screen->taxonomy : '';

	if ('product_page_product_attributes' === $screen->id) {
		product_attr_scripts();
		return;
	}

	$attrs = get_wc_tax_attrs();
	if (!isset($attrs[$taxonomy])) {
		return;
	}

	attr_terms_scripts();
}


// do_action( 'woocommerce_attribute_updated', $id, $data, $old_slug );

function update_attribute($id, $data = [])
{
	global $wpdb;

	$desc =  isset($_POST['sa_attr_desc']) ? wp_unslash($_POST['sa_attr_desc']) : '';
	$label =  isset($_POST['sa_attr_btn_label']) ? wp_unslash($_POST['sa_attr_btn_label']) : '';
	$title =  isset($_POST['sa_attr_modal_title']) ? wp_unslash($_POST['sa_attr_modal_title']) : '';
	$save_data =  [
		'description' =>  $desc,
		'title' =>  $title,
		'button_label' =>  $label,
	];
	$table =  $wpdb->prefix . 'sa_attr_tax_data';
	$row = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE attr_id = %d LIMIT 1", $id));

	if ($row) {
		$wpdb->update(
			$table,
			$save_data,
			array('attr_id' => $id),
		);
	} else {
		$save_data['attr_id'] = $id;
		$wpdb->insert(
			$table,
			$save_data,
		);
	}
}

function delete_attribute($id)
{
	global $wpdb;
	$table =  $wpdb->prefix . 'sa_attr_tax_data';
	$wpdb->query($wpdb->prepare("DELETE FROM {$table} WHERE attr_id = %d", $id));
}
add_action('woocommerce_attribute_updated', __NAMESPACE__ . '\update_attribute', 10, 2);
add_action('woocommerce_attribute_added', __NAMESPACE__ . '\update_attribute', 10, 2);
add_action('woocommerce_attribute_deleted', __NAMESPACE__ . '\delete_attribute', 10, 1);

function add_attribute_fields()
{
?>
	<div class="form-field">
		<label for="sa_attr_btn_label"><?php esc_html_e('Button label', 'domain'); ?></label>
		<div class="sa_attribute_field">
			<input name="sa_attr_btn_label" id="sa_attr_btn_label" type="text" value="">
			<p class="description"><?php _e('E.g: View chart size', 'domain'); ?></p>
		</div>
	</div>
	<div class="form-field">
		<label for="sa_attr_modal_title"><?php esc_html_e('Modal title', 'domain'); ?></label>
		<div class="sa_attribute_field">
			<input name="sa_attr_modal_title" id="sa_attr_modal_title" type="text" value="">
			<p class="description"><?php _e('E.g: View chart size', 'domain'); ?></p>
		</div>
	</div>
	<div class="form-field">
		<label for="sa_attribute_settings"><?php esc_html_e('Description', 'domain'); ?></label>
		<div class="sa_attribute_field"><?php wp_editor("", 'sa_attr_desc', ['textarea_rows' => 15]); ?></div>
		<div class="sa_attribute_settings"></div>
	</div>
<?php
}
function edit_attribute_fields()
{

	$id = isset($_GET['edit']) ? absint($_GET['edit']) : 0;
	$data = get_custom_attr_data($id);


?>
	<tr class="form-field form-required">
		<th scope="row" valign="top">
			<label for="sa_attr_btn_label"><?php esc_html_e('Button label', 'domain'); ?></label>
		</th>
		<td>
			<div class="sa_attribute_field "><input name="sa_attr_btn_label" id="sa_attr_btn_label" type="text" value="<?php echo esc_attr($data['button_label']); ?>"></div>
			<p class="description"><?php _e('E.g: View chart size', 'domain'); ?></p>
		</td>
	</tr>
	<tr class="form-field form-required">
		<th scope="row" valign="top">
			<label for="sa_attr_modal_title"><?php esc_html_e('Modal title', 'domain'); ?></label>
		</th>
		<td>
			<div class="sa_attribute_field "><input name="sa_attr_modal_title" id="sa_attr_modal_title" type="text" value="<?php echo esc_attr($data['title']); ?>"></div>
		</td>
	</tr>
	<tr class="form-field form-required">
		<th scope="row" valign="top">
			<label for="sa_attribute_settings"><?php esc_html_e('Description', 'domain'); ?></label>
		</th>
		<td>
			<div class="sa_attribute_field "><?php wp_editor($data['description'], 'sa_attr_desc', ['textarea_rows' => 15]); ?></div>
			<div class="sa_attribute_settings"></div>
		</td>
	</tr>
<?php
}

add_action('woocommerce_after_add_attribute_fields', __NAMESPACE__ . '\add_attribute_fields');
add_action('woocommerce_after_edit_attribute_fields', __NAMESPACE__ . '\edit_attribute_fields');
