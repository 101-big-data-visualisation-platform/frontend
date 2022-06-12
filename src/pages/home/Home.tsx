import React, { useContext } from "react";
import { ThemeContext } from "styled-components";
import { Container } from "../../components/Container";
import Mountains from "../../svg/mountains/Mountains";
import {
  AssessmentIconStyled,
  InnerDiv,
  LargeHeading,
  LearnMoreLinkButton,
  MainDiv,
  QueryBuilderIconStyled,
  SpeedIconStyled,
  StartLinkButton,
  StyledDiv1,
  StyledDiv2,
  StyledDiv3,
  StyledDiv4,
  StyledDiv5,
  StyledImage,
  SubHeading,
} from "./styled";

const Home: React.FC = () => {
  const theme = useContext(ThemeContext);
  return (
    <MainDiv>
      <Mountains
        color1={theme.colors.tertiary}
        color2={theme.colors.secondary2}
      />
      <InnerDiv>
        <Container>
          <StyledDiv1>
            <StyledDiv2>
              <StyledDiv3>
                <AssessmentIconStyled />
                <SpeedIconStyled />
                <QueryBuilderIconStyled />
              </StyledDiv3>
              <div>
                <LargeHeading>
                  Quickly visualise time series big data with Mohio.
                </LargeHeading>
                <SubHeading>
                  Developed by Part 4 Compsys Students at the University of
                  Auckland with the guidance of Part 4 Supervisors.
                </SubHeading>
              </div>
            </StyledDiv2>
            <StyledDiv4>
              <StyledDiv5>
                <LearnMoreLinkButton to="/origins">
                  learn more about the original contributors
                </LearnMoreLinkButton>
                <StartLinkButton to="/login">Start</StartLinkButton>
              </StyledDiv5>
              <StyledDiv5>
                <StyledImage src="./images/uoa.png" />
              </StyledDiv5>
            </StyledDiv4>
          </StyledDiv1>
        </Container>
      </InnerDiv>
    </MainDiv>
  );
};

export default Home;
