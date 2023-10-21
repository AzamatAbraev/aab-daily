import {
  USER_ACTIONS,
} from "../types/user";

const initialState = {
  users: [],
  loading: false,
  total: 0,
  activePage: 1,
  search: "",
  isModalOpen: false,
  isModalLoading: false,
  selected: null,
  imageLoading: false,
  imageData: null,
};

const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case USER_ACTIONS:
      return { ...state, ...payload };
  }
  return state;
};

export default userReducer;
