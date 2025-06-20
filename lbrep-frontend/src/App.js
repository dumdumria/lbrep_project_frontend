
import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StyledEngineProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import 'leaflet/dist/leaflet.css';
import { useImmerReducer } from 'use-immer';

import HomeScreen from './components/HomeScreen';
import Listings from './components/Listings';
import Login from './components/Login';
import Header from './components/Header';
import Testing from './components/Testing';
import Register from './components/Register';
import AddProperty from './components/AddProperty';
import Profile from './components/Profile';
import Agencies from './components/Agencies';
import AgencyDetail from './components/AgencyDetail';
import ListingDetail from './components/ListingDetail';

import DispatchContext from './Contexts/DispatchContext';
import StateContext from './Contexts/StateContext';

function App() {
  const initialState = {
    userIsLogged: Boolean(localStorage.getItem("theUserToken")),
    userUsername: localStorage.getItem("theUserUsername") || "",
    userEmail: localStorage.getItem("theUserEmail") || "",
    userId: localStorage.getItem("theUserId") || "",
    userToken: localStorage.getItem("theUserToken") || "",
  };

  function ReducerFuction(draft, action) {
    switch (action.type) {
      case "catchToken":
        draft.userToken = action.tokenValue;
        break;
        
      case "userSignsIn":
        draft.userUsername = action.usernameInfo || "";
        draft.userEmail = action.emailInfo || "";
        draft.userId = action.IdInfo || "";
        draft.userToken = action.tokenValue || draft.userToken; // Keep existing token if not provided
        draft.userIsLogged = true;
        break;

      case "logout":
        draft.userIsLogged = false;
        draft.userUsername = "";
        draft.userEmail = "";
        draft.userId = "";
        draft.userToken = "";
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFuction, initialState);

  // Update localStorage whenever state changes
  useEffect(() => {
    if (state.userIsLogged && state.userToken) {
      localStorage.setItem("theUserUsername", state.userUsername);
      localStorage.setItem("theUserEmail", state.userEmail);
      localStorage.setItem("theUserId", state.userId);
      localStorage.setItem("theUserToken", state.userToken);
    } else {
      localStorage.removeItem("theUserUsername");
      localStorage.removeItem("theUserEmail");
      localStorage.removeItem("theUserId");
      localStorage.removeItem("theUserToken");
    }
  }, [state.userIsLogged, state.userToken, state.userUsername, state.userEmail, state.userId]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <StyledEngineProvider injectFirst>
          <BrowserRouter>
            <CssBaseline />
            <Header />
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/listings/:id" element={<ListingDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/testing" element={<Testing />} />
              <Route path="/register" element={<Register />} />
              <Route path='/addproperty' element={<AddProperty />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/agencies' element={<Agencies />} />
              <Route path='/agencies/:id' element={<AgencyDetail />} />
            </Routes>
          </BrowserRouter>
        </StyledEngineProvider>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
