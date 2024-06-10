import { Spinner, Modal } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

import React from "react";
import { useState, useEffect } from "@wordpress/element";
import { ReactSortable } from "react-sortablejs";
import ImagePicker from "./ImagePicker";
import ColorPicker from "./ColorPicker";

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

	useEffect(() => {
		handleSaveCustom();
	}, [customSwatch, customName]);

	const handleSaveCustom = () => {
		setSelectedList?.((prev) => {
			const next = prev.map((el) => {
				if (el.id === term.id) {
					return {
						...el,
						custom_swatch: customSwatch,
						custom_name: customName,
					};
				}
				return el;
			});
			return next;
		});
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

	const lastSwatch = { ...(term?.swatch || {}), ...(customSwatch || {}) };

	return (
		<>
			<div
				className={classes.join(" ")}
				onClick={() => onClick?.(term)}
				key={term.id}
			>
				{lastSwatch?.type === "sasw_image" ? (
					<span className="img sasw_border">
						<img src={lastSwatch?.thumbnail || lastSwatch?.full || ""} alt="" />
					</span>
				) : null}
				{lastSwatch?.type === "sasw_color" ? (
					<span className="sasw_group_colors sasw_swatch">
						<span className="sasw_color_inner">
							<span
								className="sasw_color_item"
								style={{
									background: `${lastSwatch?.value}`,
								}}
							></span>
							{lastSwatch?.more?.length &&
								lastSwatch?.more.map((mc) => (
									<span
										className="sasw_color_item"
										style={{
											background: `${mc}`,
										}}
									></span>
								))}
						</span>
					</span>
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
					className="sasw_swatch_modal"
					style={{ width: 600 }}
					onRequestClose={() => setOpen(false)}
				>
					<div className="sasw_drawer_inner">
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

						<div className="box ">
							<h3>{__("This product settings","sa-swatches")}</h3>
							<div className="term-item__swatch_box settings-form">
								<div class="form-item">
									<label className="form_label">
										{__("Swatch type","sa-swatches")}
									</label>
									<div className="form_value">
										<select
											value={customSwatch?.type || ""}
											defaultValue={``}
											onChange={(e) => {
												let t = e.target.value;
												if (!t?.length) {
													t = term?.swatch?.type;
												}
												setCustomSwatch((prev) => {
													const next = { ...prev, type: t };
													return next;
												});
											}}
										>
											<option value={``}>{__("Default","sa-swatches")}</option>
											{Object.keys(SASW_SWATCHES.att_types).map((key) => {
												return (
													<option value={key} key={key}>
														{SASW_SWATCHES.att_types[key]}
													</option>
												);
											})}
										</select>
									</div>
								</div>
								<div class="form-item">
									<label className="form_label">{__("Swatch","sa-swatches")}</label>
									<div className="form_value">
										{lastSwatch?.type === "sasw_image" ? (
											<ImagePicker
												swatch={customSwatch}
												onChange={(changeData) => {
													setCustomSwatch((prev) => {
														const next = { ...prev, ...changeData };
														return next;
													});
												}}
											/>
										) : null}
										{lastSwatch?.type === "sasw_color" ? (
											<ColorPicker
												confirm={false}
												onChange={(changeData) => {
													setCustomSwatch((prev) => {
														const next = { ...prev, ...changeData };
														return next;
													});
												}}
												value={customSwatch || ""}
											/>
										) : null}
									</div>
								</div>

								<div class="form-item">
									<label className="form_label">
										{__("Custom name","sa-swatches")}
									</label>
									<div className="form_value">
										<input
											type="text"
											value={customName}
											onChange={(e) => setCustomName(e.target.value)}
											placeholder="Custom name"
										/>
									</div>
								</div>

								<div className="form-action">
									<button
										type="button"
										onClick={() => handleClearCustom()}
										className="button"
									>
										{__("Reset", "reset")}
									</button>
								</div>
							</div>
						</div>

						<div className="sasw_box">
							<h3>{__("Global settings","sa-swatches")}</h3>
							<div className="term-item swatch_box">
								{term?.swatch?.type === "sasw_image" ? (
									<span className="img sasw_border">
										<img
											src={term?.swatch?.thumbnail || term?.swatch?.full || ""}
											alt=""
										/>
									</span>
								) : null}
								{term?.swatch?.type === "sasw_color" ? (
									<span
										className="color sasw_border"
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

const SortableList = ({
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
			// clone={false}
			setList={onSorted}
			className="sa-list-term"
			handle=".move"
		>
			{list.map((term) => {
				return (
					<ListSelectedTermItem
						key={term?.id}
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

export default SortableList;
