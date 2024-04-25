import {
	Spinner,
	Modal,
} from "@wordpress/components";

import React from "react";
import { render, useState, useMemo, useEffect } from "@wordpress/element";
import "./attr-product.scss";
import req from "../commo/req";
import NewOption from "./components/NewOption";
import SwatchSettings from "./components/SwatchSettings";
import SortableList from "./components/SortableList";
import TableOptions from "./components/TableOptions";


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

		req({
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
		req({
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

	const tableProps = {handleAddItem, selectedList, setSelectedList, taxonomy, type, list};

	return (
		<>
			<SortableList
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
							<NewOption setNewTerm={setNewTerm} handleAddNew={handleAddNew}/>
						) : null}

						{isOpen === "settings" ? (
							<SwatchSettings/>
						) : null}

						{!["add", "settings"].includes(isOpen) ? (
							<TableOptions {...tableProps}/>
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
