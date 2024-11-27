import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Page,
  PageContent,
  Paragraph,
  ResponsiveContext,
} from "grommet";
import { Autoplay } from "../components/carousel-autoplay.js";
import TheatreList from "../components/theatre-list.js";
import MovieGrid from '../components/moviegrid.js';
import { Link } from "react-router-dom";

const Landing = ({ dark }) => {
  const theatreData = [
    {
      name: "Cineplex VIP Cinemas University District",
      location: "Calgary, AB",
      distance: "1km",
      movies: [
        {
          title: "The Great Gatsby",
          rating: "PG-13",
          duration: "2h 23min",
          genre: "Drama, Romance",
          showtimes: ["4:30 PM", "8:30 PM"],
          image: "/images/posters/gatsbyPoster.png",
        },
        {
          title: "Cars",
          rating: "G",
          duration: "1h 57min",
          genre: "Animation, Comedy",
          showtimes: ["5:15 PM", "6:45 PM", "9:00 PM"],
          image: "/images/posters/carsPoster.jpeg",
        },
      ],
    },
    {
      name: "Cineplex Odeon Westhills Cinemas",
      location: "Calgary, AB",
      distance: "7km",
      movies: [
        {
          title: "Wall-E",
          rating: "G",
          duration: "1h 38min",
          genre: "Animation, Adventure",
          showtimes: ["12:50 PM", "3:00 PM"],
          image: "/images/posters/wallePoster.jpg",
        },
      ],
    },
  ];

  const [movies, setMovies] = useState([]); // Define the state for movies

  useEffect(() => {
    // Extract movies from theatreData
    const fetchedMovies = theatreData.flatMap((theatre) =>
      theatre.movies.map((movie) => ({
        title: movie.title,
        releaseDate: movie.duration, // Assuming "duration" is used as a proxy for release date; replace if actual release date is available
        poster: movie.image,
        rating: movie.rating,
        genre: movie.genre,
        theatreName: theatre.name, // Add theatre name to the movie for additional context
      }))
    );
  
    setMovies(fetchedMovies);
  }, []);

  return (
    <Page background={dark ? "dark-1" : "light-4"}>
      <PageContent>
        {/* Hero Carousel */}
        <Autoplay dark={dark} />
        {/* Tickets Section */}
        <Box align="start" pad={{ left: "medium", top: "medium" }}>
          <Heading level={1} size="large">
            Movies
          </Heading>
        </Box>
        <MovieGrid movies={movies} />
        <Box pad="large">
      
    </Box>
      </PageContent>
    </Page>
  );
};

export default Landing;