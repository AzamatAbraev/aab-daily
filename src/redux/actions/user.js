import { toast } from "react-toastify";
import { message } from "antd";

import { USER_LIMIT } from "../../constants";
import { USER_ACTIONS } from "../types/user";
import request from "../../server";

const updateStateChange = (payload) => ({ type: USER_ACTIONS, payload });

export const getUsers =
  (page = 1, search = "") =>
  async (dispatch) => {
    try {
      dispatch(updateStateChange({ loading: true }));
      let {
        data: {
          data,
          pagination: { total },
        },
      } = await request.get("user", {
        params: { page, limit: USER_LIMIT, search },
      });
      const users = data.map((el) => ({ ...el, key: el._id }));

      dispatch(updateStateChange({ users }));
      dispatch(updateStateChange({ total }));
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(updateStateChange({ loading: false }));
    }
  };

export const changeUsersPage = (page, search) => (dispatch) => {
  dispatch(updateStateChange({ activePage: page }));
  dispatch(getUsers(page, search));
};

export const searchUsers = (search) => (dispatch) => {
  dispatch(updateStateChange({ search }));
  dispatch(updateStateChange({ activePage: 1 }));
  dispatch(getUsers(1, search));
};

export const sendCategory =
  ({ values, selected, activePage, search, form }) =>
  async (dispatch) => {
    try {
      dispatch(updateStateChange({ isModalLoading: true }));
      if (values.confirm === values.password) {
        selected === null
          ? (await request.post("user", values))
          :( await request.put(`user/${selected}`, values));
        dispatch(updateStateChange({ isModalOpen: false }));
        dispatch(getUsers(activePage, search));
        form.resetFields();
      } else {
        message.error("Password is not confirmed");
      }
    } catch (err) {
      toast.error(err.response.data);
    } finally {
      dispatch(updateStateChange({ isModalLoading: false }));
    }
  };

export const editUser = (form, id) => async (dispatch) => {
  dispatch(updateStateChange({ selected: id, isModalOpen: true }));
  const { data } = await request.get(`user/${id}`);
  form.setFieldsValue(data);
};

export const deleteUser = (id, search) => async (dispatch) => {
  try {
    await request.delete(`user/${id}`);
    dispatch(getUsers(1, search));
    dispatch(updateStateChange({ activePage: 1 }));
  } catch (err) {
    toast.error(err.response.data);
  }
};

export const showModal = (form) => async (dispatch) => {
  dispatch(updateStateChange({ isModalOpen: true, selected: null }));
  form.resetFields();
};

export const controlModal = (payload) => (dispatch) => {
  dispatch(updateStateChange({ isModalOpen: payload }));
};
