import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    box-sizing: border-box;
    margin: 0;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  button {
      font-weight: bold;
      border: none;
      color: black;
      background-color: transparent;
      font-size: 1.3rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    button:hover {
      opacity: 0.3;
    }
`;

export default GlobalStyle;
