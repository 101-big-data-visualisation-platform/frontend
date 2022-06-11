import React, { useContext } from "react";
import { ThemeContext } from "styled-components";
import Mountains from "../../svg/mountains/Mountains";
import { MainDiv } from "./styled";

const Home = () => {
  const theme = useContext(ThemeContext);
  return (
    <MainDiv>
      <Mountains
        color1={theme.colors.tertiary}
        color2={theme.colors.secondary2}
      />
    </MainDiv>
  );
};

export default Home;
