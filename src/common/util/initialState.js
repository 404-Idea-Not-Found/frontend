import { initialState as liveMeetingInitialState } from "../../features/LiveMeeting/liveMeetingSlice";
import { initialState as loginInitialState } from "../../features/login/loginSlice";
import { initialState as myPageInitialState } from "../../features/myPage/myPageSlice";
import { initialState as sidebarInitialState } from "../../features/sidebar/SidebarSlice";
import { initialState as videoInitialState } from "../../features/video/videoSlice";

const testInitialReduxState = {
  login: JSON.parse(JSON.stringify(loginInitialState)),
  myPage: JSON.parse(JSON.stringify(myPageInitialState)),
  video: JSON.parse(JSON.stringify(videoInitialState)),
  liveMeeting: JSON.parse(JSON.stringify(liveMeetingInitialState)),
  sidebar: JSON.parse(JSON.stringify(sidebarInitialState)),
};

export default testInitialReduxState;
