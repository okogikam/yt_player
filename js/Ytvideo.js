class Ytvideo{
    constructor(config){
        this.element = config.element;
        this.url = config.url;
       
        this.history = config.history || [];
        this.playlistVideo = new PlaylistVideo({
            element: this.element,
            ytVideo: this,
            playlist: config.playlist ||[]
        })
        this.listVideo = this.element.querySelector(".list-video");
        this.autoPlay = false;       
        this.dataVideo = [];
        this.playnow = 0;
        this.isDone = false;
        this.displayListNow = [];
        this.isPlaying = false;
        this.dataVideo = [];
        this.qHistory = "";
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

        if(this.q != this.qHistory){
            this.dataVideo = [];
            this.qHistory = this.q;
        }

        this.maxResults = urlConfig.maxResults || "";
        this.type = urlConfig.type || "";
        this.pageToken = urlConfig.pageToken || "";
        const url = `https://api.hancau.net/?&q=${this.q}&pageToken=${this.pageToken}&maxResults=${this.maxResults}&type=${this.type}`
        
        fetch(url)
        .then((result)=>{
            return result.json();
        })
        .then((data)=>{
            let videos = data.items;

            Object.values(videos).forEach(video=>{
                this.dataVideo.push(video);
            });
            this.pageToken =  data.nextPageToken;
            this.display("search");        
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
        this.search({
            q: this.q,
            type: this.type,
            maxResults : this.maxResults,
            pageToken: this.pageToken,
        })
        this.display("search");
    }
    //menampilkan video ke halaman
    async display(type){
        this.type = type;
        //display video
        this.listVideo.classList.remove("playlist");
        if(type === "history"){
            this.displayListNow = this.history; 
            this.removeFlex();   
            this.displayHistory(type);    
        }else if(type === "playlist"){    
            this.displayListNow = this.playlistVideo.playlist;        
            this.playlistVideo.displayPlaylist();
            this.removeFlex();  
        }else if(type === "search"){
            this.displayListNow = this.dataVideo;
            this.removeFlex();       
            this.displayHistory(type);
            if(this.pageToken != undefined && this.pageToken != "" && this.pageToken != null){
                this.displayLoadMore({
                    element: this.listVideo,
                    prev: "",
                    next: this.pageToken,
                })    
            }
        }      
    }
    
    displayHistory(type){
        this.listVideo.innerHTML = "";
        this.displayListNow.forEach((vid,key)=>{
            const kind = vid.id.kind;
            const videoKind  = kind.split("#");
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
                <p>[${videoKind[1]}]${vid.snippet.title}</p>
             </div>
            </div>
            `;
            
            btn.querySelector(".card").addEventListener("click",()=>{
                this.playnow = key;
                this.playVideo(key);
            })
            btn.querySelector(".add-playlist").addEventListener("click",()=>{
                this.playlistVideo.addPlaylist(vid);
            })
            btn.querySelector(".remove-list").addEventListener("click",()=>{
                this.deleteVideoList(type,key);
            })

            this.listVideo.append(btn)            
        })
    }
    removeFlex(){
        if(this.isPlaying || this.displayListNow.length > 0){
            this.element.classList.remove("d-flex");            
        }else{
            this.element.classList.add("d-flex");
        }   
    }
    //memutar video
    playVideo(idVideo){   
        this.isPlaying = true;       
        if(!this.history.find((v)=>(v.id.videoId == this.displayListNow[idVideo].id.videoId))){
            this.history.push(this.displayListNow[idVideo]);
            this.saveHistory();
        }
        if(!this.history.find((v)=>(v.id.playlistId == this.displayListNow[idVideo].id.playlistId))){
            this.history.push(this.displayListNow[idVideo]);
            this.saveHistory();
        }
        const kind = this.displayListNow[idVideo].id.kind;
        const videoKind = kind.split("#");

        this.addTitile({
            element: this.element.querySelector("#title"),
            title: this.displayListNow[idVideo].snippet.title
        })
        // console.log(type[1]);
        // console.log(this.displayListNow[idVideo].id.playlistId);

        const playerVideo = this.element.querySelector(".video-player");
        playerVideo.classList.remove("d-none");

        if(videoKind[1] === "playlist"){
            console.log("click");
            this.player.init({
                type: "playlist",
                videoId: this.displayListNow[idVideo].id.playlistId,
            })

            return;
        }

        this.player.init({
            videoId: this.displayListNow[idVideo].id.videoId,
            type: "video",
        }); 
        
    }
    deleteVideoList(type,idVideo){
        const div = document.createElement("div");
        div.classList.add("form-add-playlist");
        div.innerHTML = `
        <div class="playlist-card">
        <p>${this.displayListNow[idVideo].snippet.title}</p>
        <div class="playlist-img" style="background-image:url(${this.displayListNow[idVideo].snippet.thumbnails.medium.url})"></div>
        <button type="button" class="btn-add-palylist">Delete</button>
        <button type="button" class="btn cancel">Cancel</button>
        </div>
        `;
        div.querySelector(".btn-add-palylist").addEventListener("click",()=>{
            if(type === "history"){
                this.history.splice(idVideo,1);
                this.displayListNow = this.history;
                this.saveHistory();        
            }else if(type === "search"){
                this.dataVideo.splice(idVideo,1);
                this.displayListNow = this.dataVideo
            }
            this.display(type);
            div.remove();
        })
        div.querySelector(".cancel").addEventListener("click",()=>{
            div.remove();
        })
        this.element.appendChild(div);        
    }

    //memulai looping untuk mengecek status video 0 jika sudah selesai
    starLoop(){
        this.player.startLoop();
        if(this.player.playerState === 0){
            console.log("video End")            
            setTimeout(()=>{
                this.isDone = true;
            },500)
            if(this.isDone && this.autoPlay){             
                this.playnow += 1;
                if(this.playnow >= this.displayListNow.length){
                    this.playnow = 0;
                }
                this.playVideo(this.playnow);
                this.isDone = false;
                console.log("next")
                
            }else{
                const playerVideo = this.element.querySelector(".video-player");
                playerVideo.classList.add("d-none");
            }
        }

        requestAnimationFrame(()=>{
            this.starLoop()
        })
    }    
    //menyimpan history ke localhost
    saveHistory(){
        localStorage.setItem("history",JSON.stringify(this.history));
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
            this.display("search");
        }   
    }
}