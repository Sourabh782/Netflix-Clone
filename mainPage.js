const apiKey = "e1781f3938c125469b5f0c167e8c13da";
const apiEndpoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";
const youtubeEndpoint = "https://www.googleapis.com/youtube/v3/";
// const youtubeApi = "AIzaSyCyktzrrKXWaHYhr_HwiyGHzKSZ97yv_iY";  sourabh782
const youtubeApi = "AIzaSyA7IaEXIgq7tLdYuwptYSQPjz9jfkk6vfg"; // sourabh408
// https://www.googleapis.com/youtube/v3/search?part=snippet&q=spiderman%trailer&key=AIzaSyCyktzrrKXWaHYhr_HwiyGHzKSZ97yv_iY
// https://api.themoviedb.org/3/genre/tvshows/list?api_key=e1781f3938c125469b5f0c167e8c13da
// https://api.themoviedb.org/3/trending/movie/week?api_key=e1781f3938c125469b5f0c167e8c13da
const apiPaths = {
    fetchCatagories : `${apiEndpoint}/genre/movie/list?api_key=${apiKey}`,
    fetchMoviesList : (id) => `${apiEndpoint}/discover/movie?api_key=${apiKey}&with_genres=${id}`,
    fetchTrending : `${apiEndpoint}/trending/movie/week?api_key=${apiKey}`,
    searchOnYoutube : (name) => `${youtubeEndpoint}search?part=snippet&q=${name}%trailer&key=${youtubeApi}`
}

function inti(){
    fetchTrendingMovies();
    fetchAndBuildAllSection();
}

function fetchTrendingMovies(){
    fetchAndBuildTrendingSection(apiPaths.fetchTrending, 'Trending Now')
    .then(list=>{
        const index = parseInt(Math.random() * list.length);
        buildBannerSection(list[index]);
    })
    .catch(err=>{
        console.log(err);
    })
}

function buildBannerSection(movie){
    const bannerContainer = document.querySelector("#bannerSection");
    bannerContainer.style.backgroundImage = `url(${imgPath}${movie.backdrop_path})`;

    const div = document.createElement("div");
    div.className = "container bannerContent";
    div.innerHTML= `
            <h2 class="bannerTitle">${movie.title}</h2>
            <p class="bannerInfo">Trending in movies | Rating : ${movie.vote_average}</p>
            <p class="bannerDescription">${movie.overview && movie.overview.length > 200 ? movie.overview.slice(0,200).trim() + "....." : movie.overview}</p>
            <div class="buttons actionButton">
                <button class="btn"><i class="fa-solid fa-play fa-lg" style="color: #19191a; margin-right: 5px;"></i>Play</button>
                <button class="btn btn2"><i class="fa-solid fa-circle-info fa-lg" style="color: #ffffff; margin-right: 5px;"></i>More Info</button>
            </div>
    `
    bannerContainer.append(div);
}

function fetchAndBuildAllSection(){
    fetch(apiPaths.fetchCatagories)
    .then(res=>res.json())
    .then(res=>{
        const categories = res.genres;
        if(Array.isArray(categories) && categories.length){
            categories.forEach(category => {
                fetchAndBuildMovieSection(apiPaths.fetchMoviesList, category);
            })
        }
    })
    .catch(err=>console.log(err));
}

function fetchAndBuildTrendingSection(fetchURL, category){
    return fetch(fetchURL)
    .then(res => res.json())
    .then(res => {
        const movies = res.results;
        if(Array.isArray(movies) && movies.length){
            buildMoviesSection(movies, category);
        }
        return movies
    })
    .catch(err => console.log(err))
}
function fetchAndBuildMovieSection(fetchURL, category){
    // console.log(fetchURL(category.id));
    fetch(fetchURL(category.id))
    .then(res => res.json())
    .then(res => {
        const movies = res.results;
        if(Array.isArray(movies) && movies.length){
            buildMoviesSection(movies, category.name);
        }
    })
    .catch(err => console.log(err))
}


function buildMoviesSection(movies, categoryName){
    // console.log(movies, categoryName);
    const moviesContainer = document.querySelector("#moviesContainer");
    const list = movies.map(item=>{
        return `
        <div class="movieItem" onmouseover="searchMovieTrailer('${item.title}', 'yt${item.id}')">
            <img class="movieItemImg" loading="lazy" src="${imgPath}${item.backdrop_path}" alt="${item.title}"  >
            <iframe width="99%" height="99%" id="yt${item.id}" src=""></iframe>
        </div>
            `;
    }).join('');

    const moviesSectionHTML = `
            <h2 class="movieSectionHeading">${categoryName} <span class="explore">Explore All</span></h2>
            <div class="moviesRow">
                ${list}
            </div>
    `;

    // <iframe width="245" height="100%"src="https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=1&mute=1"></iframe>

    const div = document.createElement('div');
    div.className = "moviesSection";
    div.innerHTML = moviesSectionHTML;  //then append html into container
    moviesContainer.append(div);
}

function searchMovieTrailer(movieName, iframeId){
    if(!movieName){
        return;
    }
    fetch(apiPaths.searchOnYoutube(movieName))
    .then(res => res.json())
    .then(res => {
        // console.log(res.items[0])
        // const youtubeURL = `https://www.youtube.com/watch?v=${res.items[0].id.videoId}`;
        // videoId = res.items[0].id.videoId;
        try{
            document.getElementById(iframeId).src = `https://www.youtube.com/embed/${res.items[0].id.videoId}?autoplay=1&mute=0&controls=1`
        }
        catch(err){
            console.log("quota exceeded");
        }
        // console.log(youtubeURL);
    })
    .catch(err=>{console.log("err")})
}

window.addEventListener('load', function(){
    inti();
    window.addEventListener("scroll", ()=>{
        const header = document.querySelector("#header");
        if(window.scrollY > 5){
            header.classList.add("black-bg")
        }else{
            header.classList.remove("black-bg")
        }
    })
    const pointer = document.querySelector(".pointer");
    clear = setTimeout(()=>{
        pointer.style.display = ("none");
    }, 3000);
    
    clear();
})

