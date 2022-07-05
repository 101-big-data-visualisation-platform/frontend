import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/dashboard";
import ForgotPassword from "./pages/forgotPassword";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Verify from "./pages/verify";
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/verify" element={<Verify />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
