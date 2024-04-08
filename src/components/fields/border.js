/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import FieldsRender from '.';

const Border = ( props ) => {
	const { setAttributes, attributes, field } = props;
	const { values } = attributes;

	const fields = [
		{
			type: 'boxunit',
			name: 'width',
			label: __( 'Border Width', 'pm-blocks' ),
			default: undefined,
			dataType: 'object',
			responsive: true,
			props: {
				disableUnits: false,
			},
		},

		{
			type: 'select',
			name: 'style',
			label: __( 'Style', 'pm-blocks' ),
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
		},

		{
			type: 'boxunit',
			name: 'radius',
			label: __( 'Border Radius', 'pm-blocks' ),
			default: undefined,
			dataType: 'object',
			responsive: true,
			props: {
				disableUnits: false,
			},
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

export default Border;
