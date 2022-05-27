import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import Navbar from "./components/Navbar";
import { GlobalStyles } from "./themes/globalStyles";
import themes from "./themes/schema.json";
const App = () => {
  const [selectedTheme, setSelectedTheme] = useState(
    JSON.parse(localStorage.getItem("theme")!) || themes.data.light
  );
  return (
    <ThemeProvider theme={selectedTheme}>
      <GlobalStyles />
      <Navbar
        setSelectedTheme={setSelectedTheme}
        selectedTheme={selectedTheme}
      />
    </ThemeProvider>
  );
};

export default App;
