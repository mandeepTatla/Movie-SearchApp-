const all = document.querySelector("#all");
const movies = document.querySelector("#movies");
const series = document.querySelector("#series");
const episode = document.querySelector("#episode");

const searchButton = document.querySelector("#searchForm");
const searchText = document.querySelector("#searchtext");
const movieList = document.querySelector("#movieList");

const WatchList = document.querySelector("#watchList");
const individualMovie = document.querySelector("#movie");

const apiKey = "c552542c";

/// returns the  type user has selected
function getType() {
    if (all.checked) return all.value;
    if (movies.checked) return movies.value;
    if (series.checked) return series.value;
    if (episode.value) return episode.value;
}

const renderList = function(data) {
    movieList.innerHTML = "";

    const div = document.createElement("li");
    div.id = "results";
    div.className = " results";
    div.innerHTML = `${data.totalResults} Results`;
    movieList.appendChild(div);

    const { Search } = data;
    console.log(Search);
    Search.forEach((i) => {
        let loopingList = document.createElement("li");
        loopingList.id = `${i.imdbID}`;
        loopingList.className = " list-group-item clickList";
        loopingList.innerHTML = ` 

                <img class="img" id=${i.imdbID} src="${i.Poster}"/>
                ${i.Title}
               <span id=${i.imdbID} class='year'> ${i.Year}</span> `;

        movieList.appendChild(loopingList);
    });
};

const renderListEpisode = function(data) {
    movieList.innerHTML = "";

    const div = document.createElement("li");
    div.id = "results";
    div.className = "results";
    div.innerHTML = `${data.Episodes.length} Results`;
    movieList.appendChild(div);

    const { Episodes } = data;
    console.log(Episodes);
    Episodes.forEach((i) => {
        let loopingList = document.createElement("li");
        loopingList.id = `${i.imdbID}`;
        loopingList.className = " list-group-item clickList";
        loopingList.innerHTML = ` 

                
                ${i.Title}
               <span id=${i.imdbID} class='year'> ${i.Released}</span> `;

        movieList.appendChild(loopingList);
    });
};

const renderMovie = function(data) {
    individualMovie.innerHTML = "";

    const rate = data.Ratings;
    let ratingArr = [];
    if (rate.length === 0) {
        ratingArr.push({ Source: "Internet Movie Database", Value: "N/A" });
        ratingArr.push({ Source: "Rotten Tomatoes", Value: "N/A" });
        ratingArr.push({ Source: "Metacritic", Value: "N/A" });
    } else if (rate.length === 1) {
        console.log(true);
        ratingArr = [...rate];
        ratingArr.push({ Source: "Rottan Tomatoes", Value: "N/A" });
        ratingArr.push({ Source: "Metacritic", Value: "N/A" });
    } else if (rate.length === 2 && rate[1].Source.includes("Rotten Tomatoes")) {
        console.log(true);
        ratingArr = [...rate];
        ratingArr.push({ Source: "Metacritic", Value: "N/A" });
    } else if (rate.length === 2 && rate[1].Source.includes("Metacritic")) {
        console.log(true);
        ratingArr = [...rate];
        ratingArr.push({ Source: "Rottan Tomatoes", Value: "N/A" });
    } else if (rate.length === 3) {
        ratingArr = [...rate];
    }
    const html = ` 
                    <div class = "movieInfo">
                    <div class="imageContainer">
                     <img class="movieImg" src="${data.Poster}" />
                     </div>
                     <div class="Title">
                        <h1 class="movieName">${data.Title}</h3>
                        <div class ="ratedGenre">
                            <span class="rated">${data.Rated}</span>
                            <span class="year2">${data.Year}</span>
                            <span class="genre">. ${data.Genre} .</span>
                            <span class="runtime">${data.Runtime}</span>
                        </div>
                            <h6 class="actors"> ${data.Actors} </h6>
                            
                        </diV>
                    </div>
                            <hr>
                            <p class="plot">${data.Plot}</p>
                            <hr>
                            <div class="rating">
                                <div class="imdb">
                                   
                                    <span class="imdbValue">${ratingArr[0].Value}</span>
                                     <span class="imdbHead">${ratingArr[0].Source}</span>
                                </div>
                                <div class="verticalLine">
                                </div>
                                <div class="rotan">
                                   
                                    <span class="rotanValue">${ratingArr[1].Value}</span>
                                     <span class="rotanHead">${ratingArr[1].Source} </span>
                                </div>
                                 <div class="verticalLine">
                                </div>
                                <div class="meta">
                                   
                                    <span class="metaValue">${ratingArr[2].Value}</span>
                                     <span class="metaHead">${ratingArr[2].Source}</span>
                                </div>
                                
                            </div>
                    </div>
                `;

    individualMovie.insertAdjacentHTML("beforeend", html);
    WatchList.style.opacity = 1;
};

movieList.addEventListener("click", function(e) {
    //const clickedElement = e.path[0];
    const clickedElement = e.target;
    const id = clickedElement.getAttribute("id");

    // const id = clickedElement.getAttribute("id");
    if (id == null) {
        return;
    } else {
        console.log(id);
        populateUI(id);
    }
});

const populateUI = async function(imdbId) {
    try {
        const res = await fetch(
            `https://www.omdbapi.com/?&i=${imdbId}&apikey=${apiKey}&`
        );
        const data = await res.json();
        console.log(data);
        renderMovie(data);
    } catch (err) {
        console.log(err);
    }
};

const addBookmark = function(movie) {};

/* Search button handelr which will call the getAllList function
 by passing the type and search value  */

searchButton.addEventListener("submit", function(e) {
    let searchValue = searchText.value;

    individualMovie.innerHTML = "";
    WatchList.style.opacity = 0;
    const type = getType();

    console.log(type);

    getAllList(searchValue, type);

    e.preventDefault();
});

/* function to get the data  of movies, episode, list from api call  */

const getAllList = async function(searchValue, type = "") {
    const year = 2020;
    const year2 = 2018;
    try {
        if (type == "all") {
            const res = await fetch(
                `https://www.omdbapi.com/?&s=${searchValue}&page=1&apikey=${apiKey}&`
            );
            const data = await res.json();
            console.log(data);
            renderList(data);
        }
        if (type == "movie" || type == "series") {
            const res = await fetch(
                `https://www.omdbapi.com/?&s=${searchValue}&type=${type}&apikey=${apiKey}&`
            );
            const data = await res.json();
            //  console.log(data);
            renderList(data);
        }
        // if (type == "series") {
        //     const res = await fetch(
        //         `https://www.omdbapi.com/?&s=${searchValue}&type=series&apikey=${apiKey}&`
        //     );
        //     const data = await res.json();
        //     console.log(data);

        //     renderList(data);
        // }
        if (type == "episode") {
            const res = await fetch(
                `https://www.omdbapi.com/?&t=${searchValue}&Season=1&apikey=${apiKey}&`
            );
            const data = await res.json();
            console.log(data);
            renderListEpisode(data);
        }
    } catch (err) {
        console.log(err);
    }
};