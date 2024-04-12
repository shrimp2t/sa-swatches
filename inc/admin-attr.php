<?php

namespace SA_WC_BLOCKS\Admin\Attr;

use function SA_WC_BLOCKS\get_assets;

function get_swatch_data($term_id)
{

	$data = json_decode(get_term_meta($term_id, '_sa_wc_swatch', true), true);
	if (!is_array($data)) {
		$data = [];
	}

	$data = wp_parse_args($data, [
		'value' => '',
		'type' => '',
	]);

	return $data;
}


function get_current_tax()
{
	if (isset($_GET['taxonomy'])) {
		return sanitize_text_field($_GET['taxonomy']);
	}
	return false;
}


function get_wc_tax_attrs()
{
	$key = 'sa_attr_map_types';
	if (isset($GLOBALS[$key])) {
		return $GLOBALS[$key];
	}
	$attribute_taxonomies = wc_get_attribute_taxonomies();
	$attr_map_types = [];
	if (!empty($attribute_taxonomies)) {
		foreach ($attribute_taxonomies as $tax) {
			$name =  wc_attribute_taxonomy_name($tax->attribute_name);
			$attr_map_types[$name] = $tax->attribute_type;
		}
	}

	$GLOBALS[$key] = $attr_map_types;
	return $GLOBALS[$key];
}

function get_current_tax_type()
{

	$key = 'sa_current_tax_type';
	if (isset($GLOBALS[$key])) {
		return $GLOBALS[$key];
	}

	$t = get_current_tax();
	$attrs = get_wc_tax_attrs();
	$type =  $t && isset($attrs[$t]) ? $attrs[$t] : false;
	$GLOBALS[$key] = [
		'tax' => $t,
		'type' => $type,
	];

	return $GLOBALS[$key];
}

function save_term_fields($term_id)
{

	if (isset($_POST['sa_wc_attr_swatch'])) {
		update_term_meta(
			$term_id,
			'_sa_wc_swatch',
			json_encode($_POST['sa_wc_attr_swatch'])
		);
	}
}


function get_term_swatch($term_id)
{
	$data = get_term_meta($term_id, '_sa_wc_swatch', true);
	$data = json_decode($data);
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
			$content =  '<div data-tax="' . esc_attr($tax['tax']) . '" data-swatch="' . esc_attr(json_encode($data)) . '" data-tax-type="' . esc_attr($tax['type']) . '" data-term_id="' . esc_attr($term_id) . '"  class="sa_wc_swatch">' . esc_html($data['value']) . '</div>';
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
			<input type="text" name="sa_wc_attr_swatch[value]" id="sa_wc_attr_swatch" />
			<input type="hidden" name="sa_wc_attr_swatch[type]" value="text" />
		</div>
	</div>
<?php
}

function add_term_fields_color($taxonomy)
{
?>
	<div class="form-field">
		<label for="sa_wc_attr_swatch"><?php _e('Swatch color') ?></label>
		<div id="sa_wc_attr_swatch_el">
			<input type="hidden" name="sa_wc_attr_swatch[value]" id="sa_wc_attr_swatch" />
			<input type="hidden" name="sa_wc_attr_swatch[type]" value="color" />
		</div>
	</div>
<?php
}

function add_term_fields_image($taxonomy)
{
?>
	<div class="form-field">

		<label for="sa_wc_attr_swatch"><?php _e('Swatch image') ?></label>
		<div id="sa_wc_attr_swatch_el">
			<input type="hidden" name="sa_wc_attr_swatch[value]" id="sa_wc_attr_swatch" />
			<input type="hidden" name="sa_wc_attr_swatch[type]" value="image" />
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
				<input name="sa_wc_attr_swatch[value]" id="sa_wc_attr_swatch" type="text" value="<?php echo esc_attr($data['value']) ?>" />
				<input type="hidden" name="sa_wc_attr_swatch[type]" value="text" />
			</div>
		</td>
	</tr>
<?php
}

function edit_term_fields_color($term, $taxonomy)
{

	// get meta data value
	$data = get_swatch_data($term->term_id);

?><tr class="form-field">
		<th><label for="sa_wc_attr_swatch_color"><?php _e('Swatch label') ?></label></th>
		<td>
			<div id="sa_wc_attr_swatch_el">
				<input name="sa_wc_attr_swatch[value]" id="sa_wc_attr_swatch" type="hidden" value="<?php echo esc_attr($data['value']) ?>" />
				<input type="hidden" name="sa_wc_attr_swatch[type]" value="color" />
				<input type="hidden" name="sa_wc_attr_swatch[value2]" value="" />
			</div>
		</td>
	</tr>
<?php

}
function edit_term_fields_image($term, $taxonomy)
{

	$data = get_swatch_data($term->term_id);

?><tr class="form-field">
		<th><label for="sa_wc_attr_swatch_image"><?php _e('Swatch image') ?></label></th>
		<td>
			<div id="sa_wc_attr_swatch_el">
				<input name="sa_wc_attr_swatch[value]" id="sa_wc_attr_swatch" type="hidden" value="<?php echo esc_attr($data['value']) ?>" />
				<input type="hidden" name="sa_wc_attr_swatch[src]" value="" />
				<input type="hidden" name="sa_wc_attr_swatch[id]" value="" />
				<input type="hidden" name="sa_wc_attr_swatch[type]" value="image" />
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
 *
 * @param [type] $src
 * @param [type] $handle
 * @return void
 */
function maybe_change_admin_js($src, $handle)
{
	if ($handle === 'admin-tags') {
		// @see /wp-admin/js/tags.js
		$src = SA_WC_BLOCKS_URL . '/wp-admin-js/tags.js';
	}
	return $src;
}



function admin_scripts()
{

	$screen    = get_current_screen();
	$screen_id = $screen ? $screen->id : '';
	$taxonomy = $screen ? $screen->taxonomy : '';

	$attrs = get_wc_tax_attrs();

	if (!isset($attrs[$taxonomy])) {
		return;
	}

	$assets = get_assets('attr-manager');
	if (!$assets) {
		return;
	}

	$assets['dependencies'][] = 'jquery';
	wp_enqueue_media();
	wp_register_script('sa_attr_manager', $assets['files']['js'], $assets['dependencies'], $assets['version'], ['in_footer' => true]);
	wp_register_style('sa_attr_manager', $assets['files']['css'], [], $assets['version']);

	$config =  [
		'root' => esc_url_raw(rest_url()),
		'nonce' => wp_create_nonce('wp_rest'),
		'current_tax' => get_current_tax_type(),
	];

	if (isset($_GET['tag_ID'])) {
		$config['current_term'] = get_swatch_data(absint($_GET['tag_ID']));
	}


	wp_localize_script('sa_attr_manager', 'SA_WC_BLOCKS', $config);
	wp_enqueue_script('sa_attr_manager');
	wp_enqueue_style('sa_attr_manager');

	add_filter('script_loader_src', __NAMESPACE__ . '\maybe_change_admin_js', 10, 2);
}