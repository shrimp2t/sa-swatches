import { __ } from '@wordpress/i18n';

/**
 * Layout Settings.
 *
 * @param {String|Object} selector
 * @returns {Object}
 */
export const layout = ( selector = 'selector' ) => {
	return {
		type: 'panel',
		label: __( 'Layout', 'pm-blocks' ),
		open: false,
		fields: [
			{
				type: 'unit',
				name: 'gap',
				label: __( 'Items Gap', 'pm-blocks' ),
				default: '',
				dataType: '',
				responsive: true,
				props: {
					disableUnits: false,
				},
				css: [
					{
						selector:
							typeof selector === 'object'
								? selector?.gap || selector?.default
								: selector,
						render: function ( value ) {
							if ( ! value ) {
								return '';
							}
							return `gap: ${ value };`;
						},
					},
				],
			},
			{
				type: 'unit',
				name: 'minHeight',
				label: __( 'Min Height', 'pm-blocks' ),
				default: '',
				dataType: '',
				responsive: true,
				props: {
					disableUnits: false,
				},
				css: [
					{
						selector:
							typeof selector === 'object'
								? selector?.minHeight || selector?.default
								: selector,
						render: function ( value ) {
							if ( ! value ) {
								return '';
							}
							return `min-height: ${ value };`;
						},
					},
				],
			},
			{
				type: 'select',
				name: 'vAlign',
				label: __( 'Vertical Align', 'pm-blocks' ),
				default: undefined,
				dataType: 'string',
				responsive: true,
				options: [
					{
						label: __( 'Default', 'pm-blocks' ),
						value: '',
					},
					{
						label: __( 'Top', 'pm-blocks' ),
						value: 'start',
					},
					{
						label: __( 'Middle', 'pm-blocks' ),
						value: 'center',
					},
					{
						label: __( 'Bottom', 'pm-blocks' ),
						value: 'end',
					},
				],
				css: [
					{
						selector:
							typeof selector === 'object'
								? selector?.vAlign || selector?.default
								: selector,
						render: function ( value ) {
							if ( ! value ) {
								return '';
							}
							return `align-items: ${ value }`;
						},
					},
				],
			},

			{
				type: 'select',
				name: 'hAlign',
				label: __( 'Horizontal Align', 'pm-blocks' ),
				default: undefined,
				dataType: 'string',
				responsive: true,
				options: [
					{
						label: __( 'Default', 'pm-blocks' ),
						value: '',
					},
					{
						label: __( 'Center', 'pm-blocks' ),
						value: 'center',
					},
					{
						label: __( 'Start', 'pm-blocks' ),
						value: 'flex-start',
					},
					{
						label: __( 'End', 'pm-blocks' ),
						value: 'flex-end',
					},
					{
						label: __( 'Space between', 'pm-blocks' ),
						value: 'space-between',
					},
					{
						label: __( 'Space Around', 'pm-blocks' ),
						value: 'space-around',
					},
					{
						label: __( 'Space evenly', 'pm-blocks' ),
						value: 'space-evenly',
					},
				],
				css: [
					{
						selector:
							typeof selector === 'object'
								? selector?.hAlign || selector?.default
								: selector,
						render: function ( value ) {
							if ( ! value ) {
								return '';
							}
							return `justify-content: ${ value }`;
						},
					},
				],
			},
		],
	};
};

/**
 * Margin & Padding
 *
 * @param {String|Object} selector
 * @returns {Object}
 */
export const dimensions = ( selector = 'selector' ) => {
	return {
		type: 'panel',
		label: __( 'Dimensions', 'pm-blocks' ),
		open: false,
		fields: [
			{
				type: 'boxunit',
				name: 'padding',
				label: __( 'Padding', 'pm-blocks' ),
				default: undefined,
				dataType: 'object',
				responsive: true,
				props: {
					disableUnits: false,
				},
				css: [
					{
						selector:
							typeof selector === 'object'
								? selector?.padding || selector?.default
								: selector,
						render: function ( value ) {
							if ( ! value ) {
								return '';
							}
							if ( ! value.top ) {
								return '';
							}
							return `padding: ${ value.top } ${ value.right } ${ value.bottom } ${ value.left };`;
						},
					},
				],
			},

			{
				type: 'boxunit',
				name: 'margin',
				label: __( 'Margin', 'pm-blocks' ),
				default: undefined,
				dataType: 'object',
				responsive: true,
				props: {
					sides: [ 'top', 'bottom' ],
					min: -9999,
					inputProps: {
						min: -9999,
					},
				},
				css: [
					{
						selector:
							typeof selector === 'object'
								? selector?.margin || selector?.default
								: selector,
						render: function ( value ) {
							if ( ! value ) {
								return '';
							}
							if ( ! value.top ) {
								return '';
							}
							return `margin-top: ${ value.top }; margin-block-start: ${ value.top }; margin-block-end: ${ value.bottom }; margin-bottom: ${ value.bottom };`;
						},
					},
				],
			},
		],
	};
};

/**
 * Background styling
 *
 * @param {String} selector
 * @returns {Object}
 */
