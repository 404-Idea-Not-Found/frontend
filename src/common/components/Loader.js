import PropTypes from "prop-types";
import { RotatingLines } from "react-loader-spinner";
import styled from "styled-components";

const LoaderContainer = styled.div`
  width: 100%;
  display: flex;
  height: ${(props) => props.containerHeight || "60%"};
  justify-content: center;
  align-items: center;
`;

function Loader({ spinnerWidth, containerHeight }) {
  return (
    <LoaderContainer containerHeight={containerHeight}>
      <RotatingLines width={spinnerWidth} strokeColor="black" />
    </LoaderContainer>
  );
}

Loader.propTypes = {
  spinnerWidth: PropTypes.string,
  containerHeight: PropTypes.string,
};

Loader.defaultProps = {
  spinnerWidth: "100px",
  containerHeight: null,
};

export default Loader;
