
import "./admin.scss";
import { __ } from '@wordpress/i18n';
import React from "react";
import { render, useState, useEffect } from "@wordpress/element";


const Settings = ({ onChange, values }) => {
  const handleOnChange = (key, value) => {
    onChange((prev) => {
      const next = { ...prev, [key]: value, _t: Date.now() };
      if (["", null, undefined].includes(value)) {
        delete next[key];
      }
      return next;
    });
  };

  return (
    <>
      <div className="sa-settings-form">
        <h2>{__('Variations in product page', 'sa-wc-swatches')}</h2>
        <div className="group-items">
          <div className="sa_heading">
            <h3>{__('Layout Settings', 'sa-wc-swatches')}</h3>
          </div>

          <div class="form-item">
            <label className="form_label">{__('Form Layout', 'domain')}</label>
            <div className="form_value">
              <select
                value={values?.form_layout || ""}
                defaultValue={""}
                onChange={(e) => {
                  const v = e.target.value;
                  handleOnChange("form_layout", v);
                }}
              >
                {Object.keys(SA_WC_SWATCHES.configs.main_layout).map(k => (<option value={k} key={k}>{SA_WC_SWATCHES.configs.main_layout[k]}</option>))}

              </select>
            </div>
          </div>
        </div>

        <div className="group-items">
          <div className="sa_heading">
            <h3>{__('Options Settings', 'domain')}</h3>
          </div>

          <div class="form-item">
            <label className="form_label">Label</label>
            <div className="form_value">
              <select
                value={values?.label || ""}
                defaultValue={""}
                onChange={(e) => {
                  const v = e.target.value;
                  handleOnChange("label", v);
                }}
              >
                {Object.keys(SA_WC_SWATCHES.configs.show_hide).map(k => (<option value={k} key={k}>{SA_WC_SWATCHES.configs.show_hide[k]}</option>))}
              </select>
            </div>
          </div>

          <div class="form-item">
            <label className="form_label">{__('Item Layout', 'domain')}</label>
            <div className="form_value">
              <select
                value={values?.layout}
                defaultValue={`inline`}
                onChange={(e) => {
                  handleOnChange("layout", e.target.value);
                }}
              >
                <option value={""}>{__('Default', 'domain')}</option>
                {Object.keys(SA_WC_SWATCHES.configs.opion_layout).map((key) => (
                  <option value={key} key={key}>
                    {SA_WC_SWATCHES.configs.opion_layout[key]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div class="form-item">
            <label className="form_label">{__('Items per row', 'domain')}</label>
            <div className="form_value">
              <input
                value={values?.col}
                type="number"
                placeholder="Auto"
                step={1}
                onChange={(e) => {
                  handleOnChange("col", e.target.value);
                }}
                size={3}
              />
            </div>
          </div>
          <div class="form-item">
            <label className="form_label">{__('Swatch size', 'domain')}</label>
            <div className="form_value">
              <input
                value={values?.size}
                type="number"
                onChange={(e) => {
                  handleOnChange("size", e.target.value);
                }}
                size={3}
              />
            </div>
          </div>

          <div class="form-item">
            <label className="form_label">{__('Image swatch style', 'domain')}</label>
            <div className="form_value">
              <select
                value={values?.swatch_image || ""}
                defaultValue={""}
                onChange={(e) => {
                  const v = e.target.value;
                  handleOnChange("swatch_image", v);
                }}
              >
                {Object.keys(SA_WC_SWATCHES.configs.swatch_style).map((key) => (
                  <option value={key} key={key}>
                    {SA_WC_SWATCHES.configs.swatch_style[key]}
                  </option>
                ))}
              </select>
            </div>
          </div>


          <div class="form-item">
            <label className="form_label">{__('Color swatch style', 'domain')}</label>
            <div className="form_value">
              <select
                value={values?.swatch_color || ""}
                defaultValue={""}
                onChange={(e) => {
                  const v = e.target.value;
                  handleOnChange("swatch_color", v);
                }}
              >
                {Object.keys(SA_WC_SWATCHES.configs.swatch_style).map((key) => (
                  <option value={key} key={key}>
                    {SA_WC_SWATCHES.configs.swatch_style[key]}
                  </option>
                ))}
              </select>
            </div>
          </div>


        </div>
        {['drawer'].includes(values?.fromLayout) ? (

          <div className="group-items">

            <div className="sa_heading has_desc">
              <h3>{__('Selected Option Settings', 'domain')}</h3>
              <p className="sa_desc">{__('Apply for drawer layout only.', 'domain')}</p>
            </div>
            <div class="form-item">
              <label className="form_label">{__('Label', 'domain')}</label>
              <div className="form_value">
                <select
                  value={values?.drawer_label || ""}
                  defaultValue={""}
                  onChange={(e) => {
                    const v = e.target.value;
                    handleOnChange("drawer_label", v);
                  }}
                >
                  {Object.keys(SA_WC_SWATCHES.configs.show_hide).map((key) => (
                    <option value={key} key={key}>
                      {SA_WC_SWATCHES.configs.show_hide[key]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div class="form-item">
              <label className="form_label">{__('Item Layout', 'domain')}</label>
              <div className="form_value">
                <select
                  value={values?.drawer_layout}
                  defaultValue={`inline`}
                  onChange={(e) => {
                    handleOnChange("drawer_layout", e.target.value);
                  }}
                >
                  <option value={""}>{__('Default', 'domain')}</option>
                  cccc
                </select>
              </div>
            </div>

            <div class="form-item">
              <label className="form_label">{__('Swatch size', 'domain')}</label>
              <div className="form_value">
                <input
                  value={values?.drawer_size}
                  type="number"
                  onChange={(e) => {
                    handleOnChange("drawer_size", e.target.value);
                  }}
                  size={3}
                />
              </div>
            </div>

            {/* <div class="form-item">
              <label className="form_label">{__('Item min width', 'domain')}</label>
              <div className="form_value">
                <input
                  value={values?.drawer_minWidth}
                  type="number"
                  onChange={(e) => {
                    handleOnChange("drawer_minWidth", e.target.value);
                  }}
                  size={3}
                />
              </div>
            </div> */}


            <div class="form-item">
              <label className="form_label">{__('Image swatch style', 'domain')}</label>
              <div className="form_value">
                <select
                  value={values?.drawer_swatch_image || ""}
                  defaultValue={""}
                  onChange={(e) => {
                    const v = e.target.value;
                    handleOnChange("drawer_swatch_image", v);
                  }}
                >
                  {Object.keys(SA_WC_SWATCHES.configs.swatch_style).map((key) => (
                    <option value={key} key={key}>
                      {SA_WC_SWATCHES.configs.swatch_style[key]}
                    </option>
                  ))}
                </select>
              </div>
            </div>


            <div class="form-item">
              <label className="form_label">{__('Color swatch style', 'domain')}</label>
              <div className="form_value">
                <select
                  value={values?.drawer_swatch_color || ""}
                  defaultValue={""}
                  onChange={(e) => {
                    const v = e.target.value;
                    handleOnChange("drawer_swatch_color", v);
                  }}
                >
                  {Object.keys(SA_WC_SWATCHES.configs.swatch_style).map((key) => (
                    <option value={key} key={key}>
                      {SA_WC_SWATCHES.configs.swatch_style[key]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>
        ) : null}

      </div>


      <div className="sa-settings-form">
        <h2>{__('Variations in shop & archive pages', 'domain')}</h2>
        <div className="group-items">
          <div className="sa_heading">
            <h3>{__('Layout Settings', 'domain')}</h3>
          </div>

          <div class="form-item">
            <label className="form_label">{__('Enable', 'domain')}</label>
            <div className="form_value">
              <select
                value={values?.shop_show || ""}
                defaultValue={"yes"}
                onChange={(e) => {
                  const v = e.target.value;
                  handleOnChange("shop_show", v);
                }}
              >
                {Object.keys(SA_WC_SWATCHES.configs.yes_no).map((key) => (
                  <option value={key} key={key}>
                    {SA_WC_SWATCHES.configs.yes_no[key]}
                  </option>
                ))}
              </select>
            </div>
          </div>


        </div>

        <div className="group-items">
          <div className="sa_heading">
            <h3>{__('Options Settings', 'domain')}</h3>
          </div>

          <div class="form-item">
            <label className="form_label">{__('Position', 'domain')}</label>
            <div className="form_value">
              <select
                value={values?.shop_position || ""}
                defaultValue={""}
                onChange={(e) => {
                  const v = e.target.value;
                  handleOnChange("shop_position", v);
                }}
              >
                {Object.keys(SA_WC_SWATCHES.configs.position).map((key) => (
                  <option value={key} key={key}>
                    {SA_WC_SWATCHES.configs.position[key]}
                  </option>
                ))}

              </select>
            </div>
          </div>

          <div class="form-item">
            <label className="form_label">{__('Swatches align', 'domain')}</label>
            <div className="form_value">
              <select
                value={values?.shop_align || ""}
                defaultValue={""}
                onChange={(e) => {
                  const v = e.target.value;
                  handleOnChange("shop_align", v);
                }}
              >
                {Object.keys(SA_WC_SWATCHES.configs.align).map((key) => (
                  <option value={key} key={key}>
                    {SA_WC_SWATCHES.configs.align[key]}
                  </option>
                ))}
              </select>
            </div>
          </div>


          <div class="form-item">
            <label className="form_label">{__('Allow attributes selection', 'domain')}</label>
            <div className="form_value">
              <select
                value={values?.shop_selection || ""}
                defaultValue={"yes"}
                onChange={(e) => {
                  const v = e.target.value;
                  handleOnChange("shop_selection", v);
                }}
              >
                {Object.keys(SA_WC_SWATCHES.configs.yes_no).map((key) => (
                  <option value={key} key={key}>
                    {SA_WC_SWATCHES.configs.yes_no[key]}
                  </option>
                ))}
              </select>
            </div>
          </div>



          <div class="form-item">
            <label className="form_label">{__('Swatch size', 'domain')}</label>
            <div className="form_value">
              <input
                value={values?.shop_size}
                type="number"
                onChange={(e) => {
                  handleOnChange("shop_size", e.target.value);
                }}
                size={3}
              />
            </div>
          </div>

          <div class="form-item">
            <label className="form_label">{__('Image swatch style', 'domain')}</label>
            <div className="form_value">
              <select
                value={values?.shop_swatch_image || ""}
                defaultValue={""}
                onChange={(e) => {
                  const v = e.target.value;
                  handleOnChange("shop_swatch_image", v);
                }}
              >
                {Object.keys(SA_WC_SWATCHES.configs.swatch_style).map((key) => (
                  <option value={key} key={key}>
                    {SA_WC_SWATCHES.configs.swatch_style[key]}
                  </option>
                ))}
              </select>
            </div>
          </div>


          <div class="form-item">
            <label className="form_label">{__('Color swatch style', 'domain')}</label>
            <div className="form_value">
              <select
                value={values?.shop_swatch_color || ""}
                defaultValue={""}
                onChange={(e) => {
                  const v = e.target.value;
                  handleOnChange("shop_swatch_color", v);
                }}
              >
                {Object.keys(SA_WC_SWATCHES.configs.swatch_style).map((key) => (
                  <option value={key} key={key}>
                    {SA_WC_SWATCHES.configs.swatch_style[key]}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>


      </div>


    </>
  );
};

const App = ({ input, initValues }) => {
  const [settings, setSettings] = useState(initValues);
  useEffect(() => {
    input.val(JSON.stringify(settings));
  }, [settings]);
  return (<><Settings onChange={setSettings} values={settings} /></>);
}


jQuery('#sa_wc_setting_wrap').each(function () {

  const panel = jQuery(this);
  const input = jQuery('#sa_swatches_settings');
  const form = panel.closest('form');
  form.append(input);
  jQuery('.wc-settings-row-sa_swatches_settings, h2', form).remove();
  let initValues = {

  }
  try {
    initValues = JSON.parse(input.val());
  } catch (e) {
    initValues = {}
  }
  console.log('.initValues', initValues);
  render(<App input={input} initValues={initValues} />, panel.get(0));

});