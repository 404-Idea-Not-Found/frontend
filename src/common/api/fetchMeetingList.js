import axios from "axios";

async function fetchMeetingList(query, lastId) {
  const res = await axios.get(
    `meeting/meeting-list?query=${query.trim()}&lastId=${
      lastId || "firstQuery"
    }`
  );

  return res;
}

export default fetchMeetingList;
