export const ADD_FILTER = 'ADD_FILTER';
export const REMOVE_FILTER = 'REMOVE_FILTER';
export const CLEAR_FILTER = 'CLEAR_FILTER';


// NOT filter
// "filter": { "type": "not", "field": <filter> } 

// selector filter: WHERE <dim_str> = 'dim_str_value'
// "filter": { "type": "selector", "dimension": <dimension_string>, "value": <dimension_value_string> }
export const addSelectorFilter = ({type = 'selector', dimension = '', value = ''} = {}) => ({
  type: ADD_FILTER,
  filter: {
    type,
    dimension,
    value
  }
});

export const removeSelectorFilter = ({type = '', dimension = '', value = ''} = {}) => ({
    type: REMOVE_FILTER,
    filter: {
        type,
        dimension,
        value
      }
});

export const clearDimensionFiltres = (dimension) => ({
  type: CLEAR_FILTER,
  dimension: dimension,
})