import { useState, useEffect } from "@wordpress/element";

const SwatchSettings = ({ onChange, settings }) => {

  const handleOnChange = (key, value) => {
    onChange(prev => {
      return { ...prev, [key]: value, _t: Date.now() };
    })
  }


  return <div className="settings-form">
    <h3>Settings</h3>

    <div class="form-item">
      <label className="form_label">Swatch type</label>
      <div className="form_value">
        <select value={settings?.type} defaultValue={``} onChange={(e) => { handleOnChange('type', e.target.value) }}>
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
        <select value={settings?.show_price} defaultValue={``} onChange={(e) => { handleOnChange('show_price', e.target.value) }}>
          <option value={``}>Default</option>
          <option value={`1`}>Yes</option>
          <option value={`0`}>No</option>
        </select>
      </div>
    </div>

  </div>;
}

export default SwatchSettings;