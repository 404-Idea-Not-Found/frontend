import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";

import Sidebar from "../../../features/sidebar/Sidebar";
import Header from "../../components/Header";
import debounce from "../../util/debounce";
import { containerScrolled, deltaReset } from "./mainSlice";

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
  const contentsContainerRef = useRef();
  const dispatch = useDispatch();
  const isMeetingSelected = pathname !== "/main";

  useEffect(() => {
    let isScrollHandlerCalled = false;
    const initialScrollTopLeft = { top: null, left: null };
    const scrollHandler = debounce(() => {
      if (!isScrollHandlerCalled) {
        initialScrollTopLeft.top = contentsContainerRef.current.scrollTop;
        initialScrollTopLeft.left = contentsContainerRef.current.scrollLeft;
        isScrollHandlerCalled = true;
      }
      const topDelta =
        initialScrollTopLeft.top - contentsContainerRef.current.scrollTop;
      const leftDelta =
        initialScrollTopLeft.left - contentsContainerRef.current.scrollLeft;

      dispatch(containerScrolled({ topDelta, leftDelta }));
    }, 200);

    contentsContainerRef.current.addEventListener("scroll", scrollHandler);
    const memoizedEl = contentsContainerRef.current;

    return () => {
      memoizedEl.removeEventListener("scroll", scrollHandler);
      dispatch(deltaReset());
    };
  }, []);

  return (
    <MainContainer>
      <Sidebar />
      <Divider />
      <ContentsContainer ref={contentsContainerRef}>
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
