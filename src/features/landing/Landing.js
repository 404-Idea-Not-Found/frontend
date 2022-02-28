import styled from "styled-components";

import Login from "../login/Login";

const StyledDiv = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

const Divider = styled.div`
  height: 100%;
  width: 0.5rem;
  background-color: black;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  div {
    font-size: 5rem;
    font-family: "Passion One", cursive;
    font-family: "Paytone One", sans-serif;
  }
`;

function Landing() {
  return (
    <StyledDiv>
      <Login />
      <Divider />
      <LogoContainer>
        <div>404</div>
        <div>IDEA</div>
        <div>NOT</div>
        <div>FOUND</div>
      </LogoContainer>
    </StyledDiv>
  );
}

export default Landing;
