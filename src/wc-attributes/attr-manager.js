import { Button } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import React from "react";
import { render, useState, useMemo, useEffect } from "@wordpress/element";
import ColorPicker from "./components/ColorPicker";
import "./attr-style.scss";

const sendReq = ({ url, path, method, data, body, params }) => {
	return new Promise((resolve, reject) => {
		let reqUrl = url ? url : window?.SASW_SWATCHES?.root + path;
		const args = {
			method: method || "get", // *GET, POST, PUT, DELETE, etc.
			cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
			headers: {
				"Content-Type": "application/json",
				"X-WP-Nonce": window?.SASW_SWATCHES?.nonce,
			},
			redirect: "follow", // manual, *follow, error
		};

		if (data) {
			args.body = JSON.stringify(data);
		}
		if (body) {
			args.body = JSON.stringify(body);
		}

		if (params) {
			const sp = new URLSearchParams(params || {});
			const q = sp.toString();
			if (q.length) {
				if (reqUrl?.includes("?")) {
					reqUrl += "&" + q;
				} else {
					reqUrl += "?" + q;
				}
			}
		}

		fetch(reqUrl, args)
			.then((res) => res.json())
			.then((res) => resolve(res))
			.catch((e) => reject(e));
	});
};

const Image2 = ({ value, type, onChange, clear }) => {
	const [image, setImage] = useState(value || {});
	const frame = useMemo(() => {
		// https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/media-upload/README.md
		// https://github.com/xwp/wp-core-media-widgets/blob/905edbccfc2a623b73a93dac803c5335519d7837/wp-admin/js/widgets/media-gallery-widget.js
		const config = {
			title: "Select Image",
			button: {
				text: "Use this image",
			},
			multiple: false, // Set to true to allow multiple files to be selected
		};

		config.library = { type: ["image"] };
		const f = wp.media(config);

		f.on("select", function () {
			// Get media attachment details from the frame state
			var attachment = frame.state().get("selection").first().toJSON();

			const sizes = {};
			if (attachment.sizes?.thumbnail?.url) {
				sizes.thumbnail = attachment.sizes?.thumbnail?.url;
			}
			if (attachment.sizes?.full?.url) {
				sizes.full = attachment.sizes?.full?.url;
			}

			const data = {
				id: attachment.id,
				...sizes,
			};

			setImage(data);
			onChange?.(data);
		});

		return f;
	}, []);

	const handleOpen = () => {
		frame.open();
	};

	useEffect(() => {
		if (clear) {
			jQuery(window).on("taxonomy_term_added", (e, res) => {
				const t = res?.responses?.[1]?.supplemental?.term_id;
				console.log("Tax_added", t, res);
				setImage(null);
				onChange?.(null);
			});
		}
	}, []);

	const handleRemove = () => {
		setImage(false);
		onChange?.(false);
	};

	const src = image?.thumbnail ?? image?.full;

	return (
		<div className="wc_swatch_image_wrap" data-type={type}>
			<div onClick={handleOpen} className="wc_swatch_image">
				{src ? (
					<img src={src} alt="" />
				) : (
					<span className="wc_swatch_image_placeholder">
						<span class="dashicons dashicons-format-image"></span>
					</span>
				)}
			</div>
			{"full" === type ? (
				<div className="act">
					<Button size="small" onClick={handleOpen} variant="secondary">
						{__('Upload',"sa-swatches")}
					</Button>
					<Button
						onClick={handleRemove}
						isDestructive
						size="small"
						variant="secondary"
					>
						{__('Remove',"sa-swatches")}
					</Button>
				</div>
			) : null}
		</div>
	);
};

const App = () => {
	const onChange = (data) => {
		console.log("onChange", data);
		jQuery("input#sasw_attr_swatch").val(JSON.stringify({ ...data, type: SASW_SWATCHES?.current_tax?.type }));
	};
	return (
		<div className="sasw_attr_main">
			{SASW_SWATCHES?.current_tax?.type === "sasw_image" ? (
				<Image2
					value={window.SASW_SWATCHES?.current_term}
					clear={true}
					autoSave={false}
					onChange={onChange}
					type="full"
				/>
			) : null}

			{SASW_SWATCHES?.current_tax?.type === "sasw_color" ? (
				<ColorPicker
					value={window.SASW_SWATCHES?.current_term}
					onChange={onChange}
				/>
			) : null}
		</div>
	);
};

const AppCol = ({ data, term_id }) => {
	const onChange = (changeData) => {
		console.log("onChange__col", changeData);

		let saveData = {
			...SASW_SWATCHES.current_tax,
			...changeData,
			term_id,
		};

		if (saveData?.type === 'sasw_image') {
			saveData.value = changeData?.id;
		}

		sendReq({
			url: SASW_SWATCHES?.ajax,
			method: "post",
			data: saveData,
			params: {
				endpoint: "update_term_swatch",
			},
		})
			.then((res) => {
				console.log("Update_meta", res);
			})
			.catch((e) => console.log(e));
	};
	return (
		<>
			{SASW_SWATCHES?.current_tax?.type === "sasw_image" ? (
				<Image2 value={data} onChange={onChange} />
			) : null}

			{SASW_SWATCHES?.current_tax?.type === "sasw_color" ? (
				<ColorPicker confirm={true} onChange={onChange} value={data} />
			) : null}
		</>
	);
};

const domNode = document.getElementById("sasw_attr_swatch_el");
const appEl = document.createElement("div");
domNode.append(appEl);
render(<App />, appEl);

const renderCol = (el) => {
	const data = el.data("swatch");
	const term_id = el.data("term_id");
	el.addClass("sasw_added");
	render(<AppCol data={data} term_id={term_id} />, el.get(0));
};

jQuery(".sasw_swatch").each(function () {
	const el = jQuery(this);
	renderCol(el);
});

jQuery(window).on("taxonomy_term_added", (e, res) => {
	console.log('New term added');
	jQuery(".sasw_swatch")
		.not(".sasw_added")
		.each(function () {
			const el = jQuery(this);
			renderCol(el);
		});
});
