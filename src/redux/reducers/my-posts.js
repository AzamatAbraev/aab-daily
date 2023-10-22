import { MYPOST_ACTIONS } from "../types/my-posts";

const initialState = {
  myPosts: [],
  loading: false,
  error: null,
  total: 0,
  activePage: 1,
  search: "",
  isModalOpen: false,
  isModalLoading: false,
  selected: null,
  imageLoading: false,
  imageData: null,
};

const myPostsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case MYPOST_ACTIONS:
      return { ...state, ...payload };
  }
  return state;
};

export default myPostsReducer;
