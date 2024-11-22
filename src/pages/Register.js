import React, { useState } from "react";
import {
  Box,
  Button,
  Form,
  FormField,
  Page,
  PageContent,
  PageHeader,
  TextInput,
  Text,
} from "grommet";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }
    setError("");
    alert(`Registered successfully with Email: ${formData.email}`);
    // Add API call to handle user registration
  };

  return (
    <Page background="light-3" fill>
      <Box fill align="center" justify="start" pad="medium">
        <Box width="30%" pad="medium" background="white" elevation="small" round="small">
          <PageHeader title="Register" alignSelf="left" />
          {error && (
            <Text color="status-critical" margin={{ bottom: "small" }}>
              {error}
            </Text>
          )}
          <Form onSubmit={handleSubmit}>
            <FormField label="Name" name="name" required>
              <TextInput
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </FormField>
            <FormField label="Email" name="email" required>
              <TextInput
                name="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </FormField>
            <FormField label="Password" name="password" required>
              <TextInput
                name="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </FormField>
            <FormField label="Address" name="address">
              <TextInput
                name="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </FormField>
            <Box direction="row" gap="medium" justify="center" margin={{ top: "medium" }}>
              <Button type="submit" label="Register" primary />
              <Button label="Cancel" href="/" />
            </Box>
          </Form>
        </Box>
      </Box>
    </Page>
  );
};

export default Register;