const checkConditions = ( conditions, values ) => {
	let show = true;

	if ( ! conditions || ! conditions.length ) {
		return show;
	}

	for ( let i = 0; i < conditions.length; i++ ) {
		const condition = conditions[ i ];
		const { value = false, name = false, operator = false } = condition;
		if ( ! name ) {
			return false;
		}
		const currentKeyValue = values[ name ] ? values[ name ] : false;
		switch ( operator ) {
			case '>':
			case 'gt':
				show = currentKeyValue > value;
				break;
			case '>=':
			case 'gte':
				show = currentKeyValue >= value;
				break;
			case '<':
			case 'lt':
				show = currentKeyValue < value;
				break;
			case '=<':
			case 'lte':
				show = currentKeyValue <= value;
				break;
			case '=':
			case '==':
			case '===':
			case 'eq':
				show = currentKeyValue === value;
				break;
			case 'in':
			case 'exists':
				show = false;
				if ( Array.isArray( value ) ) {
					show = value.includes( currentKeyValue );
				}
				break;
			case 'not_in':
			case 'notin':
				show = false;
				if ( Array.isArray( value ) ) {
					show = ! value.includes( currentKeyValue );
				}
				break;
			default:
				show = currentKeyValue === value;
				break;
		}
		if ( ! show ) {
			return false;
		}
	}

	return show;
};

const Conditional = ( props ) => {
	const { showWhen = [], values = {}, field } = props;
	let show = checkConditions( showWhen, values );
	let classnames = [];

	if ( 'panel' !== field.type ) {
	}

	classnames.push( 'pm-field-item' );

	classnames.push( 'pm-field-type-' + field.type );
	if ( field.isHalf ) {
		classnames.push( 'is-half' );
	}

	if ( field.isHalfEnd ) {
		classnames.push( 'is-half-end' );
	}

	if ( ! show ) {
		return <></>;
	}

	return <div className={ classnames.join( ' ' ) }>{ props.children }</div>;
};

export default Conditional;
