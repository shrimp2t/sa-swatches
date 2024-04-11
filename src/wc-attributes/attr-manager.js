import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import React from "react";
import { render } from '@wordpress/element';


const ALLOWED_MEDIA_TYPES = ['image'];

function MyMediaUploader() {
  return (
    <MediaUploadCheck>
      <MediaUpload
        onSelect={(media) =>
          console.log('selected ' + media.length)
        }
        allowedTypes={ALLOWED_MEDIA_TYPES}
        value={''}
        render={({ open }) => (
          <Button onClick={open}>Open Media Library</Button>
        )}
      />
    </MediaUploadCheck>
  );
}

const App = () => {
  return <MyMediaUploader/>
}


const domNode = jQuery('#sa_wc_attr_swatch_el');
const appEl = jQuery("<div/>");
domNode.append(appEl);
// console.log( appEl[0] );
// const root = createRoot(appEl[0]);
render(<App />, appEl[0]);


// app\public\wp-admin\js\tags.js