import "./swatches.scss";

import req from "../common/req";
import { render, useState, useEffect } from "@wordpress/element";
import { AppContext, useAppContext } from "./components/context";
import IconCheck from "./components/IconCheck";
import {
	cleanObj,
	findMatchingVariations,
	findActiveAttrOptions,
} from "./common/variants";
import Drawer from "react-modern-drawer";
import { Tooltip } from "react-tooltip";
import "react-modern-drawer/dist/index.css";
import "react-tooltip/dist/react-tooltip.css";

const Option = ({
	option,
	attrName,
	clickable = true,
	settings = {},
	checkActive = true,
	showIcon = true,
	noSelect = false,
}) => {
	const { setSelected, defaults, selected, availableAttrs, appId } =
		useAppContext();
	const onCLick = (value) => {
		setSelected((prev) => {
			if (prev?.[attrName] === value) {
				return { ...prev, [attrName]: null, __t: Date.now(), __c: attrName };
			}
			return { ...prev, [attrName]: value, __t: Date.now(), __c: attrName };
		});
	};

	let selectedVal =
		typeof selected[attrName] !== "undefined"
			? selected?.[attrName]
			: defaults?.[attrName];

	const classes = ["sa_attr_option"];
	let isActive = true;
	let isClickable = true;
	let isChecked = false;

	classes.push(`sa_opt_layout_${settings.layout}`);

	if (availableAttrs?.[attrName]) {
		if (
			availableAttrs?.[attrName]?.includes(option?.slug) ||
			availableAttrs?.[attrName]?.includes("")
		) {
			isActive = true;
		} else {
			// if (selected?.__c !== attrName) {
			isActive = false;
			isClickable = false;
			// }
		}
	} else {
		isActive = false;
		isClickable = false;
	}

	if (checkActive) {
		if (isActive) {
			classes.push("sa_active");
		} else {
			classes.push("sa_inactive");
		}
	}

	if (!selectedVal) {
		classes.push("sa_not_select");
	}

	if (selectedVal === option?.slug) {
		classes.push("sa_selected");
		isClickable = true;
		isChecked = true;
	}

	const swatch = {
		...(option?.swatch || {}),
		...(option?.custom_swatch || {}),
	};

	classes.push("type_" + (swatch?.type || "mixed"));

	const isBox = ["box"].includes(settings?.layout);
	let css = {};
	let cssSwatch = {};
	let cssSwatchLabel = {};
	const { label: showLabel = "yes", col = 0, size = 0 } = settings;

	if (col > 0) {
		css = {
			flexBasis: `${100 / col}%`,
			width: `${100 / col}%`,
		};
	}

	if (size > 0 && !isBox) {
		cssSwatch = {
			width: `${size}px`,
			height: `${size}px`,
		};
		cssSwatchLabel = {
			minHeight: `${size}px`,
			minWidth: `${size}px`,
		};
	}

	const hasSwatch = ["sa_image", "sa_color"].includes(swatch?.type);

	let willShowLabel = !["hide", "no"].includes(showLabel);
	if (!showLabel && !hasSwatch) {
		willShowLabel = true;
	}

	if (!checkActive && !selectedVal && willShowLabel) {
		willShowLabel = false;
	}

	if (!willShowLabel) {
		classes.push("sa_no_label");
	}

	const tooltipId = `${appId}-${attrName}-${option.slug}-${checkActive}`;
	const divProps = {
		className: classes.join(" "),
		"data-tooltip-id": tooltipId,
	};

	if (clickable && isClickable) {
		divProps.onClick = () => {
			if (isClickable) {
				onCLick(option?.slug);
			}
		};
	}

	// if (!checkActive) {
	// 	console.log("settings", attrName, showLabel, willShowLabel, settings);
	// }

	return (
		<>
			<div className="sa_opt_wrap" style={css}>
				<div {...divProps}>
					{checkActive && ["checkbox"].includes(settings?.layout) && (
						<span className="sa_checkbox_wrap">
							<span className="sa_checkbox"></span>
						</span>
					)}
					{swatch?.type === "sa_color" ? (
						<span className="sa_swatch_wrap">
							<span className="sa_swatch sa_color" style={cssSwatch}>
								<div className="sa_color_inner">
									<span
										className="sa_color_item"
										style={{ background: `${swatch?.value}` }}
									></span>

									{swatch?.more?.length ? (
										<>
											{swatch?.more.map((c) => (
												<span
													key={c}
													className="sa_color_item"
													style={{ background: `${c}` }}
												></span>
											))}
										</>
									) : null}
								</div>
							</span>
						</span>
					) : null}

					{swatch?.type === "sa_image" ? (
						<span className="sa_swatch_wrap">
							<span className="sa_swatch sa_image" style={cssSwatch}>
								<span className="sa_image_item">
									<img alt="" src={swatch?.thumbnail || swatch?.full} />
								</span>
							</span>
						</span>
					) : null}

					{noSelect && !selectedVal && (
						<span className="sa_swatch_wrap">
							<span className="sa_swatch sa_no" style={cssSwatch}>
								<span className="sa_no_item">{"..."}</span>
							</span>
						</span>
					)}

					{willShowLabel && (
						<span className="sa_opt_label" style={cssSwatchLabel}>
							{option?.custom_name || option?.name}
						</span>
					)}

					{showIcon && isChecked && (
						<div className="sa_icon">
							<IconCheck />
						</div>
					)}
				</div>
			</div>

			<Tooltip className="sa_tooltip" style={{ zIndex: 999999 }} id={tooltipId}>
				{option?.custom_name || option?.name}
			</Tooltip>
		</>
	);
};

