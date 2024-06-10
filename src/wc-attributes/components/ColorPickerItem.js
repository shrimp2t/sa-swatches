import {
	Button,
	ColorPicker as ColorPickerWP,
	Popover,
	Modal,
} from "@wordpress/components";

import { useState } from "@wordpress/element";

const ColorPickerItem = ({ color, onChange, confirm, size = "def" }) => {
	const [value, setValue] = useState(color);
	const [isVisible, setIsVisible] = useState(false);

	const handleOnChange = (color) => {
		setValue(color);
		onChange?.(color);
	};

	const classes = ["wc_swatch_color sasw_border"];
	classes.push(size);

	return (
		<>
			<div className={classes.join(" ")}>
				<div
					style={{ background: value, pointer: "cursor" }}
					onClick={() => {
						setIsVisible(true);
					}}
				></div>
				{isVisible && (
					<Popover
						className="wc_swatch_color_picker"
						placement={`left-start`}
						offset={15}
						noArrow={false}
						onClose={() => {
							setIsVisible(false);
						}}
					>
						<ColorPickerWP color={value} onChange={handleOnChange} />
					</Popover>
				)}
			</div>
		</>
	);
};

export default ColorPickerItem;
