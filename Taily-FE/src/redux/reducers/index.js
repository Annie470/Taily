import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import localStorage from "redux-persist/lib/storage";
import authReducer from "./authReducer";
import profileReducer from "./profileReducer";
import adminReducer from "./adminReducer";
import locationReducer from "./locationReducer";
import postReducer from "./postReducer";
import reportReducer from "./reportReducer";

const authPersistConfig = {
  key: "auth",
  storage: localStorage,
  whitelist: ["token", "role"],
};

const mainReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  profile: profileReducer,
  admin: adminReducer,
  location: locationReducer,
  post: postReducer,
  report: reportReducer,
});

export default mainReducer;
