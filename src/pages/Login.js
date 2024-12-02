import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Form,
  FormField,
  Page,
  PageHeader,
  Text,
  TextInput,
  Anchor,
  ResponsiveContext,
} from "grommet";
import { User, Lock } from "grommet-icons";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const size = useContext(ResponsiveContext); // Detect screen size
  const navigate = useNavigate(); // Hook for navigation
  const { login } = useContext(AuthContext); // Access login function from AuthContext

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        login(data.userID); // Save the user ID using AuthContext
        setError("");

        try {
          // Fetch the list of movies
          const moviesResponse = await fetch("http://localhost:8080/movies/");
          const movies = await moviesResponse.json();

          // Get today's date
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Normalize time to midnight

          // Filter movies with future release dates
          const futureMovies = movies.filter((movie) => {
            const releaseDate = new Date(movie.releaseDate);
            return releaseDate > today;
          });

          // Fetch the user's profile
          const userProfileResponse = await fetch(
            `http://localhost:8080/users/${data.userID}`
          );
          const userProfile = await userProfileResponse.json();

          // Extract existing notification messages
          const existingMessages = userProfile.notificationHistory.map(
            (notification) => notification.message
          );

          // For each future movie, check if the notification exists
          for (const movie of futureMovies) {
            const message = `${movie.movieTitle} is coming out on ${movie.releaseDate}`;
            if (!existingMessages.includes(message)) {
              // Send notification to the notifications endpoint
              await fetch(`http://localhost:8080/notifications/`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userID: data.userID,
                  message,
                }),
              });
            }
          }

          // Check for the membership fee notification
          const membershipMessage = "Membership fee automatically withdrawn";
          if (!existingMessages.includes(membershipMessage)) {
            // Send the membership fee notification
            await fetch(`http://localhost:8080/notifications/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userID: data.userID,
                message: membershipMessage,
              }),
            });
          }
        } catch (notificationError) {
          console.error("Error sending notifications:", notificationError);
        }
        // End Notification Feature

        navigate("/"); // Navigate to Home page after successful login
      } else if (response.status === 401) {
        setError("Account not recognized. Please check your credentials.");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    }
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
            <Box
              direction="row"
              gap="medium"
              margin={{ top: "medium" }}
              justify="center"
            >
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