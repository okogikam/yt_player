// const api_link = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=anime&key=AIzaSyCHjRJIK4diEwjSvJe1zPgarVhmuItQtZI";
const searchBtn = document.querySelector(".cari-btn");
const loading = document.querySelector(".loading");
let conteiner = document.querySelector(".result");
const historyVideo = localStorage.getItem("history") ? JSON.parse(localStorage.getItem("history")) : [];
const Playlist = localStorage.getItem("playlist") ? JSON.parse(localStorage.getItem("playlist")) : [];
let player

window.addEventListener("load", () => {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./service-worker.js");
    }
});
  
//menyiapkan iframe video
async function onYouTubeIframeAPIReady(){
    player = await new YT.Player('video-player')

    const Ytsearch = new Ytvideo({
        element: document.querySelector(".result"),    
        playlist: Playlist,
        history: historyVideo,
        player: player
    })

    Ytsearch.load();

    searchBtn.addEventListener("click",()=>{
        console.log("cari")
        let searchQuery = document.querySelector(".search").value;
        let url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&maxResults=10&key=AIzaSyCHjRJIK4diEwjSvJe1zPgarVhmuItQtZI`
        Ytsearch.search(url);
    })

    loading.classList.add("d-none")
}
