<?php

namespace SASW_SWATCHES\Admin\WC_Settings;

use function SASW_SWATCHES\get_assets;
use function SASW_SWATCHES\get_text_settings_for_admin;

function admin_scripts()
{

	$screen    = get_current_screen();
	$screen_id = $screen ? $screen->id : '';

	if (!in_array($screen_id, array('woocommerce_page_wc-settings'), true)) {
		return;
	}

	if (!isset($_GET['section']) || 'sasw_swatches' != sanitize_text_field($_GET['section'])) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		return;
	}

	$assets = get_assets('admin/admin-settings');
	if (!$assets) {
		return;
	}

	$assets['dependencies'][] = 'jquery';
	wp_enqueue_media();
	wp_register_script('sasw_admin_settings', $assets['files']['js'], $assets['dependencies'], $assets['version'], ['in_footer' => true]);
	wp_register_style('sasw_admin_settings', $assets['files']['css'], [], $assets['version']);

	$config =  [
		'root' => esc_url_raw(rest_url()),
		'ajax' => add_query_arg(['action' => 'sasw_ajax', 'nonce' => wp_create_nonce('sasw_ajax')], admin_url('admin-ajax.php')),
		'nonce' => wp_create_nonce('wp_rest'),
		'configs' => get_text_settings_for_admin(),
	];

	wp_localize_script('sasw_admin_settings', 'SASW_SWATCHES', $config);
	wp_enqueue_script('sasw_admin_settings');
	wp_enqueue_style('sasw_admin_settings');
}

add_action('admin_enqueue_scripts', __NAMESPACE__ . '\admin_scripts');




// add_filter( 'woocommerce_get_sections_{tab}', ...
add_filter('woocommerce_get_sections_advanced', __NAMESPACE__ . '\add_setting_section');

function add_setting_section($sections)
{

	$sections['sasw_swatches'] = __('Product Swatches',"sa-swatches");
	return $sections;
}

add_action('woocommerce_settings_advanced', __NAMESPACE__ . '\section_content');

function section_content()
{
	if (empty($_GET['section']) || 'sasw_swatches' !== $_GET['section']) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		return;
	}
?>
	<div id="sasw_setting_wrap"></div>
<?php
}

function add_fields($settings, $current_section)
{
	// we need the fields only on our custom section
	if ('sasw_swatches' !== $current_section) {
		return $settings;
	}

	$settings = array(
		array(
			'name' => __('Loading...',"sa-swatches"),
			'type' => 'title',
		),

		array(
			'name'     => __('Settings',"sa-swatches"),
			'id'       => 'sasw_swatches_settings',
			'type'     => 'textarea',
			'row_class' => 'sasw_swatches_settings',
		),
		array(
			'type' => 'sectionend',
		),
	);

	return $settings;
}

add_filter('woocommerce_get_settings_advanced', __NAMESPACE__ . '\add_fields', 10, 2);
