import React, { Component, PureComponent } from 'react';

import './Header.scss';

/**
 * 头部
 */
export default class Header extends (PureComponent || Component) {
  constructor(ctx) {
    super(ctx);
  }

  render() {
    return (
      <header className="common_header">头部</header>
    );
  }

}