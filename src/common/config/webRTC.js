const ICE_SERVERS = {
  iceServers: [
    {
      urls: process.env.REACT_APP_STUN_SERVER_URL,
    },
    {
      urls: process.env.REACT_APP_TURN_SERVER_URL,
      credential: process.env.REACT_APP_TURN_SERVER_CREDENTIAL,
      username: process.env.REACT_APP_TURN_SERVER_USERNAME,
    },
  ],
};

export default ICE_SERVERS;
