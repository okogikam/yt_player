class Ytvideo{
    constructor(config){
        this.element = config.element;
        this.history = config.history || [];
        this.playlist = config.playlist || [];
        // this.ifram = config.ifram;
        this.listVideo = this.element.querySelector(".list-video");
        this.player = config.player
        this.dataVideo = [];
        this.playnow = 0;
        this.isDone = false;
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
                if(video.id.kind === "youtube#video"){
                    this.dataVideo.push(video);

                    if(!this.history.find((v)=>(v.id.videoId == video.id.videoId))){
                        this.history.push(video);
                        this.saveHistory();
                    }
                }
            });
            this.display();           
        })
    }
    //menampilkan video ke halaman
    display(){
        this.listVideo.innerHTML = "";
        this.dataVideo.forEach((vid,key)=>{
            const btn = document.createElement("button");
            btn.addEventListener("click",()=>{
                this.playnow = key;
                this.playVideo(key);
            })
            const img = new Image();
            img.src = vid.snippet.thumbnails.default.url;
            img.onload = ()=>{
                btn.append(img);
                btn.classList.add('btn-video');
                btn.innerHTML += `
                <p>${vid.snippet.title}</p>`
                this.listVideo.append(btn);
            }
        })
    }
    //memutar video
    playVideo(idVideo){        
        const playerVideo = this.element.querySelector(".video-player");
        playerVideo.classList.remove("d-none");
        this.player.loadVideoById(this.dataVideo[idVideo].id.videoId);   
        
        this.starLoop() 
    }

    //memulai looping untuk mengecek status video 0 jika sudah selesai
    starLoop(){
        if(this.player.getPlayerState() === 0 || this.player.getPlayerState() === -1){
            console.log("video End")            
            setTimeout(()=>{
                this.isDone = true;
            },1000)
            if(this.isDone){
                this.playnow += 1;
                if(this.playnow >= this.dataVideo.length){
                    this.playnow = 0;
                }
                this.playVideo(this.playnow);
                this.isDone = false;
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

    //memuat halaman awal
    load(){
        if(this.history.length > 0 ){
            this.dataVideo = this.history;
            this.display();
        }   
    }
}