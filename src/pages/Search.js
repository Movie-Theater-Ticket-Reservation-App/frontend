import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Page, PageHeader, Text, Button } from "grommet";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const query = location.state?.query || "";
  
  // Mock search results
  const allMovies = [
    { id: 1, title: "The Great Gatsby" },
    { id: 2, title: "Wall-E" },
    { id: 3, title: "Cars" },
    { id: 4, title: "Inception" },
  ];

  const filteredMovies = allMovies.filter((movie) =>
    movie.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Page background="light-3" fill>
      <Box pad="medium" align="center">
        <PageHeader title={`Search Results for "${query}"`} />
        <Box width="medium" pad="medium" background="white" elevation="small" round="small">
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => (
              <Text key={movie.id} margin={{ bottom: "small" }}>
                {movie.title}
              </Text>
            ))
          ) : (
            <Text>No results found for your search.</Text>
          )}
          <Box direction="row" gap="small" justify="center" margin={{ top: "medium" }}>
            <Button label="Go Back" onClick={() => navigate(-1)} />
            <Button label="Home" onClick={() => navigate("/")} primary />
          </Box>
        </Box>
      </Box>
    </Page>
  );
};

export default Search;