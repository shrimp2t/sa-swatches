import { set, get } from "lodash";
import { Button, Popover } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

import { useState } from "@wordpress/element";

const OptionSettings = ({ handleOnChange, objKey, values }) => {
	const [isVisible, setIsVisible] = useState(false);
	const keyName = (key) => {
		return `${objKey}.${key}`;
	};

	const getVal = (key, defaultVal = "") => {
		return get(values, `${objKey}.${key}`, defaultVal);
	};

	return (
		<div>
			<Button variant="secondary" onClick={() => setIsVisible(true)}>
				Settings
			</Button>
			{isVisible && (
				<Popover
					placement={`right-start`}
					className="sa_wc_setting_popover"
					offset={15}
					onClose={() => {
						setIsVisible(false);
					}}
				>
					<div class="form-item">
						<label className="form_label">{__("Item Layout", "domain")}</label>
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
					<div class="form-item">
						<label className="form_label">
							{__("Items per row", "domain")}
						</label>
						<div className="form_value">
							<input
								value={getVal("col")}
								type="number"
								placeholder="Auto"
								step={1}
								onChange={(e) => {
									handleOnChange(keyName("col"), e.target.value);
								}}
								size={3}
							/>
						</div>
					</div>

					<div class="form-item">
						<label className="form_label">{__("Size", "domain")}</label>
						<div className="form_value">
							<input
								value={getVal("size")}
								type="number"
								onChange={(e) => {
									handleOnChange(keyName("size"), e.target.value);
								}}
								size={3}
							/>
						</div>
					</div>

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
								{Object.keys(SA_WC_SWATCHES.configs.swatch_style).map((key) => (
									<option value={key} key={key}>
										{SA_WC_SWATCHES.configs.swatch_style[key]}
									</option>
								))}
							</select>
						</div>
					</div>
				</Popover>
			)}
		</div>
	);
};

export default OptionSettings;
