import { set, get } from "lodash";
import { Button, Popover } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

import { useState, useRef } from "@wordpress/element";

const OptionSettings = ({
	handleOnChange,
	objKey,
	values,
	fields = undefined,
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const ref = useRef(false);
	const keyName = (key) => {
		return `${objKey}.${key}`;
	};

	const getVal = (key, defaultVal = "") => {
		return get(values, `${objKey}.${key}`, defaultVal);
	};

	const showAll = !fields || !fields?.length;


	return (
		<div>
			<Button ref={ref} variant="secondary" onClick={() => setIsVisible(!isVisible)}>
				{__("Settings","sa-swatches")}
			</Button>
			{isVisible && (
				<Popover
					placement={`right-start`}
					className="sasw_setting_popover"
					offset={15}
					noArrow={false}
					anchor={ref?.current}
					onClose={() => {
						setIsVisible(false);
					}}
				>
					{showAll || fields.includes("layout") ? (
						<div class="form-item">
							<label className="form_label">
								{__("Item Layout","sa-swatches")}
							</label>
							<div className="form_value">
								<select
									value={getVal("layout")}
									defaultValue={`inline`}
									onChange={(e) => {
										handleOnChange(keyName(`layout`), e.target.value);
									}}
								>
									{Object.keys(SASW_SWATCHES.configs.option_layout).map(
										(key) => (
											<option value={key} key={key}>
												{SASW_SWATCHES.configs.option_layout[key]}
											</option>
										),
									)}
								</select>
							</div>
						</div>
					) : null}

					{showAll || fields.includes("label") ? (
						<div class="form-item">
							<label className="form_label">{__("Label","sa-swatches")}</label>
							<div className="form_value">
								<select
									value={getVal("label")}
									defaultValue={""}
									onChange={(e) => {
										const v = e.target.value;
										handleOnChange(keyName("label"), v);
									}}
								>
									{Object.keys(SASW_SWATCHES.configs.show_hide).map((k) => (
										<option value={k} key={k}>
											{SASW_SWATCHES.configs.show_hide[k]}
										</option>
									))}
								</select>
							</div>
						</div>
					) : null}
					{showAll || fields.includes("col") ? (
						<div class="form-item">
							<label className="form_label">
								{__("Items per row","sa-swatches")}
							</label>
							<div className="form_value">
								<input
									value={getVal("col")}
									type="search"
									placeholder={__("Auto","sa-swatches")}
									step={1}
									onChange={(e) => {
										handleOnChange(keyName("col"), e.target.value);
									}}
									size={3}
								/>
							</div>
						</div>
					) : null}

					{(showAll || fields.includes("size")) ? (
						<div class="form-item">
							<label className="form_label">{__("Size","sa-swatches")}</label>
							<div className="form_value">
								<input
									value={getVal("size")}
									type="number"
									placeholder={__("Auto","sa-swatches")}
									onChange={(e) => {
										handleOnChange(keyName("size"), e.target.value);
									}}
									size={3}
								/>
							</div>
						</div>
					) : null}

					{showAll || fields.includes("style") ? (
						<div class="form-item">
							<label className="form_label">{__("Style","sa-swatches")}</label>
							<div className="form_value">
								<select
									value={getVal("style")}
									defaultValue={""}
									onChange={(e) => {
										const v = e.target.value;
										handleOnChange(keyName("style"), v);
									}}
								>
									{Object.keys(SASW_SWATCHES.configs.swatch_style).map(
										(key) => (
											<option value={key} key={key}>
												{SASW_SWATCHES.configs.swatch_style[key]}
											</option>
										),
									)}
								</select>
							</div>
						</div>
					) : null}
				</Popover>
			)}
		</div>
	);
};

export default OptionSettings;
