import { Auth } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import AuthWrapper from "./components/AuthWrapper";
import Navbar from "./components/Navbar";
import AuthContext from "./contexts/AuthContext";
import DataContext from "./contexts/DataContext";
import GraphsContext from "./contexts/GraphsContext";
import Dashboard from "./pages/dashboard";
import DetailedView from "./pages/detailedView";
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
  const [fetchingUser, setFetchingUser] = useState(false);

  const [allData, setData] = useState([]);
  const [updatingData, setUpdatingData] = useState(false);

  const [allDashboards, setDashboards] = useState([]);

  const fetchCurrentUser = async () => {
    setFetchingUser(true);
    const userInfo = await Auth.currentUserInfo();
    setUser(userInfo);
    setFetchingUser(false);
  };
  useEffect(() => {
    fetchCurrentUser();
  }, []);
  useEffect(() => {
    console.log(allData);
  }, [allData]);
  return (
    <ThemeProvider theme={selectedTheme}>
      <AuthContext.Provider value={{ user, setUser, fetchingUser }}>
        <DataContext.Provider
          value={{ allData, setData, updatingData, setUpdatingData }}
        >
          <GraphsContext.Provider value={{ allDashboards, setDashboards }}>
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
              <Route
                path="/detailed"
                element={
                  <AuthWrapper>
                    <DetailedView />
                  </AuthWrapper>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/verify" element={<Verify />} />
            </Routes>
          </GraphsContext.Provider>
        </DataContext.Provider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
};

export default App;
