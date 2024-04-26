import "./swatches.scss";

import req from "../commo/req";
import { render, useState, useEffect } from "@wordpress/element";
import { AppContext, useAppContext } from "./components/context";
import IconCheck from "./components/IconCheck";

const Option = ({ option, attrName }) => {
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
			classes.push("sa_active");
			isActive = true;
		} else {
			// if (selected?.__c !== attrName) {
			classes.push("sa_inactive");
			isActive = false;
			isClickable = false;
			// }
		}
	} else {
		classes.push("sa_inactive");
		isActive = false;
		isClickable = false;
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

	classes.push("type_" + swatch?.type);

	return (
		<div
			className={classes.join(" ")}
			onClick={() => {
				if (isClickable) {
					onCLick(option?.slug);
				}
			}}
		>
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
	return (
		<div className={["sa_attr", attr.name].join(" ")}>
			<div className="sa_attr_label">{attr?.label}</div>
			<div className="sa_attr_values">
				<AttrOptions attr={attr} />
			</div>
		</div>
	);
};

// Ajax Search find_matching_product_variation

const isMatch = function (variation_attributes, attributes) {
	var match = true;
	for (var attr_name in variation_attributes) {
		if (variation_attributes.hasOwnProperty(attr_name)) {
			var val1 = variation_attributes[attr_name];
			var val2 = attributes[attr_name];

			if (
				val1 !== undefined &&
				val2 !== undefined &&
				val1.length !== 0 &&
				val2.length !== 0 &&
				val1 !== val2
			) {
				match = false;
			}
		}
	}
	return match;
};

function cleanObj(obj) {
	for (var propName in obj) {
		if (obj[propName] === null || obj[propName] === undefined) {
			delete obj[propName];
		}
	}
	return obj;
}

const findMatchingVariations = (variations, attributes) => {
	if (!Object.keys(attributes).length) {
		return variations;
	}
	const matching = [];
	for (let i = 0; i < variations.length; i++) {
		const variation = variations[i];
		if (isMatch(variation.attributes, attributes)) {
			matching.push(variation);
		}
	}
	return matching;
};

const findActiveAttrOptions = (variations, currentAttrName) => {
	const activeAttrOptions = [];

	for (const num in variations) {
		if (typeof variations[num] !== "undefined") {
			const variationAttributes = variations[num].attributes;

			for (const attrName in variationAttributes) {
				if (attrName !== currentAttrName) {
					continue;
				}

				if (typeof activeAttrOptions[attrName] === "undefined") {
					activeAttrOptions[attrName] = [];
				}

				if (variationAttributes.hasOwnProperty(attrName)) {
					let attrVal = variationAttributes[attrName];
					if (variations[num].variation_is_active) {
						if (!activeAttrOptions.includes(attrVal)) {
							activeAttrOptions.push(attrVal);
						}
					}
				}
			}
		}
	}

	return activeAttrOptions;
};

const App = ({ pid, variants }) => {
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
		availableAttrs,
	};

	return (
		<AppContext.Provider value={contentValues}>
			{Object.values(attrs).map((attr) => (
				<AttrItem key={attr.id} attr={attr} />
			))}
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
			layout: "separate", // inline | separate
			show_attr_desc: true, // Show attribute description.
		};
		const layout = "sa_layout_inline"; // sa_layout_separate
		appEl.addClass("sa_attr_product");
		appEl.addClass("sa_layout_" + settings.layout);
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
		};

		render(<App {...args} />, appEl.get(0));
	});
});
