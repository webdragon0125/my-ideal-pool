import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';

import Layout from 'src/modules/layout';

import { getAccountInfo } from 'src/store/reducers/auth';

const LoginPage = lazy(() => import('../modules/auth/Login'));
const SignupPage = lazy(() => import('../modules/auth/Signup'));

function Routes() {
  const [isLoaded, setIsLoaded] = useState(false);

  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => !!state.auth.me);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(getAccountInfo({
        final: () => setIsLoaded(true),
      }));
    } else {
      setIsLoaded(true);
    }
  }, [dispatch]);

  return isLoaded ? (
    <Suspense fallback={<div>Loading...</div>}>
      <Layout>
        <Switch>
          <Route exact path="/" render={() => {
            if (isLoggedIn) return <Redirect to="/ideas" />;
            return <Redirect to="/login" />;
          }} />
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignupPage} />
        </Switch>
      </Layout>
    </Suspense>
  ) : <div>Loading...</div>;
}

export default Routes;
