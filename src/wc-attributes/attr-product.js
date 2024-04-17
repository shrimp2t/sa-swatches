import {
	Button,
	ColorPalette,
	ColorPicker,
	Popover,
	Modal,
} from "@wordpress/components";

import React from "react";
import { render, useState, useMemo, useEffect } from "@wordpress/element";
import { ReactSortable } from "react-sortablejs";
import "./attr-product.scss";

const sendReq = ({ url, path, method, data, body, params }) => {
	return new Promise((resolve, reject) => {
		let reqUrl = url ? url : window?.SA_WC_BLOCKS?.root + path;
		const args = {
			method: method || "get", // *GET, POST, PUT, DELETE, etc.
			cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
			headers: {
				"Content-Type": "application/json",
				"X-WP-Nonce": window?.SA_WC_BLOCKS?.nonce,
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

const Image2 = ({ term, type, onChange, clear }) => {
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


	const handleRemove = () => {
		setImage(false);
		onChange?.(false);
	};

	const src = term?.swatch?.thumbnail || term?.swatch?.full

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

const ColorSwatch = ({ color, onChange, confirm }) => {
	const [value, setValue] = useState(color);
	const [isVisible, setIsVisible] = useState(false);

	const handleOnChange = (color) => {
		setValue(color);
		if (!confirm) {
			onChange?.(color);
		}
	};
	const handleOnClear = () => {
		setValue("");
		if (confirm) {
			onChange?.("");
		}
	};

	const handleOnOk = () => {
		if (confirm) {
			onChange?.(value);
			setIsVisible(false);
		}
	};

	return (
		<>
			<div className="wc_swatch_color">
				<div
					style={{ background: value, pointer: "cursor" }}
					onClick={() => {
						setIsVisible(!isVisible);
					}}
				></div>
				{isVisible && (
					<Popover
						className="wc_swatch_color_picker"
						onClickOutside={() => {
							setIsVisible(false);
						}}
						onClose={() => {
							setIsVisible(false);
						}}
					>
						<ColorPicker color={value} onChange={handleOnChange} />
						{confirm && (
							<div className="act">
								<Button
									isDestructive
									onClick={handleOnClear}
									size="small"
									variant="secondary"
								>
									Clear
								</Button>
								<Button
									onClick={() => setValue(color)}
									size="small"
									variant="secondary"
								>
									Reset
								</Button>
								<Button size="small" onClick={handleOnOk} variant="primary">
									Save
								</Button>
							</div>
						)}
					</Popover>
				)}
			</div>
		</>
	);
};

const LisTermItem = ({ term, onClick, selectedList, showClose = false, onClose, showChecked = false, showMove = false }) => {

	const classes = ['term-item'];
	let isSelected = false;
	if (selectedList?.length) {
		if (selectedList.filter(i => i.id === term.id).length) {
			classes.push('selected');
			isSelected = true;
		}
	}

	return (
		<div className={classes.join(' ')} onClick={() => onClick?.(term)} key={term.id}>

			{term?.swatch?.type === "sa_image" ? (
				<span className="img">
					<img
						src={term?.swatch?.thumbnail || term?.swatch?.full || ""}
						alt=""
					/>
				</span>
			) : null}
			{term?.swatch?.type === "sa_color" ? (
				<span
					className="color"
					style={{ background: `${term?.swatch?.value}` }}
				></span>
			) : null}
			<span className="name">{term.name}</span>

			{/* {showssMove ? (<span className="move ic" ><span className="dashicons dashicons-move"></span></span>) : null} */}
			{showClose ? (<span className="close ic" onClick={() => onClose?.(term)}><span className="dashicons dashicons-no-alt"></span></span>) : null}
			{showChecked ? (<span className={isSelected ? 'close ic' : 'add ic'}><span className={isSelected ? 'dashicons dashicons-no-alt' : 'dashicons dashicons-plus'}></span></span>) : null}
		</div>
	);
}



const SortabListTerms = ({ list, onSorted, onClick, selectedList, showClose = false, onClose, showChecked = false }) => {

	return (
		<ReactSortable list={list} setList={onSorted} className="sa-list-term"
		// handle=".move"

		>
			{list.map((term) => {
				return <LisTermItem term={term} showMove={true} onClose={onClose} onClick={onClick} showClose={showClose} selectedList={selectedList} showChecked={showChecked} />
			})}
		</ReactSortable >
	);
};



const ColSwatch = ({ term, tax, type }) => {
	// console.log("Load_data", data);
	const onChange = (changeData) => {
		// console.log("onChange__col", changeData);

		let saveData = {
			tax,
			type,
			term_id: term.id,
		};
		if (type === "sa_image") {
			saveData.value = changeData.id;
		}
		if (type === "sa_color") {
			saveData.value = changeData;
		}

		// console.log("saveData", saveData);

		sendReq({
			url: SA_WC_BLOCKS?.ajax,
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
			{type === "sa_image" ? (
				<Image2 term={term} onChange={onChange} />
			) : null}

			{type === "sa_color" ? (
				<ColorSwatch confirm={true} onChange={onChange} color={term?.swatch?.value} />
			) : null}
		</>
	);
};


const App = ({ title, taxonomy, selected, onChange }) => {
	const [isOpen, setOpen] = useState(false);
	const [isChanged, setIsChanged] = useState(false);
	const [list, setList] = useState([]);
	const [selectedList, setSelectdList] = useState([]);
	const [type, setType] = useState(false);

	useEffect(() => {
		sendReq({
			url: SA_WC_BLOCKS?.ajax,
			method: "post",
			params: {
				endpoint: "get_terms",
			},
			data: {
				taxonomy,
				selected: Array.isArray(selected) ? selected.join(",") : [selected],
			},
		})
			.then((res) => {
				console.log("get_tax_term", taxonomy, res);
				if (res?.data) {
					setList(res?.data);
				}
				if (res?.selected) {
					setSelectdList(res?.selected);
				}
				if (res?.selected) {
					setType(res?.type);
				}
			})
			.catch((e) => console.log(e));
	}, []);

	useEffect(() => {
		if (isChanged) {
			onChange(selectedList)
		}
	}, [selectedList]);

	const handleAddItem = (item) => {
		setIsChanged(true);
		setSelectdList(prev => {
			if (prev.filter(i => i.id === item.id).length) {
				return prev.filter(i => i.id !== item.id);
			}
			const next = [...prev, item];
			return next;
		});
	}

	const handleOnRemove = (item) => {
		setIsChanged(true);
		setSelectdList(prev => {
			const next = prev.filter(i => i.id !== item?.id);
			return next;
		});
	}

	const onSorted = (list) => {
		setIsChanged(true);
		setSelectdList(list);

	}

	return (
		<>
			<SortabListTerms onSorted={onSorted} list={selectedList} showClose={true} onClose={handleOnRemove} taxonomy={taxonomy} />
			<button type="button" className="button" onClick={() => setOpen(true)}>
				Open Modal
			</button>
			{isOpen && (
				<Modal
					title={title}
					size="large"
					className="sa_swatch_modal"
					onRequestClose={() => setOpen(false)}
					headerActions={

						<>
							<input type="search" placeholder="Search" />
							<button className="button">Add new</button>
						</>
					}
				>

					<table className="sa_swatch_table wp-list-table widefat striped fixed table-view-list">
						<thead>
							<tr>
								<th style={{ width: '40px' }}></th>
								<th>Name</th>
								<th className="actions"></th>
							</tr>
						</thead>
						<tbody>
							{list.map((term) => {

								const classes = ['term-item'];
								let isSelected = false;
								if (selectedList?.length) {
									if (selectedList.filter(i => i.id === term.id).length) {
										classes.push('selected');
										isSelected = true;
									}
								}

								return <tr key={term.id}>
									<td>

										<ColSwatch term={term} tax={taxonomy} type={type} />

									</td>
									<td>{term.name}</td>
									<td className="actions">
										<span onClick={() => handleAddItem(term)} className={isSelected ? ' close ic' : ' add ic'}><span className={isSelected ? 'dashicons dashicons-no-alt' : 'dashicons dashicons-plus'}></span>{isSelected ? 'Remove' : 'Add'}</span>
									</td>
								</tr>
							})}
						</tbody>
					</table>
				</Modal>
			)}
		</>
	);
};


const init = () => {
	jQuery(".sa_attr_swatches").each(function () {
		const el = jQuery(this);
		if (el.hasClass('sa_added')) {
			return;
		}
		const div = jQuery("<span/>");
		div.insertAfter(el);
		const title = el.data("title");
		const selected = el.data("selected");
		const taxonomy = el.data("taxonomy");
		console.log("selected", selected, taxonomy);
		el.addClass('sa_added sa_hide');
		const onChange = (ids) => {
			console.log('Change_callled');
			const opts = ids.map(i => {
				return `<option selected="selected" value="${i.id}">${i.name}</option>`
			});

			el.html(opts.join(' ')).trigger('change');
		}
		render(
			<App title={title} taxonomy={taxonomy} onChange={onChange} selected={selected} />,
			div.get(0),
		);
	});
}
init();

jQuery(document.body).on('woocommerce_added_attribute', function () {
	init();
});
jQuery(document.body).on('woocommerce_attributes_saved', function () {
	init();
});
