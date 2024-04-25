const SwatchSettings = ({}) => {
  return <div className="settings-form">
    <h3>Settings</h3>
    <div class="form-item">
      <label>Swatch type</label>
      <select>
        <option value={``}>Default</option>
        {Object.keys(SA_WC_BLOCKS.att_types).map((key) => {
          return <option value={key} key={key}>{SA_WC_BLOCKS.att_types[key]}</option>;
        })}
      </select>
    </div>


    <div>
      <button
        className="button button-primary"
        onClick={() => {}}
      >
        Save
      </button>
    </div>
  </div>;
}

export default SwatchSettings;