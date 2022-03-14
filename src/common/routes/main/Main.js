import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";

import Sidebar from "../../../features/sidebar/Sidebar";
import Header from "../../components/Header";

const MainContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const Divider = styled.div`
  height: 100%;
  min-width: 0.5rem;
  background-color: black;
`;

const ContentsContainer = styled.div`
  width: calc(80vw - 0.5rem);
  height: 100vh;
  overflow-x: auto;

  @media (max-width: 1440px) {
    width: calc(75vw - 0.5rem);
  }
`;

const DefaultContentScreen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  width: 100%;
  height: calc(100% - 1rem - 22px);
  margin: 0 auto;

  @media (max-width: 1440px) {
    font-size: 2rem;
  }
`;

function Main() {
  const { pathname } = useLocation();
  const isMeetingSelected = pathname !== "/main";

  return (
    <MainContainer>
      <Sidebar />
      <Divider />
      <ContentsContainer>
        <Header />
        {!isMeetingSelected && (
          <DefaultContentScreen>
            참여하고 싶은 미팅을 왼쪽에서 선택해주세요
          </DefaultContentScreen>
        )}
        <Outlet />
      </ContentsContainer>
    </MainContainer>
  );
}

export default Main;
