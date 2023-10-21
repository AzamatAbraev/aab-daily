import { toast } from "react-toastify";
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

export const sendPosts =
  ({ values, selected, activePage, search, form }) =>
  async (dispatch) => {
    try {
      dispatch(updateStateChange({ isModalLoading: true }));
      if (selected === null) {
        await request.post("post", values);
      } else {
        await request.put(`post/${selected}`, values);
      }
      dispatch(updateStateChange({ isModalOpen: false, imageData: null }));
      dispatch(getPosts(activePage, search));
      form.resetFields();
    } catch (err) {
      toast.error(err.response.data);
    } finally {
      dispatch(updateStateChange({ isModalLoading: false }));
    }
  };

export const editPost = (form, id) => async (dispatch) => {
  dispatch(updateStateChange({ selected: id, isModalOpen: true }));
  const { data } = await request.get(`post/${id}`);
  dispatch(updateStateChange({ imageData: data.photo }));
  form.setFieldsValue(data);
};

export const deletePost = (id, search) => async (dispatch) => {
  try {
    await request.delete(`post/${id}`);
    dispatch(getPosts(1, search));
    dispatch(updateStateChange({ activePage: 1 }));
  } catch (err) {
    toast.error(err.response.data);
  }
};

export const uploadImage = (file) => async (dispatch) => {
  try {
    dispatch(updateStateChange({ imageLoading: true }));
    const formData = new FormData();
    formData.append("file", file);
    let { data } = await request.post("upload", formData);
    dispatch(updateStateChange({ imageData: data }));
  } catch (err) {
    console.log(err);
  } finally {
    dispatch(updateStateChange({ imageLoading: false }));
  }
};

export const showModal = (form) => async (dispatch) => {
  dispatch(
    updateStateChange({ imageData: null, selected: null, isModalOpen: true })
  );
  form.resetFields();
};

export const controlModal = (payload) => (dispatch) => {
  dispatch(updateStateChange({ isModalOpen: payload }));
};
