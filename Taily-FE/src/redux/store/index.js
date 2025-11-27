import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import mainReducer from "../reducers";

const store = configureStore({
  reducer: mainReducer,
});

const persistedStore = persistStore(store);

export { store, persistedStore };
