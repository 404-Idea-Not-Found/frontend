import axios from "axios";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import store from "./app/store";
import GlobalStyle from "./common/components/GlobalStyle";
import "./common/config/firebase";
import Landing from "./features/landing/Landing";
import LiveMeeting from "./features/LiveMeeting/LiveMeeting";
import { loginSagaActionCreators } from "./features/login/loginSagas";
import Main from "./features/main/Main";
import MeetingDetailContainer from "./features/meetingDetail/MeetingDetailContainer";
import MeetingForm from "./features/meetingForm/MeetingForm";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL;
store.dispatch(loginSagaActionCreators.verify404Token());

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <GlobalStyle />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="main" element={<Main />}>
            <Route path="new-meeting" element={<MeetingForm />} />
            <Route
              path="meeting/detail/:meetingId"
              element={<MeetingDetailContainer />}
            />
            <Route path="meeting/live/:meetingId" element={<LiveMeeting />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
