const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const { getWebpackEntryPoints } = require("@wordpress/scripts/utils");
const NODE_ENV = process.env.NODE_ENV || "development";
const RtlCssPlugin = require("rtlcss-webpack-plugin");
const glob = require("glob");
const path = require("path");

module.exports = [
	{
		...defaultConfig,
		entry: {
			plugins: "./src/plugins/index.js",
			admin: "./src/admin/admin.js",
			["attr/attr-product"]: "./src/wc-attributes/attr-product.js",
			["attr/attr-manager"]: "./src/wc-attributes/attr-manager.js",
			["attr/product-attributes"]: "./src/wc-attributes/product-attributes.js",
			["frontend/swatches"]: "./src/frontend/swatches.js",
		},
		output: {
			...defaultConfig.output,
			path: path.resolve(__dirname, "./build/"),
			publicPath: "auto",
		},

		plugins: [
			...defaultConfig.plugins,
			new RtlCssPlugin({
				filename: "[name]-rtl.css",
			}),
		],
		mode: "development",
	},

	{
		...defaultConfig,
		plugins: [
			...defaultConfig.plugins,
			new RtlCssPlugin({
				filename: "[name]-rtl.css",
			}),
		],
		mode: "development",
	},
];
