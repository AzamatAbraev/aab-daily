import {
  CATEGORY_ID,
  CATEGORY_POSTS_FETCHING,
  CATEGORY_POSTS_LOADING,
  CATEGORY_POSTS_PAGE,
  CATEGORY_POSTS_SEARCH,
  CATEGORY_POSTS_TOTAL,
} from "../types/categoryPosts";

const initialState = {
  posts: [],
  loading: false,
  error: null,
  total: 0,
  activePage: 1,
  search: "",
  id: "",
};

const categoryPostsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case CATEGORY_POSTS_LOADING:
      return { ...state, loading: payload };
    case CATEGORY_POSTS_FETCHING:
      return { ...state, posts: payload };
    case CATEGORY_POSTS_TOTAL:
      return { ...state, total: payload };
    case CATEGORY_POSTS_SEARCH:
      return { ...state, search: payload };
    case CATEGORY_POSTS_PAGE:
      return { ...state, activePage: payload };
    case CATEGORY_ID:
      return { ...state, id: payload };
  }
  return state;
};


export default categoryPostsReducer;
