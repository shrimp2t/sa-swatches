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
			['attr-product']: "./src/wc-attributes/att-product.js",
			['attr-manager']: "./src/wc-attributes/attr-manager.js",
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
	},

	{
		...defaultConfig,
		plugins: [
			...defaultConfig.plugins,
			new RtlCssPlugin({
				filename: "[name]-rtl.css",
			}),
		],
	},
];
