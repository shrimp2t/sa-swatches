<?php

add_action('wp_ajax_loadpost', 'loadpost_init');
add_action('wp_ajax_nopriv_loadpost', 'loadpost_init');
function loadpost_init()
{
	ob_start(); //bắt đầu bộ nhớ đệm
	$post_new = new WP_Query(array(
		'post_type' =>  'post',
		'posts_per_page'    =>  '5'
	));
	if ($post_new->have_posts()) :
		echo '<ul>';
		while ($post_new->have_posts()) : $post_new->the_post();
			echo '<li>' . get_the_title() . '</li>';
		endwhile;
		echo '</ul>';
	endif;
	wp_reset_query();
	$result = ob_get_clean(); //cho hết bộ nhớ đệm vào biến $result
	wp_send_json_success($result); // trả về giá trị dạng json
	die(); //bắt buộc phải có khi kết thúc
}
