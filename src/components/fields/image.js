import { __ } from '@wordpress/i18n';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';

import { Button, FocalPointPicker } from '@wordpress/components';

import { withSelect } from '@wordpress/data';

const Image = ( props ) => {
	const {
		attributes,
		onChange = ( selectedMedia ) => {},
		focalPointBg = false,
		onFocalPointChange = () => {},
	} = props;

	const {
		media,
		focalPoint = {
			x: 0.5,
			y: 0.5,
		},
	} = attributes;

	const onSelectMedia = ( selectedMedia ) => {
		onChange( selectedMedia );
	};
	const onRemoveMedia = () => {
		onChange( {
			id: '',
			url: '',
		} );
	};

	return (
		<>
			{ media && media.url && (
				<>
					{ focalPointBg && (
						<FocalPointPicker
							url={ media.url }
							// dimensions={dimensions}
							value={ focalPoint }
							onChange={ ( focalPoint ) => {
								onFocalPointChange( focalPoint );
							} }
						/>
					) }
					{ ! focalPointBg && (
						<img
							alt={ __( 'Edit image' ) }
							title={ __( 'Edit image' ) }
							className={ 'edit-image-preview' }
							src={ media.url }
						/>
					) }
				</>
			) }
			<MediaUploadCheck>
				<MediaUpload
					title={ __( 'Replace image', 'pm-blocks' ) }
					value={ media ? media.id : undefined }
					onSelect={ onSelectMedia }
					allowedTypes={ [ 'image' ] }
					render={ ( { open } ) => (
						<>
							<Button onClick={ open } isDefault isSmall>
								{ media && media.id && media.url
									? __( 'Change Image', 'pm-blocks' )
									: __( 'Upload Image', 'pm-blocks' ) }
							</Button>

							{ media && media.id && media.url && (
								<Button
									onClick={ onRemoveMedia }
									isDefault
									isSmall
								>
									{ __( 'Remove', 'pm-blocks' ) }
								</Button>
							) }
						</>
					) }
				/>
			</MediaUploadCheck>
		</>
	);
};

export default withSelect( ( select, props ) => {
	const { attributes } = props;
	const { media = {} } = attributes;

	return { media: media.id ? select( 'core' ).getMedia( media.id ) : media };
} )( Image );
