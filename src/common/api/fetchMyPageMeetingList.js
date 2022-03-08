import axios from "axios";

import getLocalFourOFourToken from "../util/getLocalFourOFourToken";

async function fetchMyPageMeetingList(userId, email) {
  const fourOFourToken = getLocalFourOFourToken();
  const res = await axios.get(
    `meeting/my-page?userId=${userId}&&email=${email}`,
    {
      headers: {
        Authorization: `Bearer ${fourOFourToken}`,
      },
    }
  );

  return res;
}

export default fetchMyPageMeetingList;
