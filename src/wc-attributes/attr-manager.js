import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import React from "react";
import { render, useState, useMemo, useEffect } from '@wordpress/element';




const postData = ({ url, path, method, data }) => {

  return new Promise((resolve, reject) => {

    let reqUrl = url ? url : window.SA_WC_BLOCKS.root + path
    

    const args = {
      method: method || 'get', // *GET, POST, PUT, DELETE, etc.
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        "Content-Type": "application/json",
        'X-WP-Nonce': window.SA_WC_BLOCKS.nonce
      },
      redirect: "follow", // manual, *follow, error
    };

    if (data) {
      args.data = JSON.stringify(data);
    }

    fetch(reqUrl, args).then(res => res.json()).then(res => resolve(res)).catch(e => reject(e));
  })


}


const Image2 = ({ id }) => {

  const [image, setImage] = useState(false);

  const frame = useMemo(() => {
    // https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/media-upload/README.md
    // https://github.com/xwp/wp-core-media-widgets/blob/905edbccfc2a623b73a93dac803c5335519d7837/wp-admin/js/widgets/media-gallery-widget.js
    const config = {
      title: 'Select Image',
      button: {
        text: 'Use this image'
      },
      multiple: false  // Set to true to allow multiple files to be selected
    }

    config.library = { type: ['image'] };
    const f = wp.media(config);

    f.on('select', function () {
      // Get media attachment details from the frame state
      var attachment = frame.state().get('selection').first().toJSON();
      setImage(attachment);
    });

    return f;

  }, [])

  const handleOpen = () => {
    frame.open();
  }

  useEffect(() => {
    postData({
      path: `wp/v2/media/${id}?_fields=id,media_details`
    }).then(res => {

      console.log('Image', res);
    }).catch(e => console.log(e));
  }, [id])

  console.log('imae', image);

  return <Button onClick={handleOpen}>Open Media Library</Button>
}


const App = () => {
  return <>

    <Button>Check</Button>
    <br />
    <br />
    <Image2 id={103} />
  </>
}


const domNode = document.getElementById('sa_wc_attr_swatch_el');
const appEl = document.createElement('div')
domNode.append(appEl);
render(<App />, appEl);