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

  $config =  [
    'root' => esc_url_raw(rest_url()),
    'ajax' => add_query_arg(['action' => 'sa_wc_ajax', 'nonce' => wp_create_nonce('sa_wc_ajax')], admin_url('admin-ajax.php')),
    'nonce' => wp_create_nonce('wp_rest'),
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

  var_dump( $attribute);
?>
  <select multiple="multiple" data-return_id="id" data-placeholder="<?php esc_attr_e('Select values', 'woocommerce'); ?>" class="sa_attr_swatches multiselect attribute_values wc-taxonomy-term-search----" name="attribute_values[<?php echo esc_attr($i); ?>][]" data-taxonomy="<?php echo esc_attr($attribute->get_taxonomy()); ?>">
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
