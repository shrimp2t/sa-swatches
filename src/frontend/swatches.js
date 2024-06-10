import "./swatches.scss";
import "react-modern-drawer/dist/index.css";
import "react-tooltip/dist/react-tooltip.css";

// import React from "react";
import { render } from "@wordpress/element";
import App from "./components/App";
import req from "../common/req";
import { cleanObj } from "./common/variants";

const { SASW_SWATCHES } = window;

jQuery(($) => {
	const preSettings = cleanObj(SASW_SWATCHES.settings, true);
	const { option = {} } = preSettings?.single || {};
	const { option: drawerOption = {} } = preSettings?.drawer || {};

	$(".variations_form").each(function () {
		const form = $(this);
		const pid = form.data("product_id");
		const table = form.find(".variations");
		table.wrap("<div class='sasw_vtb_wrap sasw_loading sasw_hidden'></div>");
		const wrap = table.parent();
		const appEl = $("<div class='sasw_swatches'/>");
		wrap.css({
			height: `${table.height()}px`,
		});
		appEl.insertAfter(table);
		const settings = {
			layout: preSettings?.single?.layout || "separate", // inline | separate | drawer
			viewAttrDetail:
				preSettings?.single?.viewAttrDetail !== "hide" ? true : false,
			option: option,
			drawer: {
				option: drawerOption,
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
				url: SASW_SWATCHES.ajax,
				params: {
					endpoint: "get_variants",
					pid,
				},
				method: "get",
			})
				.then((res) => {
					if (res?.success && res?.data?.length) {
						form.trigger("sasw_variants", [res?.data]);
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
			onReady: () => {
				if (table) {
					wrap.removeClass("sasw_loading");

					table.hide();
					setTimeout(() => {
						wrap.css({ height: `${appEl.outerHeight()}px` });
						setTimeout(() => {
							wrap.removeClass("sasw_hidden");
							wrap.css({ height: `` });
						}, 500);
					}, 300);
				}
			},
		};

		render(<App {...args} />, appEl.get(0));
	});

	// For loop Products

	jQuery(".sasw_loop_swatches").each(function () {
		const appEl = jQuery(this);
		const pid = appEl.data("id");
		const url = appEl.data("link");
		appEl.addClass("sasw_loop_product");
		let wrap = appEl.closest(".sasw_p_loop_wrap");
		if (!wrap.length) {
			wrap = appEl.closest(".product");
		}
		const addCartBtn = wrap.find(".add_to_cart_button");
		const isBlockBtn = addCartBtn.hasClass("wc-interactive");
		const isCartBtn = addCartBtn.prop("tagName") === "BUTTON";
		const a = wrap.find(`a.woocommerce-loop-product__link, a[href="${url}"]`);
		const thumb = wrap.find(".sasw_loop_thumb");
		const thumbHtml = thumb.html();
		let blockContext = {};
		const blockParent = addCartBtn.parent();
		if (isBlockBtn) {
			blockContext = blockParent.data("wc-context");
		}

		let price = wrap.find(".price");
		if (!price.length) {
			price = wrap.find(".wc-block-components-product-price");
		}
		price.data("o_price", price.html());

		appEl.off("click");
		appEl.off("found_variation");
		appEl.off("reset_data");

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
				btnSpan.html(SASW_SWATCHES.i18n.add_cart);
				blockParent.attr(
					"wc-context",
					JSON.stringify({
						...blockContext,
						productId: variation.variation_id,
					}),
				);
				btnSpan.get(0).dispatchEvent(
					new CustomEvent("sasw_variation_change", {
						bubbles: true,
						detail: {
							variation_id: variation.variation_id,
							link,
						},
					}),
				);
			} else {
				addCartBtn.html(SASW_SWATCHES.i18n.add_cart);
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
				btnSpan.html(SASW_SWATCHES.i18n.select_options);
				btnSpan.get(0).dispatchEvent(
					new CustomEvent("sasw_variation_change", {
						bubbles: true,
						detail: {
							variation_id: 0,
							link,
						},
					}),
				);
			} else {
				addCartBtn.html(SASW_SWATCHES.i18n.select_options);
			}
			addCartBtn.removeClass("ajax_add_to_cart");

			thumb.html(thumbHtml);
			price.html(price.data("o_price"));
		});

		req({
			url: SASW_SWATCHES.ajax,
			params: {
				endpoint: "get_variants",
				pid,
			},
			method: "get",
		})
			.then((res) => {
				if (res?.success && res?.data?.length) {
					appEl.trigger("sasw_variants", [res?.data]);
				}
			})
			.catch((e) => { });

		const loopSettings = {
			layout: "inline",
			loop: true,
			selection: preSettings?.shop?.selection !== "no" ? true : false,
			showAttrLabel: false,
			align: preSettings?.shop?.align || "center",
			option: preSettings?.shop?.option,
		};

		if (loopSettings?.selection) {
			appEl.on("click", function (e) {
				e.preventDefault();
			});
		}

		console.log("loopSettings", loopSettings);

		const args = {
			pid,
			variants: [],
			useAjax: true,
			onChange: (selected) => {
				console.log("selected", selected);
			},
			settings: loopSettings,
			form: appEl,
		};

		render(<App {...args} />, appEl.get(0));
	});
});

console.log("SASW_SWATCHES", SASW_SWATCHES);
