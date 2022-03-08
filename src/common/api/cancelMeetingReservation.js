import axios from "axios";

import getLocalFourOFourToken from "../util/getLocalFourOFourToken";

async function cancelMeetingReservation(meetingId) {
  const fourOFourToken = getLocalFourOFourToken();
  const res = await axios.patch(
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

export default cancelMeetingReservation;
