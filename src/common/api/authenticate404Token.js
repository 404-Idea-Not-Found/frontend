import axios from "axios";

async function authenticate404Token(fourOFourToken) {
  const res = await axios.post(
    "auth/verify-404-token",
    {},
    {
      headers: {
        Authorization: `Bearer ${fourOFourToken}`,
      },
    }
  );

  return res;
}

export default authenticate404Token;
