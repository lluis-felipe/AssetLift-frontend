import React, { Component } from 'react';
import {
  Button,
  FormGroup,
  Form,
  Stack,
  TextInput,
  Theme,
  PasswordInput,
  HeaderName,
  Header,
  InlineLoading
} from '@carbon/react';
import axios from 'axios';
import UIShell from '../UIShell/UIShell';


// logoutfunction
// handleLogout = () => {
//   localStorage.removeItem('isLoggedIn');
//   this.setState({ logged: false });
// }

class Login extends Component {
  state = {
    username: '',
    password: '',
    loginError: '',
    submitting: false,
    logged: false
  }

  handleInputChange = (event) => {
    const { id, value } = event.target;
    this.setState({ [id]: value });
  }

  componentDidMount() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      this.setState({ logged: true });
    }
  }
  

  handleLogin = () => {
    const { username, password } = this.state;
    axios.get("/assetlift/user")
      .then((response) => {
        // handle successful login response here
        this.setState({ submitting: true });
        const users = response.data;
        const foundUser = users.find((user) => user.username === username && user.password === password);
        if (foundUser) {
          this.setState({ logged: true });
          localStorage.setItem('isLoggedIn', true);
          console.log("Logged");
        } else {
          // Exibe uma mensagem de erro se as credenciais são inválidas
          this.setState({ submitting: false });
          this.setState({
            loginError: <p style={{ color: "red" }}>
              Incorrect username or password
            </p>
          });
        }
      })
      .catch((error) => {
        // handle login error here
        console.log(error)
      });
  }

  render() {
    const { username, password, loginError, submitting, logged } = this.state;

    return (
      <Theme theme="g10">
        <Header aria-label="IBM Platform Name">
          <HeaderName href="#" prefix="Welcome to">
            AssetLift
          </HeaderName>
        </Header>
        {logged ? (
          <UIShell />
        ) : (
          <FormGroup legendText="Login">
            <Form className="login-form">
              <Stack gap={7}>
                <TextInput
                  id="username"
                  labelText="Username"
                  required
                  value={username}
                  onChange={this.handleInputChange}
                />
                <PasswordInput
                  id="password"
                  labelText="Password"
                  required
                  value={password}
                  onChange={this.handleInputChange}
                />
                <Button onClick={this.handleLogin}>
                  {submitting ? <InlineLoading /> : "Log in"}
                </Button>
                {loginError && <p>{loginError}</p>}
              </Stack>
            </Form>
          </FormGroup>
        )}
      </Theme>
    );
  }
};

export default Login;
