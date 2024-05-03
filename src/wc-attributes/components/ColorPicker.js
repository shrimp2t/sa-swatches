import {
	Button,
	ColorPicker as ColorPickerWP,
	Popover,
	Modal,
} from "@wordpress/components";

import { useEffect, useState } from "@wordpress/element";
import ColorPickerItem from "./ColorPickerItem";

const ColorPicker = ({ value, onChange, confirm }) => {
	const [values, setValues] = useState(() => {
		const more = value?.more?.map?.((v) => ({
			v: v || "",
			t: Date.now(),
		}));
		let l = [
			{
				v: value?.value || "",
				t: Date.now(),
			},
			...(more || []),
		];
		return l;
	});
	const [changed, setChanged] = useState(false);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		let t = null;
		if (changed) {
			t = setTimeout(() => {
				console.log("Call_Change___");

				const newValue = { ...value, value: "" };
				if (values?.length) {
					newValue.value = values[0].v;
				}

				if (values?.length > 1) {
					newValue.more = [];
					newValue.value = values[0].v;
					for (let i = 1; i < values.length; i++) {
						newValue.more.push(values[i].v);
					}
				}

				onChange?.(newValue);
			}, 600);
		}

		return () => {
			if (t) {
				clearTimeout(t);
			}
		};
	}, [changed]);

	return (
		<>
			<div className="">
				<div
					className="wc_swatch_colors sa_space sa_wrap"
					onClick={() => {
						setIsVisible(!isVisible);
					}}
				>
					<span className="sa_swatch">
						<span className="sa_color_inner">
							{values.map((i) => (
								<span
									className="sa_color_item"
									style={{ background: i.v, pointer: "cursor" }}
								></span>
							))}
						</span>
					</span>
				</div>

				{isVisible && (
					<Modal
						title="Select Color"
						className="sa_swatch_modal"
						onClickOutside={() => {
							setIsVisible(false);
						}}
						onRequestClose={() => {
							setIsVisible(false);
						}}
						headerActions={
							<div className="sa_space">
								<button
									className="button"
									onClick={(e) => {
										setChanged(Date.now());
										setValues((prev) => {
											return [...prev, { t: Date.now(), v: "" }];
										});
									}}
								>
									Add
								</button>
							</div>
						}
					>
						<div className="sa_space sa_wrap">
							{values.map((i, index) => {
								return (
									<div key={i.t} className="color_item">
										<ColorPickerItem
											size="x2"
											color={i.v || ""}
											onChange={(value) => {
												setChanged(Date.now());
												setValues((prev) => {
													const next = [...prev];
													next[index].v = value;
													return next;
												});
											}}
										/>
										<span
											className="ic remove"
											onClick={() => {
												setChanged(Date.now());
												setValues((prev) => {
													if (prev?.length < 2) {
														return prev;
													}
													const next = [...prev];
													next.splice(index, 1);
													return next;
												});
											}}
										>
											<span className="dashicons dashicons-no-alt"></span>
										</span>
									</div>
								);
							})}
						</div>
					</Modal>
				)}
			</div>
		</>
	);
};

export default ColorPicker;
