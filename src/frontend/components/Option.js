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
		case "sa_image":
			if (!isDrawerPrev) {
				gloalSettings = { ...(globalSettings?.option?.image || {}) };
			}
			break;
		case "color":
		case "sa_color":
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

	// if (swatch?.type === 'sa_color') {

	let selectedVal =
		typeof selected[attrName] !== "undefined"
			? selected?.[attrName]
			: defaults?.[attrName];

	const classes = ["sa_attr_option"];
	let isActive = true;
	let isClickable = true;
	let isChecked = false;

	classes.push(`sa_opt_layout_${swatch.layout}`);

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
		};
	}

	if (swatchSize > 0 && !isBox) {
		cssSwatchLabel = {
			minHeight: `${swatchSize}px`,
			minWidth: `${swatchSize}px`,
			justifyContent: "center",
		};
	}

	const hasSwatch = ["sa_image", "image", "sa_color", "color"].includes(
		swatch?.type,
	);
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
		classes.push("sa_no_label");
	} else {
		classes.push("sa_has_label");
	}

	let isCircle = false;
	if (hasSwatch || isDrawerPrev) {
		if (style) {
			classes.push("sa_style_" + style);
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
							<span
								className="sa_swatch sa_no sa_swatch_placeholder"
								style={cssSwatch}
							>
								<span className="sa_no_item">{"..."}</span>
							</span>
						</span>
					)}

					{willShowLabel && (
						<span className="sa_opt_label" style={cssSwatchLabel}>
							{option?.custom_name || option?.name}
						</span>
					)}

					{!isCircle && showIcon && isChecked && (
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

export default Option;
