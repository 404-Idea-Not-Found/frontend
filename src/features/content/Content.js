import styled from "styled-components";

const ContentContainer = styled.div`
  width: auto;
  height: auto;
  box-sizing: border-box;
`;

function Content() {
  return (
    <ContentContainer>
      참여하고 싶은 미팅을 왼쪽에서 선택해주세요
    </ContentContainer>
  );
}

export default Content;
