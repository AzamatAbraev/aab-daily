import { toast } from "react-toastify";
import { USER_LIMIT } from "../../constants";
import request from "../../server";
import { USER_ACTIONS } from "../types/user";

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

export const deleteUser = (id, search) => async (dispatch) => {
  try {
    await request.delete(`user/${id}`);
    dispatch(getUsers(1, search));
    dispatch(updateStateChange({ activePage: 1 }));
  } catch (err) {
    toast.error(err.response.data);
  }
};
