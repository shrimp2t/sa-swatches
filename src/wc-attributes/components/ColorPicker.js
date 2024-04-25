import {
	Button,
	ColorPicker as ColorPickerWP,
	Popover,
} from "@wordpress/components";

import { useState } from "@wordpress/element";




const ColorPicker = ({ color, onChange, confirm }) => {
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
						<ColorPickerWP color={value} onChange={handleOnChange} />
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

export default ColorPicker;