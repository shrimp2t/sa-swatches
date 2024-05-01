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
}

function add_fields($settings, $current_section)
{
	// we need the fields only on our custom section
	if ('sa_swatches' !== $current_section) {
		return $settings;
	}

	$settings = array(
		array(
			'name' => 'Variations in product pages',
			'type' => 'title',
		),

		array(
			'name'     => __('Layout'),
			'desc_tip' => 'You can ask it if you text me',
			'id'       => 'sa_swatches_layout',
			'type'     => 'select',
			'options' => [
				'separate' => __('Separate'),
				'inline' => __('Inline'),
				'drawer' => __('Drawer'),
			]
		),

		array(
			'name'     => __('Number options per row'),
			'desc_tip' => __('Leave empty to display auto items per row.'),
			'id'       => 'sa_swatches_option_col',
			'type'     => 'text',
			'placeholder' => __('Auto'),
		),

		array(
			'name'     => __('Option item layout'),
			'id'       => 'sa_swatches_option_layout',
			'type'     => 'select',
			'options' => [
				'inline' => __('Inline'),
				'box' => __('Box'),
				'checkbox' => __('Checkbox'),
			]
		),

		array(
			'name'     => __('Option swatch size'),
			'id'       => 'sa_swatches_option_size',
			'type'     => 'text',
			'placeholder' => __('30'),
		),
		array(
			'name'     => __('Option label'),
			'desc_tip' => 'You can ask it if you text me',
			'id'       => 'sa_swatches_option_label',
			'type'     => 'select',
			'options' => [
				'yes' => __('Show'),
				'hide' => __('Hide'),
			]
		),




		array(
			'name'     => __('Selected option layout'),
			'desc_tip' => __('Apply for drawer mod only.'),
			'id'       => 'sa_swatches_option_drawer_layout',
			'type'     => 'select',
			'options' => [
				'inline' => __('Inline'),
				'box' => __('Box'),
				'checkbox' => __('Checkbox'),
			]
		),

		array(
			'name'     => __('Selected option size'),
			'desc_tip' => __('Apply for drawer mod only.'),
			'id'       => 'sa_swatches_option_drawer_size',
			'type'     => 'text',
			'placeholder' => __('30'),
		),
		array(
			'name'     => __('Selected option label'),
			'desc_tip' => __('Apply for drawer mod only.'),
			'id'       => 'sa_swatches_option_drawer_label',
			'type'     => 'select',
			'options' => [
				'yes' => __('Show'),
				'hide' => __('Hide'),
			]
		),


		array(
			'type' => 'sectionend',
		),

		array(
			'name' => __('Variations in shop & archive pages'),
			'type' => 'title',
		),

		array(
			'name'     => __('Show variations as separate products'),
			'desc' => __('Enable to show each single variation as a separate product in the shop and archive pages.'),
			'id'       => 'sa_swatches_shop_show',
			'type'     => 'checkbox',
			'checkboxgroup' => 'start',
		),
		array(
			'name'     => __('Allow attributes selection in shop and archive pages'),
			'desc' => __('Enable to allow users to choose variations in the shop and archive pages.'),
			'id'       => 'sa_swatches_shop_selection',
			'type'     => 'checkbox',
			'checkboxgroup' => 'start',
		),

		array(
			'name'     => __('Variations form position in archive pages'),
			'id'       => 'sa_swatches_shop_position',
			'type'     => 'select',
			'options' => [
				'before_add_cart' => __('Before add to cart button'),
				'after_add_cart' => __('After add to cart button'),
			]
		),

		array(
			'name'     => __('Max options to show'),
			'id'       => 'sa_swatches_shop_max',
			'type'     => 'text',
			'placeholder' => __('Auto'),
		),
		array(
			'name'     => __('Option swatch size'),
			'id'       => 'sa_swatches_shop_size',
			'type'     => 'text',
			'placeholder' => __('30'),
		),

		array(
			'type' => 'sectionend',
		),
	);

	return $settings;
}

add_filter('woocommerce_get_settings_advanced', __NAMESPACE__ . '\add_fields', 10, 2);
