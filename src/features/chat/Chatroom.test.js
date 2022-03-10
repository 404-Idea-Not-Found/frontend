import { render, fireEvent, screen } from "../../common/util/testUtils";
import Chatroom from "./Chatroom";

window.HTMLElement.prototype.scrollIntoView = () => {};

describe("Chatroom", () => {
  const initialReduxState = {
    liveMeeting: {
      chatList: [
        {
          username: "tester",
          date: "2022-03-10T09:52",
          text: "testing chat room",
        },
      ],
    },
  };

  beforeEach(() => render(<Chatroom />, { preloadedState: initialReduxState }));

  it("renders chat from the store", () => {
    const chat = screen.getByText(/testing chat room/i);

    expect(chat).toBeInTheDocument();
  });

  it("displays submitted chat", () => {
    const testText = "Does it work?";
    const inputEl = screen.getByRole("textbox");
    const submitButtonEl = screen.getByRole("button");

    fireEvent.change(inputEl, { target: { value: testText } });
    fireEvent.click(submitButtonEl);
    expect(screen.getByText(testText)).toBeInTheDocument();
  });
});
