const { default: axios } = require("axios");

async function authenticate404Token() {
  const res = await axios.post(
    "auth/verify-404-token",
    {},
    {
      withCredentials: true,
    }
  );

  return res;
}

export default authenticate404Token;
