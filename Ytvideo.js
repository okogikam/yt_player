class Ytvideo{
    constructor(config){
        this.element = config.element;
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
    search(url){
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
        })
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
            
            // const img = new Image();
            // img.src = vid.snippet.thumbnails.default.url;
            // img.onload = ()=>{
            //     btn.append(img);
            //     btn.classList.add('btn-video');
            //     btn.innerHTML += `
            //     <p>${vid.snippet.title}</p>`
            //     this.listVideo.append(btn);
            // }
            btn.innerHTML = `
            <span>
            <button class="btn add-playlist"><i class="fa-solid fa-headphones"></i></button>
            <button class="btn remove-list"><i class="fa-solid fa-eraser"></i></button>   
            </span>         
            <div class="card">
             <div class="card-img" style="background-image:url(${vid.snippet.thumbnails.default.url})">
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

            this.listVideo.append(btn)
        })
    }
    //memutar video
    playVideo(idVideo){          
        if(!this.history.find((v)=>(v.id.videoId == this.displayListNow[idVideo].id.videoId))){
            this.history.push(this.displayListNow[idVideo]);
            this.saveHistory();
        }

        const playerVideo = this.element.querySelector(".video-player");
        playerVideo.classList.remove("d-none");
        this.player.loadVideoById(this.displayListNow[idVideo].id.videoId); 
    }

    //memulai looping untuk mengecek status video 0 jika sudah selesai
    starLoop(){
        if(this.player.getPlayerState() === 0){
            console.log("video End")            
            setTimeout(()=>{
                this.isDone = true;
            },1000)
            if(this.isDone && this.autoPlay){
                this.playnow += 1;
                if(this.playnow >= this.displayListNow.length){
                    this.playnow = 0;
                }
                this.playVideo(this.playnow);
                this.isDone = false;
                this.player.nextVideo();
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
        console.log("add to playlist")
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