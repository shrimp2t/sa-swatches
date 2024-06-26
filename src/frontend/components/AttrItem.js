import { useState, useRef, useEffect } from "@wordpress/element";
import { Modal, Popover } from "@wordpress/components";
import { useAppContext } from "./context";
import Drawer from "./Drawer";
import Option from "./Option";
import AttrOptions from "./AttrOptions";

const AttrItem = ({ attr }) => {
	const { attrs, selected, settings } = useAppContext();
	const { selection = true } = settings;
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenModal, setOpenModal] = useState(false);
	const ref = useRef(null);
	const refValue = useRef(null);

	let selectedLabel = "";
	const selectedVal = selected?.[attr?.name] || false;
	let option = false;

	if (selectedVal) {
		const { options = [] } = attrs?.[attr.id] || {};
		for (let i = 0; i < options.length; i++) {
			if (selectedVal === options[i].slug) {
				option = options[i];
				selectedLabel = options[i].name;
				break;
			}
		}
	}

	let showColon = ["separate"].includes(settings.layout);
	let showValue = ["separate"].includes(settings.layout);
	const { showAttrLabel = true, loop = false } = settings;

	const willShowDetail =
		settings?.viewAttrDetail && attr?.data?.description?.length;

	let optSettings = {};
	let optSelectedSettings = {};
	const inDrawer = ["drawer", "popover"].includes(settings?.layout);
	switch (attr.type) {
		case "image":
		case "sasw_image":
			optSettings = { ...(settings?.option?.image || {}) };
			optSelectedSettings = { ...(settings?.drawer?.option?.image || {}) };
			break;
		case "color":
		case "sasw_color":
			optSettings = { ...(settings?.option?.color || {}) };
			optSelectedSettings = { ...(settings?.drawer?.option?.color || {}) };
			break;
		default:
			optSettings = { ...(settings?.option?.default || {}) };
			optSelectedSettings = { ...(settings?.drawer?.option?.default || {}) };
	}

	useEffect(() => {
		refValue.current.addEventListener("wheel", (event) => {
			event.preventDefault();
			refValue.current.scrollLeft += event.deltaY;
		});
	}, []);

	return (
		<div
			className={[
				"sasw_attr",
				attr.name,
				"atype-" + (attr?.type || "mixed"),
				"sasw_align_" + (settings?.align || "none"),
			].join(" ")}
		>
			{showAttrLabel && (
				<div className="sasw_attr_label">
					<span className="sasw_label_title">
						{attr?.label}
						{showColon ? <span className="colon">:</span> : ""}
					</span>

					{showValue && <span className="sasw_label_val">{selectedLabel}</span>}
				</div>
			)}

			<div
				ref={refValue}
				className={[!loop ? "sasw_attr_values" : "sasw_loop_values"].join(" ")}
			>
				{inDrawer ? (
					<>
						<div
							className="sasw_opt_selected_prev"
							ref={ref}
							onClick={(e) => {
								e.preventDefault();
								if (!selection) {
									return;
								}
								setIsOpen(true);
							}}
						>
							<Option
								option={option}
								attrName={attr.name}
								clickable={false}
								checkActive={false}
								isDrawerPrev={true}
								showIcon={false}
								noSelect={true}
								settings={{
									// ...(settings?.option || {}),
									...optSelectedSettings,
									...(attr?.drawer || {}),
								}}
							/>
						</div>
						{settings?.layout === "popover" ? (
							<>
								{isOpen && (
									<Popover
										placement={`bottom`}
										className="sasw_popover"
										offset={15}
										focusOnMount={true}
										noArrow={false}
										anchor={ref?.current}
										onClose={() => {
											setIsOpen(false);
										}}
									>
										<div className="sasw_popover_inner">
											<AttrOptions
												attr={attr}
												settings={{
													// ...(settings?.drawer?.option || {}),
													...optSettings,
													...(attr?.settings || {}),
												}}
											/>
										</div>
									</Popover>
								)}
							</>
						) : (
							<Drawer
								isOpen={isOpen}
								onClose={(e) => {
									e.preventDefault();
									setIsOpen(false);
								}}
								title={
									attr?.data?.button_label?.length
										? attr?.data?.button_label
										: SASW_SWATCHES.i18n.select_attr.replace("%s", attr?.label)
								}
							>
								<AttrOptions
									attr={attr}
									settings={{
										// ...(settings?.drawer?.option || {}),
										...optSettings,
										...(attr?.settings || {}),
									}}
								/>
							</Drawer>
						)}
					</>
				) : (
					<AttrOptions
						attr={attr}
						settings={{
							// ...(settings?.option || {}),
							...optSettings,
							...(!loop ? attr?.settings || {} : {}),
						}}
					/>
				)}

				{willShowDetail ? (
					<>
						<a
							className="sasw_attr_details"
							onClick={(e) => {
								console.log("CLICK____");
								e.preventDefault();
								if (!selection) {
									return;
								}
								setOpenModal(true);
							}}
							href="#"
						>
							{attr?.data?.button_label?.length
								? attr?.data?.button_label
								: SASW_SWATCHES.i18n.btn_details}
						</a>

						{isOpenModal && (
							<Modal
								size="large"
								className="sasw_attr_desc_modal"
								title={attr?.data?.title}
								onRequestClose={() => setOpenModal(false)}
							>
								<div className="sasw_modal_inner">
									<div
										dangerouslySetInnerHTML={{
											__html: attr?.data?.description,
										}}
									></div>
								</div>
							</Modal>
						)}
					</>
				) : null}
			</div>
		</div>
	);
};

export default AttrItem;
