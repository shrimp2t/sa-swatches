/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import {
	Button,
	TextControl,
	TextareaControl,
	Icon,
	ColorPalette,
	ToggleControl,
	BaseControl,
	Popover,
	Dropdown,
	ColorIndicator,
} from '@wordpress/components';
import FieldsRender from '.';
import Conditional from './conditional';
import Image from './image';

import { useState } from '@wordpress/element';
import { useInstanceId } from '@wordpress/compose';
import {
	sortableContainer,
	sortableElement,
	sortableHandle,
} from 'react-sortable-hoc';
import { arrayMoveImmutable as arrayMove } from 'array-move';

import {
	useSetting,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import './editor.scss';

const DragHandle = sortableHandle( () => (
	<div class="drag">
		<Icon icon="menu" size="24" />
	</div>
) );

const SortableItem = sortableElement( ( props ) => {
	const { onRemoveItem, onItemValueChange, item = {}, fields = [] } = props;
	const [ isOpen, setIsOpen ] = useState( false );

	let popOverElements = {};
	let hasColor = false;
	fields.map( ( field ) => {
		if ( field.type === 'color' ) {
			hasColor = true;
		}
		popOverElements[ field.name ] = false;
	} );

	let classes = [ 'repeater-item' ];
	if ( isOpen ) {
		classes.push( 'open' );
	} else {
		classes.push( 'close' );
	}

	return (
		<div className={ classnames( classes ) }>
			<div className="header">
				<DragHandle />
				<div class="heading">{ item.title }</div>
				<div class="toggle">
					<Button
						className="toggle-btn"
						onClick={ () => setIsOpen( ! isOpen ) }
						isPressed={ false }
					>
						{ isOpen ? (
							<Icon size="24" icon="minus" />
						) : (
							<Icon size="24" icon="plus" />
						) }
					</Button>
				</div>
			</div>
			{ isOpen && (
				<div class="item-content">
					<div className="item-fields">
						<FieldsRender
							fields={ fields }
							onItemValueChange={ onItemValueChange }
							item={ item }
						/>
					</div>
					<Button
						onClick={ () => {
							onRemoveItem( item._index );
						} }
						variant="secondary"
						isSmall={ true }
					>
						{ __( 'Remove', 'pm-blocks' ) }
					</Button>
				</div>
			) }
		</div>
	);
} );

const SortableContainer = sortableContainer( ( { children } ) => {
	return <div class="pm-repeater">{ children }</div>;
} );

const Repeater = ( props ) => {
	// const instanceId = useInstanceId(Repeater);

	const { setAttributes, attributes, field = [] } = props;
	const { items = [] } = attributes;

	let defaultValues = {};
	field.fields.map( ( childField ) => {
		defaultValues[ childField.name ] = childField.default || undefined;
	} );

	const onSortEnd = ( { oldIndex, newIndex } ) => {
		setAttributes( {
			[ field.name ]: arrayMove( items, oldIndex, newIndex ),
		} );
	};

	const addItem = () => {
		let newItem = { ...defaultValues };
		let newItems = [ ...items, newItem ];
		console.log( 'Add Type', typeof newItems );
		setAttributes( { [ field.name ]: newItems } );
	};

	const onRemoveItem = ( index ) => {
		let newItems = [ ...items ];
		newItems.splice( index, 1 );
		setAttributes( { [ field.name ]: newItems } );
	};

	const onItemValueChange = ( key, value, index = undefined ) => {
		let newItems = [ ...items ];
		newItems[ index ][ key ] = value;
		setAttributes( { [ field.name ]: newItems } );
	};

	return (
		<>
			{ items && (
				<SortableContainer
					onSortEnd={ onSortEnd }
					useDragHandle
					lockAxis={ 'y' }
				>
					{ items.map( ( item, index ) => {
						const itemInfo = { ...item, _index: index };
						return (
							<SortableItem
								key={ `item-${ index }` }
								index={ index }
								item={ itemInfo }
								fields={ field.fields }
								onRemoveItem={ onRemoveItem }
								onItemValueChange={ onItemValueChange }
							/>
						);
					} ) }
				</SortableContainer>
			) }
			<Button onClick={ addItem } variant="secondary" isSmall={ true }>
				{ __( 'Add Item', 'pm-blocks' ) }
			</Button>
		</>
	);
};

export default Repeater;
