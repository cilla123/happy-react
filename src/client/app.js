/* eslint-disable */
import React, { Component, PureComponent } from 'react';
import { render } from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom';

import registerServiceWorker from './registerServiceWorker';
import Routes from './routes'
import Header from '@bussiness_components/Header/Header.js';

/**
 * Main
 */
class App extends (PureComponent || Component) {
  render() {
    return (
      <div>
        <Header />
        <Switch>
          {
            Routes.map(({ name, path, exact=true, component }) => (
              <Route path={path} exact={exact} component={component} key={name} />
            ))
          }
        </Switch>
      </div>
    );
  }
}

render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById('app'),
);

// pwa
registerServiceWorker();