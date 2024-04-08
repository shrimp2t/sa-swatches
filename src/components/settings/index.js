import { Fragment, useEffect } from '@wordpress/element';

import { InspectorControls } from '@wordpress/block-editor';
import { getBlockType } from '@wordpress/blocks';

import FieldsRender from '../fields';

/**
 * Internal dependencies
 */
import './editor.scss';

const Settings = ( props ) => {
	const { setAttributes } = props;
	const block = getBlockType( props.name );
	const { pmSettings } = block;
	props.onItemValueChange = ( key, value ) => {
		setAttributes( { [ key ]: value } );
	};
	return (
		<InspectorControls>
			<FieldsRender
				{ ...props }
				fields={ pmSettings }
				item={ props.attributes }
			/>
		</InspectorControls>
	);
};

export default Settings;
