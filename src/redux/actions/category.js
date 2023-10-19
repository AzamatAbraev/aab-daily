import { CATEGORY_LIMIT } from "../../constants";
import request from "../../server";
import {
  CATEGORY_FETCHING,
  CATEGORY_LOADING,
  CATEGORY_PAGE,
  CATEGORY_SEARCH,
  CATEGORY_TOTAL,
} from "../types/category";

export const getCategories = (page = 1, search = "") => {
  return async (dispatch) => {
    try {
      dispatch({ type: CATEGORY_LOADING, payload: true });
      let {
        data: {
          data,
          pagination: { total },
        },
      } = await request.get("category", {
        params: { page, limit: CATEGORY_LIMIT, search },
      });

      dispatch({ type: CATEGORY_FETCHING, payload: data });
      dispatch({ type: CATEGORY_TOTAL, payload: total });

    } catch (err) {
      console.log(err);
    } finally {
      dispatch({ type: CATEGORY_LOADING, payload: false });
    }
  };
};

export const changePage = (page) => {
  return (dispatch) => {
    dispatch({ type: CATEGORY_PAGE, payload: page });
    dispatch(getCategories(page));
  };
};

export const searchCategories = (search) => {
  return (dispatch) => {
    dispatch({ type: CATEGORY_SEARCH, payload: search });
    dispatch({ type: CATEGORY_PAGE, payload: 1 });
    dispatch(getCategories(1, search));
  };
};
