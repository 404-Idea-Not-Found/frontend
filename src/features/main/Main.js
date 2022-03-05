import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";

import Header from "../../common/components/Header";
import Sidebar from "../sidebar/Sidebar";

const MainContainer = styled.div`
  display: flex;
  min-width: calc(400px + 0.5rem + 1500px);
  width: 100%;
  height: 100vh;
`;

const Divider = styled.div`
  height: 100%;
  min-width: 0.5rem;
  background-color: black;
`;

const ContentsContainer = styled.div`
  flex: 1;
  min-width: 1500px;
  height: 100%;
`;

const DefaultContentScreen = styled.div`
  display: flex;
  align-items: center;
  font-size: 3rem;
  font-weight: bold;
  width: fit-content;
  height: calc(100% - 1rem - 22px);
  margin: 0 auto;
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
