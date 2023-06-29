class Ytvideo{
    constructor(config){
        this.element = config.element;
        this.history = config.history || [];
        this.playlist = config.playlist || [];
        this.listVideo = this.element.querySelector(".list-video");
       
        this.dataVideo = [];
        this.playnow = 0;
        this.isDone = false;
        this.displayListNow = [];
    }
    setPlayer(player){
        this.player = player;
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
    display(type){
        if(type === "history"){
            this.displayListNow = this.history;
        }else if(type === "playlist"){
            this.displayListNow = this.playlist;
        }else if(type === "search"){
            this.displayListNow = this.dataVideo
        }

        this.listVideo.innerHTML = "";
        this.displayListNow.forEach((vid,key)=>{
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
        if(!this.history.find((v)=>(v.id.videoId == this.displayListNow[idVideo].id.videoId))){
            this.history.push(this.displayListNow[idVideo]);
            this.saveHistory();
        }

        const playerVideo = this.element.querySelector(".video-player");
        playerVideo.classList.remove("d-none");
        this.player.loadVideoById(this.displayListNow[idVideo].id.videoId); 
        this.starLoop() 
    }

    //memulai looping untuk mengecek status video 0 jika sudah selesai
    starLoop(){
        if(this.player.getPlayerState() === 0){
            console.log("video End")            
            setTimeout(()=>{
                this.isDone = true;
            },1000)
            if(this.isDone){
                this.playnow += 1;
                if(this.playnow >= this.displayListNow.length){
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