import { __ } from '@wordpress/i18n';

import { DropdownMenu } from '@wordpress/components';

import {
	Icon,
	desktop as iconDesktop,
	tablet as iconTablet,
	mobile as iconMobile,
} from '@wordpress/icons';

import { useSelect, useDispatch } from '@wordpress/data';

/**
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-viewport/
 *
 * @param {*} props
 * @returns
 */
const ResponsiveControl = ( props ) => {
	const { field, value, item, render } = props;

	if ( ! field.responsive ) {
		return render( field, value, item );
	}

	const getView = useSelect( ( select ) => {
		const { __experimentalGetPreviewDeviceType } = select(
			'core/edit-post'
		)
			? select( 'core/edit-post' )
			: false;
		return __experimentalGetPreviewDeviceType
			? __experimentalGetPreviewDeviceType()
			: false;
	} );
	const { __experimentalSetPreviewDeviceType: setView } = useDispatch(
		'core/edit-post'
	)
		? useDispatch( 'core/edit-post' )
		: false;

	let currentValue = null;
	let currentField = { ...field };

	switch ( getView ) {
		case 'tablet':
			currentField.name = field.name + '__tablet';
			break;
		case 'mobile':
			currentField.name = field.name + '__mobile';
			break;
		default:
	}

	currentValue = item[ currentField.name ] || null;

	const controls = {
		Desktop: {
			title: __( 'Desktop', 'pm-blocks' ),
			icon: iconDesktop,
			isActive: 'Desktop' != getView,
			onClick: () => {
				setView( 'Desktop' );
			},
		},
		Tablet: {
			title: __( 'Tablet', 'pm-blocks' ),
			icon: iconTablet,
			isActive: 'Tablet' != getView,
			onClick: () => {
				setView( 'Tablet' );
			},
		},
		Mobile: {
			title: __( 'Mobile', 'pm-blocks' ),
			icon: iconMobile,
			isActive: 'Mobile' != getView,
			onClick: () => {
				setView( 'Mobile' );
			},
		},
	};

	return (
		<div className="pm-responsive">
			<DropdownMenu
				className="pm-responsive-switcher"
				icon={ controls[ getView ]?.icon || iconDesktop }
				controls={ Object.values( controls ) }
				toggleProps={ {
					variant: 'link',
				} }
			/>
			{ render( currentField, currentValue, item ) }
		</div>
	);
};

export default ResponsiveControl;
