import { useEffect } from "react";
import { RotatingLines } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { meetingListSagaActionCreators } from "./meetingListSagas";
import {
  selectMeetingList,
  selectMeetingListError,
  selectMeetingListIsLoading,
} from "./selectors";

const MeetingListContainer = styled.ul`
  padding: 0 1rem;
  list-style: none;
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Meeting = styled.li`
  margin: 0;
  border: 1px solid black;
`;

function MeetingList() {
  const isLoading = useSelector(selectMeetingListIsLoading);
  const error = useSelector(selectMeetingListError);
  const meetingList = useSelector(selectMeetingList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(meetingListSagaActionCreators.getMeetingList());
  }, []);

  if (isLoading) {
    return (
      <LoaderContainer>
        <RotatingLines width="100" strokeColor="black" />;
      </LoaderContainer>
    );
  }

  if (error.isError) {
    return <div>{`현재 데이터를 불러올 수 없습니다. \n ${error.message}`}</div>;
  }

  return (
    <MeetingListContainer>
      {meetingList.map((meeting) => (
        <Meeting key={meeting._id}>{`${meeting.title}`}</Meeting>
      ))}
    </MeetingListContainer>
  );
}

export default MeetingList;
