import { POSTS_LIMIT } from "../../constants";
import request from "../../server";
import {
  POSTS_FETCHING,
  POSTS_LOADING,
  POSTS_PAGE,
  POSTS_SEARCH,
  POSTS_TOTAL,
} from "../types/post";

export const getPosts = (page = 1, search = "") => {
  return async (dispatch) => {
    try {
      dispatch({ type: POSTS_LOADING, payload: true });
      let {
        data: {
          data,
          pagination: { total },
        },
      } = await request.get("post", {
        params: { page, limit: POSTS_LIMIT, search },
      });

      dispatch({ type: POSTS_FETCHING, payload: data });
      dispatch({ type: POSTS_TOTAL, payload: total });
    } catch (err) {
      console.log(err);
    } finally {
      dispatch({ type: POSTS_LOADING, payload: false });
    }
  };
};

export const changePage = (page) => {
  return (dispatch) => {
    dispatch({ type: POSTS_PAGE, payload: page });
    dispatch(getPosts(page));
  };
};

export const searchCategories = (search) => {
  return (dispatch) => {
    dispatch({ type: POSTS_SEARCH, payload: search });
    dispatch({ type: POSTS_PAGE, payload: 1 });
    dispatch(getPosts(1, search));
  };
};
