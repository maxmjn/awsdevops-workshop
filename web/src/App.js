import React, { Component } from 'react'

    import api from './Api'

    import './App.css'

    class App extends Component {
      state = {
        user: null,
        email: '',
        password: '',
      }

      loginUser = async (e) => {
        e.preventDefault()

        const { email, password } = this.state

        const { data: token } = await api.loginUser(email, password)

        const { data: user } = await api.getUser(token)

        this.setState({ user })
      }

      inputChange = e => this.setState({ [e.target.id]: e.target.value })

      renderLoginForm = () => {
        const { email, password } = this.state

        return (
          <form onSubmit={this.loginUser}>
            <h1>An Awesome Form on React</h1>
            <label htmlFor="email">
              <span>Email:</span>
              <input onChange={this.inputChange} value={email} id="email" name="email" type="email" />
            </label>
            <br />
            <label htmlFor="password">
              <span>Password:</span>
              <input onChange={this.inputChange} value={password} id="password" name="password" type="password" />
            </label>
            <br />
            <button type="submit">Login</button>
          </form>
        )
      }

      render () {
        const { user } = this.state

        return (
          <div className="App">
            {user ? (
              <>
                <div>{`Welcome ${user.email}!`}</div>
                <div>{`Your name is ${user.firstname} ${user.lastname}`}</div>
              </>
            ) : this.renderLoginForm()}
          </div>
        )
      }
    }

    export default App