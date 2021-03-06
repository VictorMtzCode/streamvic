import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import "react-circular-progressbar/dist/styles.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "./Details.css";
import Navbar from "../../Stateful/Navbar";
import FavsBtn from "../../Stateless/FavsBtn";
import { Helmet } from "react-helmet-async";
import useFetchDetails from "../../hooks/useFetchDetails";
import ErrorDiv from "../../Stateless/Error";
import LoadingDiv from "../../Stateless/Loading";
const imgUrl = "https://image.tmdb.org/t/p/original";
const MovieTrailer = lazy(() =>
  import("../../Stateful/MovieTrailers/MovieTrailer")
);
const DetailsCarousel = lazy(() => import("./DetailsCarousel"));

const MoviesDetails = () => {
  const { id } = useParams();
  const {
    data: movieDetails,
    error,
    isLoading,
  } = useFetchDetails(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
  );

  const value = movieDetails.vote_average;

  const truncate = (str, n) =>
    str?.length > n ? str.substring(0, n - 1) + "..." : str;

  return (
    <div
      className="details-container"
      style={{
        backgroundImage: `url(${imgUrl}${movieDetails.backdrop_path})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Helmet>
        <title>{movieDetails.title}</title>
        <meta name="description" content={movieDetails.overview} />
      </Helmet>
      <Navbar position="static" />
      {error && <ErrorDiv message={error} custom="100vh" />}
      {isLoading && <LoadingDiv />}
      {!isLoading && !error && (
        <div className="details-main">
          <div className="details-main-info">
            <img
              effect="blur"
              className="details-poster"
              src={`${imgUrl}${movieDetails.poster_path}`}
              alt={movieDetails.name}
            />
            <div className="details-main-info-text">
              <h1 className="details-title">{movieDetails.title}</h1>
              <p className="details-overview">
                {truncate(movieDetails.overview, 300)}
              </p>
              <div className="details-genres">
                <h2>Genres</h2>
                <span>
                  {movieDetails.genres.map((genre, i) => (
                    <h3 className="details-genre" key={i}>
                      {genre.name}
                    </h3>
                  ))}
                </span>
              </div>
              <div className="gauge-container">
                <div className="gauge">
                  <CircularProgressbar
                    value={value}
                    maxValue={10}
                    text={value ? `${value}` : ""}
                    styles={buildStyles({
                      trailColor: "transparent",
                      textColor: "#fff",
                      pathColor: "#fff",
                    })}
                  />
                  <p className="gauge-rating">Rating</p>
                </div>
                <FavsBtn content={movieDetails} className="details" />
              </div>
            </div>
          </div>
        </div>
      )}
      <span className="details-trailer">
        <h2 className="trailer-h2">Watch Trailer</h2>
        <Suspense fallback={<LoadingDiv />}>
          <MovieTrailer id={id} />
        </Suspense>
      </span>

      <div className="details-cast">
        <Suspense fallback={<LoadingDiv />}>
          <DetailsCarousel
            url={`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`}
            title={"Cast"}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default MoviesDetails;
