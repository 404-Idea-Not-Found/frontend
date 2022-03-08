import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import ErrorMessage from "../../common/components/ErrorMessage";
import Header from "../../common/components/Header";
import Loader from "../../common/components/Loader";
import { COLOR } from "../../common/util/constants";
import { selectUserEmail, selectUserId } from "../login/selectors";
import MyMeetingCardList from "./MyMeetingCardList";
import { createGetMyPageMeetingAction } from "./myPageSagas";
import { resetMyPageSlice } from "./myPageSlice";
import {
  selectError,
  selectIsApiLoading,
  selectIsLoading,
  selectMeetingList,
} from "./selectors";

const MyPageContainer = styled.div`
  min-width: 1300px;
  height: 100vh;

  & ::-webkit-scrollbar {
    display: block;
  }

  & ::-webkit-scrollbar {
    width: 0.5rem;
  }

  & ::-webkit-scrollbar-thumb {
    background: ${COLOR.GREY};
  }

  & ::-webkit-scrollbar-thumb:hover {
    background: black;
  }

  & ::-webkit-scrollbar-track-piece {
    background-color: ${COLOR.LIGHT_GREY};
  }

  .meeting-list-wrapper {
    width: 100%;
    margin: 0 auto;
    height: calc(100% - 1rem - 22px);
    overflow-y: scroll;
  }
`;

function MyPage() {
  const userId = useSelector(selectUserId);
  const email = useSelector(selectUserEmail);
  const meetingList = useSelector(selectMeetingList);
  const error = useSelector(selectError);
  const isLoading = useSelector(selectIsLoading);
  const isApiLoading = useSelector(selectIsApiLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId && email) dispatch(createGetMyPageMeetingAction(userId, email));
  }, [userId, email]);

  useEffect(
    () => () => {
      dispatch(resetMyPageSlice());
    },
    []
  );

  return (
    <MyPageContainer>
      <Header />
      {(!userId || !email) && (
        <ErrorMessage errorMessage="로그인이 필요 합니다!" />
      )}
      {isLoading && <Loader />}
      {isApiLoading && <Loader spinnerWidth="300px" containerHeight="100%" />}
      {error.isError && <ErrorMessage errorMessage={error.errorMessage} />}
      {!isApiLoading && !isLoading && !error.isError && (
        <div className="meeting-list-wrapper">
          <MyMeetingCardList
            meetingType="진행 예정 미팅"
            meetingList={meetingList.plannedMeeting}
          />
          <MyMeetingCardList
            meetingType="지난 미팅"
            meetingList={meetingList.pastMeeting}
          />
          <MyMeetingCardList
            meetingType="예약한 미팅"
            meetingList={meetingList.reservedMeeting}
          />
          <MyMeetingCardList
            meetingType="참여중인 프로젝트"
            meetingList={meetingList.participatingProject}
          />
        </div>
      )}
    </MyPageContainer>
  );
}

export default MyPage;
