/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import {
	useBlockProps,
	BlockControls,
	ToolbarGroup,
} from '@wordpress/block-editor';

import { Fragment, useEffect, useMemo } from '@wordpress/element';

import { PanelBody } from '@wordpress/components';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
import RenderItem from './render';

export default function Edit( props ) {
	const { isSelected, setAttributes } = props;
	const {
		items = [],
		columns = 1,
		columns__tablet = 1,
		columns__mobile = 1,
	} = props.attributes;
	const blockProps = useBlockProps();

	const openSettings = () => {
		wp.data.dispatch( 'core/block-editor' ).selectBlock( props.clientId );
		wp.data
			.dispatch( 'core/edit-post' )
			.openGeneralSidebar( 'edit-post/block' );
	};

	const renderList = useMemo( () => {
		return (
			<>
				{ Array.isArray( items ) && items.length ? (
					<div
						className="pm-items"
						data-col={ columns }
						data-col-tablet={ columns__tablet }
						data-col-mobile={ columns__mobile }
					>
						{ items.map( ( item ) => (
							<RenderItem item={ item } />
						) ) }
					</div>
				) : (
					<div className="pm-block-new-items">
						<button type="button" onClick={ openSettings }>
							{ __( 'Add Items', 'pm-blocks' ) }
						</button>
					</div>
				) }
			</>
		);
	}, [ items, columns, columns__tablet, columns__mobile ] );

	return (
		<div { ...blockProps }>
			{ Array.isArray( items ) && items.length ? (
				<div
					className="pm-items"
					data-col={ columns }
					data-col-tablet={ columns__tablet }
					data-col-mobile={ columns__mobile }
				>
					{ items.map( ( item ) => (
						<RenderItem item={ item } />
					) ) }
				</div>
			) : (
				<div className="pm-block-new-items">
					<button type="button" onClick={ openSettings }>
						{ __( 'Add Items', 'pm-blocks' ) }
					</button>
				</div>
			) }
		</div>
	);
}
