// const api_link = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=anime&key=AIzaSyCHjRJIK4diEwjSvJe1zPgarVhmuItQtZI";
const searchBtn = document.querySelector(".cari-btn");
const loading = document.querySelector(".loading");
let btnMenu = document.querySelectorAll(".btn-menu");
const historyVideo = localStorage.getItem("history") ? JSON.parse(localStorage.getItem("history")) : [];
const Playlist = localStorage.getItem("playlist") ? JSON.parse(localStorage.getItem("playlist")) : [];
let player

const Ytsearch = new Ytvideo({
    element: document.querySelector(".result"),    
    playlist: Playlist,
    history: historyVideo
})

Ytsearch.load();

window.addEventListener("load", () => {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./service-worker.js");
    }
});

btnMenu.forEach((btn,i)=>{
    btn.addEventListener("click",()=>{
        btnMenu.forEach((b)=>{
            b.classList.remove("active");
        })
        btnMenu[i].classList.add("active");
        menubtn(btn.dataset.type)
    })
})
function menubtn(type){
    Ytsearch.display(type);
}
//menyiapkan iframe video
async function onYouTubeIframeAPIReady(){
    player = new YT.Player('video-player')

    Ytsearch.setPlayer(player)

    searchBtn.addEventListener("click",()=>{
        console.log("cari")
        let searchQuery = document.querySelector(".search").value;
        let url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&maxResults=10&key=AIzaSyCHjRJIK4diEwjSvJe1zPgarVhmuItQtZI`
        Ytsearch.search(url);
        btnMenu[0].click()
    })

    loading.classList.add("d-none")
}

loading.classList.add("d-none")
