import userEvent from "@testing-library/user-event";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import createNewMeeting from "../../common/api/createNewMeeting";
import testInitialReduxState from "../../common/util/testInitialReduxState";
import {
  render,
  fireEvent,
  screen,
  runSagaMiddleware,
} from "../../common/util/testUtils";
import MeetingForm from "./MeetingForm";

jest.mock("../../common/api/createNewMeeting", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const wrappedMeetingFormComponent = (
  <BrowserRouter>
    <Routes>
      <Route path="main/new-meeting" element={<MeetingForm />} />
    </Routes>
  </BrowserRouter>
);

describe("MeetingForm", () => {
  let initialState = JSON.parse(JSON.stringify(testInitialReduxState));

  beforeAll(() => {
    render(<div id="root" />);
    runSagaMiddleware();
  });

  beforeEach(() => {
    render(<div id="root" />);
    window.history.pushState({}, "", "/main/new-meeting");
  });

  afterEach(() => {
    initialState = JSON.parse(JSON.stringify(testInitialReduxState));
  });

  it("should validate title", () => {
    render(wrappedMeetingFormComponent, { preloadedState: initialState });

    const textInputEl = screen.getByPlaceholderText("제목을 입력하세요");

    fireEvent.input(textInputEl, { target: { value: "1" } });

    expect(
      screen.getByText("2 ~ 15 글자 이내로 입력해주세요!")
    ).toBeInTheDocument();

    fireEvent.input(textInputEl, { target: { value: "23" } });

    expect(
      screen.queryByText("2 ~ 15 글자 이내로 입력해주세요!")
    ).not.toBeInTheDocument();

    fireEvent.input(textInputEl, { target: { value: "4567891234567891234" } });

    expect(
      screen.getByText("2 ~ 15 글자 이내로 입력해주세요!")
    ).toBeInTheDocument();
  });

  it("should validate tag", () => {
    render(wrappedMeetingFormComponent, { preloadedState: initialState });

    const tagInputEl = screen.getByPlaceholderText("태그1");

    fireEvent.input(tagInputEl, { target: { value: "123" } });

    expect(
      screen.queryByText("10 글자 이내로 입력해주세요!")
    ).not.toBeInTheDocument();

    fireEvent.input(tagInputEl, { target: { value: "45678912345" } });

    expect(
      screen.getByText("10 글자 이내로 입력해주세요!")
    ).toBeInTheDocument();

    userEvent.type(
      tagInputEl,
      "{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}"
    );

    expect(
      screen.queryByText("10 글자 이내로 입력해주세요!")
    ).not.toBeInTheDocument();
  });

  it("should validate meeting start time", () => {
    render(wrappedMeetingFormComponent, { preloadedState: initialState });

    const datetimeInputEl = screen.getByLabelText("미팅 시작시간");

    fireEvent.change(datetimeInputEl, {
      target: { value: "1999-10-10T00:00:00" },
    });

    expect(
      screen.getByText("현재시간 이후로 예약해 주세요!")
    ).toBeInTheDocument();

    fireEvent.change(datetimeInputEl, {
      target: { value: "2100-10-10T00:00:00" },
    });

    expect(
      screen.queryByText("현재시간 이후로 예약해 주세요!")
    ).not.toBeInTheDocument();
  });

  it("should validate meeting description", () => {
    render(wrappedMeetingFormComponent, { preloadedState: initialState });

    const descriptionInputEl = screen.getByLabelText("미팅 상세설명");

    fireEvent.change(descriptionInputEl, {
      target: { value: "1" },
    });

    expect(
      screen.getByText("10 ~ 300 글자 이내로 입력 해주세요")
    ).toBeInTheDocument();

    fireEvent.change(descriptionInputEl, {
      target: { value: "2345678912345" },
    });

    expect(
      screen.queryByText("10 ~ 300 글자 이내로 입력 해주세요")
    ).not.toBeInTheDocument();
  });

  describe("should show modal depending on submission result.", () => {
    beforeEach(() => {
      render(wrappedMeetingFormComponent, { preloadedState: initialState });

      const textInputEl = screen.getByPlaceholderText("제목을 입력하세요");
      const datetimeInputEl = screen.getByLabelText("미팅 시작시간");
      const recruitmentNumberInputEl = screen.getByLabelText("모집인원");
      const descriptionInputEl = screen.getByLabelText("미팅 상세설명");

      fireEvent.change(datetimeInputEl, {
        target: { value: "2100-10-10T00:00:00" },
      });
      fireEvent.input(recruitmentNumberInputEl, { target: { value: 2 } });
      fireEvent.input(textInputEl, { target: { value: "123" } });
      fireEvent.change(descriptionInputEl, {
        target: { value: "12345678912345" },
      });
    });

    it("should show success modal if success", async () => {
      createNewMeeting.mockImplementation(() => {});

      const submitButtonEl = screen.getByText("미팅생성");

      fireEvent.click(submitButtonEl);

      const successMessage = await screen.findByText(
        "미팅생성이 완료되었습니다!"
      );

      expect(successMessage).toBeInTheDocument();
    });

    it("should show fail modal if success", async () => {
      createNewMeeting.mockImplementation(() => {
        throw new Error("test");
      });

      const submitButtonEl = screen.getByText("미팅생성");

      fireEvent.click(submitButtonEl);

      const successMessage = await screen.findByText(
        "미팅생성에 실패했습니다."
      );

      expect(successMessage).toBeInTheDocument();
    });
  });
});
