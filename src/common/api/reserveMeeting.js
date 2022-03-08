import axios from "axios";

import getLocalFourOFourToken from "../util/getLocalFourOFourToken";

async function reserveMeeting(meetingId) {
  const fourOFourToken = getLocalFourOFourToken();
  const res = await axios.post(
    `meeting/reservation/${meetingId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${fourOFourToken}`,
      },
    }
  );

  return res;
}

export default reserveMeeting;
