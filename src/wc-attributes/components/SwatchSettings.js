import { useState, useEffect } from "@wordpress/element";

const SwatchSettings = ({ onChange, values }) => {
	const handleOnChange = (key, value) => {
		onChange((prev) => {
			return { ...prev, [key]: value, _t: Date.now() };
		});
	};

	console.log("settings", values);

	const types = {
		inline: "Inline",
		box: "Box",
		checkbox: "Checkbox",
	};

	return (
		<div className="settings-form">
			<h3>Settings</h3>

			<div class="form-item">
				<label className="form_label">Swatch type</label>
				<div className="form_value">
					<select
						value={values?.type}
						defaultValue={``}
						onChange={(e) => {
							handleOnChange("type", e.target.value);
						}}
					>
						<option value={``}>Default</option>
						{Object.keys(types).map((key) => {
							return (
								<option value={key} key={key}>
									{types[key]}
								</option>
							);
						})}
					</select>
				</div>
			</div>
			<div class="form-item">
				<label className="form_label">Label</label>
				<div className="form_value">
					<select
						value={values?.label}
						defaultValue={""}
						onChange={(e) => {
							handleOnChange("showLabel", e.target.value);
						}}
					>
						<option value={""}>Default</option>
						<option value={"show"}>Show</option>
						<option value={"hide"}>Hide</option>
					</select>
				</div>
			</div>
			<div class="form-item">
				<label className="form_label">Layout</label>
				<div className="form_value">
					<select
						value={values?.layout}
						defaultValue={`inline`}
						onChange={(e) => {
							handleOnChange("layout", e.target.value);
						}}
					>
						{Object.keys(types).map((key) => {
							return (
								<option value={key} key={key}>
									{types[key]}
								</option>
							);
						})}
					</select>
				</div>
			</div>
			<div class="form-item">
				<label className="form_label">Items per row</label>
				<div className="form_value">
					<input
						value={values?.col}
						type="number"
						onChange={(e) => {
							handleOnChange("col", e.target.value);
						}}
						size={3}
					/>
				</div>
			</div>
			<div class="form-item">
				<label className="form_label">Box size</label>
				<div className="form_value">
					<input
						value={values?.size}
						type="number"
						onChange={(e) => {
							handleOnChange("size", e.target.value);
						}}
						size={3}
					/>
				</div>
			</div>
		</div>
	);
};

export default SwatchSettings;
