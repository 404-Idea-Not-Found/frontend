import useMeetingListSearch from "../../common/hooks/useMeetingListSearch";
import testInitialReduxState from "../../common/util/initialState";
import {
  render,
  screen,
  runSagaMiddleware,
  fireEvent,
} from "../../common/util/testUtils";
import Sidebar from "./Sidebar";
import { textSubmitted } from "./SidebarSlice";

jest.mock("../../common/hooks/useMeetingListSearch", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("./SidebarSlice", () => ({
  __esModule: true,
  ...jest.requireActual("./SidebarSlice"),
  textSubmitted: jest.fn(),
}));

describe("Sidebar", () => {
  const initialState = JSON.parse(JSON.stringify(testInitialReduxState));

  beforeAll(() => {
    render(<div id="root" />);
    runSagaMiddleware();
  });

  beforeEach(() => {
    render(<div id="root" />);
    window.history.pushState({}, "", "/my-page");
  });

  it("should submit the entered text", () => {
    useMeetingListSearch.mockImplementation(() => ({
      isLoading: false,
      error: { isError: false, errorMessage: null },
      meetingList: [],
      hasMore: false,
    }));
    textSubmitted.mockImplementation(() => ({
      type: "none",
    }));

    render(<Sidebar />, { preloadedState: initialState });

    const textInputEl = screen.getByRole("textbox");
    const submitButtonEl = screen.getByRole("button");

    fireEvent.input(textInputEl, { target: { value: "testValue" } });
    fireEvent.click(submitButtonEl);

    expect(screen.queryByText("testValue")).not.toBeInTheDocument();
  });
});
