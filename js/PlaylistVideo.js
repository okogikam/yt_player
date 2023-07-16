class PlaylistVideo{
    constructor (config){
        this.element = config.element;
        this.playlist = config.playlist;
        this.ytVideo = config.ytVideo;
        this.listVideo = this.element.querySelector(".list-video");
    }
    displayPlaylist(){
        this.listVideo.innerHTML = "";
        Object.values(this.playlist).forEach(video=>{
            Object.keys(video).forEach(key=>{                
                const btn = document.createElement("button");
                btn.classList.add('btn-video');
                btn.innerHTML = `
                <span>
                <button class="btn remove-list"><i class="fa-solid fa-eraser"></i></button>   
                </span>         
                <div class="card">
                    <div class="card-img" style="background-image:url(${video[key][0].thumbnails.medium.url})">
                    <span class="video-num">${video[key].length} <br><i class="fa-solid fa-list"></i></span>
                    </div>
                    <div class="card-body">
                    <p>${key}</p>
                    </div>
                </div>
                `;
    
                btn.querySelector(".card").addEventListener("click",()=>{
                    // this.playnow = key;
                    this.displayPerVideo({
                        key: key,
                        videos: video[key]}
                        );
                })
                // btn.querySelector(".add-playlist").addEventListener("click",()=>{
                //     this.addPlaylist(vid);
                // })
                btn.querySelector(".remove-list").addEventListener("click",()=>{
                    this.deleteVideoList(type,key);
                })
    
                this.listVideo.append(btn);           

            })
        })
    }
    displayPerVideo(videoConfig){
        this.listVideo.innerHTML = `<p class="title">${videoConfig.key}</p>`;
        Object.values(videoConfig.videos).forEach(vid=>{
            const btn = document.createElement("button");
            btn.classList.add('btn-video');
            btn.innerHTML = `
            <span>
            <button class="btn remove-list"><i class="fa-solid fa-eraser"></i></button>   
            </span>         
            <div class="card-video-detal">
                <div class="card-img" style="background-image:url(${vid.thumbnails.medium.url})">
                </div>
                <div class="card-body">
                <p>${vid.title}</p>
                </div>
            </div>
            `;

            btn.querySelector(".card-video-detal").addEventListener("click",()=>{
                // this.playnow = key;
                // this.playVideo(key);
                this.playVideo(vid);
            })
            // btn.querySelector(".add-playlist").addEventListener("click",()=>{
            //     this.addPlaylist(vid);
            // })
            btn.querySelector(".remove-list").addEventListener("click",()=>{
                this.deleteVideoList(type,key);
            })

            this.listVideo.append(btn);
            this.listVideo.classList.add("playlist")
        })
    }
    playVideo(video){
        this.addTitile({
            element: this.element.querySelector("#title"),
            title: video.title,
        })

        const playerVideo = this.element.querySelector(".video-player");
        playerVideo.classList.remove("d-none");
        this.ytVideo.player.loadVideoById(video.videoId); 
        console.log(this.ytVideo.player);
        console.log(this.element);
    }
    addTitile(titleConfig){
        titleConfig.element.innerHTML = "";
        titleConfig.element.innerHTML = `<p>${titleConfig.title}</p>`;
    }
    
}