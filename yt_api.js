// const api_link = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=anime&key=AIzaSyCHjRJIK4diEwjSvJe1zPgarVhmuItQtZI";
const searchBtn = document.querySelector(".cari-btn");
const loading = document.querySelector(".loading");
const settingbtn = document.querySelector(".setting-btn");
const autoPlaybtn = document.querySelector(".auto-play");
const closesetting = document.querySelector(".close");
const removeHistory = document.querySelector(".remove-history");
const removePlailist = document.querySelector(".remove-playlist");
const setting = document.querySelector(".setting");
let btnMenu = document.querySelectorAll(".btn-menu");
const historyVideo = localStorage.getItem("history") ? JSON.parse(localStorage.getItem("history")) : [];
const Playlist = localStorage.getItem("playlist") ? JSON.parse(localStorage.getItem("playlist")) : [];
let player

const Ytsearch = new Ytvideo({
    element: document.querySelector(".result"),    
    playlist: Playlist,
    history: historyVideo
})

if(typeof player === "object"){
    loading.classList.add("d-none");
}

window.addEventListener("load", () => {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./service-worker.js");
    }
});

autoPlaybtn.addEventListener("click",()=>{
    if(Ytsearch.autoPlay){
        Ytsearch.autoPlay = false;
        autoPlaybtn.innerHTML = '<i class="fa-solid fa-toggle-off"></i>';
    }else{
        Ytsearch.autoPlay = true;
        autoPlaybtn.innerHTML = '<i class="fa-solid fa-toggle-on"></i>';
    }
})

settingbtn.addEventListener("click",()=>{
    setting.classList.toggle("d-none");
})

closesetting.addEventListener("click",()=>{
    setting.classList.toggle("d-none");
})

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
// console.log(Ytsearch.listIdVideo);
// 2. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
function onYouTubeIframeAPIReady(){
    loading.classList.remove("d-none")
    player = new YT.Player('video-player',{
        playerVars: {
            'controls': 0,
            'iv_load_policy':3
          },
        events:{
            "onReady": onReadyPlayer,
            "onError": onErrorPlayer
        }
    })    
}

searchBtn.addEventListener("click",()=>{
    console.log("cari")
    let searchQuery = document.querySelector(".search").value;
    let url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&maxResults=9&type=video&key=AIzaSyCHjRJIK4diEwjSvJe1zPgarVhmuItQtZI`
    Ytsearch.search(url);
    btnMenu[0].click()
})

function onReadyPlayer(){
    Ytsearch.setPlayer(player)
    Ytsearch.load();
    loading.classList.add("d-none")
}

function onErrorPlayer(){
    location.reload()
}

removeHistory.addEventListener("click",()=>{
    Ytsearch.removeHistory();
})
// loading.classList.add("d-none")
