import { set, get } from "lodash";
import { Button, Popover } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

import { useState } from "@wordpress/element";

const OptionSettings = ({
	handleOnChange,
	objKey,
	values,
	fields = undefined,
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const keyName = (key) => {
		return `${objKey}.${key}`;
	};

	const getVal = (key, defaultVal = "") => {
		return get(values, `${objKey}.${key}`, defaultVal);
	};

	const showAll = !fields || !fields?.length;

	return (
		<div>
			<Button variant="secondary" onClick={() => setIsVisible(!isVisible)}>
				{__("Settings", "domain")}
			</Button>
			{isVisible && (
				<Popover
					placement={`right-start`}
					className="sa_wc_setting_popover"
					offset={15}
					noArrow={false}
					onClose={() => {
						setIsVisible(false);
					}}
				>
					{showAll || fields.includes("layout") ? (
						<div class="form-item">
							<label className="form_label">
								{__("Item Layout", "domain")}
							</label>
							<div className="form_value">
								<select
									value={getVal("layout")}
									defaultValue={`inline`}
									onChange={(e) => {
										handleOnChange(keyName(`layout`), e.target.value);
									}}
								>
									{Object.keys(SA_WC_SWATCHES.configs.option_layout).map(
										(key) => (
											<option value={key} key={key}>
												{SA_WC_SWATCHES.configs.option_layout[key]}
											</option>
										),
									)}
								</select>
							</div>
						</div>
					) : null}

					{showAll || fields.includes("label") ? (
						<div class="form-item">
							<label className="form_label">Label</label>
							<div className="form_value">
								<select
									value={getVal("label")}
									defaultValue={""}
									onChange={(e) => {
										const v = e.target.value;
										handleOnChange(keyName("label"), v);
									}}
								>
									{Object.keys(SA_WC_SWATCHES.configs.show_hide).map((k) => (
										<option value={k} key={k}>
											{SA_WC_SWATCHES.configs.show_hide[k]}
										</option>
									))}
								</select>
							</div>
						</div>
					) : null}
					{showAll || fields.includes("col") ? (
						<div class="form-item">
							<label className="form_label">
								{__("Items per row", "domain")}
							</label>
							<div className="form_value">
								<input
									value={getVal("col")}
									type="number"
									placeholder={__("Auto", "domain")}
									step={1}
									onChange={(e) => {
										handleOnChange(keyName("col"), e.target.value);
									}}
									size={3}
								/>
							</div>
						</div>
					) : null}
					{showAll || fields.includes("size") ? (
						<div class="form-item">
							<label className="form_label">{__("Size", "domain")}</label>
							<div className="form_value">
								<input
									value={getVal("size")}
									type="number"
									placeholder={__("Auto", "domain")}
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
							<label className="form_label">{__("Style", "domain")}</label>
							<div className="form_value">
								<select
									value={getVal("style")}
									defaultValue={""}
									onChange={(e) => {
										const v = e.target.value;
										handleOnChange(keyName("style"), v);
									}}
								>
									{Object.keys(SA_WC_SWATCHES.configs.swatch_style).map(
										(key) => (
											<option value={key} key={key}>
												{SA_WC_SWATCHES.configs.swatch_style[key]}
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
