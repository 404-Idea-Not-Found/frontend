import axios from "axios";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import store from "./app/store";
import GlobalStyle from "./common/components/GlobalStyle";
import "./common/config/firebase";
import Landing from "./common/routes/landing/Landing";
import Main from "./common/routes/main/Main";
import LiveMeeting from "./features/liveMeeting/LiveMeeting";
import { createVerify404TokenAction } from "./features/login/loginSagas";
import MeetingDetailContainer from "./features/meetingDetail/MeetingDetailContainer";
import MeetingForm from "./features/meetingForm/MeetingForm";
import MyPage from "./features/myPage/MyPage";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL;
store.dispatch(createVerify404TokenAction());

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
          <Route path="my-page" element={<MyPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
