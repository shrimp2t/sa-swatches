<?php

namespace SA_WC_BLOCKS\API;

require_once __DIR__ . '/attr-api.php';

add_action('wp_ajax_sa_wc_ajax', __NAMESPACE__ . '\init');
add_action('wp_ajax_nopriv_sa_wc_ajax', __NAMESPACE__ . '\init');
function init()
{


	$post = json_decode(file_get_contents('php://input'), true);
	$endpoint =  isset($_REQUEST['endpoint']) ? sanitize_text_field($_REQUEST['endpoint']) : '';
	$method =  $_REQUEST['method'] ? sanitize_text_field($_REQUEST['method']) : '';



	do_action('sa_wc_api/' . $endpoint, $post);

	die();
}
