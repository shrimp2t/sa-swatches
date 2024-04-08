/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

import settings from './settings';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( 'pm-blocks/products', {
	pmSettings: settings,
	// Declare support for anchor links.
	icon: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="icon icon-tabler icon-tabler-list"
			width={ 24 }
			height={ 24 }
			viewBox="0 0 24 24"
			stroke-width={ 2 }
			stroke="#FFCCB3"
			fill="#fff"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
			<line x1={ 9 } y1={ 6 } x2={ 20 } y2={ 6 }></line>
			<line x1={ 9 } y1={ 12 } x2={ 20 } y2={ 12 }></line>
			<line x1={ 9 } y1={ 18 } x2={ 20 } y2={ 18 }></line>
			<line x1={ 5 } y1={ 6 } x2={ 5 } y2="6.01"></line>
			<line x1={ 5 } y1={ 12 } x2={ 5 } y2="12.01"></line>
			<line x1={ 5 } y1={ 18 } x2={ 5 } y2="18.01"></line>
		</svg>
	),
	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save,
} );
