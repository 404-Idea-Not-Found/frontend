import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    width: 100%;
    height: 100vh;
    overflow-y: hidden;
    box-sizing: border-box;
    margin: 0;
  }

  #root {
    width: 100%;
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

  @media (max-width: 1440px) {
    body {
      background-color: white;
    }
  }
`;

export default GlobalStyle;
