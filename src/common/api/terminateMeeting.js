import axios from "axios";

import getLocalFourOFourToken from "../util/getLocalFourOFourToken";

async function terminateMeeting(meetingId) {
  const fourOFourToken = getLocalFourOFourToken();
  const res = await axios.post(
    `meeting/termination/${meetingId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${fourOFourToken}`,
      },
    }
  );

  return res;
}

export default terminateMeeting;
