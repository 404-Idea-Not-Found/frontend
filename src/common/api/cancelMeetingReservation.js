import axios from "axios";

async function cancelMeetingReservation(meetingId) {
  const res = await axios.patch(
    `meeting/reservation/${meetingId}`,
    {},
    { withCredentials: true }
  );

  return res;
}

export default cancelMeetingReservation;
