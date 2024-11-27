import React from 'react';
import { Grid, Box, Image, Text, ResponsiveContext } from 'grommet';

const MovieGrid = ({ movies }) => {
  return (
    <ResponsiveContext.Consumer>
      {(size) => (
        <Grid
          columns={
            size === 'small'
              ? ['auto'] // Single column for small screens
              : size === 'medium'
              ? ['auto', 'auto'] // Two columns for medium screens
              : { count: 4, size: 'auto' } // Four columns for larger screens
          }
          rows="auto"
          gap="medium"
          justify="center"
          align="center"
          pad="medium"
        >
          {movies.map((movie, index) => (
            <Box
              key={index}
              pad="medium"
              border={{ color: 'light-4' }}
              round="small"
              elevation="medium"
              background="white"
              style={{
                width: '100%', // Ensure width is responsive
                maxWidth: '300px', // Limit max width for better visuals
                textAlign: 'center',
              }}
            >
              <Image
                src={movie.poster}
                alt={movie.title}
                fit="cover"
                style={{
                  height: '300px', // Adjusted height
                  width: '100%', // Make it responsive
                  borderRadius: '8px',
                }}
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
      )}
    </ResponsiveContext.Consumer>
  );
};

export default MovieGrid;