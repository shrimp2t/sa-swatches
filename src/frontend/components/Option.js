import { useAppContext } from "./context";
import IconCheck from "./IconCheck";
import { Tooltip } from "react-tooltip";
import { cleanObj } from "../common/variants";

const Option = ({
	option,
	attrName,
	clickable = true,
	settings = {},
	checkActive = true,
	showIcon = true,
	noSelect = false,
	isDrawerPrev = false,
}) => {
	const {
		setSelected,
		defaults,
		selected,
		availableAttrs,
		appId,
		settings: globalSettings,
	} = useAppContext();
	const { selection = true, loop = false } = globalSettings;

	// console.log('settings', settings);
	const optionSettings = {
		...cleanObj(option?.swatch || {}),
		...cleanObj(option?.custom_swatch || {}),
	};

	let gloalSettings = {};
	switch (optionSettings.type) {
		case "image":
		case "sasw_image":
			if (!isDrawerPrev) {
				gloalSettings = { ...(globalSettings?.option?.image || {}) };
			}
			break;
		case "color":
		case "sasw_color":
			if (!isDrawerPrev) {
				gloalSettings = { ...(settings?.color || {}) };
			}
			break;
		default:
			if (!isDrawerPrev) {
				gloalSettings = { ...(settings?.default || {}) };
			}
	}

	const swatch = {
		...cleanObj(settings),
		...cleanObj(optionSettings || {}),
	};

	// if (swatch?.type === 'sasw_color') {

	let selectedVal =
		typeof selected[attrName] !== "undefined"
			? selected?.[attrName]
			: defaults?.[attrName];

	const classes = ["sasw_attr_option"];
	let isActive = true;
	let isClickable = true;
	let isChecked = false;

	classes.push(`sasw_opt_layout_${swatch.layout}`);

	if (availableAttrs?.[attrName]) {
		if (
			availableAttrs?.[attrName]?.includes(option?.slug) ||
			availableAttrs?.[attrName]?.includes("")
		) {
			isActive = true;
		} else {
			isActive = false;
			isClickable = false;
		}
	} else {
		isActive = false;
		isClickable = false;
	}

	if (checkActive) {
		if (isActive) {
			classes.push("sasw_active");
		} else {
			classes.push("sasw_inactive");
		}
	}

	if (!selectedVal) {
		classes.push("sasw_not_select");
	}

	if (selectedVal && selectedVal === option?.slug) {
		classes.push("sasw_selected");
		isClickable = true;
		isChecked = true;
	}

	if (!selection) {
		isClickable = false;
	}

	classes.push("type_" + (swatch?.type || "mixed"));

	const isBox = ["box"].includes(swatch?.layout);
	let css = {};
	let cssSwatch = {};
	let cssSwatchLabel = {};
	if (isDrawerPrev) {
		delete swatch.col;
	}
	const { label: showLabel = "yes", col = 0, size = 0, style = false } = swatch;

	const swatchSize = Number(size);

	if (col > 0) {
		css = {
			flexBasis: `${100 / col}%`,
			width: `${100 / col}%`,
		};
	}


	if (swatchSize > 0) {
		cssSwatch = {
			width: `${swatchSize}px`,
			height: `${swatchSize}px`,
			minHeight: `${swatchSize}px`,
		};
	}

	if (swatchSize > 0 && !isBox) {
		cssSwatchLabel = {
			minHeight: `${swatchSize}px`,
			minWidth: `${swatchSize}px`,
			justifyContent: "center",
		};
	}

	const hasSwatch = ["sasw_image", "image", "sasw_color", "color"].includes(
		swatch?.type,
	);

	if (selectedVal && ["sasw_image", "image"].includes(
		swatch?.type,
	)) {
		delete cssSwatch.height;
	}

	let willShowLabel = !["hide", "no", false].includes(showLabel);
	if (isDrawerPrev) {
		willShowLabel = false;
	}

	if (!willShowLabel && !hasSwatch) {
		willShowLabel = true;
	}

	if (!checkActive && !selectedVal && willShowLabel) {
		willShowLabel = false;
	}

	if (!willShowLabel) {
		classes.push("sasw_no_label");
	} else {
		classes.push("sasw_has_label");
	}

	let isCircle = false;
	if (hasSwatch || isDrawerPrev) {
		if (style) {
			classes.push("sasw_style_" + style);
			isCircle = style === "circle";
		}
	}

	const tooltipId = `${appId}-${attrName}-${option.slug}-${checkActive}`;
	const divProps = {
		className: classes.join(" "),
		"data-tooltip-id": tooltipId,
	};

	const onCLick = (value) => {
		if (!selection) {
			return;
		}
		setSelected((prev) => {
			if (prev?.[attrName] === value) {
				return { ...prev, [attrName]: null, __t: Date.now(), __c: attrName };
			}
			return { ...prev, [attrName]: value, __t: Date.now(), __c: attrName };
		});
	};

	if (clickable && isClickable) {
		divProps.onClick = () => {
			if (isClickable) {
				onCLick(option?.slug);
			}
		};
	}

	return (
		<>
			<div className="sasw_opt_wrap" style={css}>
				<div {...divProps}>
					{checkActive && ["checkbox"].includes(settings?.layout) && (
						<span className="sasw_checkbox_wrap">
							<span className="sasw_checkbox"></span>
						</span>
					)}
					{swatch?.type === "sasw_color" ? (
						<span className="sasw_swatch_wrap">
							<span className="sasw_swatch sasw_color" style={cssSwatch}>
								<div className="sasw_color_inner">
									<span
										className="sasw_color_item"
										style={{ background: `${swatch?.value}` }}
									></span>

									{swatch?.more?.length ? (
										<>
											{swatch?.more.map((c) => (
												<span
													key={c}
													className="sasw_color_item"
													style={{ background: `${c}` }}
												></span>
											))}
										</>
									) : null}
								</div>
							</span>
						</span>
					) : null}

					{swatch?.type === "sasw_image" ? (
						<span className="sasw_swatch_wrap">
							<span className="sasw_swatch sasw_image" style={cssSwatch}>
								<span className="sasw_image_item">
									<img alt="" src={swatch?.thumbnail || swatch?.full} />
								</span>
							</span>
						</span>
					) : null}

					{noSelect && !selectedVal && (
						<span className="sasw_swatch_wrap">
							<span
								className="sasw_swatch sasw_no sasw_swatch_placeholder"
								style={cssSwatch}
							>
								<span className="sasw_no_item">{"..."}</span>
							</span>
						</span>
					)}

					{willShowLabel && (
						<span className="sasw_opt_label" style={cssSwatchLabel}>
							{option?.custom_name || option?.name}
						</span>
					)}

					{!isCircle && showIcon && isChecked && (
						<div className="sasw_icon">
							<IconCheck />
						</div>
					)}
				</div>
			</div>

			<Tooltip className="sasw_tooltip" style={{ zIndex: 999999 }} id={tooltipId}>
				{option?.custom_name || option?.name}
			</Tooltip>
		</>
	);
};

export default Option;
