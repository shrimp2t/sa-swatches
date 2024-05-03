import { useState, useEffect } from "@wordpress/element";
import { useAppContext } from "./context";
import Drawer from "react-modern-drawer";
import Option from "./Option";
import AttrOptions from "./AttrOptions";

const AttrItem = ({ attr }) => {
	const [width, setWidth] = useState(window.innerWidth);
	const [height, setHeight] = useState(window.innerHeight);
	const { attrs, selected, settings } = useAppContext();
	const [isOpen, setIsOpen] = useState(false);

	let selectedLabel = "";
	const selectedVal = selected?.[attr?.name] || false;
	let option = false;

	useEffect(() => {
		const handleResize = () => {
			setWidth(window.innerWidth);
			setHeight(window.innerHeight);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

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
						<div onClick={() => setIsOpen(true)}>
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
							open={isOpen}
							onClose={() => setIsOpen(false)}
							direction={width > 600 ? "right" : "bottom"}
							className="sa_drawer sa_attr_drawer_values"
							zIndex={999900}
							size={1000}
							lockBackgroundScroll={true}
						>
							<div className="sa_drawer_wrap">
								<div className="sa_drawer_head">
									<div className="sa_drawer_head_inner">
										<div className="sa_drawer_title">
											{SA_WC_SWATCHES.i18n.select_attr.replace(
												"%s",
												attr?.label,
											)}{" "}
										</div>
										<div className="sa_drawer_actions">
											<button
												type="button"
												className="button"
												onClick={() => setIsOpen(false)}
											>
												Close
											</button>
										</div>
									</div>
								</div>
								<div className="sa_drawer_body">
									<AttrOptions
										attr={attr}
										settings={{
											...(settings?.drawer?.option || {}),
											...(attr?.settings || {}),
										}}
									/>
								</div>
								{/* <div className="sa_drawer_footer">
									<div className="sa_drawer_footer_inner">
										<div className="sa_drawer_title">Select {attr?.label}</div>
										<div className="sa_drawer_actions">
											<button type="button" className="button">
												Close
											</button>
										</div>
									</div>
								</div> */}
							</div>
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
			</div>
		</div>
	);
};

export default AttrItem;
