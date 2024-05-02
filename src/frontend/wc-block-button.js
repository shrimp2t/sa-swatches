/**
 * External dependencies
 * @see https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce-blocks/assets/js/atomic/blocks/product-elements/button/frontend.tsx
 * @see https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce-blocks/tsconfig.base.json#L43
 */
console.log("dsadsadsa");

/**
 * WordPress dependencies
 */

import {
	store,
	getContext,
	getElement,
	getConfig,
} from "@wordpress/interactivity";
// import { getScope } from "@wordpress/interactivity/build/hooks";
const nameSpace = "woocommerce/product-button";
console.log("getConfig", getConfig(nameSpace));
store("sawc/cart-btn", {
	actions: {
		toggle: () => {
			const context = getContext();
			context.isOpen = !context.isOpen;
		},
	},
	callbacks: {
		logIsOpen: () => {
			const btnContext = getContext(nameSpace);
			const context = getContext();
			// Log the value of `isOpen` each time it changes.
			console.log(`Is open: ${context.isOpen}`);
			console.log(`btnContext`, btnContext);
		},
	},
});
