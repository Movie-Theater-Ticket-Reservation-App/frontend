import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  Form,
  FormField,
  Page,
  PageContent,
  PageHeader,
  Text,
  TextInput,
  Anchor,
  ResponsiveContext,
} from "grommet";
import { User, Lock } from "grommet-icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const size = useContext(ResponsiveContext); // Detect screen size

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    alert(`Logged in with Email: ${email}`);
  };

  return (
    <Page background="light-3" fill>
        <Box
          fill
          align="center"
          justify={size === "small" ? "center" : "start"} 
          pad={{
            top: size === "small" ? "1/5" : "medium",
            horizontal: "medium",
          }}        
        >
          <Box
            width={size === "small" ? "90%" : "36%"}
            pad="medium"
            background="white"
            elevation="small"
            round="small"
          >
            <PageHeader title="Login" alignSelf="start" />
            {error && (
              <Text color="status-critical" margin={{ bottom: "small" }}>
                {error}
              </Text>
            )}
            <Form onSubmit={handleSubmit}>
              <FormField label="Email" name="email" required>
                <TextInput
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  icon={<User />}
                />
              </FormField>
              <FormField label="Password" name="password" required>
                <TextInput
                  name="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  icon={<Lock />}
                />
              </FormField>
              <Box direction="row" gap="medium" margin={{ top: "medium" }} justify="center">
                <Button type="submit" label="Login" primary />
                <Button label="Sign Up" href="/register" />
              </Box>
            </Form>
            <Text margin={{ top: "small" }} alignSelf="center">
              <Anchor href="/" label="Forgot Password?" />
            </Text>
          </Box>
        </Box>
    </Page>
  );
};

export default Login;