import { toast } from "react-toastify";

import { CATEGORY_LIMIT } from "../../constants";
import request from "../../server";
import { CATEGORY_ACTIONS } from "../types/category";

const updateStateChange = (payload) => ({ type: CATEGORY_ACTIONS, payload });

export const getCategories =
  (page = 1, search = "") =>
  async (dispatch) => {
    try {
      dispatch(updateStateChange({ loading: true }));
      let {
        data: {
          data,
          pagination: { total },
        },
      } = await request.get("category", {
        params: { page, limit: CATEGORY_LIMIT, search },
      });
      const categories = data.map((el) => ({ ...el, key: el._id }));

      dispatch(updateStateChange({ categories }));
      dispatch(updateStateChange({ total }));
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(updateStateChange({ loading: false }));
    }
  };

export const changePage = (page, search) => (dispatch) => {
  dispatch(updateStateChange({ activePage: page }));
  dispatch(getCategories(page, search));
};

export const searchCategories = (search) => (dispatch) => {
  dispatch(updateStateChange({ search: search }));
  dispatch(updateStateChange({ activePage: 1 }));
  dispatch(getCategories(1, search));
};

export const controlModal = (payload) => (dispatch) => {
  dispatch(updateStateChange({ isModalOpen: payload }));
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

export const sendCategory =
  ({ values, selected, activePage, search, form }) =>
  async (dispatch) => {
    try {
      dispatch(updateStateChange({ isModalLoading: true }));
      if (selected === null) {
        await request.post("category", values);
      } else {
        await request.put(`category/${selected}`, values);
      }
      dispatch(updateStateChange({ isModalOpen: false, imageData: null }));
      dispatch(getCategories(activePage, search));
      form.resetFields();
    } catch (err) {
      toast.error(err.response.data);
    } finally {
      dispatch(updateStateChange({ isModalLoading: false }));
    }
  };

export const editCategory = (form, id) => async (dispatch) => {
  dispatch(updateStateChange({ selected: id, isModalOpen: true }));
  const { data } = await request.get(`category/${id}`);
  dispatch(updateStateChange({ imageData: data.photo }));
  form.setFieldsValue(data);
};

export const deleteCategory = (id, search) => async (dispatch) => {
  try {
    await request.delete(`category/${id}`);
    dispatch(getCategories(1, search));
    dispatch(updateStateChange({ activePage: 1 }));
  } catch (err) {
    toast.error(err.response.data);
  }
};

export const showModal = (form) => async (dispatch) => {
  dispatch(
    updateStateChange({ imageData: null, selected: null, isModalOpen: true })
  );
  form.resetFields();
};
