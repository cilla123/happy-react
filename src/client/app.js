import React, { Component, PureComponent } from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

/**
 * Main
 */
class App extends (PureComponent || Component) {
  render() {
    return <div>Hello Happy React!!</div>;
  }
}

if (typeof window !== 'undefined') {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    window.document.getElementById('app'),
  );
}