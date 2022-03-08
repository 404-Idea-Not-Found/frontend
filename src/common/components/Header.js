import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
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
  margin-right: 10rem;
`;

const HeaderButton = styled.button`
  display: flex;
  align-items: center;
  border: none;
  margin-right: 1.5rem;
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

  &:active {
    opacity: 1;
    .google-logo {
      opacity: 1;
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
  const { pathname } = useLocation();

  function handleNewMeetingClick() {
    navigate("/main/new-meeting");
  }

  function handleMainClick() {
    navigate("/main");
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
          {pathname.includes("my-page") && (
            <HeaderButton onClick={handleMainClick}>Main</HeaderButton>
          )}
          {!pathname.includes("my-page") && (
            <HeaderButton onClick={handleMyPageClick}>My Page</HeaderButton>
          )}
          <HeaderButton onClick={handleLogoutClikc}>Logout</HeaderButton>
        </>
      )}
      {!isLoggedIn && (
        <HeaderButton onClick={handleSignInClick}>
          <img className="google-logo" src={googleGLogo} alt="google logo" />
          Sign in with Google
        </HeaderButton>
      )}
    </HeaderContainer>
  );
}

export default Header;
