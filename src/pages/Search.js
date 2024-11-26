import React from "react";
import { useLocation } from "react-router-dom";
import { Box, Page, PageHeader, Text, Button, Card, CardBody, Image } from "grommet";
import { Link } from "react-router-dom";

const Search = () => {
  const location = useLocation();

  const query = location.state?.query || "";

  // Mock search results with movie details
  const allMovies = [
    {
      id: 1,
      title: "The Great Gatsby",
      image: "/images/posters/gatsbyPoster.png",
      rating: "PG-13",
      runtime: "2h 23min",
      genre: "Drama, Romance",
      times: ["4:30 PM", "8:30 PM"],
    },
    {
      id: 2,
      title: "Wall-E",
      image: "/images/posters/wallePoster.jpg",
      rating: "G",
      runtime: "1h 38min",
      genre: "Animation, Adventure",
      times: ["12:50 PM", "3:00 PM"],
    },
    {
      id: 3,
      title: "Cars",
      image: "/images/posters/carsPoster.jpeg",
      rating: "G",
      runtime: "1h 57min",
      genre: "Animation, Comedy",
      times: ["5:15 PM", "6:45 PM", "9:00 PM"],
    },
  ];

  const filteredMovies = allMovies.filter((movie) =>
    movie.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Page background="light-3" fill>
      <Box pad="medium" align="center">
        <PageHeader title={`Search Results for "${query}"`} />
        {filteredMovies.length > 0 ? (
          <Box gap="medium" width="large">
            {filteredMovies.map((movie, movieIndex) => (
              <Card key={movie.id} background="white" elevation="small" round="small">
                <CardBody pad="small" direction="row" gap="small" align="center">
                  <Image src={movie.image} alt={movie.title} fit="contain" height="300px" />
                  <Box>
                    <Text size="large" weight="bold">
                      {movie.title}
                    </Text>
                    <Text size="small">
                      {movie.rating} | {movie.runtime} | {movie.genre}
                    </Text>
                    <Box direction="row" gap="small" wrap>
                      {movie.times.map((time, timeIndex) => (
                        <Link
                          key={timeIndex}
                          to={`/seat-booking/0/${movieIndex}/${time}`} // Use a placeholder (e.g., "0") for theatre index if not applicable
                          state={{
                            theatre: { name: "Sample Theatre" }, // Replace with actual theatre info if available
                            movie,
                            showtime: time,
                          }} // Pass movie, theatre, and showtime details via state
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
                </CardBody>
              </Card>
            ))}
          </Box>
        ) : (
          <Box pad="medium" align="center">
            <Text>No results found for your search.</Text>
          </Box>
        )}
        <Box direction="row" gap="small" justify="center" margin={{ top: "medium" }}>
          <Button label="Go Back" onClick={() => window.history.back()} />
          <Button label="Home" onClick={() => (window.location.href = "/")} primary />
        </Box>
      </Box>
    </Page>
  );
};

export default Search;