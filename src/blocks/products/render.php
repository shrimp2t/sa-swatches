<?php

/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */
?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<?php esc_html_e('Example Dynamic – hello from a dynamic block aaa!!!!', 'example-dynamic'); ?>


	<?php
	$query = new WC_Product_Query(array(
		'limit' => 20,
		'orderby' => 'date',
		'order' => 'DESC',
		'paginate' => true,
	));
	$query = $query->get_products();

	global $product;

	$args = [];

	/**
	 * WC_Product
	 */
	foreach ($query->products as $product) {

		$GLOBALS['post'] = get_post($product->get_id()); // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
		setup_postdata($GLOBALS['post']);


	?>
		<div class="product">
			<div><?php woocommerce_template_loop_product_thumbnail(); ?></h1>
			<h1><?php woocommerce_template_loop_product_title(); ?></h1>
			<div>
				<?php

				global $product;

				woocommerce_template_loop_add_to_cart();
				?>
			</div>

		</div>
	<?php
	}

	?>

</div>