export const isMatch = function (variation_attributes, attributes) {
	var match = true;
	for (var attr_name in variation_attributes) {
		if (variation_attributes.hasOwnProperty(attr_name)) {
			var val1 = variation_attributes[attr_name];
			var val2 = attributes[attr_name];

			if (
				val1 !== undefined &&
				val2 !== undefined &&
				val1.length !== 0 &&
				val2.length !== 0 &&
				val1 !== val2
			) {
				match = false;
			}
		}
	}
	return match;
};

export const cleanObj = (obj) => {
	for (var propName in obj) {
		if (obj[propName] === null || obj[propName] === undefined) {
			delete obj[propName];
		}
	}
	return obj;
};

export const findMatchingVariations = (variations, attributes) => {
	if (!Object.keys(attributes).length) {
		return variations;
	}
	const matching = [];
	for (let i = 0; i < variations.length; i++) {
		const variation = variations[i];
		if (isMatch(variation.attributes, attributes)) {
			matching.push(variation);
		}
	}
	return matching;
};

export const findActiveAttrOptions = (variations, currentAttrName) => {
	const activeAttrOptions = [];

	for (const num in variations) {
		if (typeof variations[num] !== "undefined") {
			const variationAttributes = variations[num].attributes;

			for (const attrName in variationAttributes) {
				if (attrName !== currentAttrName) {
					continue;
				}

				if (typeof activeAttrOptions[attrName] === "undefined") {
					activeAttrOptions[attrName] = [];
				}

				if (variationAttributes.hasOwnProperty(attrName)) {
					let attrVal = variationAttributes[attrName];
					if (variations[num].variation_is_active) {
						if (!activeAttrOptions.includes(attrVal)) {
							activeAttrOptions.push(attrVal);
						}
					}
				}
			}
		}
	}

	return activeAttrOptions;
};