const AttrOptions = ({ attr, settings }) => {
	const classes = ["sa_attr_options"];
	classes.push("sa_opts_l_" + settings?.layout);
	if (settings?.col > 0) {
		classes.push("sa_opts_col");
	}
	return (
		<div className={classes.join(" ")}>
			{attr?.options.map((option) => {
				return (
					<Option
						key={[attr.id, option.id]}
						attrName={attr.name}
						attrId={attr.id}
						option={option}
						settings={settings}
					/>
				);
			})}
		</div>
	);
};

const AttrItem = ({ attr }) => {
	const { attrs, selected, settings } = useAppContext();
	const [isOpen, setIsOpen] = useState(false);

	let selectedLabel = "";
	const selectedVal = selected?.[attr?.name] || false;
	let option = false;

	if (selectedVal) {
		const { options = [] } = attrs?.[attr.id] || {};
		for (let i = 0; i < options.length; i++) {
			if (selectedVal === options[i].slug) {
				option = options[i];
				selectedLabel = options[i].name;
				break;
			}
		}
	}

	let showColon = ["separate"].includes(settings.layout);
	let showValue = ["separate"].includes(settings.layout);

	return (
		<div
			className={[
				"sa_attr",
				attr.name,
				"atype-" + (attr?.type || "mixed"),
			].join(" ")}
		>
			<div className="sa_attr_label">
				<span className="sa_label_title">
					{attr?.label}
					{showColon ? <span className="colon">:</span> : ""}
				</span>

				{showValue && <span className="sa_label_val">{selectedLabel}</span>}
			</div>
			<div className="sa_attr_values">
				{settings.layout === "drawer" ? (
					<>
						<div onClick={() => setIsOpen(true)}>
							<Option
								option={option}
								attrName={attr.name}
								clickable={false}
								checkActive={false}
								showIcon={false}
								noSelect={true}
								settings={{
									...(settings?.option || {}),
									...(attr?.drawer || {}),
								}}
							/>
						</div>
						<Drawer
							open={isOpen}
							onClose={() => setIsOpen(false)}
							direction="right"
							className="sa_drawer sa_attr_drawer_values"
							zIndex={999900}
							size={450}
							lockBackgroundScroll={true}
						>
							<div className="sa_drawer_wrap">
								<div className="sa_drawer_head">
									<div className="sa_drawer_head_inner">
										<div className="sa_drawer_title">Select {attr?.label}</div>
										<div className="sa_drawer_actions">
											<button>Close</button>
										</div>
									</div>
								</div>
								<div className="sa_drawer_body">
									<AttrOptions
										attr={attr}
										settings={{
											...(settings?.drawer?.option || {}),
											...(attr?.settings || {}),
										}}
									/>
								</div>
								<div className="sa_drawer_footer">
									<div className="sa_drawer_footer_inner">
										<div className="sa_drawer_title">Select {attr?.label}</div>
										<div className="sa_drawer_actions">
											<button>Close</button>
										</div>
									</div>
								</div>
							</div>
						</Drawer>
					</>
				) : (
					<AttrOptions
						attr={attr}
						settings={{
							...(settings?.option || {}),
							...(attr?.settings || {}),
						}}
					/>
				)}
			</div>
		</div>
	);
};

