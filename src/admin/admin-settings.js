import "./admin.scss";
import { __ } from "@wordpress/i18n";
import { set, get } from "lodash";
import React from "react";
import { render, useState, useEffect } from "@wordpress/element";
import OptionSettings from "./OptionSettings";
import { __experimentalUnitControl as UnitControl } from "@wordpress/components";

const Settings = ({ onChange, values }) => {
	const getVal = (key, defaultVal = "") => {
		return get(values, `${key}`, defaultVal);
	};

	const handleOnChange = (key, value) => {
		onChange((prev) => {
			let next = { ...prev };
			set(next, key, value);
			return next;

			// let next = { ...prev, [key]: value, _t: Date.now() };
			// if (["", null, undefined].includes(value)) {
			// 	delete next[key];
			// }
			// return next;
		});
	};

	return (
		<>
			<div className="sa-settings-form">
				<h2>{__("Variations in product page", "sa-wc-swatches")}</h2>
				<div className="group-items">
					<div className="sa_heading">
						<h3>{__("Layout Settings", "sa-wc-swatches")}</h3>
					</div>

					<div class="form-item">
						<label className="form_label">
							{__("Form Layout", "sa-wc-swatches")}
						</label>
						<div className="form_value">
							<select
								value={getVal("single.layout")}
								defaultValue={""}
								onChange={(e) => {
									const v = e.target.value;
									handleOnChange("single.layout", v);
								}}
							>
								{Object.keys(SA_WC_SWATCHES.configs.main_layout).map((k) => (
									<option value={k} key={k}>
										{SA_WC_SWATCHES.configs.main_layout[k]}
									</option>
								))}
							</select>
						</div>
					</div>

					<div class="form-item">
						<label className="form_label">
							{__("Popover size", "sa-wc-swatches")}
						</label>
						<div className="form_value">
							<UnitControl
							placeholder="Auto"
								value={getVal("single.pooverSize")}
								onChange={(v) => {
									handleOnChange("single.pooverSize", v);
								}}
							/>
							
						</div>
					</div>

					<div class="form-item">
						<label className="form_label">
							{__("Attribute description", "sa-wc-swatches")}
						</label>
						<div className="form_value">
							<select
								value={getVal("single.viewAttrDetail")}
								defaultValue={""}
								onChange={(e) => {
									const v = e.target.value;
									handleOnChange("single.viewAttrDetail", v);
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
				</div>

				<div className="group-items">
					<div className="sa_heading">
						<h3>{__("Options Settings", "sa-wc-swatches")}</h3>
					</div>

					<div class="form-item">
						<label className="form_label">
							{__("Swatch image", "sa-wc-swatches")}
						</label>
						<div className="form_value">
							<OptionSettings
								objKey={"single.option.image"}
								values={values}
								handleOnChange={handleOnChange}
							/>
						</div>
					</div>

					<div class="form-item">
						<label className="form_label">
							{__("Swatch color", "sa-wc-swatches")}
						</label>
						<div className="form_value">
							<OptionSettings
								objKey={"single.option.color"}
								values={values}
								handleOnChange={handleOnChange}
							/>
						</div>
					</div>
					<div class="form-item">
						<label className="form_label">
							{__("Swatch default", "sa-wc-swatches")}
						</label>
						<div className="form_value">
							<OptionSettings
								objKey={"single.option.default"}
								values={values}
								handleOnChange={handleOnChange}
							/>
						</div>
					</div>
				</div>
				{["drawer"].includes(getVal("single.layout")) ? (
					<div className="group-items">
						<div className="sa_heading has_desc">
							<h3>{__("Selected Option Settings", "sa-wc-swatches")}</h3>
							<p className="sa_desc">
								{__("Apply for drawer layout only.", "sa-wc-swatches")}
							</p>
						</div>

						<div class="form-item">
							<label className="form_label">
								{__("Swatch image", "sa-wc-swatches")}
							</label>
							<div className="form_value">
								<OptionSettings
									objKey={"drawer.option.image"}
									values={values}
									fields={["layout", "size", "style"]}
									handleOnChange={handleOnChange}
								/>
							</div>
						</div>

						<div class="form-item">
							<label className="form_label">
								{__("Swatch color", "sa-wc-swatches")}
							</label>
							<div className="form_value">
								<OptionSettings
									objKey={"drawer.option.color"}
									values={values}
									fields={["layout", "size", "style"]}
									handleOnChange={handleOnChange}
								/>
							</div>
						</div>
						<div class="form-item">
							<label className="form_label">
								{__("Swatch default", "sa-wc-swatches")}
							</label>
							<div className="form_value">
								<OptionSettings
									objKey={"drawer.option.default"}
									values={values}
									fields={["layout", "size", "style"]}
									handleOnChange={handleOnChange}
								/>
							</div>
						</div>
					</div>
				) : null}
			</div>

			<div className="sa-settings-form">
				<h2>{__("Variations in shop & archive pages", "sa-wc-swatches")}</h2>
				<div className="group-items">
					<div className="sa_heading">
						<h3>{__("Layout Settings", "sa-wc-swatches")}</h3>
					</div>

					<div class="form-item">
						<label className="form_label">
							{__("Enable", "sa-wc-swatches")}
						</label>
						<div className="form_value">
							<select
								value={values?.shop.show || ""}
								defaultValue={"yes"}
								onChange={(e) => {
									const v = e.target.value;
									handleOnChange("shop.show", v);
								}}
							>
								{Object.keys(SA_WC_SWATCHES.configs.yes_no).map((key) => (
									<option value={key} key={key}>
										{SA_WC_SWATCHES.configs.yes_no[key]}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>

				<div className="group-items">
					<div className="sa_heading">
						<h3>{__("Options Settings", "sa-wc-swatches")}</h3>
					</div>

					<div class="form-item">
						<label className="form_label">
							{__("Position", "sa-wc-swatches")}
						</label>
						<div className="form_value">
							<select
								value={values?.shop?.position || ""}
								defaultValue={""}
								onChange={(e) => {
									const v = e.target.value;
									handleOnChange("shop.position", v);
								}}
							>
								{Object.keys(SA_WC_SWATCHES.configs.position).map((key) => (
									<option value={key} key={key}>
										{SA_WC_SWATCHES.configs.position[key]}
									</option>
								))}
							</select>
						</div>
					</div>

					<div class="form-item">
						<label className="form_label">
							{__("Swatches align", "sa-wc-swatches")}
						</label>
						<div className="form_value">
							<select
								value={values?.shop_align || ""}
								defaultValue={""}
								onChange={(e) => {
									const v = e.target.value;
									handleOnChange("shop.align", v);
								}}
							>
								{Object.keys(SA_WC_SWATCHES.configs.align).map((key) => (
									<option value={key} key={key}>
										{SA_WC_SWATCHES.configs.align[key]}
									</option>
								))}
							</select>
						</div>
					</div>

					<div class="form-item">
						<label className="form_label">
							{__("Allow attributes selection", "sa-wc-swatches")}
						</label>
						<div className="form_value">
							<select
								value={values?.shop.selection || ""}
								defaultValue={""}
								onChange={(e) => {
									const v = e.target.value;
									handleOnChange("shop.selection", v);
								}}
							>
								{Object.keys(SA_WC_SWATCHES.configs.yes_no).map((key) => (
									<option value={key} key={key}>
										{SA_WC_SWATCHES.configs.yes_no[key]}
									</option>
								))}
							</select>
						</div>
					</div>

					<div class="form-item">
						<label className="form_label">
							{__("Swatch image", "sa-wc-swatches")}
						</label>
						<div className="form_value">
							<OptionSettings
								objKey={"shop.option.image"}
								values={values}
								handleOnChange={handleOnChange}
							/>
						</div>
					</div>

					<div class="form-item">
						<label className="form_label">
							{__("Swatch color", "sa-wc-swatches")}
						</label>
						<div className="form_value">
							<OptionSettings
								objKey={"shop.option.color"}
								values={values}
								handleOnChange={handleOnChange}
							/>
						</div>
					</div>
					<div class="form-item">
						<label className="form_label">
							{__("Swatch default", "sa-wc-swatches")}
						</label>
						<div className="form_value">
							<OptionSettings
								objKey={"shop.option.default"}
								values={values}
								handleOnChange={handleOnChange}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

const App = ({ input, initValues }) => {
	const [settings, setSettings] = useState(initValues);
	useEffect(() => {
		input.val(JSON.stringify(settings));
	}, [settings]);
	return (
		<>
			<Settings onChange={setSettings} values={settings} />
		</>
	);
};

jQuery("#sa_wc_setting_wrap").each(function () {
	const panel = jQuery(this);
	const input = jQuery("#sa_swatches_settings");
	const form = panel.closest("form");
	form.append(input);
	jQuery(".wc-settings-row-sa_swatches_settings, h2", form).remove();
	let initValues = {};
	try {
		initValues = JSON.parse(input.val());
	} catch (e) {
		initValues = {};
	}
	console.log(".initValues", initValues);
	render(<App input={input} initValues={initValues} />, panel.get(0));
});
