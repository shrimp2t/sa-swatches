<?php

namespace SA_WC_SWATCHES\API;

require_once __DIR__ . '/attr-api.php';
require_once __DIR__ . '/product-api.php';

add_action('wp_ajax_sa_wc_ajax', __NAMESPACE__ . '\init');
add_action('wp_ajax_nopriv_sa_wc_ajax', __NAMESPACE__ . '\init');
function init()
{

	$post = json_decode(file_get_contents('php://input'), true);

	$nonce = isset($_GET['nonce']) ? sanitize_text_field($_GET['nonce']) : false;
	if (!$nonce) {
		$nonce = isset($post['nonce']) ? sanitize_text_field($post['nonce']) : false;
	}
	if (!$nonce) {
		$nonce = isset($_REQUEST['nonce']) ? sanitize_text_field($_REQUEST['nonce']) : false;
	}

	if (!wp_verify_nonce($nonce, 'sa_wc_ajax')) {
		wp_send_json_error('-1');
		die();
	}

	$endpoint =  isset($_REQUEST['endpoint']) ? sanitize_text_field($_REQUEST['endpoint']) : '';
	$method =  isset($_REQUEST['method']) ? sanitize_text_field($_REQUEST['method']) : '';
	do_action('sa_wc_api/' . $endpoint, $post);

	die();
}
