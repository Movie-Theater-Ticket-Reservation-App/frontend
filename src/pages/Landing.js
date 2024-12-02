import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Heading,
  Page,
  PageContent,
} from "grommet";
import { Autoplay } from "../components/carousel-autoplay.js";
import MovieGrid from '../components/moviegrid.js';
import { AuthContext } from "../context/AuthContext"; // Import AuthContext

const Landing = () => {
  const [movies, setMovies] = useState([]); // Define the state for movies
  const [error, setError] = useState(""); // For error handling

  const { userID } = useContext(AuthContext); // Get userID from AuthContext

  useEffect(() => {
    // Fetch movies from the backend
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:8080/movies/");
        if (!response.ok) {
          throw new Error("Failed to fetch movies.");
        }
        const data = await response.json();
        // Map the API data to the format required by MovieGrid
        const mappedMovies = data.map((movie) => ({
          title: movie.movieTitle,
          releaseDate: movie.releaseDate, // Use actual release date
          poster: movie.url,
          rating: movie.rate,
          genre: movie.movieGenre,
        }));

        // Get current date without time
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter movies based on releaseDate and user login status
        const filteredMovies = mappedMovies.filter((movie) => {
          if (!movie.releaseDate) {
            // If releaseDate is unspecified, all users can see it
            return true;
          }
          const releaseDate = new Date(movie.releaseDate);
          if (isNaN(releaseDate.getTime())) {
            // If releaseDate is invalid, include the movie
            return true;
          }
          if (releaseDate < today) {
            // If releaseDate is before today, all users can see it
            return true;
          }
          // If releaseDate is after today, only logged-in users can see it
          return userID ? true : false;
        });

        // Sort the movies by release date (newest first)
        const sortedMovies = filteredMovies.sort((a, b) => {
          const dateA = a.releaseDate ? new Date(a.releaseDate) : null;
          const dateB = b.releaseDate ? new Date(b.releaseDate) : null;

          if (dateA && !isNaN(dateA.getTime()) && dateB && !isNaN(dateB.getTime())) {
            // Both movies have valid release dates
            return dateB - dateA; // Newest first
          } else if (dateA && !isNaN(dateA.getTime())) {
            // Only movie A has a valid release date
            return -1; // Movie A comes before Movie B
          } else if (dateB && !isNaN(dateB.getTime())) {
            // Only movie B has a valid release date
            return 1; // Movie B comes before Movie A
          } else {
            // Neither movie has a valid release date
            return 0; // Keep original order
          }
        });

        setMovies(sortedMovies);
      } catch (err) {
        setError(err.message || "An error occurred while fetching movies.");
      }
    };

    fetchMovies();
  }, [userID]); // Add userID to dependency array

  return (
    <Page background="light-3">
      <PageContent>
        {/* Hero Carousel */}
        <Autoplay />
        {/* Tickets Section */}
        <Box align="start" pad={{ left: "medium", top: "medium" }}>
          <Heading level={1} size="large">
            Movies
          </Heading>
          {error && (
            <Box pad={{ vertical: "small" }} background="status-critical">
              <Heading level={4} size="small" color="white">
                {error}
              </Heading>
            </Box>
          )}
        </Box>
        <MovieGrid movies={movies} />
        <Box pad="large"></Box>
      </PageContent>
    </Page>
  );
};

export default Landing;