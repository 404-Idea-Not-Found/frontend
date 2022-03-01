import axios from "axios";

async function fetchMeetingList(query, lastId = "firstQuery") {
  const res = await axios.get(
    `meeting/meeting-list?query=${query}&lastId=${lastId || "firstQuery"}`
  );

  return res;
}

export default fetchMeetingList;
