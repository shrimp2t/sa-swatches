import classnames from 'classnames';

// https://github.com/WordPress/gutenberg/issues/8655#issuecomment-940948868
// https://developer.wordpress.org/block-editor/reference-guides/data/data-core-editor/

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useEffect, useMemo, useContext, Fragment } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { getBlockType } from '@wordpress/blocks';
import { useInstanceId } from '@wordpress/compose';
import { useSelect, subscribe, select } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { BlockList } from '@wordpress/block-editor';
import uniqid from 'uniqid';

import Settings from '../components/settings';

import { InspectorControls } from '@wordpress/block-editor';

/**
 * Internal dependencies.
 */

import './editor.scss';
import './style.scss';

const addSettingsPanel = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const block = getBlockType( props.name );
		if ( ! block.pmSettings ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<Fragment>
				<InspectorControls>
					<Settings { ...props } />
				</InspectorControls>
				<BlockEdit { ...props } />
			</Fragment>
		);
	};
}, 'applyAllControls' );

addFilter( 'editor.BlockEdit', 'pm-blocks/settings', addSettingsPanel );

function addAttributes( settings ) {
	const { pmSettings } = settings;
	let cssFields = {};
	let autoAttributes = {};
	let hasSupportCSS = false;
	const findCssFields = ( fields ) => {
		if ( ! Array.isArray( fields ) ) {
			return;
		}
		fields.map( ( field, index ) => {
			if ( [ 'panel', 'group' ].includes( field.type ) ) {
				return findCssFields( field.fields );
			}
			if ( [ 'tabs' ].includes( field.type ) ) {
				field.tabs.map( ( tab ) => {
					findCssFields( tab.fields );
				} );
				return;
			}

			if ( typeof field.dataType !== 'undefined' ) {
				autoAttributes[ field.name ] = {
					type: field.dataType,
					default: field.default || null,
				};
			} else {
				switch ( field.type ) {
					case 'button':
						// Skip
						return;
						break;
					case 'repeater':
						autoAttributes[ field.name ] = {
							type: 'array',
							default: field.default || [],
						};

						break;
					case 'bg':
					case 'background':
					case 'border':
						autoAttributes[ field.name ] = {
							type: 'object',
							default: field.default || undefined,
						};
						break;
					case 'image':
						autoAttributes[ field.name ] = {
							type: 'object',
							default: field.default || {},
						};
						break;
					case 'range':
						autoAttributes[ field.name ] = {
							type: 'number',
							default: field.default || null,
						};
						break;
					default:
						autoAttributes[ field.name ] = {
							type: 'string',
							default: field.default || null,
						};
						break;
				}
			}

			if ( field.name === 'bid' ) {
				autoAttributes[ field.name ] = {
					type: 'string',
					default: 'bid-' + new Date().getTime(),
				};
			}

			if ( field.responsive ) {
				autoAttributes[ field.name + '__tablet' ] = {
					...autoAttributes[ field.name ],
				};
				autoAttributes[ field.name + '__mobile' ] = {
					...autoAttributes[ field.name ],
				};
			}

			if ( field.css && field.css.length ) {
				hasSupportCSS = true;
				cssFields[ field.name ] = field.css;
				if ( field.responsive ) {
					cssFields[ field.name + '__tablet' ] = field.css;
					cssFields[ field.name + '__mobile' ] = field.css;
				}
			}
		} );
	};

	if ( typeof settings.attributes !== 'object' ) {
		settings.attributes = {};
	}

	if ( pmSettings && pmSettings.length ) {
		findCssFields( pmSettings );

		console.log( 'AUTO FIELDs', autoAttributes );
		if ( hasSupportCSS ) {
			settings.hasSupportCSS = true;
			settings.cssFields = cssFields;
			settings.attributes = Object.assign(
				settings.attributes,
				autoAttributes
			);
		}
	}

	if ( hasSupportCSS ) {
		settings.attributes = Object.assign( settings.attributes, {
			pmId: {
				type: 'string',
				default: '',
			},
			pm_style: {
				type: 'string',
				default: '',
			},
		} );
	}

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'pm-blocks/css-attributes',
	addAttributes
);

/**
 * https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/style.js
 */
