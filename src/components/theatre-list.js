import React from "react";
import { Box, Heading, Text, Image, Button } from "grommet";
import { Link } from "react-router-dom";

const TheatreList = ({ theatres }) => {
  return (
    <Box pad="medium" gap="medium">
      {theatres.map((theatre, index) => (
        <Box key={index} background="light-2" pad="medium" round="small">
          <Heading level={3} margin="none">
            {theatre.name} <Text size="small">({theatre.distance})</Text>
          </Heading>
          <Text size="small" color="dark-6">
            {theatre.location}
          </Text>
          <Box margin={{ top: "small" }} gap="medium">
            {theatre.movies.map((movie, movieIndex) => (
              <Box
                key={movieIndex}
                pad={{ bottom: "medium" }}
                style={{
                  borderBottom:
                    movieIndex !== theatre.movies.length - 1
                      ? "1px solid #E0E0E0"
                      : "none", // Remove border for the last movie
                }}
              >
                <Box direction="row" gap="medium">
                  <Box width="small">
                    <Image src={movie.image} alt={movie.title} fit="cover" />
                  </Box>
                  <Box>
                    <Heading level={4} margin="none">{movie.title}</Heading>
                    <Text size="small" color="dark-6">
                      {movie.rating} | {movie.duration} | {movie.genre}
                    </Text>
                    <Box direction="row" gap="small" margin={{ top: "small" }}>
                      {movie.showtimes.map((time, timeIndex) => (
                        <Link
                          key={timeIndex}
                          to={`/seat-booking/${index}/${movieIndex}/${time}`}
                          state={{ theatre, movie, showtime: time }}
                          style={{ textDecoration: "none" }}
                        >
                          <Button
                            label={time}
                            primary
                            color="brand"
                            size="small"
                          />
                        </Link>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default TheatreList;