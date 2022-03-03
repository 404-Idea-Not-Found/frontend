import { combineReducers, configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import liveMeetingReducer from "../features/LiveMeeting/LiveMeetingSlice";
import loginReducer from "../features/login/loginSlice";
import rootSaga from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();

const allReducers = combineReducers({
  login: loginReducer,
  liveMeeting: liveMeetingReducer,
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
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;
