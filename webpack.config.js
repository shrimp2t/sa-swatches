const defaultConfig = require("@wordpress/scripts/config/webpack.config");

const { getWebpackEntryPoints } = require("@wordpress/scripts/utils");
const NODE_ENV = process.env.NODE_ENV || "development";
const RtlCssPlugin = require("rtlcss-webpack-plugin");
const glob = require("glob");
const path = require("path");

/**
 * @see https://github.com/WordPress/wp-movies-demo/tree/main
 */

module.exports = [
	...defaultConfig,
	{
		...defaultConfig[0],
		entry: {
			plugins: "./src/plugins/index.js",
			['admin/admin-settings']: "./src/admin/admin-settings.js",
			["attr/attr-product"]: "./src/wc-attributes/attr-product.js",
			["attr/attr-manager"]: "./src/wc-attributes/attr-manager.js",
			["attr/product-attributes"]: "./src/wc-attributes/product-attributes.js",
			["frontend/swatches"]: "./src/frontend/swatches.js",
		},
		output: {
			...defaultConfig[0].output,
			path: path.resolve(__dirname, "./build/"),
		},
	},
];
