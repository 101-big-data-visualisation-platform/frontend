import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import Navbar from "./components/Navbar/Navbar";
import themes from "./themes/schema.json";
const App = () => {
  const [selectedTheme, setSelectedTheme] = useState(themes.data.light);
  return (
    <ThemeProvider theme={selectedTheme}>
      <Navbar
        setSelectedTheme={setSelectedTheme}
        selectedTheme={selectedTheme}
      />
    </ThemeProvider>
  );
};

export default App;
