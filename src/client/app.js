import React, { Component, PureComponent } from 'react';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

/**
 * Main
 */
class App extends (PureComponent || Component) {
  render() {
    return <div>Hello Happy React!!!</div>;
  }
}

render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById('app'),
);

registerServiceWorker();