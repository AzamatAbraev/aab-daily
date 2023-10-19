import { CATEGORY_POSTS_LIMIT } from "../../constants";
import request from "../../server";
import { CATEGORY_POSTS_FETCHING, CATEGORY_POSTS_LOADING, CATEGORY_POSTS_PAGE, CATEGORY_POSTS_SEARCH, CATEGORY_POSTS_TOTAL } from "../types/categoryPosts";

export const getCategoryPosts = (id, search = "", page = 1, ) => {
  return async (dispatch) => {
    try {
      dispatch({type: CATEGORY_POSTS_LOADING, payload: true})
      let {
        data: {
          data,
          pagination: { total },
        },
      } = await request.get(`post`, {
        params: { category: id, page, limit: CATEGORY_POSTS_LIMIT, search },
      });

      dispatch({type: CATEGORY_POSTS_FETCHING, payload: data})
      dispatch({ type: CATEGORY_POSTS_TOTAL, payload: total });

    } catch (err) {
      console.log(err);
    } finally {
      dispatch({type: CATEGORY_POSTS_LOADING, payload: false})
    }
  }
}

export const changePostsPage = (page) => {
  return (dispatch) => {
    dispatch({ type: CATEGORY_POSTS_PAGE, payload: page });
    dispatch(getCategoryPosts(page));
  };
};

export const searchCategoryPosts = (search) => {
  return (dispatch) => {
    dispatch({ type: CATEGORY_POSTS_SEARCH, payload: search });
    dispatch({ type: CATEGORY_POSTS_PAGE, payload: 1 });
    dispatch(getCategoryPosts(1, search));
  };
};