import { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import refreshIcon from "../../images/refreshIcon.png";
import searchbarIcon from "../../images/searchbarIcon.png";
import MeetingList from "../meetingList/MeetingList";
import { sidebarRefreshed, textSubmitted } from "./SidebarSlice";

const SidebarContainer = styled.div`
  max-width: 410px;
  min-width: 400px;
  height: 100%;

  .down-arrow {
    display: block;
    margin: 0 auto;
    width: 2rem;
  }
`;

const SearchbarContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  margin: 2rem 0;
  padding-left: 1rem;
  display: flex;
  align-items: center;

  .refreshIcon {
    display: block;
    padding: 0;
    margin: 0 auto;
    width: 2rem;
    transition: all 0.2s;
    border: none;
    background-color: transparent;
  }

  .refreshIcon:hover {
    transform: rotate(180deg);
  }
`;

const Searchbar = styled.form`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  border: 3px solid black;
  border-radius: 30px;
  width: 85%;
  overflow: hidden;

  .searchbarIcon {
    margin: 0.1rem 0.5rem;
    padding-bottom: 0.2rem;
    width: 1.5rem;
    height: 1.5rem;
  }

  input {
    width: 85%;
    font-size: 2rem;
    outline: none;
    border: none;
  }
`;

function Sidebar() {
  const [enteredText, setEnteredText] = useState("");
  const dispatch = useDispatch();

  function handleTextSubmit(event) {
    event.preventDefault();
    setEnteredText("");
    dispatch(textSubmitted({ enteredText, lastId: null }));
  }

  function handleTextInput(event) {
    setEnteredText(event.target.value);
  }

  function handleRefreshButtonClick() {
    dispatch(sidebarRefreshed());
  }

  return (
    <SidebarContainer>
      <SearchbarContainer>
        <Searchbar id="searchbar" onSubmit={handleTextSubmit}>
          <img
            htmlFor="searchbar"
            className="searchbarIcon"
            src={searchbarIcon}
            alt="searchbar-icon"
          />
          <input type="text" onChange={handleTextInput} value={enteredText} />
        </Searchbar>
        <button
          className="refreshIcon"
          type="button"
          onClick={handleRefreshButtonClick}
        >
          <img className="refreshIcon" src={refreshIcon} alt="refresh-icon" />
        </button>
      </SearchbarContainer>
      <MeetingList />
    </SidebarContainer>
  );
}

export default Sidebar;
