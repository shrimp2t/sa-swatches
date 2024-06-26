import req from "../../common/req";
import ImagePicker from "./ImagePicker";
import ColorPicker from "./ColorPicker";

const ColSwatch = ({ term, tax, type, setSelectedList, setList }) => {
	const onChange = (changeData) => {
		let saveData = {
			...changeData,
			tax,
			type,
			term_id: term.id,
		};

		if (type === 'sasw_image') {
			saveData.value = changeData?.id;
		}

		saveData.pid = SASW_SWATCHES?.pid;

		req({
			url: SASW_SWATCHES?.ajax,
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
					setList?.((prev) => {
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
			{type === "sasw_image" ? (
				<td className="col_swatch">
					<ImagePicker swatch={term?.swatch} onChange={onChange} />
				</td>
			) : null}
			{type === "sasw_color" ? (
				<td className="col_swatch">
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
	setList,
}) => {
	return (
		<table className="sasw_swatch_table wp-list-table widefat striped fixed table-view-list">
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
								setList={setList}
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
