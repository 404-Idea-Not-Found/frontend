import axios from "axios";

async function createNewMeeting(meetingData) {
  const res = await axios.post(
    "meeting/new-meeting",
    { meetingData },
    { withCredentials: true }
  );

  return res;
}

export default createNewMeeting;
