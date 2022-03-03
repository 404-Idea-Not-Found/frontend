import { useParams } from "react-router-dom";
import styled from "styled-components";

import ErrorMessage from "../../common/components/ErrorMessage";
import Loader from "../../common/components/Loader";
import useGetMeeting from "../../common/hooks/useGetMeeting";
import MeetingDetail from "./MeetingDetail";

const StyledDiv = styled.div`
  width: 100%;
  height: calc(100% - 1rem - 22px);
  box-sizing: border-box;
`;

function MeetingDetailContainer() {
  const { meetingId } = useParams();
  const { isLoading, error, meeting } = useGetMeeting(meetingId);

  return (
    <StyledDiv>
      {!isLoading && <MeetingDetail meeting={meeting} />}
      {isLoading && <Loader spinnerWidth="300px" />}
      {error.isError && <ErrorMessage errorMessage={error.errorMessage} />}
    </StyledDiv>
  );
}

export default MeetingDetailContainer;
