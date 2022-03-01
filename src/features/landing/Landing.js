import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Login from "../login/Login";
import { selectIsLoggedIn } from "../login/selectors";

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

  #IDEA {
    margin: 0;
    padding: 0;
    opacity: 1;
    animation: flickerIDEA 2s linear reverse infinite;
  }

  #IDEA::after {
    content: "ffff";
    box-shadow: -180px 0px 60px 10px rgba(216, 216, 216, 0.8);
  }

  #IDEA::after {
    color: transparent;
  }

  @keyframes flickerIDEA {
    0% {
      opacity: 0.4;
    }
    5% {
      opacity: 0.5;
    }
    10% {
      opacity: 0.6;
    }
    15% {
      opacity: 0.85;
    }
    25% {
      opacity: 0.5;
    }
    30% {
      opacity: 1;
    }
    35% {
      opacity: 0.1;
    }
    40% {
      opacity: 0.25;
    }
    45% {
      opacity: 0.5;
    }
    60% {
      opacity: 1;
    }
    70% {
      opacity: 0.85;
    }
    80% {
      opacity: 0.4;
    }
    90% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }

  div {
    font-size: 5rem;
    font-family: "Passion One", cursive;
    font-family: "Paytone One", sans-serif;
    transition: all 2s;
  }
`;

function Landing() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/main");
    }
  }, [isLoggedIn]);

  return (
    <StyledDiv>
      <Login />
      <Divider />
      <LogoContainer>
        <div id="404">404</div>
        <div id="IDEA">IDEA</div>
        <div id="NOT">NOT</div>
        <div id="FOUND">FOUND</div>
      </LogoContainer>
    </StyledDiv>
  );
}

export default Landing;
