import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import ruthiMainReducer from "./features/ruthiMain/ruthiMainSlice";
import notesReducer from "./features/notes/notesSlice";
import roomChatReducer from "./features/roomChat/roomChatSlice";

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
};

// Combine reducers
const rootReducer = combineReducers({
  ruthiMain: ruthiMainReducer,
  hrNotes: notesReducer,
  roomChat: roomChatReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Single shared store instance
const store = configureStore({
  reducer: persistedReducer,
});

// Persistor tied to the shared store instance
const persistor = persistStore(store);

export { store, persistor };
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