export const background = ( selector = 'selector' ) => {
	return {
		type: 'bg',
		name: 'bg',
		label: __( 'Background', 'pm-blocks' ),
		css: [
			{
				selector: selector,
				render: 'bg',
			},
		],
	};
};

/**
 * Border Styling
 *
 * @param {String} selector
 * @returns
 */
export const border = ( selector = 'selector' ) => {
	return {
		type: 'group',
		label: __( 'Border', 'pm-blocks' ),
		responsive: false,
		props: {
			variant: 'secondary',
		},
		fields: [
			{
				type: 'boxunit',
				name: 'borderWidth',
				label: __( 'Border Width', 'pm-blocks' ),
				responsive: true,
				css: [
					{
						selector: selector,
						render: function ( value, props ) {
							if ( ! value || typeof value !== 'object' ) {
								return '';
							}
							return `border-width: ${ value.top } ${ value.right } ${ value.bottom } ${ value.left }`;
						},
					},
				],
			},

			{
				type: 'select',
				name: 'style',
				label: __( 'Style', 'pm-blocks' ),
				options: [
					{
						label: __( 'none', 'pm-blocks' ),
						value: 'none',
					},
					{
						label: __( 'solid', 'pm-blocks' ),
						value: 'solid',
					},
					{
						label: __( 'dotted', 'pm-blocks' ),
						value: 'dotted',
					},
					{
						label: __( 'dashed', 'pm-blocks' ),
						value: 'dashed',
					},
					{
						label: __( 'double', 'pm-blocks' ),
						value: 'double',
					},
					{
						label: __( 'groove', 'pm-blocks' ),
						value: 'groove',
					},
					{
						label: __( 'ridge', 'pm-blocks' ),
						value: 'ridge',
					},
					{
						label: __( 'inset', 'pm-blocks' ),
						value: 'inset',
					},
					{
						label: __( 'outset', 'pm-blocks' ),
						value: 'outset',
					},
				],
				css: [
					{
						selector:
							typeof selector === 'object'
								? selector?.style || selector?.default
								: selector,
						render: function ( value, props ) {
							let newVal = value;
							if ( ! newVal || newVal === '' ) {
								if ( props?.attributes?.borderColor !== '' ) {
									newVal = 'solid';
								} else {
									return '';
								}
							}
							return `border-style: ${ value }`;
						},
					},
				],
			},

			{
				type: 'color',
				name: 'borderColor',
				label: __( 'Color', 'pm-blocks' ),
				css: [
					{
						selector:
							typeof selector === 'object'
								? selector?.borderColor || selector?.default
								: selector,
						render: function ( value ) {
							if ( ! value ) {
								return '';
							}

							return `border-color: ${ value }`;
						},
					},
				],
			},

			{
				type: 'boxunit',
				name: 'borderRadius',
				label: __( 'Border Radius', 'pm-blocks' ),
				default: undefined,
				dataType: 'object',
				responsive: true,
				props: {
					disableUnits: false,
				},
				css: [
					{
						selector:
							typeof selector === 'object'
								? selector?.borderRadius || selector?.default
								: selector,
						render: function ( value ) {
							if ( ! value || typeof value !== 'object' ) {
								return '';
							}

							return `border-radius: ${ value.top } ${ value.right } ${ value.bottom } ${ value.left };`;
						},
					},
				],
			},
		],
	};
};

/**
 * Link styling
 *
 * @param {String} selector
 * @returns
 */
export const link = ( selector = 'selector' ) => {
	return {
		type: 'group',
		label: __( 'Link', 'pm-blocks' ),
		fields: [
			// Start tabs
			{
				type: 'tabs',
				label: __( 'Tabs', 'pm-blocks' ),
				tabs: [
					{
						name: 'tab_normal',
						title: __( 'Normal', 'pm-blocks' ),
						fields: [
							{
								type: 'color',
								name: 'linkColor',
								label: __( 'Link Color', 'pm-blocks' ),
								default: '',
								responsive: false,
								css: [
									{
										selector: selector + ' a',
										render: function ( value ) {
											if ( ! value ) {
												return '';
											}

											return `color: ${ value };`;
										},
									},
								],
							},
						],
					},

					{
						name: 'tab_hover',
						title: __( 'Hover', 'pm-blocks' ),
						fields: [
							{
								type: 'color',
								name: 'linkHoverColor',
								label: __( 'Hover Color', 'pm-blocks' ),
								default: '',
								responsive: false,
								css: [
									{
										selector: selector + ' a:hover',
										render: function ( value ) {
											if ( ! value ) {
												return '';
											}
											return `color: ${ value };`;
										},
									},
								],
							},
						],
					},
				],
			},
			// end tabs
		],
	};
};

/**
 * All Styling
 *
 * @param {String} selector
 * @returns
 */
export const styling = ( selector = 'selector' ) => {
	return {
		type: 'panel',
		label: __( 'Styling', 'pm-blocks' ),
		open: false,
		fields: [
			{
				type: 'color',
				name: 'color',
				label: __( 'Text Color', 'pm-blocks' ),
				css: [
					{
						selector: selector,
						render: function ( value ) {
							if ( ! value ) {
								return '';
							}
							return `color: ${ value };`;
						},
					},
				],
			},

			link( selector ),
			border( selector ),
			background( selector ),
		],
	};
};
