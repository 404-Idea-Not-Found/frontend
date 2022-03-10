const mockMeeting = {
  title: "test",
  tag: ["testTag1"],
  description: "Test description.",
  owner: "testOwner",
  reservation: ["test@gmail.com"],
  colleague: [
    {
      username: "testColleague",
      email: "testColleague@gmail.com",
      profilePicture: "testProfile",
    },
  ],
  recruitmentNumber: 6,
  startTime: "2022-03-10T12:32",
  chatList: [
    { username: "testChatUser", text: "textText", date: "2022-03-10T12:32" },
  ],
  isLive: false,
  isEnd: false,
  ownerSocketId: "testOwnerSocketId",
};

export default mockMeeting;
