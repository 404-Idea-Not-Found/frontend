import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { createEmitSocketEventAction } from "../LiveMeeting/liveMeetingSagas";
import { chatSubmitted } from "../LiveMeeting/LiveMeetingSlice";
import { selectChatList } from "../LiveMeeting/selectors";
import { selectUsername } from "../login/selectors";

const ChatroomContainer = styled.div`
  width: 350px;
  margin-top: 3rem;
  border: 2px solid black;
  display: flex;
  flex-direction: column;
`;

const ChatListContainer = styled.div`
  height: calc(70vh - 4px - 2rem);
  overflow-y: auto;
`;

const ChatContainer = styled.div`
  margin-left: 10px;
  margin-bottom: 5px;

  .username {
    font-weight: bold;
    color: ${(props) => (props.isMyChat ? "black" : "blue")};
  }

  .text {
    font-size: 1.2rem;
    width: 320px;
    word-break: break-all;
  }
`;

const StyledForm = styled.form`
  display: flex;
  justify-content: flex-end;

  input {
    box-sizing: border-box;
    height: 2rem;
    font-size: 1.5rem;
    flex: 3;
    border-top: 2px solid black;
    border-bottom: none;
    border-left: none;
    border-right: none;
  }

  input:focus {
    outline: none;
  }

  button {
    flex: 1;
    font-weight: bold;
    background-color: white;
    border-top: 2px solid black;
    border-left: 2px solid black;
    border-bottom: none;
    border-right: none;
    cursor: pointer;
  }

  button:disabled {
    cursor: not-allowed;
  }
`;

function Chatroom() {
  const chatList = useSelector(selectChatList);
  const username = useSelector(selectUsername);
  const [entererdText, setEnteredText] = useState("");
  const dispatch = useDispatch();
  const isTextEmpty = entererdText.trim().length < 1;
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current.scrollIntoView(false);
  });

  function textSubmitHandler(event) {
    event.preventDefault();
    const chat = {
      username: username || "Stranger",
      text: entererdText,
      date: new Date().toISOString(),
    };

    setEnteredText("");
    dispatch(createEmitSocketEventAction("chatSubmitted", chat));
    dispatch(chatSubmitted(chat));
  }

  function textInputHandler(event) {
    setEnteredText(event.target.value);
  }

  return (
    <ChatroomContainer>
      <ChatListContainer>
        {chatList.map((chat) => (
          <ChatContainer
            isMyChat={username === chat.username}
            className="chat-container"
            key={chat.date}
          >
            <div className="username">{chat.username}</div>
            <div className="text">{chat.text}</div>
          </ChatContainer>
        ))}
        <div ref={scrollRef} />
      </ChatListContainer>
      <StyledForm onSubmit={textSubmitHandler}>
        <input
          type="text"
          value={entererdText}
          minLength={1}
          onChange={textInputHandler}
        />
        <button type="submit" disabled={isTextEmpty}>
          Enter
        </button>
      </StyledForm>
    </ChatroomContainer>
  );
}

export default Chatroom;
