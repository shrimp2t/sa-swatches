<?php

namespace SA_WC_BLOCKS\Admin\WC_Settings;
// add_filter( 'woocommerce_get_sections_{tab}', ...
add_filter('woocommerce_get_sections_advanced', __NAMESPACE__ . '\add_setting_section');

function add_setting_section($sections)
{

	$sections['sa_swatches'] = __('Product Swatches');
	return $sections;
}

// add_action( 'woocommerce_settings_{tab}', ...
add_action('woocommerce_settings_advanced', __NAMESPACE__ . '\section_content');

function section_content()
{
	if (empty($_GET['section']) || 'sa_swatches' !== $_GET['section']) {
		return;
	}
	echo 'what is up?';
}

function add_fields($settings, $current_section)
{
	// we need the fields only on our custom section
	if ('sa_swatches' !== $current_section) {
		return $settings;
	}

	$settings = array(
		array(
			'name' => 'Custom Shipping Settings by Misha',
			'type' => 'title',
			'desc' => 'Blah blah blah description',
		),
		array(
			'name'     => 'Amazing shipping promo code',
			'desc_tip' => 'You can ask it if you text me',
			'id'       => 'misha_shipping_code',
			'type'     => 'text',
		),
		array(
			'name'     => 'Enabled',
			'desc'     => 'Yes',
			'desc_tip' => 'Some description under the field',
			'id'       => 'misha_shipping_on',
			'type'     => 'checkbox',
		),
		array(
			'type' => 'sectionend',
		),
	);

	return $settings;
}

add_filter('woocommerce_get_settings_advanced', __NAMESPACE__ . '\add_fields', 10, 2);
