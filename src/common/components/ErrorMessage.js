import PropTypes from "prop-types";
import styled from "styled-components";

const ErrorMessageContainer = styled.div`
  .error-title {
    text-align: center;
    font-size: 1.4rem;
    color: red;
    width: 19rem;
    margin: 2rem auto;
  }

  .error-paragraph {
    text-align: center;
    white-space: wrap;
    word-break: break-all;
    width: 19rem;
    font-size: 1.3rem;
    color: red;
    margin: 2rem auto;
  }
`;

function ErrorMessage({ errorMessage }) {
  return (
    <ErrorMessageContainer>
      <h1 className="error-title">현재 데이터를 불러올 수 없습니다</h1>
      <p className="error-paragraph">{errorMessage}</p>
    </ErrorMessageContainer>
  );
}

ErrorMessage.propTypes = {
  errorMessage: PropTypes.string.isRequired,
};

export default ErrorMessage;
