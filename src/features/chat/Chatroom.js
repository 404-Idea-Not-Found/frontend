import styled from "styled-components";

const ChatroomContainer = styled.div`
  min-width: 300px;
  max-width: 500px;
  margin-top: 3rem;
  border: 2px solid black;
  display: flex;
  flex-direction: column;
`;

const ChatContainer = styled.div`
  flex: 1;
`;

function Chatroom() {
  function chatSubmitHandler(event) {
    event.preventDefault();
  }

  return (
    <ChatroomContainer>
      <ChatContainer>test</ChatContainer>
      <form>
        <input type="text" />
        <button type="submit" onClick={chatSubmitHandler}>
          Enter
        </button>
      </form>
    </ChatroomContainer>
  );
}

export default Chatroom;
