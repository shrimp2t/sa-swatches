
import "./swatches.scss";
import "react-modern-drawer/dist/index.css";
import "react-tooltip/dist/react-tooltip.css";

// import React from "react";
import { render } from "@wordpress/element";
import App from "./components/App";
import req from "../common/req";
import {
	cleanObj,
} from "./common/variants";



const { SA_WC_SWATCHES } = window;

jQuery(($) => {
	const singleSettings = cleanObj(SA_WC_SWATCHES.single, true);
	const loopSettings = cleanObj(SA_WC_SWATCHES.single, true);

	const option = {
		layout: singleSettings?.option_layout || 'inline', // box || inline | checkbox
		col: parseInt(singleSettings?.option_col), // Number: apply for layout [box] only.
		size: singleSettings?.option_size || 22, // not apply for [box] layout.
		label: singleSettings?.option_label, //  yes | no | <>empty
	};

	const drawerOption = {
		layout: singleSettings?.option_drawer_layout || 'inline', // box || inline | checkbox
		size: singleSettings?.option_drawer_size, // not apply for [box] layout.
		label: singleSettings?.option_drawer_label, //  yes | no | <>empty
	};

	$(".variations_form").each(function () {
		const form = $(this);
		const pid = form.data("product_id");
		const table = form.find(".variations");
		table.hide();
		const appEl = $("<div/>");
		appEl.insertAfter(table);
		const settings = {
			layout: singleSettings?.layout || "separate", // inline | separate | drawer
			showAttrDesc: true, // Show attribute description.
			showAttrLabel: true,
			option: singleSettings?.layout === "drawer" ? drawerOption : option,
			drawer: {
				option: option,
			},
		};

		console.log("Settings", settings);

		const onChange = (selected) => {
			Object.keys(selected).map((name) => {
				const v = selected[name] || false;
				// form.find([`[name="${name}"]`]).val(v).trigger('change');
			});
		};

		const variants = form.data("product_variations");
		const useAjax = false === variants;

		if (useAjax) {
			req({
				url: SA_WC_SWATCHES.ajax,
				params: {
					endpoint: "get_variants",
					pid,
				},
				method: "get",
			})
				.then((res) => {
					if (res?.success && res?.data?.length) {
						form.trigger("sa_variants", [res?.data]);
					}
				})
				.catch((e) => { });
		}

		const args = {
			pid,
			variants: variants?.length ? variants : [],
			useAjax,
			onChange,
			settings,
			form,
		};

		render(<App {...args} />, appEl.get(0));
	});

	// For loop Products

	jQuery(".sa_loop_swatches").each(function () {
		const appEl = jQuery(this);
		const pid = appEl.data("id");
		const url = appEl.data("link");
		appEl.addClass("sa_loop_product");
		let wrap = appEl.closest(".sa_p_loop_wrap");
		if (!wrap.length) {
			wrap = appEl.closest(".product");
		}
		const addCartBtn = wrap.find(".add_to_cart_button");
		const isBlockBtn = addCartBtn.hasClass('wc-interactive');
		const isCartBtn = addCartBtn.prop('tagName') === 'BUTTON';
		const a = wrap.find(`a.woocommerce-loop-product__link, a[href="${url}"]`);
		const thumb = wrap.find(".sa_loop_thumb");
		const thumbHtml = thumb.html();
		let blockContext = {}
		const blockParent = addCartBtn.parent();
		if (isBlockBtn) {
			blockContext = blockParent.data('wc-context');
			console.log('blockContext', blockContext);

		}

		let price = wrap.find(".price");
		if (!price.length) {
			price = wrap.find('.wc-block-components-product-price');
		}
		price.data("o_price", price.html());

		appEl.off("click");
		appEl.off("found_variation");
		appEl.off("reset_data");

		appEl.on("click", function (e) {
			e.preventDefault();
		});

		const buildLink = (args) => {
			const usp = new URLSearchParams(args);
			const str = usp.toString();
			const sep = url.includes("?") ? "&" : "?";
			const newUrl = str.length ? `${url}${sep}${str}` : url;
			a.attr("href", newUrl);
		};

		appEl.on("found_variation", function (evt, variation, findArgs) {
			addCartBtn.attr("data-product_id", variation.variation_id);
			addCartBtn.attr("data-product_sku", variation.sku);
			if (isBlockBtn) {
				addCartBtn.addClass('wc-interactive');
				addCartBtn.find('span').html(SA_WC_SWATCHES.i18n.add_cart);
				blockParent.attr('wc-context', JSON.stringify({ ...blockContext, productId: variation.variation_id }))
			} else {
				addCartBtn.html(SA_WC_SWATCHES.i18n.add_cart);
			}


			addCartBtn.addClass("ajax_add_to_cart");
			buildLink(findArgs || {});
			if (variation?.image?.thumb_src) {
				const img = thumb
					.find("img");

				img.attr("src", variation.image.thumb_src)
				if (variation?.image?.srcset) {
					img.attr("srcset", variation?.image?.srcset);
				}
			}

			if (variation?.price_html) {
				const vp = jQuery(variation?.price_html).html();
				price.html(vp);
			}
		});

		appEl.on("reset_data", function (evt, findArgs) {
			addCartBtn.attr("data-product_id", '');
			addCartBtn.attr("data-product_sku", "");
			// if (isCartBtn) {
			// 	addCartBtn.attr('type', 'link');
			// }
			if (isBlockBtn) {
				addCartBtn.removeClass('wc-interactive');
				addCartBtn.find('span').html(SA_WC_SWATCHES.i18n.select_options);
			} else {
				addCartBtn.html(SA_WC_SWATCHES.i18n.select_options);
			}
			addCartBtn.removeClass("ajax_add_to_cart");
			buildLink(findArgs || {});
			thumb.html(thumbHtml);
			price.html(price.data("o_price"));
		});

		req({
			url: SA_WC_SWATCHES.ajax,
			params: {
				endpoint: "get_variants",
				pid,
			},
			method: "get",
		})
			.then((res) => {
				if (res?.success && res?.data?.length) {
					appEl.trigger("sa_variants", [res?.data]);
				}
			})
			.catch((e) => { });

		const args = {
			pid,
			variants: [],
			useAjax: true,
			onChange: (selected) => {
				console.log("selected", selected);
			},
			settings: {
				layout: "inline",
				loop: true,
				showAttrLabel: false,
				option: {
					layout: "inline",
					label: "hide",
					loop: true,
				},
			},
			form: appEl,
		};

		render(<App {...args} />, appEl.get(0));
	});
});

console.log("SA_WC_SWATCHES", SA_WC_SWATCHES);

