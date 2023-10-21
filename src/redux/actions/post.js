import { POSTS_LIMIT } from "../../constants";
import request from "../../server";
import { POST_ACTIONS } from "../types/post";

const updateStateChange = (payload) => ({ type: POST_ACTIONS, payload });

export const getPosts =
  (page = 1, search = "") =>
  async (dispatch) => {
    try {
      dispatch(updateStateChange({ loading: true }));

      let {
        data: {
          data,
          pagination: { total },
        },
      } = await request.get("post", {
        params: { page, limit: POSTS_LIMIT, search },
      });
      const posts = data.map((el) => ({ ...el, key: el._id }));

      dispatch(updateStateChange({ posts }));
      dispatch(updateStateChange({ total }));
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(updateStateChange({ loading: false }));
    }
  };

export const changePage = (page, search) => (dispatch) => {
  dispatch(updateStateChange({ activePage: page }));
  dispatch(getPosts(page, search));
};

export const searchPosts = (search) => (dispatch) => {
  dispatch(updateStateChange({ search: search }));
  dispatch(updateStateChange({ activePage: 1 }));
  dispatch(getPosts(1, search));
};
