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

  // State to track if search has been performed
  const [hasSearched, setHasSearched] = useState(false);

  // Function to format Date object to 'YYYY-MM-DD'
  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fetch theatres when the component mounts
  useEffect(() => {
    const fetchTheatres = async () => {
      try {
        const response = await fetch("http://localhost:8080/theatres/");
        const data = await response.json();
        setTheatres(data);
        console.log("Fetched Theatres:", data);
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
        console.log("Fetched Movies:", data);

        // Create title-to-ID mapping and ID-to-movie mapping
        const titleIdMap = {};
        const idMovieMap = {};
        data.forEach((movie) => {
          titleIdMap[movie.movieTitle] = movie.movieID;
          idMovieMap[movie.movieID] = movie;
        });
        setTitleToIdMap(titleIdMap);
        setIdToMovieMap(idMovieMap);
        console.log("Title to ID Map:", titleIdMap);
        console.log("ID to Movie Map:", idMovieMap);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  // Set default date if not already set
  useEffect(() => {
    if (!selectedDate) {
      // Set default date to today
      const today = new Date();
      const formattedToday = getFormattedDate(today);
      setSelectedDate(formattedToday);
      console.log("Default selectedDate set to:", formattedToday);
    }
  }, [selectedDate]);

  // Handle search submission
  const handleSearch = async () => {
    if (!selectedTheatre || !selectedDate || query.trim() === "") {
      alert("Please fill in all fields before searching.");
      return;
    }

    console.log("Starting search with parameters:");
    console.log("Selected Theatre ID:", selectedTheatre);
    console.log("Selected Date:", selectedDate);
    console.log("Query:", query);

    try {
      // Fetch showtimes for the selected theatre
      const response = await fetch(
        `http://localhost:8080/theatres/${selectedTheatre}/showtimes`
      );
      const showtimesData = await response.json();
      console.log("Showtimes Data:", showtimesData);

      // Filter showtimes by selected date
      const filteredShowtimes = showtimesData.filter((showtime) => {
        console.log(
          "Comparing showtime date:",
          showtime.date,
          "with selected date:",
          selectedDate
        );
        return showtime.date === selectedDate;
      });
      console.log("Filtered Showtimes:", filteredShowtimes);

      // Add movieID to each showtime using the titleToIdMap
      const showtimesWithIds = filteredShowtimes.map((showtime) => {
        const movieID = titleToIdMap[showtime.movieTitle];
        if (!movieID) {
          console.warn(`Movie ID not found for title: ${showtime.movieTitle}`);
        }
        return { ...showtime, movieID };
      });
      console.log("Showtimes with Movie IDs:", showtimesWithIds);

      // Filter out showtimes where movieID was not found
      const validShowtimes = showtimesWithIds.filter(
        (showtime) => showtime.movieID !== undefined
      );
      console.log("Valid Showtimes:", validShowtimes);

      // Get unique movieIDs from the valid showtimes
      const movieIds = [...new Set(validShowtimes.map((s) => s.movieID))];
      console.log("Unique Movie IDs:", movieIds);

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
      console.log("Movies with Showtimes:", moviesWithShowtimes);

      // Filter out any null entries
      const validMoviesWithShowtimes = moviesWithShowtimes.filter(
        (movie) => movie !== null
      );
      console.log("Valid Movies with Showtimes:", validMoviesWithShowtimes);

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
      console.log("Filtered Movies:", filteredMovies);

      setFilteredMovies(filteredMovies);
      setHasSearched(true); // Set hasSearched to true after searching
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
              !selectedTheatre || !selectedDate || query.trim() === ""
                ? "Please fill in all fields to search"
                : hasSearched
                ? `Search Results for "${query}"`
                : "Click search"
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
                onChange={({ value }) => {
                  console.log("Selected Theatre:", value);
                  setSelectedTheatre(value);
                  setHasSearched(false); // Reset hasSearched when inputs change
                }}
              />
            </Box>
            {/* Date picker for selecting date */}
            <Box width={size === "small" ? "80%" : "300px"}>
              <DateInput
                format="yyyy-mm-dd"
                value={selectedDate}
                onChange={({ value: nextValue }) => {
                  console.log("DateInput value:", nextValue);
                  let dateValue;
                  if (Array.isArray(nextValue)) {
                    dateValue = nextValue[0];
                  } else {
                    dateValue = nextValue;
                  }
                  if (typeof dateValue === "string") {
                    // Extract date part in case time is included
                    dateValue = dateValue.split("T")[0];
                  }
                  console.log("Formatted selectedDate:", dateValue);
                  setSelectedDate(dateValue);
                  setHasSearched(false); // Reset hasSearched when inputs change
                }}
                calendarProps={{
                  bounds: [
                    getFormattedDate(new Date()),
                    getFormattedDate(
                      new Date(new Date().setMonth(new Date().getMonth() + 2))
                    ),
                  ],
                  range: false, // Disable date range selection
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
              onChange={(event) => {
                console.log("Query input:", event.target.value);
                setQuery(event.target.value);
                setHasSearched(false); // Reset hasSearched when inputs change
              }}
              style={{ fontSize: "16px", padding: "10px", flex: 1 }}
            />
            <Button
              label="Search"
              onClick={handleSearch}
              margin={{ left: "small" }}
              disabled={
                !selectedTheatre || !selectedDate || query.trim() === ""
              }
            />
          </Box>
          {hasSearched && filteredMovies.length > 0 ? (
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
            hasSearched && (
              <Box pad="medium" align="center">
                <Text>No results found for your search.</Text>
              </Box>
            )
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