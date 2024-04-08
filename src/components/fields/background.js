/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import FieldsRender from '.';

const Background = ( props ) => {
	const { setAttributes, attributes, field } = props;
	let { values = {} } = attributes;

	const fields = [
		{
			type: 'select',
			name: 'type',
			label: __( 'Type', 'pm-blocks' ),
			options: [
				{
					label: __( 'Color', 'pm-blocks' ),
					value: 'color',
				},
				{
					label: __( 'Image', 'pm-blocks' ),
					value: 'image',
				},
				{
					label: __( 'Gradient', 'pm-blocks' ),
					value: 'gradient',
				},
			],
		},
		{
			type: 'color',
			name: 'color',
			label: __( 'Color', 'pm-blocks' ),
			showWhen: [
				{
					name: 'type',
					value: [ '', 'color', undefined ],
					operator: 'in',
				},
			],
		},
		{
			type: 'gradient',
			name: 'gradient',
			label: __( 'Gradient', 'pm-blocks' ),
			showWhen: [
				{
					name: 'type',
					value: 'gradient',
					operator: '=',
				},
			],
		},
		{
			type: 'image',
			name: 'image',
			label: __( 'Image', 'pm-blocks' ),
			focalPointBg: true,
			showWhen: [
				{
					name: 'type',
					value: 'image',
					operator: '=',
				},
			],
		},
		{
			isHidden: true,
			name: 'imagePos',
			default: undefined,
			dataType: 'object',
			showWhen: [
				{
					name: 'type',
					value: 'image',
					operator: '=',
				},
			],
		},
		{
			type: 'select',
			name: 'cover',
			label: __( 'Cover', 'pm-blocks' ),
			options: [
				{
					label: __( 'Default', 'pm-blocks' ),
					value: 'initial',
				},
				{
					label: __( 'Cover', 'pm-blocks' ),
					value: 'cover',
				},
				{
					label: __( 'Contain', 'pm-blocks' ),
					value: 'contain',
				},
			],
			showWhen: [
				{
					name: 'type',
					value: 'image',
					operator: '=',
				},
			],
		},
		{
			type: 'select',
			name: 'repeat',
			label: __( 'Repeat', 'pm-blocks' ),
			options: [
				{
					label: __( 'no-repeat', 'pm-blocks' ),
					value: 'no-repeat',
				},
				{
					label: __( 'repeat', 'pm-blocks' ),
					value: 'repeat',
				},
				{
					label: __( 'repeat-x', 'pm-blocks' ),
					value: 'repeat-x',
				},
				{
					label: __( 'repeat-y', 'pm-blocks' ),
					value: 'repeat-y',
				},
			],
			showWhen: [
				{
					name: 'type',
					value: 'image',
					operator: '=',
				},
			],
		},

		{
			type: 'select',
			name: 'attachment',
			label: __( 'Attachment', 'pm-blocks' ),
			options: [
				{
					label: __( 'Scroll', 'pm-blocks' ),
					value: 'scroll',
				},
				{
					label: __( 'Fixed', 'pm-blocks' ),
					value: 'fixed',
				},
				{
					label: __( 'Local', 'pm-blocks' ),
					value: 'local',
				},
				{
					label: __( 'Local, scroll', 'pm-blocks' ),
					value: 'local, scroll',
				},
				{
					label: __( 'Scroll, local', 'pm-blocks' ),
					value: 'scroll, local',
				},
			],
			showWhen: [
				{
					name: 'type',
					value: 'image',
					operator: '=',
				},
			],
		},
	];

	let defaultValues = {};
	fields.map( ( field ) => {
		defaultValues[ field.name ] = field.default || undefined;
	} );

	const onItemValueChange = ( key, value, index = undefined ) => {
		let newValues = { ...values };
		newValues[ key ] = value;
		setAttributes( { [ field.name ]: newValues } );
	};

	if ( ! values.type ) {
		values.type = 'color';
	}

	return (
		<>
			<FieldsRender
				{ ...props }
				onItemValueChange={ onItemValueChange }
				fields={ fields }
				item={ values }
			/>
		</>
	);
};

export default Background;
