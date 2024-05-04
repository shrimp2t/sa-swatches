import "./swatches.scss";
import "react-modern-drawer/dist/index.css";
import "react-tooltip/dist/react-tooltip.css";

// import React from "react";
import { render } from "@wordpress/element";
import App from "./components/App";
import req from "../common/req";
import { cleanObj } from "./common/variants";

const { SA_WC_SWATCHES } = window;

jQuery(($) => {
	const preSettings = cleanObj(SA_WC_SWATCHES.settings, true);

	const option = {
		layout: preSettings?.layout || "inline", // box || inline | checkbox
		col: parseInt(preSettings?.col), // Number: apply for layout [box] only.
		size: preSettings?.size || 22, // not apply for [box] layout.
		label: preSettings?.label, //  yes | no | <>empty
		image_style: preSettings?.swatch_image,
		color_style: preSettings?.swatch_color,
	};

	const drawerOption = {
		layout: preSettings?.drawer_layout || "inline", // box || inline | checkbox
		size: preSettings?.drawer_size, // not apply for [box] layout.
		label: preSettings?.drawer_label, //  yes | no | <>empty
		image_style: preSettings?.drawer_swatch_image,
		color_style: preSettings?.drawer_swatch_color,
	};

	$(".variations_form").each(function () {
		const form = $(this);
		const pid = form.data("product_id");
		const table = form.find(".variations");
		table.wrap("<div class='sa_vtb_wrap sa_loading sa_hidden'></div>");
		const wrap = table.parent();
		const appEl = $("<div class='sa_wc_swatches'/>");
		wrap.css({
			height: `${table.height()}px`,
		});
		appEl.insertAfter(table);
		const settings = {
			layout: preSettings?.form_layout || "separate", // inline | separate | drawer
			showAttrDesc: true, // Show attribute description.
			showAttrLabel: true,
			option: preSettings?.form_layout === "drawer" ? drawerOption : option,
			drawer: {
				option: option,
			},
		};

		console.log("SINGLE____Settings", settings);

		const onChange = (selected) => {
			Object.keys(selected).map((name) => {
				const v = selected[name] || false;
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
				.catch((e) => {});
		}

		const args = {
			pid,
			variants: variants?.length ? variants : [],
			useAjax,
			onChange,
			settings,
			form,
			onReady: () => {
				if (table) {
					wrap.removeClass("sa_loading");

					table.hide();
					setTimeout(() => {
						wrap.css({ height: `${appEl.outerHeight()}px` });
						setTimeout(() => {
							wrap.removeClass("sa_hidden");
							wrap.css({ height: `` });
						}, 500);
					}, 300);
				}
			},
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
		const isBlockBtn = addCartBtn.hasClass("wc-interactive");
		const isCartBtn = addCartBtn.prop("tagName") === "BUTTON";
		const a = wrap.find(`a.woocommerce-loop-product__link, a[href="${url}"]`);
		const thumb = wrap.find(".sa_loop_thumb");
		const thumbHtml = thumb.html();
		let blockContext = {};
		const blockParent = addCartBtn.parent();
		if (isBlockBtn) {
			blockContext = blockParent.data("wc-context");
			console.log("blockContext", blockContext);
		}

		let price = wrap.find(".price");
		if (!price.length) {
			price = wrap.find(".wc-block-components-product-price");
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
			return newUrl;
		};

		appEl.on("found_variation", function (evt, variation, findArgs) {
			addCartBtn.attr("data-product_id", variation.variation_id);
			addCartBtn.attr("data-product_sku", variation.sku);
			const link = buildLink(findArgs || {});

			if (isBlockBtn) {
				addCartBtn.addClass("wc-interactive");
				const btnSpan = addCartBtn.find("span");
				btnSpan.html(SA_WC_SWATCHES.i18n.add_cart);
				blockParent.attr(
					"wc-context",
					JSON.stringify({
						...blockContext,
						productId: variation.variation_id,
					}),
				);
				btnSpan.get(0).dispatchEvent(
					new CustomEvent("sa_wc_variation_change", {
						bubbles: true,
						detail: {
							variation_id: variation.variation_id,
							link,
						},
					}),
				);
			} else {
				addCartBtn.html(SA_WC_SWATCHES.i18n.add_cart);
			}

			addCartBtn.addClass("ajax_add_to_cart");

			if (variation?.image?.thumb_src) {
				const img = thumb.find("img");

				img.attr("src", variation.image.thumb_src);
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
			addCartBtn.attr("data-product_id", "");
			addCartBtn.attr("data-product_sku", "");
			const link = buildLink(findArgs || {});
			if (isBlockBtn) {
				addCartBtn.removeClass("wc-interactive");
				const btnSpan = addCartBtn.find("span");
				btnSpan.html(SA_WC_SWATCHES.i18n.select_options);
				btnSpan.get(0).dispatchEvent(
					new CustomEvent("sa_wc_variation_change", {
						bubbles: true,
						detail: {
							variation_id: 0,
							link,
						},
					}),
				);
			} else {
				addCartBtn.html(SA_WC_SWATCHES.i18n.select_options);
			}
			addCartBtn.removeClass("ajax_add_to_cart");

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
			.catch((e) => {});

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
				align: preSettings?.shop_align || "center",
				option: {
					layout: "inline",
					label: "hide",
					loop: true,
					size: preSettings?.shop_size,
					image_style: preSettings?.shop_swatch_image,
					color_style: preSettings?.shop_swatch_color,
				},
			},
			form: appEl,
		};

		render(<App {...args} />, appEl.get(0));
	});
});

console.log("SA_WC_SWATCHES", SA_WC_SWATCHES);
