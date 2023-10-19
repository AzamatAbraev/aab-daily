import {
  POSTS_FETCHING,
  POSTS_LOADING,
  POSTS_PAGE,
  POSTS_SEARCH,
  POSTS_TOTAL,
} from "../types/post";

const initialState = {
  categories: [],
  loading: false,
  error: null,
  total: 0,
  activePage: 1,
  search: "",
};

const postsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case POSTS_LOADING:
      return { ...state, loading: payload };
    case POSTS_FETCHING:
      return { ...state, categories: payload };
    case POSTS_TOTAL:
      return { ...state, total: payload };
    case POSTS_PAGE:
      return { ...state, activePage: payload };
    case POSTS_SEARCH:
      return { ...state, search: payload };
  }
  return state;
};

export default postsReducer;
