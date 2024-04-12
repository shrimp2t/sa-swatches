import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";
import React from "react";
import { render, useState, useMemo, useEffect } from "@wordpress/element";
import "./attr-manager.scss";

const postData = ({ url, path, method, data }) => {
	return new Promise((resolve, reject) => {
		let reqUrl = url ? url : window.SA_WC_BLOCKS.root + path;
		const args = {
			method: method || "get", // *GET, POST, PUT, DELETE, etc.
			cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
			headers: {
				"Content-Type": "application/json",
				"X-WP-Nonce": window.SA_WC_BLOCKS.nonce,
			},
			redirect: "follow", // manual, *follow, error
		};

		if (data) {
			args.data = JSON.stringify(data);
		}

		fetch(reqUrl, args)
			.then((res) => res.json())
			.then((res) => resolve(res))
			.catch((e) => reject(e));
	});
};

const Image2 = ({ id, type, onChange, clear }) => {
	const [image, setImage] = useState(null);

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

	useEffect(() => {
		if (id)
			postData({
				path: `wp/v2/media/${id}?_fields=id,media_details`,
			})
				.then((res) => {
					if (res?.id) {
						const sizes = {};
						if (res?.media_details.sizes?.thumbnail?.source_url) {
							sizes.thumbnail = res?.media_details.sizes?.thumbnail?.source_url;
						}
						if (res?.media_details.sizes?.thumbnail?.url) {
							sizes.thumbnail = res?.media_details.sizes?.thumbnail?.url;
						}
						if (res?.media_details.sizes?.full?.source_url) {
							sizes.full = res?.media_details.sizes?.full?.source_url;
						}
						if (res?.media_details.sizes?.full?.url) {
							sizes.full = res?.media_details.sizes?.full?.url;
						}

						const data = {
							id: res?.id,
							...sizes,
						};

						setImage(data);
					} else {
						setImage(false);
					}
				})
				.catch((e) => console.log(e));
	}, [id]);
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
						Upload
					</Button>
					<Button
						onClick={handleRemove}
						isDestructive
						size="small"
						variant="secondary"
					>
						Remove
					</Button>
				</div>
			) : null}
		</div>
	);
};

const App = () => {
	const onChange = (data) => {
		console.log("onChange", data);
		jQuery("input#sa_wc_attr_swatch").val(data?.id);
	};
	return (
		<Image2
			id={window.SA_WC_BLOCKS?.current_term?.value}
			clear={true}
			autoSave={false}
			onChange={onChange}
			type="full"
		/>
	);
};

const AppCol = ({ data }) => {
	return (
		<>
			<Image2 id={data?.value} />
		</>
	);
};

const domNode = document.getElementById("sa_wc_attr_swatch_el");
const appEl = document.createElement("div");
domNode.append(appEl);
render(<App />, appEl);

const renderCol = (el) => {
	const data = el.data("swatch");
	console.log(data);
	el.addClass("sa_added");
	render(<AppCol data={data} />, el.get(0));
};

jQuery(".sa_wc_swatch").each(function () {
	const el = jQuery(this);
	renderCol(el);
});

jQuery(window).on("taxonomy_term_added", (e, res) => {
	jQuery(".sa_wc_swatch")
		.not(".sa_added")
		.each(function () {
			const el = jQuery(this);
			renderCol(el);
		});
});
