import { combineReducers } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import userReducer from "../features/authentication";
import appReducer from "../features/app";

const userPersistConfig = {
  key: "user",
  storage: storage,
  blacklist: [ 'isAdmin']
};

const combinedReducer = combineReducers({
  app: appReducer,
  user: persistReducer(userPersistConfig, userReducer),
});

const rootReducer = (state, action) => {
	if (action.type === 'LOGOUT') {
		state = {};
	}
	return combinedReducer(state, action);
};
export default rootReducer;
