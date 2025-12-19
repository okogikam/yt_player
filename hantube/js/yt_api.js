// const api_link = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=anime&key=AIzaSyCHjRJIK4diEwjSvJe1zPgarVhmuItQtZI";
const domain = location.origin;
const searchBtn = document.querySelector(".cari-btn");
const loading = document.querySelector(".loading");
const settingbtn = document.querySelector(".setting-btn");
const autoPlaybtn = document.querySelector(".auto-play");
const closesetting = document.querySelector(".close");
const removeHistory = document.querySelector(".remove-history");
const removePlailist = document.querySelector(".remove-playlist");
const userLogin = document.querySelector(".user-login");
const setting = document.querySelector(".setting");
let btnMenu = document.querySelectorAll(".btn-menu");
const historyVideo = localStorage.getItem("history") ? JSON.parse(localStorage.getItem("history")) : [];
const Playlist = localStorage.getItem("playlist") ? JSON.parse(localStorage.getItem("playlist")) : [];
let searchInput = document.querySelector(".search");
let player = new Player({
    element: document.querySelector("#video-player"),
    origin: "https://okogikam.github.io/yt_player/",
})


const Ytsearch = new Ytvideo({
    element: document.querySelector("body"),    
    playlist: Playlist,
    history: historyVideo,
    url: "https://okogikam.github.io/yt_player/api.php?",
})

// if(typeof player === "object"){
//     loading.classList.add("d-none");
// }

window.addEventListener("load", async () => {
    if ("serviceWorker" in navigator) {
       await navigator.serviceWorker.register("./service-worker.js");
    }

    player.makeElement();
    Ytsearch.setPlayer(player);
    Ytsearch.isUserLogin();
    loading.classList.add("d-none");
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
// function onYouTubeIframeAPIReady(){
//     loading.classList.remove("d-none")
//     player = new YT.Player('video-player',{
//         playerVars: {
//             'controls': 1,
//             'iv_load_policy':3,
//             'listType': 'playlist',
//             'origin': "https://hancau.net/api/",
//             'rel': 0
//           },         
//         events:{
//             "onReady": onReadyPlayer,
//             "onError": onErrorPlayer,
//         }
//     })    
// }


// function onReadyPlayer(){
//     Ytsearch.setPlayer(player)
//     Ytsearch.load();
//     loading.classList.add("d-none")
// }

// function onErrorPlayer(){
    //     location.reload()
    // }
        
searchBtn.addEventListener("click",()=>{
    let searchQuery = searchInput.value;
    let videoType = searchQuery.split(":");
    let type = "video";
    if(videoType[0].toLowerCase() === "pl"){
        type = "playlist";
    }
    Ytsearch.search({
        q: searchQuery,
        type: type,
        maxResults: "50"
    });
    btnMenu[0].click()
})

searchInput.addEventListener("keydown",(event)=>{   
    if(event.code === "Enter"){
        event.preventDefault();
        let searchQuery = searchInput.value;
        let videoType = searchQuery.split(":");
        let type = "video";
        if(videoType[0].toLowerCase() === "pl"){
            type = "playlist";
        }
        Ytsearch.search({
            q: searchQuery,
            type: type,
            maxResults: "50"
        });
        btnMenu[0].click()
    }
})

removeHistory.addEventListener("click",()=>{
    if(confirm("Apa anda yakin?") === true){
        Ytsearch.removeHistory();
    }
})
removePlailist.addEventListener("click",()=>{
    if(confirm("Apa anda yakin?") === true){
    Ytsearch.playlistVideo.removePlaylist();
    }
})
userLogin.addEventListener("click",()=>{
    Ytsearch.usersetting.init();
})

