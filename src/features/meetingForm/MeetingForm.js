import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import createNewMeeting from "../../common/api/createNewMeeting";
import Modal from "../../common/components/Modal";
import { COLOR } from "../../common/util/constants";
import getErrorMessage from "../../common/util/getErrorMessage";
import { createGetMeetingListAction } from "../sidebar/sidebarSagas";

const StyledForm = styled.form`
  min-height: 400px;
  width: 70%;
  max-height: calc(100vh - 2rem - 2px);
  margin: 3rem 0;

  label {
    display: block;
    font-size: 1.5rem;
    font-weight: bold;
    width: 20rem;
  }

  button {
    display: block;
    width: 20rem;
    margin: 0 auto;
    padding: 1rem 2rem;
    font-size: 2rem;
    font-weight: bold;
    background-color: ${COLOR.BRIGHT_GREEN};
    border: none;
    cursor: pointer;
  }

  button:disabled {
    background-color: ${COLOR.LIGHT_GREY};
    cursor: not-allowed;
  }

  #form-meeting-title {
    color: ${(props) => (props.titleError ? "red" : "black")};
    font-size: 1.2rem;
    width: 15rem;
  }

  #form-meeting-tag-1 {
    width: 10rem;
    margin-right: 2rem;
    color: ${(props) => (props.tag1Error ? "red" : "black")};
    font-size: 1.2rem;
  }

  #form-meeting-tag-2 {
    width: 10rem;
    color: ${(props) => (props.tag2Error ? "red" : "black")};
    font-size: 1.2rem;
  }

  #form-meeting-start-time {
    color: ${(props) => (props.startTimeError ? "red" : "black")};
    width: 25rem;
    font-size: 1.2rem;
  }

  #form-meeting-recruitment-number {
    color: ${(props) => (props.recruitmentNumberError ? "red" : "black")};
    width: 3rem;
    font-size: 1.2rem;
  }

  #form-meeting-description {
    color: ${(props) => (props.descriptionError ? "red" : "black")};
    width: 100%;
    height: 15rem;
    resize: none;
    font-family: inherit;
    font-size: 1.2rem;
  }
`;

const InputContainer = styled.div`
  margin: 0 auto;
  margin-bottom: 1rem;
  width: 70%;
`;

const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 2rem - 2px);
  width: 100%;
  overflow-y: auto;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 0.5rem;
