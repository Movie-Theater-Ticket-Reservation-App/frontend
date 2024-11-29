import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Page,
  PageContent,
} from "grommet";
import { Autoplay } from "../components/carousel-autoplay.js";
import MovieGrid from '../components/moviegrid.js';

const Landing = () => {
  const [movies, setMovies] = useState([]); // Define the state for movies
  const [error, setError] = useState(""); // For error handling

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
          releaseDate: movie.duration, // Map duration if actual release date is unavailable
          poster: movie.url,
          rating: movie.rate,
          genre: movie.movieGenre,
        }));
        setMovies(mappedMovies);
      } catch (err) {
        setError(err.message || "An error occurred while fetching movies.");
      }
    };

    fetchMovies();
  }, []);

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