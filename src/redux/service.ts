import axios from "axios";
import { MovieSerie, } from "../interfaces/movieSerie";
import { PropsFilter, ResponseGenres, ResponseMovies, ResponsePerson, ResponseSearch, ResponseSeries } from "../interfaces/response";



export const optionsRequest = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: import.meta.env.VITE_API_KEY
    }
}




const apiService = {

    moviesPopulity: async () => {
        try {
            const responseAllDay: ResponseMovies = await axios.get("https://api.themoviedb.org/3/trending/all/day", optionsRequest)
            const allDay = responseAllDay?.data?.results;

            const responseTopRated: ResponseMovies = await axios.get(`https://api.themoviedb.org/3/movie/top_rated `, optionsRequest)
            const topRated = responseTopRated.data.results

            const responseNowPlaying: ResponseMovies = await axios.get(`https://api.themoviedb.org/3/movie/now_playing`, optionsRequest)
            const nowPlaying = responseNowPlaying.data.results

            const responseUpcoming: ResponseMovies = await axios.get(`https://api.themoviedb.org/3/movie/upcoming`, optionsRequest)
            const upcoming = responseUpcoming.data.results

            const allMovies = allDay.concat(topRated).concat(nowPlaying).concat(upcoming)
            const allMoviesFormat: MovieSerie[] = []

            allMovies.map((movie) => {

                let nameOrTitle: string
                let releaseOrFirst: string

                if (movie.title === undefined && movie.release_date === undefined) {
                    nameOrTitle = movie.name
                    releaseOrFirst = movie.first_air_date
                } else {
                    nameOrTitle = movie.title
                    releaseOrFirst = movie.release_date
                }

                const movieFormat = {
                    adult: movie.adult,
                    first_air_date: undefined,
                    backdrop: movie.backdrop_path,
                    genres: movie.genre_ids,
                    id: movie.id,
                    media_type: movie.media_type,
                    overview: movie.overview,
                    popularity: movie.popularity,
                    poster: movie.poster_path,
                    release: releaseOrFirst,
                    name: nameOrTitle,
                    original_name: movie.original_title,
                    average: movie.vote_average,
                    count: movie.vote_count,
                    isMovie: true,
                    favorite: false,
                }
                allMoviesFormat.push(movieFormat)
            })

            const allDayFormat = allMoviesFormat.slice(0, 20)
            const topRatedFormat = allMoviesFormat.slice(20, 40)
            const nowPlayingFormat = allMoviesFormat.slice(40, 60)
            const upcomingFormat = allMoviesFormat.slice(60)

            return {
                moviesAllDay: allDayFormat,
                upcoming: upcomingFormat,
                topRated: topRatedFormat,
                nowPlaying: nowPlayingFormat
            }


        } catch (error) {
            console.log(error)
        }
    },

    seriesPopulity: async () => {

        try {
            const response: ResponseSeries = await axios.get(`https://api.themoviedb.org/3/tv/popular`, optionsRequest)
            const allDay = response.data.results

            const responseNowPlaying: ResponseSeries = await axios.get(`https://api.themoviedb.org/3/tv/airing_today`, optionsRequest)
            const nowPlaying = responseNowPlaying.data.results

            const responseTopRated: ResponseSeries = await axios.get(`https://api.themoviedb.org/3/tv/top_rated`, optionsRequest)
            const topRated = responseTopRated.data.results

            const allSeries = allDay.concat(topRated).concat(nowPlaying)
            const allSeriesFormat: MovieSerie[] = []

            allSeries.map((item) => {
                const serieFormat = {
                    adult: undefined,
                    first_air_date: item.first_air_date,
                    backdrop: item.backdrop_path,
                    genres: item.genre_ids,
                    id: item.id,
                    original_name: item.original_name,
                    media_type: "Serie",
                    overview: item.overview,
                    popularity: item.popularity,
                    poster: item.poster_path,
                    release: undefined,
                    name: item.name,
                    average: item.vote_average,
                    count: item.vote_count,
                    isMovie: false,
                    favorite: false
                }

                allSeriesFormat.push(serieFormat)

            })


            const allDayFormat = allSeriesFormat.slice(0, 20)
            const topRatedFormat = allSeriesFormat.slice(20, 40)
            const nowPlayingFormat = allSeriesFormat.slice(40, 60)


            return {
                allDay: allDayFormat,
                nowPlaying: nowPlayingFormat,
                topRated: topRatedFormat
            }

        } catch (error) {
            console.log(error)
        }
    },

    genres: async () => {
        try {
            const response: ResponseGenres = await axios.get(`https://api.themoviedb.org/3/genre/movie/list`, optionsRequest)
            const data = response?.data?.genres;
            return data
        } catch (error) {
            console.log(error)
        }
    },

    movies: async ({ name, id, type, isFiltering, pageCorrect, isMovieOrSerie }: PropsFilter) => {
        console.log("isMovie", isMovieOrSerie)
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: import.meta.env.VITE_API_KEY
            },
            params: {
                page: pageCorrect
            }

        }
        if (isMovieOrSerie === "movie") {
            if (type === "filter" && id !== undefined && isFiltering) {
                try {
                    const response: ResponseSearch = await axios.get(`https://api.themoviedb.org/3/discover/movie?with_genres=${id}`, options)
                    const data = response.data.results
                    const result: MovieSerie[] = []

                    data.map((movie) => {
                        const dataFormat = {
                            adult: movie.adult,
                            first_air_date: undefined,
                            backdrop: movie.backdrop_path,
                            genres: movie.genre_ids,
                            id: movie.id,
                            media_type: "Movie",
                            overview: movie.overview,
                            popularity: movie.popularity,
                            poster: movie.poster_path,
                            release: movie.release_date,
                            name: movie.title,
                            original_name: movie.original_title,
                            average: movie.vote_average,
                            count: movie.vote_count,
                            isMovie: true,
                            favorite: false,
                        }
                        result.push(dataFormat)
                    })

                    console.log("result", response.data)
                    const payload = {
                        movies: result,
                        pageAtual: response.data.page,
                        type: type,
                        isFiltering: isFiltering,
                        id: id,
                        name: "",
                        isMovieOrSerie: isMovieOrSerie,
                    }
                    return payload

                } catch (error) {
                    console.log(error)
                }

            } else if (name && type === "search") {
                try {
                    const response: ResponseSearch = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${name}&language=pt-BR`, options)
                    const data = response.data.results
                    const result: MovieSerie[] = []
                    data.map((movie) => {
                        const dataFormat = {
                            adult: movie.adult,
                            first_air_date: undefined,
                            backdrop: movie.backdrop_path,
                            genres: movie.genre_ids,
                            id: movie.id,
                            media_type: "Movie",
                            overview: movie.overview,
                            popularity: movie.popularity,
                            poster: movie.poster_path,
                            release: movie.release_date,
                            name: movie.title,
                            original_name: movie.original_title,
                            average: movie.vote_average,
                            count: movie.vote_count,
                            isMovie: true,
                            favorite: false,
                        }
                        result.push(dataFormat)
                    })
                    const payload = {
                        movies: result,
                        pageAtual: response.data.page,
                        name: name,
                        type: type,
                        id: null,
                        isFiltering: false,
                        isMovieOrSerie: isMovieOrSerie
                    }
                    return payload

                } catch (error) {
                    console.log(error)
                }
            } else {
                const payload = {
                    movies: null,
                    pageAtual: 1,
                    name: null,
                    type: null,
                    id: null,
                    isFiltering: false,
                    isMovieOrSerie: ""

                }
                return payload
            }

        } else {
            if (type === "filter" && id !== undefined && isFiltering) {
                try {
                    const response: ResponseSearch = await axios.get(`https://api.themoviedb.org/3/discover/tv?with_genres=${id}`, options)
                    const data = response.data.results
                    const result: MovieSerie[] = []

                    data.map((movie) => {
                        const dataFormat = {
                            adult: movie.adult,
                            first_air_date: undefined,
                            backdrop: movie.backdrop_path,
                            genres: movie.genre_ids,
                            id: movie.id,
                            media_type: "Movie",
                            overview: movie.overview,
                            popularity: movie.popularity,
                            poster: movie.poster_path,
                            release: movie.release_date,
                            name: movie.title,
                            original_name: movie.original_title,
                            average: movie.vote_average,
                            count: movie.vote_count,
                            isMovie: true,
                            favorite: false,
                        }
                        result.push(dataFormat)
                    })

                    console.log("result", response.data)
                    const payload = {
                        movies: result,
                        pageAtual: response.data.page,
                        type: type,
                        isFiltering: isFiltering,
                        id: id,
                        name: "",
                        isMovieOrSerie: isMovieOrSerie
                    }
                    return payload

                } catch (error) {
                    console.log(error)
                }

            } else if (name && type === "search") {
                try {
                    const response: ResponseSearch = await axios.get(`https://api.themoviedb.org/3/search/tv?query=${name}&language=pt-BR`, options)
                    const data = response.data.results
                    const result: MovieSerie[] = []
                    data.map((movie) => {
                        const dataFormat = {
                            adult: movie.adult,
                            first_air_date: undefined,
                            backdrop: movie.backdrop_path,
                            genres: movie.genre_ids,
                            id: movie.id,
                            media_type: "Movie",
                            overview: movie.overview,
                            popularity: movie.popularity,
                            poster: movie.poster_path,
                            release: movie.release_date,
                            name: movie.title,
                            original_name: movie.original_title,
                            average: movie.vote_average,
                            count: movie.vote_count,
                            isMovie: true,
                            favorite: false,
                        }
                        result.push(dataFormat)
                    })
                    const payload = {
                        movies: result,
                        pageAtual: response.data.page,
                        name: name,
                        type: type,
                        id: null,
                        isFiltering: false,
                        isMovieOrSerie: isMovieOrSerie
                    }
                    return payload

                } catch (error) {
                    console.log(error)
                }
            } else {
                const payload = {
                    movies: null,
                    pageAtual: 1,
                    name: null,
                    type: null,
                    id: null,
                    isFiltering: false,
                    isMovieOrSerie: ""

                }
                return payload
            }
        }
    },


    person: async () => {
        try {
            const response: ResponsePerson = await axios.get(`https://api.themoviedb.org/3/person/popular`, optionsRequest)
            const data = response?.data?.results;
            return data
        } catch (error) {
            console.log(error)
        }
    }

}

export default apiService;