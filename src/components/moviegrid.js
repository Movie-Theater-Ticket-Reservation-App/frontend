import React from 'react';
import { Grid, Box, Image, Text } from 'grommet';

const MovieGrid = ({ movies }) => {
  return (
    <Grid
      columns={{ count: 4, size: 'auto' }} // Maximum 4 movies per row
      rows="auto"
      gap="medium"
      justify="center"
      align="center"
      pad="medium"
    >
      {movies.map((movie) => (
        <Box
          key={movie.id}
          pad="medium"
          border={{ color: 'light-4' }}
          round="small"
          elevation="medium"
          background="white"
          style={{
            width: '300px', // Adjusted width
            textAlign: 'center',
          }}
        >
          <Image
            src={movie.poster}
            alt={movie.title}
            fit="cover"
            style={{ height: '400px', borderRadius: '8px' }} // Adjusted image height
          />
          <Box pad={{ vertical: 'small' }}>
            <Text weight="bold" size="medium" truncate>
              {movie.title}
            </Text>
            <Text size="small" color="dark-6">
              {movie.releaseDate}
            </Text>
            <Text size="small" color="dark-6">
              {movie.rating} | {movie.genre}
            </Text>
          </Box>
        </Box>
      ))}
    </Grid>
  );
};

export default MovieGrid;