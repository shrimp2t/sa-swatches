<?php

namespace SA_WC_BLOCKS;


global $sa_db_version;
$sa_db_version = '1.0';

function install()
{
	global $wpdb;
	global $sa_db_version;
	$table_name = $wpdb->prefix . 'sa_attr_tax_data';

	$charset_collate = $wpdb->get_charset_collate();

	$sql = "CREATE TABLE $table_name (
		`attr_id` bigint(20) NOT NULL AUTO_INCREMENT,
		`settings` longtext DEFAULT NULL,
		`description` longtext DEFAULT NULL,
		PRIMARY KEY  (attr_id)
	) $charset_collate;";

	require_once ABSPATH . 'wp-admin/includes/upgrade.php';
	dbDelta($sql);

	add_option('sa_db_version', $sa_db_version);
}
