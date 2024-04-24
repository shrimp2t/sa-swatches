import {
	Button,
	Spinner,
	ColorPicker,
	Popover,
	Modal,
	Tooltip,
} from "@wordpress/components";

import React from "react";
import { render, useState, useMemo, useEffect } from "@wordpress/element";
import { ReactSortable } from "react-sortablejs";
import "./attr-product.scss";

const sendReq = ({ url, path, method, data, body, params, signal }) => {
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

		if (signal) {
			args.signal = signal;
		}

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

const Image = ({ swatch, type, onChange, clear }) => {
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

	const handleRemove = () => {
		setImage(false);
		onChange?.(false);
	};

	const src =
		image?.thumbnail || image?.full || swatch?.thumbnail || swatch?.full;

	return (
		<div className="wc_swatch_image_wrap" data-type={type}>
			<div onClick={handleOpen} className="wc_swatch_image sa_border">
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
			<div className="wc_swatch_color sa_border">
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

const ListSelectedTermItem = ({
	term,
	onClick,
	selectedList,
	onClose,
	setSelectedList,
}) => {
	const classes = ["term-item"];
	const [isOpen, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [customSwatch, setCustomSwatch] = useState(null);
	const [customName, setCustomName] = useState(null);
	let isSelected = false;
	if (selectedList?.length) {
		if (selectedList.filter((i) => i.id === term.id).length) {
			classes.push("selected");
			isSelected = true;
		}
	}
	useEffect(() => {
		setCustomSwatch(term?.custom_swatch);
		setCustomName(term?.custom_name);
	}, []);

	const handleSaveCustom = () => {
		const value =
			term?.swatch?.type === "sa_image"
				? customSwatch?.id
				: customSwatch?.value;
		setSelectedList?.((prev) => {
			const next = prev.map((el) => {
				if (el.id === term.id) {
					return {
						...el,
						custom_swatch: {
							type: el?.swatch?.type,
							value,
						},
						custom_name: customName,
					};
				}
				return el;
			});
			return next;
		});
		setOpen(false);
	};

	const handleClearCustom = () => {
		setSelectedList?.((prev) => {
			const next = prev.map((el) => {
				if (el.id === term.id) {
					delete el.custom_swatch;
					delete el.custom_name;
				}
				return el;
			});
			return next;
		});

		setCustomName("");
		setCustomSwatch(null);
	};

	return (
		<>
			<div
				className={classes.join(" ")}
				onClick={() => onClick?.(term)}
				key={term.id}
			>
				{term?.swatch?.type === "sa_image" ? (
					<span className="img sa_border">
						<img
							src={
								customSwatch?.thumbnail ||
								customSwatch?.full ||
								term?.swatch?.thumbnail ||
								term?.swatch?.full ||
								""
							}
							alt=""
						/>
					</span>
				) : null}
				{term?.swatch?.type === "sa_color" ? (
					<span
						className="color sa_border"
						style={{
							background: `${customSwatch?.value || term?.swatch?.value}`,
						}}
					></span>
				) : null}

				<span className="name">{customName || term.name}</span>
				<div className="actions">
					<span className="move ic">
						<span class="dashicons dashicons-move"></span>
					</span>
					<span onClick={() => setOpen(true)} className="edit ic">
						<span class="dashicons dashicons-edit-page"></span>
					</span>
					<span className="close ic" onClick={() => onClose?.(term)}>
						<span className="dashicons dashicons-no-alt"></span>
					</span>
				</div>
			</div>

			{isOpen && (
				<Modal
					title={`Swatch settings`}
					size="medium"
					className="sa_swatch_modal"
					style={{ width: 600 }}
					onRequestClose={() => setOpen(false)}
				>
					<div className="sa_modal_inner">
						{loading ? (
							<div className="loading">
								<Spinner
									style={{
										height: 30,
										width: 30,
									}}
								/>
							</div>
						) : null}

						<div className="box">
							<h3>This product settings</h3>
							<div className="term-item swatch_box">
								{term?.swatch?.type === "sa_image" ? (
									<Image
										swatch={customSwatch}
										onChange={(changeData) => {
											setCustomSwatch((prev) => {
												const next = { ...prev, ...changeData };
												return next;
											});
										}}
									/>
								) : null}
								{term?.swatch?.type === "sa_color" ? (
									<ColorSwatch
										confirm={false}
										onChange={(changeData) => {
											setCustomSwatch((prev) => {
												const next = { ...prev, value: changeData };
												return next;
											});
										}}
										color={customSwatch?.value}
									/>
								) : null}
								<input
									type="text"
									style={{ flexBasis: "60%" }}
									value={customName}
									onChange={(e) => setCustomName(e.target.value)}
									placeholder="Custom name"
								/>
								<button
									type="button"
									onClick={handleSaveCustom}
									className="button"
								>
									Save
								</button>
								<button
									type="button"
									onClick={() => handleClearCustom()}
									className="button"
								>
									Reset
								</button>
							</div>
						</div>

						<div className="sa_box">
							<h3>Global settings</h3>
							<div className="term-item swatch_box">
								{term?.swatch?.type === "sa_image" ? (
									<span className="img sa_border">
										<img
											src={term?.swatch?.thumbnail || term?.swatch?.full || ""}
											alt=""
										/>
									</span>
								) : null}
								{term?.swatch?.type === "sa_color" ? (
									<span
										className="color sa_border"
										style={{ background: `${term?.swatch?.value}` }}
									></span>
								) : null}
								<span>{term?.name}</span>
							</div>
						</div>
					</div>
				</Modal>
			)}
		</>
	);
};

const SortableListTerms = ({
	list,
	onSorted,
	onClick,
	selectedList,
	setSelectedList,
	onClose,
}) => {
	return (
		<ReactSortable
			list={list}
			setList={onSorted}
			className="sa-list-term"
			handle=".move"
		>
			{list.map((term) => {
				return (
					<ListSelectedTermItem
						term={term}
						showMove={true}
						onClose={onClose}
						onClick={onClick}
						selectedList={selectedList}
						setSelectedList={setSelectedList}
					/>
				);
			})}
		</ReactSortable>
	);
};

const ColSwatch = ({ term, tax, type, setSelectedList }) => {
	const onChange = (changeData) => {
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

		saveData.pid = SA_WC_BLOCKS?.pid;

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
				if (res?.data) {
					setSelectedList?.((prev) => {
						const next = prev.map((el) => {
							if (el.id === res?.data?.id) {
								return res?.data;
							}
							return el;
						});

						return next;
					});
				}
			})
			.catch((e) => console.log(e));
	};
	return (
		<>
			{type === "sa_image" ? (
				<td style={{ width: "40px" }}>
					<Image swatch={term?.swatch} onChange={onChange} />
				</td>
			) : null}
			{type === "sa_color" ? (
				<td style={{ width: "40px" }}>
					<ColorSwatch
						confirm={true}
						onChange={onChange}
						color={term?.swatch?.value}
					/>
				</td>
			) : null}
		</>
	);
};

const App = ({
	title,
	taxonomy,
	selected,
	onChange,
	onLoad,
	initList,
	isCustom,
	titleInput,
}) => {
	const [loading, setLoading] = useState(false);
	const [isOpen, setOpen] = useState(false);
	const [isChanged, setIsChanged] = useState(false);
	const [loadSelected, setLoadSelected] = useState(false);
	const [list, setList] = useState([]);
	const [selectedList, setSelectedList] = useState([]);
	const [type, setType] = useState(false);
	const [search, setSearch] = useState("");
	const [newTerm, setNewTerm] = useState("");
	const [modalTitle, setModalTitle] = useState(title);

	useEffect(() => {
		// if (isCustom) {
		// 	// setLoadSelected(true);
		// 	setList(initList);
		// 	// setSelectedList(initList);
		// }

		const controller = new AbortController();
		const signal = controller.signal;
		setLoading(true);
		const body = {
			taxonomy,
		};
		if (!search?.length && selected?.length) {
			if (!loadSelected) {
				body.selected = Array.isArray(selected) ? selected : [selected];
			}
		} else {
			body.search = search;
		}

		body.pid = SA_WC_BLOCKS?.pid;
		body.is_custom = isCustom ? 1 : null;
		if (isCustom) {
			body.taxonomy = modalTitle;
		}

		sendReq({
			url: SA_WC_BLOCKS?.ajax,
			method: "post",
			signal,
			params: {
				endpoint: "get_terms",
			},
			data: body,
		})
			.then((res) => {
				console.log("get_tax_term", taxonomy, res);
				if (res?.data) {
					setList(res?.data);
				}

				if (!loadSelected) {
					if (res?.selected) {
						setLoadSelected(true);
						console.log("Load_selected", res?.selected);
						setSelectedList(res?.selected);
					}

					if (isCustom && !res?.data?.length) {
						setList(res?.selected || []);
					}

					onLoad?.(res?.selected || []);
				}
				if (res?.selected) {
					setType(res?.type);
				}
			})
			.catch((e) => console.log(e))
			.finally(() => {
				setLoading(false);
			});
		return () => {
			controller.abort();
		};
	}, [search]);

	useEffect(() => {
		if (isChanged) {
			onChange(selectedList);
		}
	}, [selectedList]);

	useEffect(() => {
		if (isCustom) {
			const title = titleInput.val();
			setModalTitle(title);

			titleInput.on("change", function () {
				const title = titleInput.val();
				setModalTitle(title);
			});
		}
	}, []);

	const handleAddItem = (item) => {
		setIsChanged(true);
		setSelectedList((prev) => {
			if (prev.filter((i) => i.id === item.id).length) {
				return prev.filter((i) => i.id !== item.id);
			}
			const next = [...prev, item];
			return next;
		});
	};

	const handleOnRemove = (item) => {
		setIsChanged(true);
		setSelectedList((prev) => {
			const next = prev.filter((i) => i.id !== item?.id);
			return next;
		});
	};

	const onSorted = (list) => {
		setIsChanged(true);
		setSelectedList(list);
	};

	const handleAddNew = () => {
		if (!newTerm?.length) {
			return;
		}

		if (isCustom) {
			let t = newTerm?.trim?.();
			if (t?.length) {
				const newItem = {
					id: t,
					name: t,
				};

				setList([newItem, ...list]);
				setSelectedList([...selectedList, newItem]);
				setNewTerm("");
				setOpen(false);
				setLoading(false);
				return;
			}
		}

		setLoading(true);
		sendReq({
			url: SA_WC_BLOCKS?.ajax,
			method: "post",
			params: {
				endpoint: "add_term",
			},
			data: {
				taxonomy,
				name: newTerm,
				pid: SA_WC_BLOCKS?.pid,
			},
		})
			.then((res) => {
				if (res?.data) {
					setList([res.data, ...list]);
					setNewTerm("");
					setOpen(true);
				}
				console.log("added_new_term", taxonomy, res);
			})
			.catch((e) => console.log(e))
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<>
			<SortableListTerms
				onSorted={onSorted}
				list={selectedList}
				setSelectedList={setSelectedList}
				showClose={true}
				onClose={handleOnRemove}
				taxonomy={taxonomy}
			/>
			<div className="sa_space">
				<button type="button" className="button" onClick={() => setOpen(true)}>
					Select Options
				</button>
				<button type="button" className="button" onClick={() => setOpen(true)}>
					Settings
				</button>
			</div>
			{isOpen && (
				<Modal
					title={modalTitle}
					size="medium"
					className="sa_swatch_modal"
					style={{ width: 550 }}
					onRequestClose={() => setOpen(false)}
					headerActions={
						<div className="sa_space">
							{!["add", "settings"].includes(isOpen) ? (
								<>
									<input
										type="search"
										onChange={(e) => setSearch(e.target.value)}
										value={search || ""}
										placeholder="Search"
									/>
									<button onClick={() => setOpen("add")} className="button">
										Add New
									</button>
									<button
										onClick={() => setOpen("settings")}
										className="button"
									>
										<span class="dashicons dashicons-admin-generic"></span>
									</button>
								</>
							) : (
								<button onClick={() => setOpen(true)} className="button">
									Cancel
								</button>
							)}
						</div>
					}
				>
					<div className="sa_modal_inner" style={{ minHeight: "50vh" }}>
						{loading ? (
							<div className="loading">
								<Spinner
									style={{
										height: 30,
										width: 30,
									}}
								/>
							</div>
						) : null}

						{isOpen === "add" ? (
							<div>
								<h3>Add new option</h3>
								<div className="add-form">
									<input
										type="text"
										onChange={(e) => setNewTerm(e.target.value)}
										value={newTerm || ""}
										placeholder="New option name"
									/>
									<button
										className="button button-primary"
										onClick={() => handleAddNew()}
									>
										Save
									</button>
								</div>
							</div>
						) : null}

						{isOpen === "settings" ? (
							<div className="settings-form">
								<h3>Settings</h3>
								<div class="form-item">
									<label>Swatch type</label>
									<select>
										<option value={``}>Default</option>
										{Object.keys(SA_WC_BLOCKS.att_types).map((key) => {
											return <option value={key} key={key}>{SA_WC_BLOCKS.att_types[key]}</option>;
										})}
									</select>
								</div>


								<div>
									<button
										className="button button-primary"
										onClick={() => handleAddNew()}
									>
										Save
									</button>
								</div>
							</div>
						) : null}

						{!["add", "settings"].includes(isOpen) ? (
							<table className="sa_swatch_table wp-list-table widefat striped fixed table-view-list">
								<tbody>
									{list.map((term) => {
										const classes = ["term-item"];
										let isSelected = false;
										if (selectedList?.length) {
											if (selectedList.filter((i) => i.id === term.id).length) {
												classes.push("selected");
												isSelected = true;
											}
										}

										return (
											<tr key={term.id}>
												<ColSwatch
													setSelectedList={setSelectedList}
													term={term}
													tax={taxonomy}
													type={type}
												/>

												<td>{term.name}</td>
												<td className="actions">
													<span
														onClick={() => handleAddItem(term)}
														className={isSelected ? " close ic" : " add ic"}
													>
														<span
															className={
																isSelected
																	? "dashicons dashicons-no-alt"
																	: "dashicons dashicons-plus"
															}
														></span>
														{isSelected ? "Remove" : "Select"}
													</span>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						) : null}
					</div>
				</Modal>
			)}
		</>
	);
};

const init = () => {
	jQuery("select.attribute_values, textarea[name^='attribute_values[']").each(
		function () {
			const el = jQuery(this);

			if (el.hasClass("sa_added")) {
				return;
			}

			const parent = el.closest("table");
			const tag = el.prop("tagName");
			const isCustomAttr = tag === "TEXTAREA";

			const div = jQuery("<span/>");
			div.insertAfter(el);
			let title =
				el.data("title") || parent.find(".attribute_name strong").text();
			const titleInput = parent.find("input.attribute_name");
			if (isCustomAttr) {
				title = titleInput.val();
			}

			const getCustomValues = () => {
				const values = el
					.val()
					.toString()
					.split("|")
					.map((i) => {
						return i.trim();
					})
					.filter((i) => i?.length);
				return values;
			};

			let selected = !isCustomAttr
				? el.data("selected") || undefined
				: getCustomValues();
			const taxonomy = el.data("taxonomy");
			const customInput = parent.find("input.sa_overwrite_swatches");
			if (!selected && !isCustomAttr) {
				selected = el.val();
				jQuery(
					".select_all_attributes, .select_no_attributes, .add_new_attribute",
					parent,
				).remove();

				el.removeClass("wc-taxonomy-term-search");
				// if (jQuery.fn?.select2) {
				// 	try {
				// 		el.select2("destroy");
				// 	} catch (e) {}
				// }
			}
			console.log("selected", selected, taxonomy);
			el.addClass("sa_added sa_hide");

			const handleChange = (list) => {
				let custom = {};
				try {
					custom = JSON.parse(customInput.val());
				} catch (e) {
					custom = {};
				}
				const opts = list.map((i) => {
					const strId = `${i.id}`;
					if (i?.custom_swatch || i?.custom_name) {
						if (typeof custom[strId] === "undefined" || !custom[strId]) {
							custom[strId] = {};
						}
						custom[strId]["swatch"] = i?.custom_swatch || false;
						custom[strId]["name"] = i?.custom_name || false;
					} else {
						custom[strId] = false;
					}
					if (!isCustomAttr) {
						return `<option selected="selected" value="${i.id}">${i.name}</option>`;
					} else {
						return i.id;
					}
				});

				customInput.val(JSON.stringify(custom));
				if (isCustomAttr) {
					el.html(opts.join("|"));
				} else {
					el.html(opts.join(" "));
				}
			};

			const onChange = (list) => {
				handleChange(list);
				el.trigger("change");
			};

			const onLoad = (list) => {
				handleChange(list);
			};

			render(
				<App
					title={title}
					taxonomy={taxonomy}
					onChange={onChange}
					onLoad={onLoad}
					selected={selected}
					isCustom={isCustomAttr}
					initList={isCustomAttr ? selected : undefined}
					titleInput={titleInput}
				/>,
				div.get(0),
			);
		},
	);
};
init();

jQuery(document.body).on("woocommerce_added_attribute", function () {
	init();
});
jQuery(document.body).on("woocommerce_attributes_saved", function () {
	init();
});
