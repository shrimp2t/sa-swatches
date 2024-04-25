import {
  Spinner,
  Modal,
} from "@wordpress/components";

import React from "react";
import { useState, useEffect } from "@wordpress/element";
import { ReactSortable } from "react-sortablejs";
import ImagePicker from "./ImagePicker";
import ColorPicker from "./ColorPicker";


const ListSelectedTermItem = ({
  term,
  onClick,
  selectedList,
  onClose,
  setSelectedList,
}) => {
  const classes = ["term-item"];
  const [isOpen, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customSwatch, setCustomSwatch] = useState(null);
  const [customName, setCustomName] = useState(null);
  let isSelected = false;
  if (selectedList?.length) {
    if (selectedList.filter((i) => i.id === term.id).length) {
      classes.push("selected");
      isSelected = true;
    }
  }
  useEffect(() => {
    setCustomSwatch(term?.custom_swatch);
    setCustomName(term?.custom_name);
  }, []);

  const handleSaveCustom = () => {
    const value =
      term?.swatch?.type === "sa_image"
        ? customSwatch?.id
        : customSwatch?.value;
    setSelectedList?.((prev) => {
      const next = prev.map((el) => {
        if (el.id === term.id) {
          return {
            ...el,
            custom_swatch: {
              type: el?.swatch?.type,
              value,
            },
            custom_name: customName,
          };
        }
        return el;
      });
      return next;
    });
    setOpen(false);
  };

  const handleClearCustom = () => {
    setSelectedList?.((prev) => {
      const next = prev.map((el) => {
        if (el.id === term.id) {
          delete el.custom_swatch;
          delete el.custom_name;
        }
        return el;
      });
      return next;
    });

    setCustomName("");
    setCustomSwatch(null);
  };

  return (
    <>
      <div
        className={classes.join(" ")}
        onClick={() => onClick?.(term)}
        key={term.id}
      >
        {term?.swatch?.type === "sa_image" ? (
          <span className="img sa_border">
            <img
              src={
                customSwatch?.thumbnail ||
                customSwatch?.full ||
                term?.swatch?.thumbnail ||
                term?.swatch?.full ||
                ""
              }
              alt=""
            />
          </span>
        ) : null}
        {term?.swatch?.type === "sa_color" ? (
          <span
            className="color sa_border"
            style={{
              background: `${customSwatch?.value || term?.swatch?.value}`,
            }}
          ></span>
        ) : null}

        <span className="name">{customName || term.name}</span>
        <div className="actions">
          <span className="move ic">
            <span class="dashicons dashicons-move"></span>
          </span>
          <span onClick={() => setOpen(true)} className="edit ic">
            <span class="dashicons dashicons-edit-page"></span>
          </span>
          <span className="close ic" onClick={() => onClose?.(term)}>
            <span className="dashicons dashicons-no-alt"></span>
          </span>
        </div>
      </div>

      {isOpen && (
        <Modal
          title={`Swatch settings`}
          size="medium"
          className="sa_swatch_modal"
          style={{ width: 600 }}
          onRequestClose={() => setOpen(false)}
        >
          <div className="sa_modal_inner">
            {loading ? (
              <div className="loading">
                <Spinner
                  style={{
                    height: 30,
                    width: 30,
                  }}
                />
              </div>
            ) : null}

            <div className="box">
              <h3>This product settings</h3>
              <div className="term-item swatch_box">
                {term?.swatch?.type === "sa_image" ? (
                  <ImagePicker
                    swatch={customSwatch}
                    onChange={(changeData) => {
                      setCustomSwatch((prev) => {
                        const next = { ...prev, ...changeData };
                        return next;
                      });
                    }}
                  />
                ) : null}
                {term?.swatch?.type === "sa_color" ? (
                  <ColorPicker
                    confirm={false}
                    onChange={(changeData) => {
                      setCustomSwatch((prev) => {
                        const next = { ...prev, value: changeData };
                        return next;
                      });
                    }}
                    color={customSwatch?.value}
                  />
                ) : null}
                <input
                  type="text"
                  style={{ flexBasis: "60%" }}
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Custom name"
                />
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="button"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => handleClearCustom()}
                  className="button"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="sa_box">
              <h3>Global settings</h3>
              <div className="term-item swatch_box">
                {term?.swatch?.type === "sa_image" ? (
                  <span className="img sa_border">
                    <img
                      src={term?.swatch?.thumbnail || term?.swatch?.full || ""}
                      alt=""
                    />
                  </span>
                ) : null}
                {term?.swatch?.type === "sa_color" ? (
                  <span
                    className="color sa_border"
                    style={{ background: `${term?.swatch?.value}` }}
                  ></span>
                ) : null}
                <span>{term?.name}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

const SortableList = ({
  list,
  onSorted,
  onClick,
  selectedList,
  setSelectedList,
  onClose,
}) => {
  return (
    <ReactSortable
      list={list}
      setList={onSorted}
      className="sa-list-term"
      handle=".move"
    >
      {list.map((term) => {
        return (
          <ListSelectedTermItem
            term={term}
            showMove={true}
            onClose={onClose}
            onClick={onClick}
            selectedList={selectedList}
            setSelectedList={setSelectedList}
          />
        );
      })}
    </ReactSortable>
  );
};


export default SortableList;