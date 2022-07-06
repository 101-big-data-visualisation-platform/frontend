import { Auth } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import AuthWrapper from "./components/AuthWrapper";
import Navbar from "./components/Navbar";
import AuthContext from "./contexts/AuthContext";
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
  const [user, setUser] = useState(null);
  const fetchCurrentUser = async () => {
    const userInfo = await Auth.currentUserInfo();
    setUser(userInfo);
  };
  useEffect(() => {
    fetchCurrentUser();
  }, []);
  return (
    <ThemeProvider theme={selectedTheme}>
      <AuthContext.Provider value={{ user, setUser }}>
        <GlobalStyles />
        <Navbar
          setSelectedTheme={setSelectedTheme}
          selectedTheme={selectedTheme}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <AuthWrapper>
                <Dashboard />
              </AuthWrapper>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/verify" element={<Verify />} />
        </Routes>
      </AuthContext.Provider>
    </ThemeProvider>
  );
};

export default App;
