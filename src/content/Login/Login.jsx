import React, { useState } from "react";
import {
  Button,
  Form,
  TextInput,
  InlineLoading,
  FormGroup,
  Stack,
  Theme,
  PasswordInput,
} from "@carbon/react";
import axios from "axios";

function login(username, password, setLoading, setLoginError) {
  setLoading(true);
  axios
    .get("/assetlift/user")
    .then((response) => {
      // Handle successful response
      console.log(response.data); // Exibe todos os usuários na resposta do servidor
      const users = response.data;
      // Verifica se os nomes de usuário e senhas correspondem
      const foundUser = users.find((user) => user.username === username && user.password === password);
      if (foundUser) {
        console.log("Logged");
      } else {
        // Exibe uma mensagem de erro se as credenciais são inválidas
        setLoading(false);
        setLoginError(true);
      }
    })
    .catch((error) => {
      setLoading(false);
      console.log(error);
      setLoginError(true);
    });
}

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    setLoginError(false);
    login(username, password, setSubmitting, setLoginError);
  };

  return (
    <Theme theme="g10">
      <Form onSubmit={handleSubmit}>
        <FormGroup style={{ maxWidth: "400px" }}>
          <Stack gap={7}>
            <TextInput
              id="username"
              labelText="Username"
              value={username}
              onChange={handleUsernameChange}
            />
            <PasswordInput
              id="password"
              labelText="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            <Button type="submit" disabled={submitting}>
              {submitting ? <InlineLoading description="Loading" /> : "Log in"}
            </Button>
            {loginError && (
              <p style={{ color: "red", marginTop: "1rem" }}>
                Incorrect username or password
              </p>
            )}
          </Stack>
        </FormGroup>
      </Form>
    </Theme>
  );
}

export default Login;