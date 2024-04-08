import { __ } from '@wordpress/i18n';
import {
	Button,
	ColorPalette,
	BaseControl,
	Dropdown,
	ColorIndicator,
} from '@wordpress/components';

import { useSetting } from '@wordpress/block-editor';

const Color = ( props ) => {
	const {
		attributes,
		onChange = () => {},
		onClear,
		item = {},
		field,
		value,
	} = props;

	/**
	 * @see https://github.com/WordPress/gutenberg/blob/2747474eec0b0990009f12d0dc6e23d64fef7ec8/packages/edit-site/src/components/global-styles/palette.js
	 */
	const colorsTheme = useSetting( 'color.palette.theme' );
	const colorsCustom = useSetting( 'color.palette.custom' );
	const colorsDefault = useSetting( 'color.palette.default' );

	const colors = useSetting( 'color' );

	return (
		<>
			<BaseControl
				className="pm-block-color-wrapper"
				label={ field.label }
			>
				<div className="pm-block-color-value">
					<Dropdown
						className="pm-popver-container"
						contentClassName="pm-popver-content"
						position="top right"
						__experimentalIsRenderedInSidebar={ true }
						renderToggle={ ( { isOpen, onToggle } ) => (
							<ColorIndicator
								onClick={ onToggle }
								colorValue={ value }
							/>
						) }
						renderContent={ () => (
							<>
								<ColorPalette
									colors={ [] }
									enableAlpha={ true }
									value={ value }
									__experimentalIsRenderedInSidebar={ true }
									__experimentalHasMultipleOrigins={ true }
									clearable={ false }
									onChange={ onChange }
								/>

								{ colorsTheme && (
									<BaseControl label={ 'Default' }>
										<ColorPalette
											colors={ colorsDefault || [] }
											value={ value }
											disableCustomColors={ true }
											clearable={ false }
											onChange={ onChange }
										/>
									</BaseControl>
								) }
								{ colorsTheme && (
									<BaseControl label={ 'Theme' }>
										<ColorPalette
											colors={ colorsTheme || [] }
											value={ value }
											clearable={ false }
											disableCustomColors={ true }
											onChange={ onChange }
										/>
									</BaseControl>
								) }
								{ colorsCustom && (
									<BaseControl label={ 'Custom' }>
										<ColorPalette
											colors={ colorsCustom || [] }
											value={ value }
											clearable={ false }
											disableCustomColors={ true }
											onChange={ onChange }
										/>
									</BaseControl>
								) }

								<Button
									onClick={ onClear }
									variant="secondary"
									isSmall={ true }
								>
									{ __( 'Clear', 'pm-blocks' ) }
								</Button>
							</>
						) }
					/>
				</div>
			</BaseControl>
		</>
	);
};

export default Color;
