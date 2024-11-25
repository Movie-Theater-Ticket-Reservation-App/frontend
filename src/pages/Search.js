import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Page, PageHeader, Text, Button, Card, CardBody, CardFooter, Image } from "grommet";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
    },]

  const filteredMovies = allMovies.filter((movie) =>
    movie.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Page background="light-3" fill>
      <Box pad="medium" align="center">
        <PageHeader title={`Search Results for "${query}"`} />
        {filteredMovies.length > 0 ? (
          <Box gap="medium" width="large">
            {filteredMovies.map((movie) => (
              <Card key={movie.id} background="white" elevation="small" round="small">
                <CardBody pad="small" direction="row" gap="small" align="center">
                  <Image src={movie.image} alt={movie.title} fit="contain" height="300x"/>
                  <Box>
                    <Text size="large" weight="bold">
                      {movie.title}
                    </Text>
                    <Text size="small">
                      {movie.rating} | {movie.runtime} | {movie.genre}
                    </Text>
                    <Box direction="row" gap="small" wrap>
                      {movie.times.map((time) => (
                        <Button
                          key={time}
                          label={time}
                          onClick={() => navigate(`/movie/${movie.id}`)}
                          plain
                          style={{
                            border: "1px solid #00739D",
                            borderRadius: "5px",
                            padding: "5px",
                            color: "#00739D",
                            cursor: "pointer",
                          }}
                        />
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
          <Button label="Go Back" onClick={() => navigate(-1)} />
          <Button label="Home" onClick={() => navigate("/")} primary />
        </Box>
      </Box>
    </Page>
  );
};

export default Search;