import axios from "axios";

import getLocalFourOFourToken from "../util/getLocalFourOFourToken";

async function deleteMeeting(meetingId) {
  const fourOFourToken = getLocalFourOFourToken();
  await axios.delete(`meeting/${meetingId}`, {
    headers: {
      Authorization: `Bearer ${fourOFourToken}`,
    },
  });
}

export default deleteMeeting;
