import { USER_LIMIT } from "../../constants";
import request from "../../server";
import {
  USER_FETCHING,
  USER_LOADING,
  USER_PAGE,
  USER_SEARCH,
  USER_TOTAL,
} from "../types/user";

export const getUsers = (page = 1, search = "") => {
  return async (dispatch) => {
    try {
      dispatch({ type: USER_LOADING, payload: true });
      let {
        data: {
          data,
          pagination: { total },
        },
      } = await request.get("user", {
        params: { page, limit: USER_LIMIT, search },
      });

      dispatch({ type: USER_FETCHING, payload: data });
      dispatch({ type: USER_TOTAL, payload: total });
    } catch (err) {
      console.log(err);
    } finally {
      dispatch({ type: USER_LOADING, payload: false });
    }
  };
};

export const changeUsersPage = (page) => {
  return (dispatch) => {
    dispatch({ type: USER_PAGE, payload: page });
    dispatch(getUsers(page));
  };
};

export const searchUsers = (search) => {
  return (dispatch) => {
    dispatch({ type: USER_SEARCH, payload: search });
    dispatch({ type: USER_PAGE, payload: 1 });
    dispatch(getUsers(1, search));
  };
};
