# Srouce

https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce-blocks/assets/js/atomic/blocks/product-elements/button/frontend.tsx

https://plugins.trac.wordpress.org/browser/woocommerce/trunk/assets/client/blocks/product-button-interactivity-frontend.js

# JavaScript Beautifier
https://codebeautify.org/jsviewer


# Search and edit function function 

import getElement function
```js
	he = e => (0, t.getContext)(e),
	getElement = (0, t.getElement),
```


### addToCartText
--> Handle product when variation changes

### syncTemporaryNumberOfItemsOnLoad
--> Handle change add to cart id when variation change.


Listend event variation change:
```js

const e = he(); // getContext 
const element = getElement();
element.ref.addEventListener("sasw_variation_change", (evt) => {
  console.log('sasw_variation_change', evt.detail, e);
  e.productId = evt.detail?.variation_id || 0;
});

```