const App = ({ pid, variants, settings, form }) => {
	const [appId, setAppId] = useState("");
	const [attrs, setAttrs] = useState({});
	const [selected, setSelected] = useState({});
	const [defaults, setDefaults] = useState({});
	const [availableAttrs, setAvailableAttrs] = useState([]);

	useEffect(() => {
		form.on("sa_variants", (evt, data) => {
			variants = data;
		});
	}, []);

	// Get Attrs settings.
	useEffect(() => {
		setAppId(`_${pid}_${Date.now()}`);
		req({
			url: SA_WC_SWATCHES.ajax,
			params: {
				endpoint: "get_product_attrs",
				pid,
			},
		}).then((res) => {
			// console.log("Data", res);
			if (res?.success && res?.data) {
				setAttrs(res.data);
			}
			// console.log("Data", Object.keys(res).join(" | "));
		});
	}, [pid]);

	const handleCheckVariants = (attrs, selected, variants) => {
		const findArgs = cleanObj({ ...selected, __t: null, __c: null });
		const activeAttrOptions = {};
		Object.values(attrs).map((attr) => {
			const args = { ...findArgs };
			delete args[attr.name];
			const found = findMatchingVariations(variants, args);
			const activeOpts = findActiveAttrOptions(found, attr.name);
			activeAttrOptions[attr.name] = activeOpts;
		});

		setAvailableAttrs(activeAttrOptions);

		if (Object.keys(attrs).length === Object.keys(findArgs).length) {
			const matchingVariations = findMatchingVariations(variants, findArgs);
			const [variation] = matchingVariations;
			form.trigger("update_variation_values");
			if (variation) {
				form.trigger("found_variation", [variation]);
			} else {
				form.trigger("reset_data");
			}
		} else {
			form.trigger("update_variation_values");
			form.trigger("reset_data");
		}
	};

	useEffect(() => {
		let obj = {};
		Object.values(attrs).map((attr) => {
			if (!obj?.__c) {
				obj.__c = attr.name;
			}
			obj[attr.name] = attr?.default;
		});
		setDefaults(obj);
		if (!selected?.__t) {
			setSelected(obj);
		}

		handleCheckVariants(attrs, selected, variants);
	}, [attrs]);

	useEffect(() => {
		handleCheckVariants(attrs, selected, variants);

		Object.keys(selected).map((name) => {
			const v = selected[name] || false;
			form.find(`[name="${name}"]`).val(v);
		});
	}, [selected]);

	const contentValues = {
		appId,
		selected,
		setSelected,
		defaults,
		attrs,
		availableAttrs,
		settings,
	};

	const classes = ["sa_attr_product"];
	classes.push("sa_layout_" + settings.layout);

	return (
		<AppContext.Provider value={contentValues}>
			<div className={classes.join(" ")}>
				{Object.values(attrs).map((attr) => (
					<AttrItem key={attr.id} attr={attr} />
				))}
			</div>
		</AppContext.Provider>
	);
};

jQuery(($) => {
	const singleSettings = cleanObj(SA_WC_SWATCHES.single, true);
	const loopSettings = cleanObj(SA_WC_SWATCHES.single, true);

	const option = {
		layout: singleSettings?.option_layout, // box || inline | checkbox
		col: parseInt(singleSettings?.option_col), // Number: apply for layout [box] only.
		size: singleSettings?.option_size, // not apply for [box] layout.
		label: singleSettings?.option_label, //  yes | no | <>empty
	};

	const drawerOption = {
		layout: singleSettings?.option_drawer_layout, // box || inline | checkbox
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
			show_attr_desc: true, // Show attribute description.
			show_attr_label: false,
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
				.catch((e) => {});
		}

		const args = {
			pid,
			variants,
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
			onChange: () => {},
			settings: {},
			form: appEl,
		};

		render(<App {...args} />, appEl.get(0));
	});
});
