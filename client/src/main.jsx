import React, { StrictMode } from "react";

import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

import authReducer from "./state";
import notificationReducer from "./state/notification";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";
import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PURGE,
  persistReducer,
  PERSIST,
  REGISTER,
} from "redux-persist";
import NotificationListener from "./components/NotificationListener.jsx";

const rootReducers = combineReducers({
  auth: authReducer,
  notifications: notificationReducer,
});

const persistConfig = { key: "root", storage, version: 1 };
const persistedReducer = persistReducer(persistConfig, rootReducers);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate
          loading={<div>Loading...</div>}
          persistor={persistStore(store)}
        >
          <NotificationListener />
          <App />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
