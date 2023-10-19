import { Provider } from "react-redux";
import PropTypes from "prop-types";
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";

import categoryReducer from "../reducers/category";
import languageReducer from "../reducers/language";
import categoryPostsReducer from "../reducers/categoryPosts";
import postsReducer from "../reducers/post";
import userReducer from "../reducers/user";

const rootReducer = combineReducers({
  category: categoryReducer,
  post: postsReducer,
  user: userReducer,
  categoryPosts: categoryPostsReducer,
  language: languageReducer,
});

export const Store = createStore(rootReducer, applyMiddleware(thunk));

const StoreProvider = ({children}) => {
  return <Provider store={Store}>{children}</Provider>;
};

StoreProvider.propTypes = {
  children: PropTypes.node,
}

export default StoreProvider;
