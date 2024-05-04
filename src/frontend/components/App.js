import req from "../../common/req";
import { useState, useEffect } from "@wordpress/element";
import { AppContext } from "./context";
import {
	cleanObj,
	findMatchingVariations,
	findActiveAttrOptions,
} from "../common/variants";
import AttrItem from "./AttrItem";

const App = ({
	pid,
	variants: initVariants,
	settings,
	form,
	table,
	onReady,
}) => {
	const [appId, setAppId] = useState("");
	const [attrs, setAttrs] = useState({});
	const [selected, setSelected] = useState({});
	const [defaults, setDefaults] = useState({});
	const [availableAttrs, setAvailableAttrs] = useState([]);
	const [ajaxLoaded, setAjaxLoaded] = useState(false);
	const [variants, setVariants] = useState(
		initVariants?.length ? initVariants : [],
	);

	useEffect(() => {
		form.on("sa_variants", (evt, data) => {
			setVariants(data);
			setAjaxLoaded(Date.now());
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
			if (res?.success && res?.data) {
				if (settings?.loop || settings?.option?.loop) {
					for (const k in res.data) {
						delete res.data[k].settings;
					}
				}
				setAttrs(res.data);
				onReady?.();
			}
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
		const attrLength = Object.keys(attrs).length;
		const findArgsLength = Object.keys(findArgs).length;

		if (
			attrLength > 0 &&
			findArgsLength > 0 &&
			attrLength === Object.keys(findArgs).length
		) {
			const matchingVariations = findMatchingVariations(variants, findArgs);
			const [variation] = matchingVariations;
			form.trigger("update_variation_values");
			if (variation) {
				form.trigger("found_variation", [variation, findArgs]);
			} else {
				form.trigger("reset_data", [findArgs]);
			}
		} else {
			form.trigger("update_variation_values");
			form.trigger("reset_data", findArgs);
		}
	};

	useEffect(() => {
		let obj = {};
		const { searchParams } = new URL(window.location.href);
		const initSelected = {};
		Object.values(attrs).map((attr) => {
			if (!obj?.__c) {
				obj.__c = attr.name;
			}
			if (attr?.default?.length) {
				obj[attr.name] = attr?.default;
			}

			const urlAttrVal = searchParams.get(attr.name);
			if (urlAttrVal?.length) {
				initSelected[attr.name] = urlAttrVal;
			}
		});

		setDefaults(obj);
		setSelected({ ...obj, ...initSelected });
		handleCheckVariants(attrs, selected, variants);
	}, [attrs, ajaxLoaded]);

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

export default App;
