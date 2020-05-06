import { combineReducers } from "redux";

// reducers
import rooms from "./rooms";
const appReducer = combineReducers({rooms});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default rootReducer;
