import React, { Component, PureComponent } from 'react'

/**
 * 异步组件
 */
export default (loadComponent, placeholder="") => {
    return class AsyncLoadComponent extends (PureComponent || Component) {

        unmount = false

        constructor(){
            super()
            this.state = {
                Child: null
            }
        }

        componentWillUnmount(){
            this.unmount = true
        }

        async componentDidMount(){
            const { default: Child } = await loadComponent()
            if (this.unmount) return
            this.setState({
                Child
            })
        }

        render() {
            const { Child } = this.state
            return (
                Child ? <Child {...this.props} /> : placeholder
            )
        }

    }
}