`;

function MeetingForm() {
  const [enteredTitle, setEnteredTitle] = useState("");
  const [titleError, setTitleError] = useState(null);
  const [enteredTag1, setEnteredTag1] = useState("");
  const [enteredTag2, setEnteredTag2] = useState("");
  const [tag1Error, setTag1Error] = useState(null);
  const [tag2Error, setTag2Error] = useState(null);
  const [enteredStartTime, setEnteredStartTime] = useState("");
  const [startTimeError, setStartTimeError] = useState(null);
  const [enteredRecruitmentNumber, setEnteredRecruitmentNumber] = useState("");
  const [recruitmentNumberError, setRecruitmentNumberError] = useState(null);
  const [enteredDescription, setEnteredDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isFormValid =
    !titleError &&
    enteredTitle.trim().length &&
    !startTimeError &&
    enteredStartTime.trim().length &&
    !recruitmentNumberError &&
    !descriptionError &&
    enteredDescription.trim().length &&
    !tag1Error &&
    !tag2Error;

  function handleTitleInput(event) {
    setEnteredTitle(event.target.value);
    const isTitleMinLength = event.target.value.length > 1;
    const isTitleMaxLength = event.target.value.length < 16;

    if (!isTitleMinLength || !isTitleMaxLength) {
      setTitleError("2 ~ 15 글자 이내로 입력해주세요!");
      return;
    }

    setTitleError(null);
  }

  function handleTag1Input(event) {
    setEnteredTag1(event.target.value);
    const isTagMaxLength = event.target.value.length <= 10;

    if (!isTagMaxLength) {
      setTag1Error("10 글자 이내로 입력해주세요!");
      return;
    }

    setTag1Error(null);
  }

  function handleTag2Input(event) {
    setEnteredTag2(event.target.value);
    const isTagMaxLength = event.target.value.length <= 10;

    if (!isTagMaxLength) {
      setTag2Error("10 글자 이내로 입력해주세요!");
      return;
    }

    setTag2Error(null);
  }

  function handleStartTimeInput(event) {
    setEnteredStartTime(event.target.value);
    const isDateLater = new Date(event.target.value) - new Date() > 0;

    if (!isDateLater) {
      setStartTimeError("현재시간 이후로 예약해 주세요!");
      return;
    }

    setStartTimeError(null);
  }

  function handleRecruitmentNumberInput(event) {
    setEnteredRecruitmentNumber(event.target.value);
    const isMinRecruitmentNumber = event.target.value >= 0;

    if (!isMinRecruitmentNumber) {
      setRecruitmentNumberError("0 이상의 숫자를 입력해주세요!");
      return;
    }

    setRecruitmentNumberError(null);
  }

  function handleDescriptionInput(event) {
    setEnteredDescription(event.target.value);
    const isMinDescription = event.target.value.length >= 10;
    const isMaxDescription = event.target.value.length <= 300;

    if (!isMinDescription || !isMaxDescription) {
      setDescriptionError("10 ~ 300 글자 이내로 입력 해주세요");
      return;
    }

    setDescriptionError(null);
  }

  async function handleFormSubmission(event) {
    event.preventDefault();
    const meetingData = {
      title: enteredTitle,
      tag: [enteredTag1, enteredTag2],
      description: enteredDescription,
      recruitmentNumber: enteredRecruitmentNumber,
      startTime: enteredStartTime,
    };

    if (isFormValid) {
      try {
        await createNewMeeting(meetingData);
        setShowSuccessModal(true);
      } catch (error) {
        const errorMessage = getErrorMessage(error);

        setSubmissionError(errorMessage);
      }
    }
  }

  function handleErrorModalCloseClick() {
    setSubmissionError(null);
  }

  function handleSuccessModalCloseClick() {
    navigate("/main");
    dispatch(createGetMeetingListAction(""));
  }

  return (
    <FormWrapper>
      {submissionError && (
        <Modal onModalClose={handleErrorModalCloseClick}>
          <h1>미팅생성에 실패했습니다.</h1>
          <div>{submissionError}</div>
        </Modal>
      )}
      {showSuccessModal && (
        <Modal onModalClose={handleSuccessModalCloseClick}>
          <h2>미팅생성이 완료되었습니다!</h2>
          <p>마이페이지에서 약속 시간에 맞추어 미팅에 참여해 주세요!</p>
          <button type="button" onClick={handleSuccessModalCloseClick}>
            메인으로
          </button>
        </Modal>
      )}
      <StyledForm
        onSubmit={handleFormSubmission}
        titleError={titleError}
        tag1Error={tag1Error}
        tag2Error={tag2Error}
        startTimeError={startTimeError}
        recruitmentNumberError={recruitmentNumberError}
        descriptionError={descriptionError}
        isFormValid={isFormValid}
      >
        <InputContainer>
          <div className="space-taker" />
          <label htmlFor="form-meeting-title">제목</label>
          <input
            id="form-meeting-title"
            type="text"
            placeholder="제목을 입력하세요"
            onChange={handleTitleInput}
            value={enteredTitle}
            minLength={2}
            required
          />
          {titleError && <ErrorMessage>{titleError}</ErrorMessage>}
        </InputContainer>
        <InputContainer>
          <label htmlFor="form-meeting-tag-1">태그</label>
          <input
            id="form-meeting-tag-1"
            type="text"
            placeholder="태그1"
            onChange={handleTag1Input}
            value={enteredTag1}
            maxLength={11}
          />
          <input
            id="form-meeting-tag-2"
            type="text"
            placeholder="태그2"
            onChange={handleTag2Input}
            value={enteredTag2}
            maxLength={11}
          />
          {tag1Error && <ErrorMessage>{tag1Error}</ErrorMessage>}
          {tag2Error && <ErrorMessage>{tag2Error}</ErrorMessage>}
        </InputContainer>
        <InputContainer>
          <label htmlFor="form-meeting-start-time">미팅 시작시간</label>
          <input
            id="form-meeting-start-time"
            type="datetime-local"
            onChange={handleStartTimeInput}
            value={enteredStartTime}
            required
          />
          {startTimeError && <ErrorMessage>{startTimeError}</ErrorMessage>}
        </InputContainer>
        <InputContainer>
          <label htmlFor="form-meeting-recruitment-number">모집인원</label>
          <input
            id="form-meeting-recruitment-number"
            type="number"
            step={1}
            min={0}
            onChange={handleRecruitmentNumberInput}
            value={enteredRecruitmentNumber}
            required
          />
          {recruitmentNumberError && (
            <ErrorMessage>{recruitmentNumberError}</ErrorMessage>
          )}
        </InputContainer>
        <InputContainer>
          <label
            htmlFor="form-meeting-description"
            onChange={handleDescriptionInput}
            value={enteredDescription}
          >
            미팅 상세설명
          </label>
          <textarea
            id="form-meeting-description"
            minLength={10}
            maxLength={300}
            placeholder="미팅에 대한 설명을 입력하세요"
            onChange={handleDescriptionInput}
            required
          />
          {descriptionError && <ErrorMessage>{descriptionError}</ErrorMessage>}
        </InputContainer>
        <button type="submit" disabled={!isFormValid}>
          미팅생성
        </button>
      </StyledForm>
    </FormWrapper>
  );
}

export default MeetingForm;
