/* eslint-disable react/prop-types */
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { render as rtlRender } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";

import rootSaga from "../../app/rootSaga";
import liveMeetingReducer from "../../features/LiveMeeting/LiveMeetingSlice";
import loginReducer from "../../features/login/loginSlice";
import myPageReducer from "../../features/MyPage/myPageSlice";
import sidebarReducer from "../../features/sidebar/SidebarSlice";
import videoReducer from "../../features/video/videoSlice";

const sagaMiddleware = createSagaMiddleware();
const allReducers = combineReducers({
  login: loginReducer,
  liveMeeting: liveMeetingReducer,
  sidebar: sidebarReducer,
  myPage: myPageReducer,
  video: videoReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "RESET_APP") {
    state = undefined;
  }

  return allReducers(state, action);
};

function render(
  ui,
  {
    preloadedState,
    store = configureStore({
      reducer: rootReducer,
      preloadedState,
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
    }),
    ...renderOptions
  } = {}
) {
  sagaMiddleware.run(rootSaga);

  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from "@testing-library/react";
export { render };