const withClientIdClassName = createHigherOrderComponent(
	( BlockListBlock ) => {
		return ( props ) => {
			const { clientId } = props;

			const postType = useSelect(
				( select ) => select( 'core/editor' ).getCurrentPostType(),
				[]
			);

			const [ meta, setMeta ] = useEntityProp(
				'postType',
				postType,
				'meta'
			);

			const metaValue = meta?.pm_blocks_css || {};
			const updateMetaValue = ( id, newValue ) => {
				let newMetaValue = { ...metaValue, [ id ]: newValue };
				console.log( 'New Meta', newMetaValue );
				setMeta( { ...meta, pm_blocks_css: newMetaValue } );
			};

			const block = getBlockType( props.name );
			if ( ! block.hasSupportCSS ) {
				return <BlockListBlock { ...props } />;
			}

			const { cssFields = {} } = block;
			const cssFieldKeys = Object.keys( cssFields );
			const { pmId, pm_style } = props.attributes;

			let cssEffectValues = [];
			cssFieldKeys.map( ( key ) => {
				cssEffectValues.push( props.attributes[ key ] || null );
			} );

			const devices = {
				tablet: '780px',
				mobile: '560px',
			};

			const forDesktop = ( $code ) => {
				return `${ $code }`;
				// return `@media (min-width: ${devices.tablet}) { ${$code} }`
			};

			const forTablet = ( $code ) => {
				return `@media (min-width: ${ devices.mobile }) and (max-width: ${ devices.tablet }) { ${ $code } }`;
			};

			const forMobile = ( $code ) => {
				return `@media (max-width: ${ devices.mobile }) { ${ $code } }`;
			};

			const renderBackground = ( values, blockProps ) => {
				const {
					type: bgType,
					color,
					gradient,
					image,
					imagePos = {},
					cover,
					repeat,
					attachment,
				} = values;

				switch ( bgType ) {
					case 'gradient':
						if ( gradient ) {
							return `background: ${ gradient };`;
						} else {
							return ``;
						}
						break;
					case 'image':
						let code = '';
						if ( color ) {
							code += `background-color: ${ color } ;`;
						}
						if ( image && image.url ) {
							code += `background-image: url('${ image.url }');`;
							if ( cover ) {
								code += `background-size: ${ cover };`;
							}
							if ( repeat ) {
								code += `background-repeat: ${ repeat };`;
							}
							if ( attachment ) {
								code += `background-attachment: ${ attachment };`;
							}
							if ( imagePos && imagePos.x && imagePos.y ) {
								code += `background-position: ${
									imagePos.x * 100
								}% ${ imagePos.y * 100 }%;`;
							}
						}

						return code;
						break;
					default:
						if ( color ) {
							return `background-color: ${ color };`;
						} else {
							return ``;
						}
						break;
				}
			};

			useEffect( () => {
				let cssAttrs = {};
				const tabletKey = '__tablet';
				const mobileKey = '__mobile';

				let ki = 0;
				for ( let key of Object.keys( cssFields ) ) {
					const cssItems = cssFields[ key ];
					const value = props.attributes[ key ] || null;
					if ( ! value ) {
						continue;
					}
					for ( let i = 0; i < cssItems.length; i++ ) {
						const { selector, render } = cssItems[ i ];
						const cssKey = `_${ ki }_${ i }_${ key }`;
						let cssValue;
						if ( render === 'bg' || render === 'background' ) {
							cssValue = renderBackground( value, props );
						} else {
							cssValue = render( value, props );
						}

						if ( typeof cssValue === 'string' ) {
							cssAttrs[ cssKey ] = { selector, value: cssValue };
						}
						ki++;
					}
				}

				let cssElements = {
					desktop: {},
					tablet: {},
					mobile: {},
				};

				const selectorRegex = new RegExp( 'selector', 'g' );
				// Group CSS by selector
				for ( let key of Object.keys( cssAttrs ) ) {
					const { selector, value } = cssAttrs[ key ];
					if ( ! selector || ! value ) {
						continue;
					}
					let deviceType = 'desktop';
					if (
						tabletKey ===
						key.substring( key.length - tabletKey.length )
					) {
						deviceType = 'tablet';
					}
					if (
						mobileKey ===
						key.substring( key.length - mobileKey.length )
					) {
						deviceType = 'mobile';
					}

					const renderSelector = selector.replace(
						selectorRegex,
						`.${ 'pm-block-' + pmId }`
					);
					if (
						typeof cssElements[ deviceType ][ selector ] ===
						'undefined'
					) {
						cssElements[ deviceType ][ selector ] = {
							selector: renderSelector,
							props: [],
						};
					}

					if ( value ) {
						// console.log( 'deviceType', deviceType, selector, value );
						cssElements[ deviceType ][ selector ].props.push(
							value.trim()
						);
					}
				} // end loop cssAttrs

				// console.log( 'cssFields', cssFields );
				// console.log( 'cssAttrs', cssAttrs );
				// console.log( 'cssElements', cssElements );

				// Render to CSS
				let devicesCSS = {
					desktop: '',
					tablet: '',
					mobile: '',
				};
				[ 'desktop', 'tablet', 'mobile' ].map( ( deviceType ) => {
					let stringCSS = '';
					for ( let key of Object.keys(
						cssElements[ deviceType ]
					) ) {
						let { selector, props } =
							cssElements[ deviceType ][ key ];
						if ( props.length ) {
							stringCSS += `${ selector }{ ${ props.join(
								'; '
							) } }`;
						}
					}

					if ( stringCSS.length ) {
						switch ( deviceType ) {
							case 'tablet':
								devicesCSS[ deviceType ] =
									forTablet( stringCSS );
								break;
							case 'mobile':
								devicesCSS[ deviceType ] =
									forMobile( stringCSS );
								break;
							default:
								devicesCSS[ deviceType ] =
									forDesktop( stringCSS );
						}
					}
				} );

				let allCss = Object.values( devicesCSS ).join( ' ' ).trim();

				// updateMetaValue( clientId, allCss );

				if ( ! allCss ) {
					props.setAttributes( { pm_style: undefined } );
				} else {
					props.setAttributes( { pm_style: allCss } );
					if ( ! pmId ) {
						props.setAttributes( { pmId: uniqid.time() } );
					}
				}
			}, [ ...cssEffectValues, pmId, clientId ] );

			const renderCSS = useMemo( () => {
				return <>{ pm_style ? <style>{ pm_style }</style> : <></> }</>;
			}, [ pm_style ] );

			return (
				<>
					{ renderCSS }
					<BlockListBlock
						{ ...props }
						className={ 'pm-block-' + pmId }
					/>
				</>
			);
		};
	},
	'useInstanceId'
);

