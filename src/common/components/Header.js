import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { loginSagaActionCreators } from "../../features/login/loginSagas";
import { selectIsLoggedIn } from "../../features/login/selectors";
import googleGLogo from "../../images/googleGLogo.png";

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 20rem;
  margin-left: auto;
  margin-top: 1rem;
`;

const HeaderButton = styled.button`
  border: none;
  background-color: white;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    text-shadow: grey 1px 0 10px;
  }
`;

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  function handleNewMeetingClick() {
    navigate("/new-meeting");
  }

  function handleMyPageClick() {
    navigate("/my-page");
  }

  function handleLogoutClikc() {
    document.cookie = "fourOFourToken=; max-age=0";
    dispatch({ type: "RESET_APP" });
    navigate("/");
  }

  function handleSignInClick() {
    dispatch(loginSagaActionCreators.loggedInWithGoogle());
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
          <img src={googleGLogo} alt="googleGLogo" />
          Sign in with Google{" "}
        </HeaderButton>
      )}
    </HeaderContainer>
  );
}

export default Header;
