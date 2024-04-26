import "./swatches.scss";

import req from "../commo/req";
import { render, useState, useMemo, useEffect, createContext } from "@wordpress/element";
import { AppContext, useAppContext } from "./components/context";

console.log('__DSADSA___');


const Option = ({ option, attrName }) => {
  const { setSelected, defaults, selected } = useAppContext();
  const onCLick = (value) => {
    setSelected(prev => {
      if (prev?.[attrName] === value) {
        return { ...prev, [attrName]: null, __t: Date.now(), __c: attrName };

      }
      return { ...prev, [attrName]: value, __t: Date.now(), __c: attrName }
    })
  }

  let selectedVal = typeof selected[attrName] !== 'undefined' ? selected?.[attrName] : defaults?.[attrName];

  const classes = ['sa_attr_option'];
  if (selectedVal === option?.slug) {
    classes.push('sa_selected');
  };

  return <div className={classes.join(' ')} onClick={() => onCLick(option?.slug)}>{option?.name}</div>
}



const AttrOptions = ({ attr }) => {
  return <div className="sa_attr_options">
    {attr?.options.map(option => {
      return <Option key={[attr.id, option.id]} attrName={attr.name} attrid={attr.id} option={option} />
    })}
  </div>
}



const AttrItem = ({ attr }) => {

  return <div className="sa_attr">
    <div className="sa_attr_label">{attr?.label}</div>
    <div className="sa_attr_values">
      <AttrOptions attr={attr} />
    </div>
  </div>

}

// Ajax Search find_matching_product_variation

const isMatch = function (variation_attributes, attributes) {
  var match = true;
  for (var attr_name in variation_attributes) {
    if (variation_attributes.hasOwnProperty(attr_name)) {
      var val1 = variation_attributes[attr_name];
      var val2 = attributes[attr_name];

      if (val1 !== undefined && val2 !== undefined && val1.length !== 0 && val2.length !== 0 && val1 !== val2) {
        console.log('COMpare__', attr_name, val1, val2);
        match = false;
      }
    }
  }
  return match;
};


function cleanObj(obj) {
  for (var propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
  return obj
}

const findMatchingVariations = (variations, attributes) => {
  console.log('findMatchingVariations_attrs', attributes);
  if (!Object.keys(attributes).length) {
    return variations;
  }
  var matching = [];
  for (var i = 0; i < variations.length; i++) {
    var variation = variations[i];

    if (isMatch(variation.attributes, attributes)) {
      matching.push(variation);
    }
  }
  return matching;
};

const App = ({ pid, variants }) => {
  const [attrs, setAttrs] = useState({});
  const [selected, setSelected] = useState({});
  const [defaults, setDefaults] = useState({});
  const [availableAttrs, setAvailableAttrs] = useState([]);
  const [matches, setMatches] = useState([]);

  // Get Attrs settings.
  useEffect(() => {
    req({
      url: SA_WC_SWATCHES.ajax,
      params: {
        endpoint: 'get_product_attrs',
        pid,
      }
    }).then(res => {
      console.log('Data', res);
      if (res?.success && res?.data) {
        setAttrs(res.data);
      }
      console.log('Data', Object.keys(res).join(' | '));
    });
  }, [pid])


  useEffect(() => {
    let obj = {};
    Object.values(attrs).map(attr => {
      obj[attr.name] = attr?.default;
    })
    setDefaults(obj);
    if (!selected?.__t) {
      setSelected(obj);
    }
  }, [attrs])

  useEffect(() => {

    const variations = findMatchingVariations(variants, cleanObj({ ...selected, __t: null, __c: null }))
    console.log('selected', selected);
    console.log('variations', variations);


    const activeAttrOptions = {};


    for (const num in variations) {
      if (typeof (variations[num]) !== 'undefined') {
        const variationAttributes = variations[num].attributes;

        for (const attrName in variationAttributes) {
          const attrKey = attrName.substring('attribute_'.length);
          activeAttrOptions[attrKey] = [];
          if (variationAttributes.hasOwnProperty(attrName)) {
            let attrVal = variationAttributes[attrName],
              variation_active = false;

            if (variations[num].variation_is_active) {
              variation_active = true;
            }

            if (attrVal) {
              // Decode entities.
              attrVal = jQuery('<div/>').html(attrVal).text();

              console.log( 'Check', attrKey, attrVal )

              // Attach to matching options by value. This is done to compare
              // TEXT values rather than any HTML entities.
              const options = attrs[attrKey]?.options || [];
              if (options.length) {
                for (var i = 0, len = options.length; i < len; i++) {
                  if (attrVal === options[i]?.slug) {
                    activeAttrOptions[attrKey].push(options[i]?.slug);
                    break;
                  }
                }
              }
            } else {
              // Attach all apart from placeholder.
              activeAttrOptions[attrKey].push(attrVal);
              // new_attr_select.find('option:gt(0)').addClass('attached ' + variation_active);
            }

          }
        }
      }
    }

    console.log('activeAttrOptions', activeAttrOptions);




  }, [selected])

  const contentValues = {
    selected, setSelected, defaults
  }

  return <AppContext.Provider value={contentValues}>
    {Object.values(attrs).map(attr => <AttrItem key={attr.id} attr={attr} />)}
  </AppContext.Provider>
}




jQuery(($) => {
  $('.variations_form').each(function () {
    const form = $(this);
    const pid = form.data('product_id');
    const table = form.find('.variations');
    console.log(form.data('product_id'));
    const appEl = $('<div/>');
    appEl.insertAfter(table);
    appEl.addClass('sa_attr_product');
    const onChange = (selected) => {
      Object.keys(selected).map(name => {
        const v = selected[name] || false;
        // form.find([`[name="${name}"]`]).val(v).trigger('change');
      });


    }


    const variants = form.data('product_variations');
    console.log( 'variants', variants );
    const useAjax = false === variants;
    const args = {
      pid,
      variants,
      useAjax,
      onChange,
    }

    render(<App {...args} />, appEl.get(0));
  })
})