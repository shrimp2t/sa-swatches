const SwatchSettings = ({ onSettingChange }) => {
  return <div className="settings-form">
    <h3>Settings</h3>

    <div class="form-item">
      <label className="form_label">Swatch type</label>
      <div className="form_value">
        <select>
          <option value={``}>Default</option>
          {Object.keys(SA_WC_BLOCKS.att_types).map((key) => {
            return <option value={key} key={key}>{SA_WC_BLOCKS.att_types[key]}</option>;
          })}
        </select>
      </div>
    </div>
    <div class="form-item">
      <label className="form_label">Show price</label>
      <div className="form_value">
        <select>
          <option value={`1`}>Default</option>
          <option value={`1`}>Yes</option>
          <option value={`0`}>No</option>
        </select>
      </div>
    </div>


    <div>
      <button
        className="button button-primary"
        onClick={() => { }}
      >
        Save
      </button>
    </div>
  </div>;
}

export default SwatchSettings;