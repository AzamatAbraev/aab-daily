import {
  USER_ACTIONS,
} from "../types/user";

const initialState = {
  users: [],
  loading: false,
  error: null,
  total: 0,
  activePage: 1,
  search: "",
};

const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case USER_ACTIONS:
      return { ...state, ...payload };
  }
  return state;
};

export default userReducer;
