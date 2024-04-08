import { __ } from '@wordpress/i18n';

const settings = [
	{
		type: 'panel',
		label: __( 'Content', 'pm-blocks' ),
		open: true,
		fields: [
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
