class Ytvideo{
    constructor(config){
        this.element = config.element;
        this.url = "https://youtube.googleapis.com/youtube/v3/search?part=snippet";
        this.apiKey = "AIzaSyCHjRJIK4diEwjSvJe1zPgarVhmuItQtZI";
       
        this.history = config.history || [];
        this.playlist = config.playlist || [];
        this.listVideo = this.element.querySelector(".list-video");
        this.autoPlay = false;       
        this.dataVideo = [];
        this.playnow = 0;
        this.isDone = false;
        this.displayListNow = [];
    }
    setPlayer(player){
        this.player = player;
        this.starLoop();
    }
    setPlaylist(){
        this.listIdVideo = [];
        this.displayListNow.forEach(vid=>{
            this.listIdVideo.push(vid.id.videoId);
        })

        this.player.cuePlaylist({
            list:this.listIdVideo,
            listType: "playlist"
        });
    }
    
    //pencarian
    search(urlConfig){
        this.q = urlConfig.q || "";
        this.maxResults = urlConfig.maxResults || "";
        this.type = urlConfig.type || "";
        this.pageToken = urlConfig.pageToken || "";
        const url = `${this.url}&q=${this.q}&pageToken=${this.pageToken}&maxResults=${this.maxResults}&type=${this.type}&key=${this.apiKey}`
        fetch(url)
        .then((result)=>{
            return result.json()
        }).then((data)=>{
            this.dataVideo = [];
            let videos =data.items
            Object.values(videos).forEach(video=>{
                this.dataVideo.push(video);
            });
            this.display("search"); 
            this.pageToken =  data.nextPageToken;
            this.displayLoadMore({
                element: this.listVideo,
                prev: data.prevPageToken ? data.prevPageToken : "",
                next: data.nextPageToken ? data.nextPageToken : ""
            })            
            // console.log(data.nextPageToken)     
        })
    }
    searchMore(urlConfig){
        this.q = urlConfig.q || "";
        this.maxResults = urlConfig.maxResults || "";
        this.type = urlConfig.type || "";
        this.pageToken = urlConfig.pageToken || "";
        const url = `${this.url}&q=${this.q}&pageToken=${this.pageToken}&maxResults=${this.maxResults}&type=${this.type}&key=${this.apiKey}`
        fetch(url)
        .then((result)=>{
            return result.json()
        }).then((data)=>{
            let videos =data.items
            Object.values(videos).forEach(video=>{
                this.dataVideo.push(video);
            });
            this.display("search"); 
            this.pageToken =  data.nextPageToken;  
            this.pageToken =  data.nextPageToken;
            this.displayLoadMore({
                element: this.listVideo,
                prev: data.prevPageToken ? data.prevPageToken : "",
                next: data.nextPageToken ? data.nextPageToken : ""
            })  
        })
    }
    addTitile(titleConfig){
        titleConfig.element.innerHTML = "";
        titleConfig.element.innerHTML = `<p>${titleConfig.title}</p>`;
    }
    displayLoadMore(loadConfig){
        const div = document.createElement("div");
        div.classList.add("more");
        if(loadConfig.prev !== ""){
            const btn = document.createElement("button");
            btn.textContent = "Load Prev";
            btn.classList.add("btn")
            btn.classList.add("d-none");
            div.appendChild(btn);
        }

        if(loadConfig.next !== ""){
            const btn = document.createElement("button");
            btn.textContent = "Load More";
            btn.classList.add("btn")
            btn.classList.add("load-more");
            div.appendChild(btn);
        }

        div.querySelector(".load-more").addEventListener("click",()=>{
            this.loadSearchResultMore();
        })
        loadConfig.element.appendChild(div);
    }
    loadSearchResultMore(){
        this.searchMore({
            q: this.q,
            type: this.type,
            maxResults : this.maxResults,
            pageToken: this.pageToken,
        })
        this.display("search");
    }
    //menampilkan video ke halaman
    async display(type){
        if(type === "history"){
            this.displayListNow = this.history;        
        }else if(type === "playlist"){
            this.displayListNow = this.playlist;
        }else if(type === "search"){
            this.displayListNow = this.dataVideo
        }

        // this.setPlaylist()

        this.listVideo.innerHTML = "";
        this.displayListNow.forEach((vid,key)=>{
            const btn = document.createElement("button");
            btn.classList.add('btn-video');
            btn.innerHTML = `
            <span>
            <button class="btn add-playlist"><i class="fa-solid fa-headphones"></i></button>
            <button class="btn remove-list"><i class="fa-solid fa-eraser"></i></button>   
            </span>         
            <div class="card">
             <div class="card-img" style="background-image:url(${vid.snippet.thumbnails.medium.url})">
             </div>
             <div class="card-body">
                <p>${vid.snippet.title}</p>
             </div>
            </div>
            `;

            btn.querySelector(".card").addEventListener("click",()=>{
                this.playnow = key;
                this.playVideo(key);
            })
            btn.querySelector(".add-playlist").addEventListener("click",()=>{
                this.addPlaylist(vid);
            })
            btn.querySelector(".remove-list").addEventListener("click",()=>{
                this.deleteVideoList(type,key);
            })

            this.listVideo.append(btn)            
        })
    }
    //memutar video
    playVideo(idVideo){          
        if(!this.history.find((v)=>(v.id.videoId == this.displayListNow[idVideo].id.videoId))){
            this.history.push(this.displayListNow[idVideo]);
            this.saveHistory();
        }

        this.addTitile({
            element: this.element.querySelector("#title"),
            title: this.displayListNow[idVideo].snippet.title
        })

        const playerVideo = this.element.querySelector(".video-player");
        playerVideo.classList.remove("d-none");
        this.player.loadVideoById(this.displayListNow[idVideo].id.videoId); 
    }
    deleteVideoList(type,idVideo){
        if(type === "history"){
            this.history.splice(idVideo,1);
            this.displayListNow = this.history;
            this.saveHistory();        
        }else if(type === "playlist"){
            this.playlist.splice(idVideo,1);
            this.displayListNow = this.playlist;
            this.savePlaylist();
        }else if(type === "search"){
            this.dataVideo.splice(idVideo,1);
            this.displayListNow = this.dataVideo
        }

        this.display(type);
    }

    //memulai looping untuk mengecek status video 0 jika sudah selesai
    starLoop(){
        if(this.player.getPlayerState() === 0){
            console.log("video End")            
            setTimeout(()=>{
                this.isDone = true;
            },800)
            if(this.isDone && this.autoPlay){
                this.playnow += 1;
                if(this.playnow >= this.displayListNow.length){
                    this.playnow = 0;
                }
                this.playVideo(this.playnow);
                this.isDone = false;
                this.player.nextVideo();
                console.log("next")
            }
        }

        requestAnimationFrame(()=>{
            this.starLoop()
        })
    }
    addPlaylist(vid){
        const match = this.playlist.find(object=>{
            return `${object.id.videoId}` === `${vid.id.videoId}`
        });
        if(match){
            return
        }
        this.playlist.push(vid);
        this.savePlaylist()
    }
    //menyimpan history ke localhost
    saveHistory(){
        localStorage.setItem("history",JSON.stringify(this.history));
    }
    savePlaylist(){
        localStorage.setItem("playlist",JSON.stringify(this.playlist));
    }
    //menghapus history ke localhost
    removeHistory(){
        this.history = [];
        this.saveHistory();
        this.display("history")
    }

    //memuat halaman awal
    load(){
        if(this.history.length > 0 ){
            this.display("history");
        }   
    }
}