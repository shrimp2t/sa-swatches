const RenderItem = ( props ) => {
	const { item } = props;
	return (
		<div className="item">
			<h3>{ item.title }</h3>
			<div>{ item.subtitle }</div>
			<p>{ item.desc }</p>
		</div>
	);
};

export default RenderItem;
