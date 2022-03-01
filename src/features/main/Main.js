import styled from "styled-components";

import Header from "../../common/components/Header";
import Content from "../content/Content";
import Sidebar from "../sidebar/Sidebar";

const MainContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

const Divider = styled.div`
  height: 100%;
  width: 0.5rem;
  background-color: black;
`;

const ContentsContainer = styled.div`
  width: 100%;
  height: 100%;
`;

function Main() {
  return (
    <MainContainer>
      <Sidebar />
      <Divider />
      <ContentsContainer>
        <Header />
        <Content />
      </ContentsContainer>
    </MainContainer>
  );
}

export default Main;
