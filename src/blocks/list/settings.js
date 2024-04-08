import { __ } from '@wordpress/i18n';

const settings = [
	{
		type: 'panel',
		label: __( 'Content', 'pm-blocks' ),
		open: true,
		fields: [
			{
				label: __( 'Items', 'pm-blocks' ),
				type: 'repeater',
				name: 'items',
				fields: [
					{
						type: 'text',
						name: 'title',
						label: __( 'Title', 'pm-blocks' ),
						default: __( 'Item title', 'pm-blocks' ),
					},
					{
						type: 'text',
						label: __( 'Subtitle', 'pm-blocks' ),
						name: 'subtitle',
						default: __( 'Item subtitle', 'pm-blocks' ),
					},
					{
						type: 'textarea',
						name: 'desc',
						label: __( 'Description', 'pm-blocks' ),
						default: __( 'Item description', 'pm-blocks' ),
					},
				],
			},

			{
				type: 'range',
				name: 'columns',
				label: __( 'Columns', 'pm-blocks' ),
				default: 1,
				responsive: true,
				props: {
					allowReset: false,
					min: 1,
					max: 6,
					step: 1,
				},
			},
		],
	},
];

export default settings;
