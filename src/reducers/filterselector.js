import {
  ADD_FILTER,
  REMOVE_FILTER,
  CLEAR_FILTER
} from "../actions/filterselector";

const filterSelectorDefaultState = [];

export default function FilterSelectorReducer(
  state = filterSelectorDefaultState,
  action
) {
  switch (action.type) {
    case ADD_FILTER:
      return !state.find(
        f =>
          f.type === action.filter.type &&
          f.dimension === action.filter.dimension &&
          f.value === action.filter.value
      )
        ? [...state, action.filter]
        : state;

    case REMOVE_FILTER:
      return state.filter(
        ({ type, dimension, value }) =>
          type !== action.filter.type ||
          dimension !== action.filter.dimension ||
          value !== action.filter.value
      );

    case CLEAR_FILTER:
      return state.filter(f => f.dimension !== action.dimension);

    default:
      return state;
  }
}
