import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
//import Sidebar from "./components/Sidebar";
import Home from "./views/Home";
import Profile from "./views/Profile";
import Plants from "./views/Plants";
import Weather from "./views/Weather";
import Dashboard from "./views/Dashboard";
import Historical from "./views/Historical";
import ExternalApi from "./views/ExternalApi";
import { useAuth0 } from "@auth0/auth0-react";
import history from "./utils/history";

// styles
import "./App.css";

// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
import Schedule from "./views/Schedule";
import CreateSchedule from "./views/CreateSchedule";
import EditSchedule from "./views/EditSchedule";
initFontAwesome();

const App = () => {
  const { isLoading, error } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router history={history}>
      <div id="app" className="d-flex flex-column h-100">
        <NavBar />
        <Container className="flex-grow-1 mt-5">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/plants" component={Plants} />
            <Route path="/weather" component={Weather} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/history" component={Historical} />
            <Route path="/external-api" component={ExternalApi} />
            <Route path="/schedule/create" component={CreateSchedule} />
            <Route path="/schedule/edit/:id" component={EditSchedule} />
            <Route path="/schedule" component={Schedule} />
          </Switch>
        </Container>
      </div>
    </Router>
  );
};

export default App;
