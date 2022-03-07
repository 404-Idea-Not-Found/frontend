import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Modal from "../../common/components/Modal";
import { COLOR } from "../../common/util/constants";
import googleGLogo from "../../images/googleGLogo.png";
import { loginSagaActionCreators } from "./loginSagas";
import { userCheckedLoginError } from "./loginSlice";
import { selectLoginError } from "./selectors";

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  border: 4px solid black;
  margin: 1rem 0;
  background-color: white;
  transition: background-color 0.5s;
  width: 400px;
  height: 60px;
  cursor: pointer;

  &:hover {
    background-color: ${COLOR.LIGHT_GREY};
  }

  img {
    width: 35px;
  }
`;

function Login() {
  const loginError = useSelector(selectLoginError);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleGoogleLoginClick() {
    dispatch(loginSagaActionCreators.logInWithGoogle());
  }

  function handleLookaroundClick() {
    navigate("/main");
  }

  function handleModalCloseClick() {
    dispatch(userCheckedLoginError());
  }

  return (
    <div>
      {loginError.isError && (
        <Modal onModalClose={handleModalCloseClick}>
          <div>로그인에 실패 했습니다</div>
          <div>{loginError.errorMessage}</div>
        </Modal>
      )}
      <LoginButton onClick={handleGoogleLoginClick}>
        <img src={googleGLogo} alt="googleGLogo" />
        Sign in with Google
      </LoginButton>
      <LoginButton onClick={handleLookaroundClick}>
        Look around without sign in
      </LoginButton>
    </div>
  );
}

export default Login;
