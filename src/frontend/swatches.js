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
import "react-modern-drawer/dist/index.css";

const Option = ({ option, attrName, clickable = true }) => {
	const { setSelected, defaults, selected, availableAttrs } = useAppContext();
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

	if (isActive) {
		classes.push("sa_active");
	} else {
		classes.push("sa_inactive");
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

	const divProps = {
		className: classes.join(" "),
	};

	if (clickable && isClickable) {
		divProps.onClick = () => {
			if (isClickable) {
				onCLick(option?.slug);
			}
		};
	}

	return (
		<div {...divProps}>
			{swatch?.type === "sa_color" ? (
				<span className="sa_swatch sa_color">
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
			) : null}

			{swatch?.type === "sa_image" ? (
				<span className="sa_swatch sa_image">
					<span className="sa_image_item">
						<img alt="" src={swatch?.thumbnail || swatch?.full} />
					</span>
				</span>
			) : null}

			{option?.name}
			{isChecked && (
				<div className="sa_icon">
					<IconCheck />
				</div>
			)}
		</div>
	);
};

const AttrOptions = ({ attr }) => {
	return (
		<div className="sa_attr_options">
			{attr?.options.map((option) => {
				return (
					<Option
						key={[attr.id, option.id]}
						attrName={attr.name}
						attrId={attr.id}
						option={option}
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
				{settings.layout === "modal" ? (
					<>
						<div onClick={() => setIsOpen(true)}>
							<Option option={option} attrName={attr.name} clickable={false} />
						</div>
						<Drawer
							open={isOpen}
							onClose={() => setIsOpen(false)}
							direction="right"
							className="sa_attr_modal_values"
							zIndex={99999}
							size={450}
							lockBackgroundScroll={true}
						>
							<div className="sa_modal_inner">
								<AttrOptions attr={attr} />
							</div>
						</Drawer>
					</>
				) : (
					<AttrOptions attr={attr} />
				)}
			</div>
		</div>
	);
};

const App = ({ pid, variants, settings }) => {
	const [attrs, setAttrs] = useState({});
	const [selected, setSelected] = useState({});
	const [defaults, setDefaults] = useState({});
	const [availableAttrs, setAvailableAttrs] = useState([]);
	const [matches, setMatches] = useState([]);

	// Get Attrs settings.
	useEffect(() => {
		req({
			url: SA_WC_SWATCHES.ajax,
			params: {
				endpoint: "get_product_attrs",
				pid,
			},
		}).then((res) => {
			console.log("Data", res);
			if (res?.success && res?.data) {
				setAttrs(res.data);
			}
			console.log("Data", Object.keys(res).join(" | "));
		});
	}, [pid]);

	useEffect(() => {
		let obj = {};
		Object.values(attrs).map((attr) => {
			if (!obj?.__c) {
				obj.__c = attr.name;
			}
			obj[attr.name] = attr?.default;
		});
		setDefaults(obj);

		const activeAttrOptions = {};

		Object.values(attrs).map((attr) => {
			const args = {};
			delete args[attr.name];
			const found = findMatchingVariations(variants, args);
			const activeOpts = findActiveAttrOptions(found, attr.name);
			activeAttrOptions[attr.name] = activeOpts;
		});

		if (!selected?.__t) {
			setSelected(obj);
		}
		setAvailableAttrs(activeAttrOptions);
	}, [attrs]);

	useEffect(() => {
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
	}, [selected]);

	const contentValues = {
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

console.log("___load");
jQuery(($) => {
	$(".variations_form").each(function () {
		const form = $(this);
		const pid = form.data("product_id");
		const table = form.find(".variations");
		console.log(form.data("product_id"));
		const appEl = $("<div/>");
		appEl.insertAfter(table);
		const settings = {
			layout: "modal", // inline | separate | modal
			show_attr_desc: true, // Show attribute description.
			show_attr_label: true,
		};

		const onChange = (selected) => {
			Object.keys(selected).map((name) => {
				const v = selected[name] || false;
				// form.find([`[name="${name}"]`]).val(v).trigger('change');
			});
		};

		const variants = form.data("product_variations");
		console.log("variants", variants);
		const useAjax = false === variants;
		const args = {
			pid,
			variants,
			useAjax,
			onChange,
			settings,
		};

		render(<App {...args} />, appEl.get(0));
	});
});
