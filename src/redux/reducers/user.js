import {
  USER_FETCHING,
  USER_LOADING,
  USER_PAGE,
  USER_SEARCH,
  USER_TOTAL,
} from "../types/user";

const initialState = {
  categories: [],
  loading: false,
  error: null,
  total: 0,
  activePage: 1,
  search: "",
};

const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case USER_LOADING:
      return { ...state, loading: payload };
    case USER_FETCHING:
      return { ...state, categories: payload };
    case USER_TOTAL:
      return { ...state, total: payload };
    case USER_PAGE:
      return { ...state, activePage: payload };
    case USER_SEARCH:
      return { ...state, search: payload };
  }
  return state;
};

export default userReducer;
