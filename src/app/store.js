import { combineReducers, configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import mainReducer from "../common/routes/main/mainSlice";
import liveMeetingReducer from "../features/liveMeeting/liveMeetingSlice";
import loginReducer from "../features/login/loginSlice";
import myPageReducer from "../features/myPage/myPageSlice";
import sidebarReducer from "../features/sidebar/SidebarSlice";
import videoReducer from "../features/video/videoSlice";
import rootSaga from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();

const allReducers = combineReducers({
  login: loginReducer,
  liveMeeting: liveMeetingReducer,
  sidebar: sidebarReducer,
  myPage: myPageReducer,
  video: videoReducer,
  main: mainReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "RESET_APP") {
    state = undefined;
  }

  return allReducers(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "ATTACH_SOCKET_EVENT_LISTENER",
          "EMIT_SOCKET_EVENT",
          "GET_USER_MEDIA",
        ],
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;
