import { useState, useEffect } from "@wordpress/element";
import { Modal } from "@wordpress/components";
import { useAppContext } from "./context";
import Drawer from "./Drawer";
import Option from "./Option";
import AttrOptions from "./AttrOptions";

const AttrItem = ({ attr }) => {
	const { attrs, selected, settings } = useAppContext();
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenModal, setOpenModal] = useState(false);

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

	return (
		<div
			className={[
				"sa_attr",
				attr.name,
				"atype-" + (attr?.type || "mixed"),
				"sa_align_" + (settings?.align || "none"),
			].join(" ")}
		>
			{showAttrLabel && (
				<div className="sa_attr_label">
					<span className="sa_label_title">
						{attr?.label}
						{showColon ? <span className="colon">:</span> : ""}
					</span>

					{showValue && <span className="sa_label_val">{selectedLabel}</span>}
				</div>
			)}

			<div className={[!loop ? "sa_attr_values" : "sa_loop_values"].join(" ")}>
				{settings.layout === "drawer" ? (
					<>
						<div
							className="sa_opt_selected_prev"
							onClick={() => setIsOpen(true)}
						>
							<Option
								option={option}
								attrName={attr.name}
								clickable={false}
								checkActive={false}
								showIcon={false}
								noSelect={true}
								settings={{
									...(settings?.option || {}),
									...(attr?.drawer || {}),
								}}
							/>
						</div>
						<Drawer
							isOpen={isOpen}
							onClose={() => setIsOpen(false)}
							title={
								attr?.data?.button_label?.length
									? attr?.data?.button_label
									: SA_WC_SWATCHES.i18n.select_attr.replace("%s", attr?.label)
							}
						>
							<AttrOptions
								attr={attr}
								settings={{
									...(settings?.drawer?.option || {}),
									...(attr?.settings || {}),
								}}
							/>
						</Drawer>
					</>
				) : (
					<AttrOptions
						attr={attr}
						settings={{
							...(settings?.option || {}),
							...(!loop ? attr?.settings || {} : {}),
						}}
					/>
				)}

				{willShowDetail ? (
					<>
						<a
							className="sa_attr_details"
							onClick={(e) => {
								console.log("CLICK____");
								e.preventDefault();
								setOpenModal(true);
							}}
							href="#"
						>
							{SA_WC_SWATCHES.i18n.btn_details}
						</a>

						{isOpenModal && (
							<Modal
								size="medium"
								className="sa_attr_desc_modal"
								// style={{ width: 600 }}
								onRequestClose={() => setOpenModal(false)}
							>
								<div className="sa_modal_inner">
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
