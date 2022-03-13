import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";

import Sidebar from "../../../features/sidebar/Sidebar";
import { sidebarReset } from "../../../features/sidebar/SidebarSlice";
import Header from "../../components/Header";

const MainContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;

  @media (max-width: 1440px) {
    width: 1440px;
  }
`;

const Divider = styled.div`
  height: 100%;
  min-width: 0.5rem;
  background-color: black;
`;

const ContentsContainer = styled.div`
  width: calc(80vw - 0.5rem);
  height: 100vh;

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
`;

function Main() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const isMeetingSelected = pathname !== "/main";

  useEffect(
    () => () => {
      dispatch(sidebarReset());
    },
    []
  );

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
