/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import {
	Button,
	TextControl,
	TextareaControl,
	ColorPalette,
	ToggleControl,
	BaseControl,
	Dropdown,
	ColorIndicator,
	SelectControl,
	GradientPicker,
	PanelBody,
	TabPanel,
	RangeControl,
	__experimentalUnitControl as UnitControl,
	__experimentalBoxControl as BoxControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';

import { Icon, edit as iconEdit, close as iconClose } from '@wordpress/icons';

import Conditional from './conditional';
import Repeater from './repeater';
import Image from './image';
import Color from './color';
import Responsive from './responsive';
import Background from './background';
import Border from './border';

const FieldsRender = ( props ) => {
	const {
		onItemValueChange,
		item = {}, // Current item values
		fields = [],
	} = props;

	return (
		<div class="pm-fields-render">
			{ fields.map( ( field, fi ) => {
				const value = item[ field.name ] || undefined;

				if ( field.isHidden ) {
					return;
				}
				const fieldProps = field.props || {};
				switch ( field.type ) {
					case 'panel':
						return (
							<Conditional
								field={ field }
								showWhen={ field.showWhen }
								values={ item }
							>
								<PanelBody
									title={ field.label }
									initialOpen={ field.open || false }
								>
									<FieldsRender
										{ ...props }
										onItemValueChange={ onItemValueChange }
										fields={ field.fields }
										item={ item }
									/>
								</PanelBody>
							</Conditional>
						);
						break;
					case 'tabs':
						return (
							<Conditional
								field={ field }
								showWhen={ field.showWhen }
								values={ item }
							>
								<TabPanel
									className="pm-tabs-panel"
									activeClass="active-tab"
									tabs={ field.tabs }
									initialTabName={ field.tabs[ 0 ].name }
								>
									{ ( tab ) => {
										const tabProps = tab.props || {};
										return (
											<FieldsRender
												{ ...tabProps }
												onItemValueChange={
													onItemValueChange
												}
												fields={ tab.fields }
												item={ item }
											/>
										);
									} }
								</TabPanel>
							</Conditional>
						);
						break;
					case 'group':
						return (
							<Conditional
								field={ field }
								showWhen={ field.showWhen }
								values={ item }
							>
								<BaseControl label={ field.label }>
									<Dropdown
										className="pm-popver-container"
										contentClassName="pm-popver-content"
										position="bottom right"
										__experimentalIsRenderedInSidebar={
											true
										}
										renderToggle={ ( {
											isOpen,
											onToggle,
										} ) => (
											<Button
												variant={
													isOpen
														? 'secondary'
														: 'primary'
												}
												onClick={ onToggle }
												isSmall
												aria-expanded={ isOpen }
											>
												{
													<Icon
														icon={
															isOpen
																? iconClose
																: iconEdit
														}
													/>
												}
											</Button>
										) }
										renderContent={ () => {
											return (
												<FieldsRender
													{ ...props }
													onItemValueChange={
														onItemValueChange
													}
													fields={ field.fields }
													item={ item }
												/>
											);
										} }
									/>
								</BaseControl>
							</Conditional>
						);
						break;
					case 'repeater':
						return (
							<Conditional
								field={ field }
								showWhen={ field.showWhen }
								values={ item }
							>
								<BaseControl label={ field.label }>
									<Repeater
										{ ...props }
										field={ field }
										attributes={ {
											items: item[ field.name ] || [],
										} }
									/>
								</BaseControl>
							</Conditional>
						);
						break;
					case 'background':
					case 'bg':
						return (
							<Conditional
								field={ field }
								showWhen={ field.showWhen }
								values={ item }
							>
								<BaseControl label={ field.label }>
									<Dropdown
										className="pm-popver-container"
										contentClassName="pm-popver-content"
										position="bottom right"
										__experimentalIsRenderedInSidebar={
											true
										}
										renderToggle={ ( {
											isOpen,
											onToggle,
										} ) => (
											<Button
												variant={
													isOpen
														? 'secondary'
														: 'primary'
												}
												onClick={ onToggle }
												isSmall
												aria-expanded={ isOpen }
											>
												{
													<Icon
														icon={
															isOpen
																? iconClose
																: iconEdit
														}
													/>
												}
											</Button>
										) }
										renderContent={ () => {
											return (
												<Background
													{ ...props }
													field={ field }
													attributes={ {
														values:
															item[
																field.name
															] || {},
													} }
												/>
											);
										} }
									/>
								</BaseControl>
							</Conditional>
						);
						break;
					case 'border':
						return (
							<Conditional
								field={ field }
								showWhen={ field.showWhen }
								values={ item }
							>
								<BaseControl label={ field.label }>
									<Dropdown
										className="pm-popver-container"
										contentClassName="pm-popver-content"
										position="bottom center"
										__experimentalIsRenderedInSidebar={
											true
										}
										renderToggle={ ( {
											isOpen,
											onToggle,
										} ) => (
											<Button
												variant={
													isOpen
														? 'secondary'
														: 'primary'
												}
												onClick={ onToggle }
												isSmall
												aria-expanded={ isOpen }
											>
												{
													<Icon
														icon={
															isOpen
																? iconClose
																: iconEdit
														}
													/>
												}
											</Button>
										) }
										renderContent={ () => {
											return (
												<Border
													{ ...props }
													field={ field }
													attributes={ {
														values:
															item[
																field.name
															] || {},
													} }
												/>
											);
										} }
									/>
								</BaseControl>
							</Conditional>
						);
						break;
					case 'button':
						return (
							<Conditional
								field={ field }
								showWhen={ field.showWhen }
								values={ item }
							>
								<Button
									{ ...fieldProps }
									onClick={ () => {
										if ( field.onClick ) {
											// onItemValueChange(field.name, value, item._index)
											field.onClick(
												field,
												value,
												onItemValueChange,
												item
											);
										}
									} }
								>
									{ field.label }
								</Button>
							</Conditional>
						);
						break;
					case 'text':
						return (
							<Conditional
								field={ field }
								showWhen={ field.showWhen }
								values={ item }
							>
								<Responsive
									field={ field }
									value={ value }
									item={ item }
									render={ (
										DeviceField,
										deviceValue,
										deviceItem
									) => (
										<TextControl
											{ ...fieldProps }
											label={ DeviceField.label }
											value={ deviceValue }
											onChange={ ( newDeviceValue ) => {
												onItemValueChange(
													DeviceField.name,
													newDeviceValue,
													deviceItem._index
												);
											} }
										/>
									) }
								/>
							</Conditional>
						);
						break;
					case 'number':
						return (
							<Conditional
								field={ field }
								showWhen={ field.showWhen }
								values={ item }
							>
								<Responsive
									field={ field }
									value={ value }
									item={ item }
									render={ (
										DeviceField,
										deviceValue,
										deviceItem
									) => (
										<NumberControl
											{ ...fieldProps }
											label={ DeviceField.label }
											value={ deviceValue }
											onChange={ ( newDeviceValue ) => {
												onItemValueChange(
													DeviceField.name,
													newDeviceValue,
													deviceItem._index
												);
											} }
										/>
									) }
								/>
							</Conditional>
						);
						break;
					case 'textarea':
						return (
							<Conditional
								field={ field }
								showWhen={ field.showWhen }
								values={ item }
							>
								<TextareaControl
									{ ...fieldProps }
									label={ field.label }
									value={ value }
									onChange={ ( value ) => {
										onItemValueChange(
											field.name,
											value,
											item._index
										);
									} }
								/>
							</Conditional>
						);
						break;

					case 'unit':
						return (
							<Conditional
								field={ field }
								showWhen={ field.showWhen }
								values={ item }
							>
								<Responsive
									field={ field }
									value={ value || {} }
									item={ item }
									render={ (
										DeviceField,
										deviceValue,
										deviceItem
									) => (
										<BaseControl label={ field.label }>
											<UnitControl
												{ ...fieldProps }
												value={ deviceValue || {} }
												onChange={ (
													newDeviceValue
												) => {
													onItemValueChange(
														DeviceField.name,
														newDeviceValue,
														deviceItem._index
													);
												} }
											/>
										</BaseControl>
									) }
								/>
							</Conditional>
						);
						break;
					case 'boxunit':
						return (
							<Conditional
								field={ field }
								showWhen={ field.showWhen }
								values={ item }
							>
								<Responsive
									field={ field }
									value={ value }
									item={ item }
									render={ (
										DeviceField,
										deviceValue,
										deviceItem
									) => (
										<div className="boxunit-inner">
											<BoxControl
												allowReset={ false }
												{ ...fieldProps }
												label={ field.label }
												values={ deviceValue || {} }
												onChange={ (
													newDeviceValue
												) => {
													onItemValueChange(
														DeviceField.name,
														newDeviceValue,
														deviceItem._index
													);
												} }
											/>
										</div>
									) }
								/>
							</Conditional>
						);
						break;

					case 'range':
						return (
							<Conditional
								field={ field }
								showWhen={ field.showWhen }
								values={ item }
							>
								<Responsive
									field={ field }
									value={ value }
									item={ item }
									render={ (
										DeviceField,
										deviceValue,
										deviceItem
									) => (
										<BaseControl label={ field.label }>
											<RangeControl
												{ ...fieldProps }
												value={ deviceValue }
												onChange={ (
													newDeviceValue
												) => {
													onItemValueChange(
														DeviceField.name,
														newDeviceValue,
														deviceItem._index
													);
												} }
											/>
										</BaseControl>
									) }
								/>
							</Conditional>
						);
						break;
					case 'image':
						return (
							<Conditional
								field={ field }
								showWhen={ field.showWhen }
								values={ item }
							>
								<BaseControl label={ field.label }>
									<div>
										<Image
											label={ field.label }
											value={ value }
											focalPointBg={
												field.focalPointBg
													? true
													: false
											}
											attributes={ {
												media: value,
												focalPoint:
													item[
														field.name + 'Pos'
													] || {},
											} }
											onChange={ ( media ) => {
												onItemValueChange(
													field.name,
													{
														id: media.id,
														url: media.url,
													},
													item._index
												);
											} }
											onFocalPointChange={ (
												newValue
											) => {
												onItemValueChange(
													field.name + 'Pos',
													newValue,
													item._index
												);
											} }
										/>
									</div>
								</BaseControl>
							</Conditional>
						);
						break;
					case 'color':
						return (
							<Conditional
								field={ field }
								showWhen={ field.showWhen }
								values={ item }
							>
								<Color
									label={ field.label }
									field={ field }
									value={ value }
									onChange={ ( newValue ) => {
										onItemValueChange(
											field.name,
											newValue,
											item._index
										);
									} }
									onClear={ () => {
										onItemValueChange(
											field.name,
											'',
											item._index
										);
									} }
								/>
							</Conditional>
						);
						break;
					case 'gradient':
						return (
							<Conditional
								field={ field }
								showWhen={ field.showWhen }
								values={ item }
							>
								<BaseControl label={ field.label }>
									<GradientPicker
										value={ value }
										onChange={ ( newValue ) => {
											onItemValueChange(
												field.name,
												newValue,
												item._index
											);
										} }
									/>
								</BaseControl>
							</Conditional>
						);
						break;
					case 'toggle':
					case 'checkbox':
						return (
							<Conditional
								field={ field }
								showWhen={ field.showWhen }
								values={ item }
							>
								<Responsive
									field={ field }
									value={ value }
									item={ item }
									render={ (
										DeviceField,
										deviceValue,
										deviceItem
									) => (
										<ToggleControl
											label={ field.label }
											help={
												value
													? field.help
														? field.help.checked
														: ''
													: field.help
													? field.help.uncheck
													: ''
											}
											checked={ deviceValue }
											onChange={ () => {
												onItemValueChange(
													DeviceField.name,
													! deviceValue,
													deviceItem._index
												);
											} }
										/>
									) }
								/>
							</Conditional>
						);
						break;
					case 'select':
					case 'dropdown':
						return (
							<Conditional
								field={ field }
								showWhen={ field.showWhen }
								values={ item }
							>
								<Responsive
									field={ field }
									value={ value }
									item={ item }
									render={ (
										DeviceField,
										deviceValue,
										deviceItem
									) => (
										<SelectControl
											label={ field.label }
											value={ deviceValue }
											options={ field.options || [] }
											onChange={ ( deviceValue ) => {
												onItemValueChange(
													DeviceField.name,
													deviceValue,
													deviceItem._index
												);
											} }
										/>
									) }
								/>
							</Conditional>
						);
						break;
				}
			} ) }
		</div>
	);
};

export default FieldsRender;
