import testInitialReduxState from "../../common/util/testInitialReduxState";
import {
  render,
  screen,
  runSagaMiddleware,
  fireEvent,
} from "../../common/util/testUtils";
import Sidebar from "./Sidebar";
import { createGetMeetingListAction } from "./sidebarSagas";

jest.mock("./sidebarSagas", () => ({
  __esModule: true,
  ...jest.requireActual("./sidebarSagas"),
  createGetMeetingListAction: jest.fn(),
}));

describe("Sidebar", () => {
  const initialState = JSON.parse(JSON.stringify(testInitialReduxState));

  beforeAll(() => {
    render(<div id="root" />);
    runSagaMiddleware();
  });

  it("should submit the entered text", () => {
    createGetMeetingListAction.mockImplementation(() => ({ type: "none" }));

    render(<Sidebar />, { preloadedState: initialState });

    const testValue = "testValue";
    const textInputEl = screen.getByRole("textbox");
    const submitButtonEl = screen.getByRole("button");

    fireEvent.input(textInputEl, { target: { value: testValue } });
    fireEvent.click(submitButtonEl);

    expect(createGetMeetingListAction.mock.calls[1][0]).toBe(testValue);
    expect(screen.queryByText(testValue)).not.toBeInTheDocument();
  });
});
