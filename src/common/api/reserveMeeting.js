import axios from "axios";

async function reserveMeeting(meetingId) {
  const res = await axios.post(
    `meeting/reservation/${meetingId}`,
    {},
    { withCredentials: true }
  );

  return res;
}

export default reserveMeeting;
