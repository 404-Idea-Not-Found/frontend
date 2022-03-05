import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    box-sizing: border-box;
    margin: 0;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

export default GlobalStyle;
