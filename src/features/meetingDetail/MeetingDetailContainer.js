import { useParams } from "react-router-dom";
import styled from "styled-components";

import ErrorMessage from "../../common/components/ErrorMessage";
import Loader from "../../common/components/Loader";
import useGetMeeting from "../../common/hooks/useGetMeeting";
import MeetingDetail from "./MeetingDetail";

const StyledDiv = styled.div`
  width: 100%;
  height: calc(100vh - 3.5rem);
  box-sizing: border-box;
`;

const LoaderContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function MeetingDetailContainer() {
  const { meetingId } = useParams();
  const { isLoading, error, meeting } = useGetMeeting(meetingId);

  return (
    <StyledDiv>
      {!isLoading && <MeetingDetail meeting={meeting} />}
      {isLoading && (
        <LoaderContainer>
          <Loader spinnerWidth="200px" containerHeight="90%" />
        </LoaderContainer>
      )}
      {error.isError && <ErrorMessage errorMessage={error.errorMessage} />}
    </StyledDiv>
  );
}

export default MeetingDetailContainer;
