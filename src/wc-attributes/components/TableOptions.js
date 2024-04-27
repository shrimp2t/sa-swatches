import req from "../../common/req";
import ImagePicker from "./ImagePicker";
import ColorPicker from "./ColorPicker";

const ColSwatch = ({ term, tax, type, setSelectedList }) => {
	const onChange = (changeData) => {
		let saveData = {
			...changeData,
			tax,
			type,
			term_id: term.id,
		};

		saveData.pid = SA_WC_BLOCKS?.pid;

		req({
			url: SA_WC_BLOCKS?.ajax,
			method: "post",
			data: saveData,
			params: {
				endpoint: "update_term_swatch",
			},
		})
			.then((res) => {
				console.log("Update_meta", res);
				if (res?.data) {
					setSelectedList?.((prev) => {
						const next = prev.map((el) => {
							if (el.id === res?.data?.id) {
								return res?.data;
							}
							return el;
						});

						return next;
					});
				}
			})
			.catch((e) => console.log(e));
	};
	return (
		<>
			{type === "sa_image" ? (
				<td>
					<ImagePicker swatch={term?.swatch} onChange={onChange} />
				</td>
			) : null}
			{type === "sa_color" ? (
				<td>
					<ColorPicker
						confirm={true}
						onChange={onChange}
						value={term?.swatch}
					/>
				</td>
			) : null}
		</>
	);
};

const TableOptions = ({
	handleAddItem,
	selectedList,
	setSelectedList,
	taxonomy,
	type,
	list,
}) => {
	return (
		<table className="sa_swatch_table wp-list-table widefat striped fixed table-view-list">
			<tbody>
				{list.map((term) => {
					const classes = ["term-item"];
					let isSelected = false;
					if (selectedList?.length) {
						if (selectedList.filter((i) => i.id === term.id).length) {
							classes.push("selected");
							isSelected = true;
						}
					}

					return (
						<tr key={term.id}>
							<ColSwatch
								setSelectedList={setSelectedList}
								term={term}
								tax={taxonomy}
								type={type}
							/>

							<td>{term.name}</td>
							<td className="actions">
								<span
									onClick={() => handleAddItem(term)}
									className={isSelected ? " close ic" : " add ic"}
								>
									<span
										className={
											isSelected
												? "dashicons dashicons-no-alt"
												: "dashicons dashicons-plus"
										}
									></span>
									{isSelected ? "Remove" : "Select"}
								</span>
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

export default TableOptions;
