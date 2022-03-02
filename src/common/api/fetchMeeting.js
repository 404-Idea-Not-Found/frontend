import axios from "axios";

async function fetchMeeting(meetingId) {
  const res = await axios.get(`meeting/${meetingId}`);

  return res;
}

export default fetchMeeting;
