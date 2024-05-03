
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

  console.log("settings", values);

  const types = {
    inline: "Inline",
    box: "Box",
    checkbox: "Checkbox",
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
            <label className="form_label">{__('From Layout', 'domain')}</label>
            <div className="form_value">
              <select
                value={values?.fromLayout || ""}
                defaultValue={""}
                onChange={(e) => {
                  const v = e.target.value;
                  handleOnChange("fromLayout", v);
                }}
              >
                <option value={"separate"}>separate</option>
                <option value={"inline"}>inline</option>
                <option value={"drawer"}>drawer</option>
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
                <option value={""}>Default</option>
                <option value={"yes"}>Show</option>
                <option value={"no"}>Hide</option>
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
                <option value={""}>Default</option>
                {Object.keys(types).map((key) => {
                  return (
                    <option value={key} key={key}>
                      {types[key]}
                    </option>
                  );
                })}
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
                <option value={""}>Default</option>
                <option value={"box"}>box</option>
                <option value={"circle"}>circle</option>
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
                <option value={""}>Default</option>
                <option value={"box"}>box</option>
                <option value={"circle"}>circle</option>
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
              <label className="form_label">Label</label>
              <div className="form_value">
                <select
                  value={values?.drawer_label || ""}
                  defaultValue={""}
                  onChange={(e) => {
                    const v = e.target.value;
                    handleOnChange("drawer_label", v);
                  }}
                >
                  <option value={""}>Default</option>
                  <option value={"yes"}>Show</option>
                  <option value={"no"}>Hide</option>
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
                  <option value={""}>Default</option>
                  {Object.keys(types).map((key) => {
                    return (
                      <option value={key} key={key}>
                        {types[key]}
                      </option>
                    );
                  })}
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

            <div class="form-item">
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
            </div>


            <div class="form-item">
              <label className="form_label">{__('Image swatch style', 'domain')}</label>
              <div className="form_value">
                <select
                  value={values?.label_swatch_image || ""}
                  defaultValue={""}
                  onChange={(e) => {
                    const v = e.target.value;
                    handleOnChange("label_swatch_image", v);
                  }}
                >
                  <option value={""}>Default</option>
                  <option value={"box"}>box</option>
                  <option value={"circle"}>circle</option>
                </select>
              </div>
            </div>


            <div class="form-item">
              <label className="form_label">{__('Color swatch style', 'domain')}</label>
              <div className="form_value">
                <select
                  value={values?.label_swatch_color || ""}
                  defaultValue={""}
                  onChange={(e) => {
                    const v = e.target.value;
                    handleOnChange("label_swatch_color", v);
                  }}
                >
                  <option value={""}>Default</option>
                  <option value={"box"}>Box</option>
                  <option value={"circle"}>Circle</option>
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
            <h3>Layout Settings</h3>
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
                <option value={"yes"}>yes</option>
                <option value={"no"}>no</option>
              </select>
            </div>
          </div>


        </div>

        <div className="group-items">
          <div className="sa_heading">
            <h3>{__('Options Settings', 'domain')}</h3>
          </div>

          <div class="form-item">
            <label className="form_label">Position</label>
            <div className="form_value">
              <select
                value={values?.shop_position || ""}
                defaultValue={""}
                onChange={(e) => {
                  const v = e.target.value;
                  handleOnChange("shop_position", v);
                }}
              >
                <option value={"before_add_cart"}>before_add_cart</option>
                <option value={"before_add_cart"}>after_add_cart</option>

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
                <option value={"center"}>center</option>
                <option value={"left"}>left</option>
                <option value={"right"}>right</option>
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
                <option value={"yes"}>yes</option>
                <option value={"no"}>no</option>
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
                <option value={""}>Default</option>
                <option value={"box"}>box</option>
                <option value={"circle"}>circle</option>
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
                <option value={""}>Default</option>
                <option value={"box"}>box</option>
                <option value={"circle"}>circle</option>
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