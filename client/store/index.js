import { createStore, applyMiddleware, combineReducers } from "redux";
import userReducer from "./user";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";

const store = createStore(
  combineReducers({
    user: userReducer,
  }),
  applyMiddleware(thunkMiddleware, createLogger())
);

export default store;
