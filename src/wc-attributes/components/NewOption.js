const NewOption = ({ handleAddNew, setNewTerm, newTerm }) => {

  return <div>
    <h3>Add new option</h3>
    <div className="add-form">
      <input
        type="text"
        onChange={(e) => setNewTerm(e.target.value)}
        value={newTerm || ""}
        placeholder="New option name"
      />
      <button
        className="button button-primary"
        onClick={() => handleAddNew()}
      >
        Save
      </button>
    </div>
  </div>
}

export default NewOption;