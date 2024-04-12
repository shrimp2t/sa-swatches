<?php

namespace SA_WC_BLOCKS\API;

add_action('wp_ajax_sa_wc_ajax', __NAMESPACE__ . '\init');
add_action('wp_ajax_nopriv_sa_wc_ajax', __NAMESPACE__ . '\init');
function init()
{

	$endpoint =  isset($_REQUEST['endpoint']) ? sanitize_text_field($_REQUEST['endpoint']) : '';
	$method =  $_REQUEST['method'] ? sanitize_text_field($_REQUEST['method']) : '';

	die();
}
