import axios from "axios";

async function fetchMeetingList(lastId = "firstQuery") {
  const res = await axios.get(`meeting/meeting-list/${lastId}`);

  return res;
}

export default fetchMeetingList;
