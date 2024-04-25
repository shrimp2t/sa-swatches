import {
  Button,
} from "@wordpress/components";

import React from "react";
import { useState, useMemo } from "@wordpress/element";


const Image = ({ swatch, type, onChange, clear }) => {
  const [image, setImage] = useState(null);

  const frame = useMemo(() => {
    // https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/media-upload/README.md
    // https://github.com/xwp/wp-core-media-widgets/blob/905edbccfc2a623b73a93dac803c5335519d7837/wp-admin/js/widgets/media-gallery-widget.js
    const config = {
      title: "Select Image",
      button: {
        text: "Use this image",
      },
      multiple: false, // Set to true to allow multiple files to be selected
    };

    config.library = { type: ["image"] };
    const f = wp.media(config);

    f.on("select", function () {
      // Get media attachment details from the frame state
      var attachment = frame.state().get("selection").first().toJSON();

      const sizes = {};
      if (attachment.sizes?.thumbnail?.url) {
        sizes.thumbnail = attachment.sizes?.thumbnail?.url;
      }
      if (attachment.sizes?.full?.url) {
        sizes.full = attachment.sizes?.full?.url;
      }

      const data = {
        id: attachment.id,
        ...sizes,
      };

      setImage(data);
      onChange?.(data);
    });

    return f;
  }, []);

  const handleOpen = () => {
    frame.open();
  };

  const handleRemove = () => {
    setImage(false);
    onChange?.(false);
  };

  const src =
    image?.thumbnail || image?.full || swatch?.thumbnail || swatch?.full;

  return (
    <div className="wc_swatch_image_wrap" data-type={type}>
      <div onClick={handleOpen} className="wc_swatch_image sa_border">
        {src ? (
          <img src={src} alt="" />
        ) : (
          <span className="wc_swatch_image_placeholder">
            <span class="dashicons dashicons-format-image"></span>
          </span>
        )}
      </div>
      {"full" === type ? (
        <div className="act">
          <Button size="small" onClick={handleOpen} variant="secondary">
            Upload
          </Button>
          <Button
            onClick={handleRemove}
            isDestructive
            size="small"
            variant="secondary"
          >
            Remove
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default Image;