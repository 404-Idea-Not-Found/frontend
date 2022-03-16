import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const StyledDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

function Fallback() {
  const navigate = useNavigate();

  function handleButtonClick() {
    navigate("/");
  }

  return (
    <StyledDiv>
      <h1>404 Page Not Found</h1>
      <h2>잘못된 주소 같습니다... URL을 확인해 주세요</h2>
      <button onClick={handleButtonClick} type="button">
        메인으로
      </button>
    </StyledDiv>
  );
}

export default Fallback;
