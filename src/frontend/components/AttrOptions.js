import Option from "./Option";

const AttrOptions = ({ attr, settings }) => {
	const classes = ["sa_attr_options"];
	classes.push("sa_opts_l_" + settings?.layout);
	if (settings?.col > 0) {
		classes.push("sa_opts_col");
	} else {
		if (!settings?.loop) {
			classes.push("sa_opts_col_auto");
		}
	}

	return (
		<div className={classes.join(" ")}>
			{attr?.options.map((option) => {
				return (
					<Option
						key={[attr.id, option.id]}
						attrName={attr.name}
						attrId={attr.id}
						option={option}
						settings={settings}
					/>
				);
			})}
		</div>
	);
};


export default AttrOptions;