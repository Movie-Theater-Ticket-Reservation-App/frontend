import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Page,
  PageHeader,
  Text,
  Button,
  Card,
  CardBody,
  Image,
  Select,
  DateInput,
  TextInput,
  ResponsiveContext,
  Layer,
  Grid,
} from "grommet";
import { Close } from "grommet-icons";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
  const location = useLocation();
  const size = useContext(ResponsiveContext);
  const navigate = useNavigate();

  const { userID } = useContext(AuthContext);

  // Function to format date to 'yyyy-mm-dd' in local time
  const formatDateToLocalISOString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Extract search query from URL parameters
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("query") || "";

  // State variables
  const [theatres, setTheatres] = useState([]);
  const [allMovies, setAllMovies] = useState([]);

  // Create a mapping from movieTitle to movieID
  const [titleToIdMap, setTitleToIdMap] = useState({});

  // Create a mapping from movieID to movie details
  const [idToMovieMap, setIdToMovieMap] = useState({});

  // States for input fields
  const [query, setQuery] = useState(initialQuery);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  // State for filtered movies
  const [filteredMovies, setFilteredMovies] = useState([]);

  // State for notification
  const [notification, setNotification] = useState(null);

  // Fetch theatres when the component mounts
  useEffect(() => {
    const fetchTheatres = async () => {
      try {
        const response = await fetch("http://localhost:8080/theatres/");
        const data = await response.json();
        setTheatres(data);
      } catch (error) {
        console.error("Error fetching theatres:", error);
      }
    };
    fetchTheatres();
  }, []);

  // Fetch movies when the component mounts
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:8080/movies/");
        const data = await response.json();
        setAllMovies(data);

        // Create title-to-ID mapping and ID-to-movie mapping
        const titleIdMap = {};
        const idMovieMap = {};
        data.forEach((movie) => {
          titleIdMap[movie.movieTitle] = movie.movieID;
          idMovieMap[movie.movieID] = movie;
        });
        setTitleToIdMap(titleIdMap);
        setIdToMovieMap(idMovieMap);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  // Set default date if not already set
  useEffect(() => {
    if (!selectedDate) {
      // Set default date to today using local time
      const today = new Date();
      const formattedToday = formatDateToLocalISOString(today);
      setSelectedDate(formattedToday);
    }
  }, [selectedDate]);

  // Handle search submission
  const handleSearch = async () => {
    if (!selectedTheatre || !selectedDate || query.trim() === "") {
      alert("Please fill in all fields before searching.");
      return;
    }

    try {
      // Fetch showtimes for the selected theatre
      const response = await fetch(
        `http://localhost:8080/theatres/${selectedTheatre}/showtimes`
      );
      const showtimesData = await response.json();

      // Filter showtimes by selected date
      const filteredShowtimes = showtimesData.filter(
        (showtime) => showtime.date === selectedDate
      );

      // Add movieID to each showtime using the titleToIdMap
      const showtimesWithIds = filteredShowtimes.map((showtime) => {
        const movieID = titleToIdMap[showtime.movieTitle];
        if (!movieID) {
          console.warn(`Movie ID not found for title: ${showtime.movieTitle}`);
        }
        return { ...showtime, movieID };
      });

      // Filter out showtimes where movieID was not found
      const validShowtimes = showtimesWithIds.filter(
        (showtime) => showtime.movieID !== undefined
      );

      // Get unique movieIDs from the valid showtimes
      const movieIds = [...new Set(validShowtimes.map((s) => s.movieID))];

      // Build moviesWithShowtimes using idToMovieMap
      const moviesWithShowtimes = movieIds.map((movieID) => {
        const movieData = idToMovieMap[movieID];
        if (!movieData) {
          console.warn(`Movie data not found for ID: ${movieID}`);
          return null;
        }

        // Get showtimes for this movie
        const showtimesForMovie = validShowtimes.filter(
          (showtime) => showtime.movieID === movieID
        );

        return {
          ...movieData,
          showtimes: showtimesForMovie,
        };
      });

      // Filter out any null entries
      const validMoviesWithShowtimes = moviesWithShowtimes.filter(
        (movie) => movie !== null
      );

      // Filter movies based on search query and release date
      const filteredMovies = validMoviesWithShowtimes.filter((movie) => {
        const matchesQuery = movie.movieTitle
          .toLowerCase()
          .includes(query.toLowerCase());

        // Check release date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let includeMovie = true;

        if (movie.releaseDate) {
          const releaseDate = new Date(movie.releaseDate);
          if (!isNaN(releaseDate.getTime())) {
            if (releaseDate > today && !userID) {
              // Movie has a future release date and user is not logged in
              includeMovie = false;
            }
          }
        }

        return matchesQuery && includeMovie;
      });

      setFilteredMovies(filteredMovies);
    } catch (error) {
      console.error("Error fetching showtimes or movies:", error);
    }
  };

  // Function to handle showtime button click
  const handleShowtimeClick = (theatre, movie, showtime) => {
    // Create the notification message
    const message = `You selected:
    Theatre: ${theatre.theatreName}
    Movie: ${movie.movieTitle}
    Date: ${showtime.date}
    Showtime: ${showtime.time}`;

    // Set the notification state
    setNotification(message);

    // Delay navigation by 1 second to show the notification
    setTimeout(() => {
      navigate(
        `/seat-booking/${theatre.theatreID}/${movie.movieID}/${showtime.showtimeID}`,
        {
          state: {
            theatre,
            movie,
            showtime,
          },
        }
      );
    }, 1000);
  };

  return (
    <Page background="light-3" fill>
      <Box fill direction="column">
        <Box
          pad="medium"
          align="center"
          width="100%"
          flex="grow"
          overflow="auto"
        >
          {/* Display notification if it exists */}
          {notification && (
            <Layer
              position="top"
              modal={false}
              margin={{ vertical: "medium", horizontal: "small" }}
              onEsc={() => setNotification(null)}
              responsive={false}
              plain
            >
              <Box
                align="center"
                direction="row"
                gap="small"
                justify="between"
                round="small"
                elevation="medium"
                pad={{ vertical: "small", horizontal: "medium" }}
                background="status-ok"
              >
                <Text>{notification}</Text>
                <Button
                  icon={<Close />}
                  onClick={() => setNotification(null)}
                  plain
                />
              </Box>
            </Layer>
          )}

          <PageHeader
            title={
              selectedTheatre && selectedDate
                ? `Search Results for "${query}"`
                : "Please fill in all fields to search"
            }
          />
          <Box
            width="100%"
            direction={size === "small" ? "column" : "row"}
            gap="medium"
            pad="medium"
            justify="center"
            align="center"
          >
            {/* Dropdown for selecting theatre */}
            <Box width={size === "small" ? "80%" : "300px"}>
              <Select
                options={theatres}
                labelKey="theatreName"
                valueKey={{ key: "theatreID", reduce: true }}
                placeholder="Select a Theatre"
                value={selectedTheatre}
                onChange={({ value }) => setSelectedTheatre(value)}
              />
            </Box>
            {/* Date picker for selecting date */}
            <Box width={size === "small" ? "80%" : "300px"}>
              <DateInput
                format="yyyy-mm-dd"
                value={selectedDate}
                onChange={({ value: nextValue }) => {
                  setSelectedDate(nextValue);
                }}
                calendarProps={{
                  bounds: [
                    formatDateToLocalISOString(new Date()),
                    formatDateToLocalISOString(
                      new Date(new Date().setMonth(new Date().getMonth() + 2))
                    ),
                  ],
                }}
              />
            </Box>
          </Box>
          {/* Search Bar with Search Button */}
          <Box
            margin={{ top: "medium" }}
            width={size === "small" ? "100%" : "large"}
            direction="row"
            align="center"
          >
            <TextInput
              placeholder="Search for movies..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              style={{ fontSize: "16px", padding: "10px", flex: 1 }}
            />
            <Button
              label="Search"
              onClick={handleSearch}
              margin={{ left: "small" }}
              disabled={!selectedTheatre || !selectedDate || query.trim() === ""}
            />
          </Box>
          {filteredMovies.length > 0 ? (
            <Box width="100%" margin={{ top: "medium" }}>
              <Grid
                columns={
                  size === "small"
                    ? ["100%"]
                    : {
                        count: 1,
                        size: "auto",
                      }
                }
                gap="medium"
              >
                {filteredMovies.map((movie) => (
                  <Card
                    key={movie.movieID}
                    background="white"
                    elevation="small"
                    round="small"
                    width="100%"
                  >
                    <CardBody
                      pad="small"
                      direction="row"
                      gap="medium"
                      align="start"
                      justify="between"
                    >
                      <Box
                        width="150px"
                        height="200px"
                        overflow="hidden"
                        flex="shrink"
                      >
                        <Image
                          src={movie.url}
                          alt={movie.movieTitle}
                          fit="cover"
                          fill
                        />
                      </Box>
                      <Box flex="grow">
                        <Text size="large" weight="bold">
                          {movie.movieTitle}
                        </Text>
                        <Text size="small" margin={{ vertical: "small" }}>
                          Rating: {movie.rate} | Duration: {movie.duration} |
                          Genre: {movie.movieGenre}
                        </Text>
                        <Box
                          direction="row"
                          gap="small"
                          wrap
                          margin={{ top: "small" }}
                          align="start"
                        >
                          {movie.showtimes.length > 0 ? (
                            movie.showtimes.map((showtime) => (
                              <Button
                                key={showtime.showtimeID}
                                label={`${showtime.time}`}
                                primary
                                color="brand"
                                size="small"
                                onClick={() =>
                                  handleShowtimeClick(
                                    theatres.find(
                                      (theatre) =>
                                        theatre.theatreID === selectedTheatre
                                    ),
                                    movie,
                                    showtime
                                  )
                                }
                              />
                            ))
                          ) : (
                            <Text>
                              No showtimes available at this location
                            </Text>
                          )}
                        </Box>
                      </Box>
                    </CardBody>
                  </Card>
                ))}
              </Grid>
            </Box>
          ) : (
            <Box pad="medium" align="center">
              <Text>No results found for your search.</Text>
            </Box>
          )}
        </Box>
        <Box
          flex={false}
          pad={{ vertical: "small" }}
          background="light-2"
          align="center"
        >
          <Box direction="row" gap="small" justify="center">
            <Button label="Go Back" onClick={() => window.history.back()} />
            <Button
              label="Home"
              onClick={() => (window.location.href = "/")}
              primary
            />
          </Box>
        </Box>
      </Box>
    </Page>
  );
};

export default Search;