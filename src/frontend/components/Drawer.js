import { default as ModernDrawer } from "react-modern-drawer";
import { useState, useEffect } from "@wordpress/element";
import IconClose from "./IconClose";

const Drawer = ({ isOpen, onClose, title, footer, children }) => {
	const [width, setWidth] = useState(window.innerWidth);
	const [height, setHeight] = useState(window.innerHeight);
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

	return (
		<ModernDrawer
			open={isOpen}
			onClose={onClose}
			direction={width > 600 ? "right" : "bottom"}
			className="sa_drawer sa_attr_drawer_values"
			zIndex={999900}
			size={width > 600 ? 450 : height * 0.6}
			lockBackgroundScroll={true}
		>
			<div className="sa_drawer_wrap">
				<div className="sa_drawer_head">
					<div className="sa_drawer_head_inner">
						{title && <div className="sa_drawer_title">{title}</div>}

						<div className="sa_drawer_actions">
							<span className="sa_drawer_btn sa_close sa_cursor" onClick={onClose}>
								<IconClose />
							</span>
						</div>
					</div>
				</div>
				<div className="sa_drawer_body">{children}</div>
				{footer && (
					<div className="sa_drawer_footer">
						<div className="sa_drawer_footer_inner">{footer}</div>
					</div>
				)}
			</div>
		</ModernDrawer>
	);
};

export default Drawer;
