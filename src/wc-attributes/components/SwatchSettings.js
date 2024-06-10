import { __ } from "@wordpress/i18n";
const SwatchSettings = ({ onChange, values }) => {
	const handleOnChange = (key, value) => {
		onChange((prev) => {
			const next = { ...prev, [key]: value, _t: Date.now() };
			if (["", null, undefined].includes(value)) {
				delete next[key];
			}
			return next;
		});
	};

	const handleReset = (e) => {
		e.preventDefault();
		const c = confirm(__("Reset all settings?","sa-swatches"));
		if (c) {
			onChange((prev) => {
				return { _t: Date.now() };
			});
		}
	};

	console.log("values", values);

	return (
		<>
			<div className="settings-form">
				<div className="sasw_heading">
					<h3>{__("Options Settings","sa-swatches")}</h3>
				</div>

				<div class="form-item">
					<label className="form_label">{__("Label","sa-swatches")}</label>
					<div className="form_value">
						<select
							value={values?.label || ""}
							defaultValue={""}
							onChange={(e) => {
								const v = e.target.value;
								handleOnChange("label", v);
							}}
						>
							{Object.keys(SASW_SWATCHES.configs.yes_no).map((k) => (
								<option value={k} key={k}>
									{SASW_SWATCHES.configs.yes_no[k]}
								</option>
							))}
						</select>
					</div>
				</div>
				<div class="form-item">
					<label className="form_label">{__("Item layout","sa-swatches")}</label>
					<div className="form_value">
						<select
							value={values?.layout || ""}
							defaultValue={`inline`}
							onChange={(e) => {
								handleOnChange("layout", e.target.value);
							}}
						>
							{Object.keys(SASW_SWATCHES.configs.option_layout).map((k) => (
								<option value={k} key={k}>
									{SASW_SWATCHES.configs.option_layout[k]}
								</option>
							))}
						</select>
					</div>
				</div>
				<div class="form-item">
					<label className="form_label">{__("Items per row","sa-swatches")}</label>
					<div className="form_value">
						<input
							value={values?.col || ""}
							type="search"
							placeholder="Auto"
							step={1}
							onChange={(e) => {
								handleOnChange("col", e.target.value);
							}}
							size={3}
						/>
					</div>
				</div>

				<div class="form-item">
					<label className="form_label">{__("Swatch size","sa-swatches")}</label>
					<div className="form_value">
						<input
							value={values?.size || ""}
							type="search"
							placeholder={__("Default","sa-swatches")}
							onChange={(e) => {
								handleOnChange("size", e.target.value);
							}}
							size={3}
						/>
					</div>
				</div>


				<div class="form-item">
					<label className="form_label">{__("Style","sa-swatches")}</label>
					<div className="form_value">
						<select
							value={values?.style}
							defaultValue={""}
							onChange={(e) => {
								const v = e.target.value;
								handleOnChange('style', v);
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

				<div className="sasw_heading has_desc">
					<h3>{__("Selected Option Settings","sa-swatches")}</h3>
					<p className="sasw_desc">
						{__("Apply for drawer layout only.","sa-swatches")}
					</p>
				</div>
				<div class="form-item">
					<label className="form_label">{__("Label","sa-swatches")}</label>
					<div className="form_value">
						<select
							value={values?.drawer_label || ""}
							defaultValue={""}
							onChange={(e) => {
								const v = e.target.value;
								handleOnChange("drawer_label", v);
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

				<div class="form-item">
					<label className="form_label">{__("Item layout","sa-swatches")}</label>
					<div className="form_value">
						<select
							value={values?.drawer_layout || ""}
							defaultValue={`inline`}
							onChange={(e) => {
								handleOnChange("drawer_layout", e.target.value);
							}}
						>
							{Object.keys(SASW_SWATCHES.configs.option_layout).map((k) => (
								<option value={k} key={k}>
									{SASW_SWATCHES.configs.option_layout[k]}
								</option>
							))}
						</select>
					</div>
				</div>

				<div class="form-item">
					<label className="form_label">{__("Swatch size","sa-swatches")}</label>
					<div className="form_value">
						<input
							value={values?.drawer_size || ""}
							type="number"
							placeholder={__("Default","sa-swatches")}
							onChange={(e) => {
								handleOnChange("drawer_size", e.target.value);
							}}
							size={3}
						/>
					</div>
				</div>

				<div class="form-item">
					<label className="form_label">{__("Style","sa-swatches")}</label>
					<div className="form_value">
						<select
							value={values?.drawer_style}
							defaultValue={""}
							onChange={(e) => {
								const v = e.target.value;
								handleOnChange('drawer_style', v);
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

			</div>

			<div className="form-action" style={{ paddingTop: "20px" }}>
				<button type="button" onClick={handleReset} className="button">
					{__("Reset","sa-swatches")}
				</button>
			</div>
		</>
	);
};

export default SwatchSettings;
