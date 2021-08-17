const all = document.querySelector("#all");
const movies = document.querySelector("#movies");
const series = document.querySelector("#series");
const episode = document.querySelector("#episode");

const searchButton = document.querySelector("#searchForm");
const searchText = document.querySelector("#searchtext");
const movieList = document.querySelector("#movieList");

const WatchList = document.querySelector("#watchList");
const individualMovie = document.querySelector("#movie");
const cardlist = document.querySelector(".cardList");
const watchListbtn = document.querySelector(".watchListbtn");
let bookmarks = new Array();

const apiKey = "c552542c";

/// returns the  type user has selected
function getType() {
    if (all.checked) return all.value;
    if (movies.checked) return movies.value;
    if (series.checked) return series.value;
    if (episode.value) return episode.value;
}

/* Search button handelr which will call the getAllList function
             by passing the type and search value  */
searchButton.addEventListener("submit", function(e) {
    let searchValue = searchText.value;
    individualMovie.innerHTML = "";
    const type = getType();
    getAllList(searchValue, type);
    e.preventDefault();
});

const init = function() {
    const storage = localStorage.getItem("bookmarks");

    if (storage) {
        bookmarks = JSON.parse(storage);
    }
};

init();
console.log(bookmarks);

const localstoargeBookmarks = function(bookmark) {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
};

// This function renders the list if the user selected type is Any, movie, series

const renderList = function(data) {
    movieList.innerHTML = "";

    const div = document.createElement("li");
    div.className = " results";
    div.innerHTML = `${data.totalResults} Results`;
    movieList.appendChild(div);
    const { Search } = data;
    //console.log(Search);
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

// This function renders the list if the user selected type is Epsidoed

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
        loopingList.innerHTML = `  ${i.Title}
        <span id=${i.imdbID} class='year'> ${i.Released}</span> `;
        movieList.appendChild(loopingList);
    });
};

// This function will render the full details of selected item from the list.
const renderMovie = function(data, bookmarks) {
    individualMovie.innerHTML = "";

    const bookmarklist = bookmarks;
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
                        <div class="divButton">
                         <button class="watchList" id="${data.imdbID}">Watchlist</button>
                         </div>
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

    // if the movie is added to watchlist before then it will contain the id in bookmark array.
    // this will add the class toogle to button
    const getbuttonClass = document.querySelector(".watchList");
    const buttonId = getbuttonClass.getAttribute("id");
    if (bookmarklist.includes(buttonId)) {
        getbuttonClass.classList.toggle("toggle");
    }
};

/// this function add all the movies selected by the user to the modal.

function populateShowList(data) {
    const html = `<div class="card">
      <div class="card-body listClicked" id = ${data.imdbID}>
       <img class="img" id=${data.imdbID} src="${data.Poster}"/>
        ${data.Title}
        <span id=${data.imdbID} class='year'> ${data.Year}</span> 
      </div>
    </div`;

    cardlist.insertAdjacentHTML("beforeend", html);
}

// get the imdb ID and pass it to populateUI
movieList.addEventListener("click", function(e) {
    const clickedElement = e.target;
    const id = clickedElement.getAttribute("id");
    if (id == null) {
        return;
    } else {
        populateUI(id);
    }
});

// This function will add and remove the id from bookmark array

function addWishlist(id) {
    const getId = document.querySelector(`button#${id}`);
    if (bookmarks.includes(id)) {
        let index = bookmarks.indexOf(id);
        bookmarks.splice(index, 1);
        getId.classList.toggle("toggle");
        localstoargeBookmarks();

        console.log(bookmarks);
    } else {
        getId.classList.toggle("toggle");

        bookmarks.push(id);
        localstoargeBookmarks();
        console.log(bookmarks);
    }
}

// this click event will open the modal that contains all the watchlist that user has selected.

watchListbtn.addEventListener("click", function(e) {
    cardlist.innerHTML = "";
    showWishList(bookmarks);
});

// this clickhandler will run when clicked on wishlist butoon and will get the id and pass it to addwishList(id)
document.addEventListener("click", function(e) {
    const getCurrentElement = e.target;

    if (getCurrentElement.classList.contains("watchList")) {
        const id = getCurrentElement.getAttribute("id");
        addWishlist(id);
    }
});

// this clickhandler will run only when clicked on items in the modal
document.addEventListener("click", function(e) {
    const getCurrentElement = e.target;
    if (getCurrentElement.classList.contains("card-body")) {
        const id = getCurrentElement.getAttribute("id");
        console.log(id);
        populateUI(id);
    }
});

// this showlist function will run when user click bookmark button.
// this will  make api calls depending upon how many items in array.

const showWishList = async function(imdbId) {
    if (imdbId.length === 0) {
        showEmptyListMessage();
    } else {
        for (let i = 0; i < imdbId.length; i++) {
            const res = await fetch(
                `https://www.omdbapi.com/?&i=${imdbId[i]}&apikey=${apiKey}&`
            );
            const data = await res.json();
            //  console.log(data);
            populateShowList(data);
        }
        console.log(imdbId);
    }
};

const populateUI = async function(imdbId) {
    try {
        const res = await fetch(
            `https://www.omdbapi.com/?&i=${imdbId}&apikey=${apiKey}&`
        );
        const data = await res.json();
        //console.log(data);
        renderMovie(data, bookmarks);
    } catch (err) {
        console.log(err);
    }
};

function showEmptyListMessage() {
    cardlist.innerHTML = "";
    const html = `<div class="card">
      <div class="card-body" >
       No bookmark Yet. Find a movie you like and bookmark it :) 
      </div>
    </div`;
    cardlist.insertAdjacentHTML("beforeend", html);
}

function ShowError(err) {
    movieList.innerHTML = "";
    const html = `<li class= 'error list-group-item' > ${err} </li>`;
    movieList.insertAdjacentHTML("beforeend", html);
}

/* function to get the data  of movies, episode, list from api call  */

const getAllList = async function(searchValue, type = "") {
    try {
        if (type == "movie" || type == "series" || type == "") {
            const res = await fetch(
                `https://www.omdbapi.com/?&s=${searchValue}&type=${type}&apikey=${apiKey}&`
            );
            const data = await res.json();
            console.log(data);
            if (data.Error) {
                ShowError(data.Error);
            } else {
                renderList(data);
            }
        }

        if (type == "episode") {
            const res = await fetch(
                `https://www.omdbapi.com/?&t=${searchValue}&Season=1&apikey=${apiKey}&`
            );
            const data = await res.json();
            console.log(data);

            if (data.Error) {
                ShowError(data.Error);
            } else {
                renderListEpisode(data);
            }
        }
    } catch (err) {
        ShowError(err.message);
    }
};