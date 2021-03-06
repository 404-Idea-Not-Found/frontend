import axios from "axios";

import getLocalFourOFourToken from "../util/getLocalFourOFourToken";

async function createNewMeeting(meetingData) {
  const fourOFourToken = getLocalFourOFourToken();
  const res = await axios.post(
    "meeting/new-meeting",
    { meetingData },
    {
      headers: {
        Authorization: `Bearer ${fourOFourToken}`,
      },
    }
  );

  return res;
}

export default createNewMeeting;
