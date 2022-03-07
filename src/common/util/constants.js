/* eslint-disable import/prefer-default-export */
export const COLOR = {
  LIGHT_SKY_BLUE: "#C0D6E4",
  LIGHT_GREY: "#d1d1d1",
  GREY: "rgba(72, 72, 72, 0.46)",
  CYAN: "#7EF2FA",
  SALMON: "#FA7E7E",
  BRIGHT_GREEN: "#88FA7E",
  GREEN: "#4DB233",
  LEMON: "#F5FF87",
};

export const TIME = {
  DAY_TO_SECONDS: 86400,
};

export const ICE_SERVERS = {
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
