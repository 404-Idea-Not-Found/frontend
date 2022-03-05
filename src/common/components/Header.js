import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { loginSagaActionCreators } from "../../features/login/loginSagas";
import { selectIsLoggedIn } from "../../features/login/selectors";
import googleGLogo from "../../images/googleGLogo.png";
import { COLOR } from "../util/constants";

const HeaderContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  min-width: 1300px;
  min-height: calc(2rem + 2px);
  width: 100%;
  margin-left: auto;
`;

const HeaderButton = styled.button`
  display: flex;
  align-items: center;
  border: none;
  background-color: white;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.4s;

  &:hover {
    color: ${COLOR.LIGHT_GREY};
    .google-logo {
      opacity: 0.3;
    }
  }

  .google-logo {
    width: 1rem;
    margin-right: 0.2rem;
    opacity: 1;
    transition: opacity 0.8s;
  }
`;

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  function handleNewMeetingClick() {
    navigate("new-meeting");
  }

  function handleMyPageClick() {
    navigate("/my-page");
  }

  function handleLogoutClikc() {
    localStorage.removeItem("fourOFourToken");
    dispatch({ type: "RESET_APP" });
    navigate("/");
  }

  function handleSignInClick() {
    dispatch(loginSagaActionCreators.logInWithGoogle());
  }

  return (
    <HeaderContainer>
      {isLoggedIn && (
        <>
          <HeaderButton onClick={handleNewMeetingClick}>
            New Meeting
          </HeaderButton>
          <HeaderButton onClick={handleMyPageClick}>My Page</HeaderButton>
          <HeaderButton onClick={handleLogoutClikc}>Logout</HeaderButton>
        </>
      )}
      {!isLoggedIn && (
        <HeaderButton onClick={handleSignInClick}>
          <img className="google-logo" src={googleGLogo} alt="googleGLogo" />
          Sign in with Google
        </HeaderButton>
      )}
    </HeaderContainer>
  );
}

export default Header;