addFilter(
	'editor.BlockListBlock',
	'pm-blocks/custom-classes',
	withClientIdClassName
);

/**
 * @see https://jeffreycarandang.com/extending-gutenberg-core-blocks-with-custom-attributes-and-controls/
 */

function applySaveExtraClass( extraProps, blockType, attributes ) {
	const { pmId, pm_style } = attributes;
	if ( pm_style ) {
		const unqClass = 'pm-block-' + pmId;
		if ( ! extraProps.className.includes( unqClass ) ) {
			extraProps.className = classnames( extraProps.className, unqClass );
		}
	}
	return extraProps;
}

addFilter(
	'blocks.getSaveContent.extraProps',
	'pm-blocks/applyExtraClass',
	applySaveExtraClass
);

// Deletec when block added / Removed
const getBlockList = select( 'core/editor' ).getBlocks;
let blockList = getBlockList().map( ( block ) => block.clientId );

const unsubscribe = subscribe( () => {
	// Get new blocks client ids
	const newBlockList = getBlockList().map( ( block ) => {
		//  console.log( 'Block: ', block );
		return block.clientId;
	} );

	// Compare lengths
	const blockListChanged = newBlockList.length !== blockList.length;
	if ( ! blockListChanged ) {
		return;
	}

	// Block Added
	if ( newBlockList > blockList ) {
		// Get added blocks
		const added = newBlockList.filter( ( x ) => ! blockList.includes( x ) );
		console.log( 'added', added );
	} else if ( newBlockList < blockList ) {
		// Get removed blocks
		const removed = blockList.filter(
			( x ) => ! newBlockList.includes( x )
		);
		console.log( 'removed', removed );
	}

	// Update current block list with the new blocks for further comparison
	blockList = newBlockList;
} );

// Later, if necessary...
// unsubscribe();

// function addBlockSettings( settings, name ) {
//     // if ( name !== 'core/list' ) {
//     //     return settings;
//     // }

// 	console.log( 'block settings', settings );

//     return settings;
// }

// wp.hooks.addFilter(
//     'blocks.registerBlockType',
//     'pm-blocks/class-names/list-block',
//     addBlockSettings
// );
