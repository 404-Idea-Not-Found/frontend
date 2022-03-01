import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import loginReducer from "../features/login/loginSlice";
import meetingListReducer from "../features/meetingList/meetingListSlice";
import rootSaga from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    login: loginReducer,
    meetingList: meetingListReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;
