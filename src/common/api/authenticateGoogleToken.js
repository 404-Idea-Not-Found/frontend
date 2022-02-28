import axios from "axios";

async function authenticateGoogleToken(accessToken) {
  const res = await axios.post(
    "auth/google",
    {
      googleUserIdToken: accessToken,
    },
    {
      withCredentials: true,
    }
  );

  return res;
}

export default authenticateGoogleToken;
