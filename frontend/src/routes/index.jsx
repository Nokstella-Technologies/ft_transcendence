// Routes.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Login from '../pages/Login';
import SignUp from '../pages/SingUp';
import Home from '../pages/Home';
import { AuthContext } from '../context/AuthContex';

const Routes = () => {
  const { loading } = useContext(AuthContext);

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Router>
          <Switch>
            <Route path="/login" component={Login} exact />
            <Route path="/register" component={SignUp} />
            <ProtectedRoute path="/home" component={Home} />
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
          </Switch>
        </Router>
      )}
    </>
  );
};

export default Routes;