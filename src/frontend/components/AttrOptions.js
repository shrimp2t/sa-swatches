import Option from "./Option";


const AttrOptions = ({ attr, settings }) => {
	const classes = ["sasw_attr_options"];
	classes.push("sasw_opts_l_" + settings?.layout);
	if (settings?.col > 0) {
		classes.push("sasw_opts_col");
	} else {
		if (!settings?.loop) {
			classes.push("sasw_opts_col_auto");
		}
	}

	return (
		<>
			<div  className={classes.join(" ")}>
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
		</>
	);
};

export default AttrOptions;
