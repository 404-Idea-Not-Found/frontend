import styled from "styled-components";

import refreshIcon from "../../images/refreshIcon.png";
import searchbarIcon from "../../images/searchbarIcon.png";
import MeetingList from "../meetingList/MeetingList";

const SidebarContainer = styled.div`
  width: 40%;
  height: 90%;
`;

const SearchbarContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  margin: 2rem 0;
  padding-left: 1rem;
  display: flex;
  align-items: center;

  .refreshIcon {
    margin: 0 auto;
    width: 2rem;
    transition: all 0.2s;
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
  return (
    <SidebarContainer>
      <SearchbarContainer>
        <Searchbar id="searchbar">
          <img
            htmlFor="searchbar"
            className="searchbarIcon"
            src={searchbarIcon}
            alt="searchbar-icon"
          />
          <input type="text" />
        </Searchbar>
        <img className="refreshIcon" src={refreshIcon} alt="refresh-icon" />
      </SearchbarContainer>
      <MeetingList />
    </SidebarContainer>
  );
}

export default Sidebar;
