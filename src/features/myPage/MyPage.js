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
  }, [userId, email, dispatch]);

  useEffect(
    () => () => {
      dispatch(resetMyPageSlice());
    },
    []
  );

  return (
    <MyPageContainer>
      <Header />
      {isLoading && <Loader spinnerWidth="300px" containerHeight="50%" />}
      {isApiLoading && <Loader spinnerWidth="300px" containerHeight="50%" />}
      {(!userId || !email) && (
        <ErrorMessage errorMessage="???????????? ?????? ?????????!" />
      )}
      {error.isError && <ErrorMessage errorMessage={error.errorMessage} />}
      {!isApiLoading && !isLoading && !error.isError && (
        <div className="meeting-list-wrapper">
          <MyMeetingCardList
            meetingType="?????? ?????? ??????"
            meetingList={meetingList.plannedMeeting}
          />
          <MyMeetingCardList
            meetingType="?????? ??????"
            meetingList={meetingList.pastMeeting}
          />
          <MyMeetingCardList
            meetingType="????????? ??????"
            meetingList={meetingList.reservedMeeting}
          />
          <MyMeetingCardList
            meetingType="???????????? ????????????"
            meetingList={meetingList.participatingProject}
          />
        </div>
      )}
    </MyPageContainer>
  );
}

export default MyPage;
