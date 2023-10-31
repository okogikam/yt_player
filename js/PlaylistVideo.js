class PlaylistVideo{
    constructor (config){
        this.element = config.element;
        this.playlist = config.playlist;
        this.ytVideo = config.ytVideo;
        this.listVideo = this.element.querySelector(".list-video");
    }
    displayPlaylist(){
        this.listVideo.classList.remove("playlist");
        this.listVideo.innerHTML = "";
        Object.values(this.playlist).forEach(video=>{
            Object.keys(video).forEach(key=>{    
                if(video[key].length > 0){
                    console.log(video[key].length)
                    const btn = document.createElement("button");
                    btn.classList.add('btn-video');
                    btn.innerHTML = `
                    <span>
                    <button class="btn remove-list"><i class="fa-solid fa-eraser"></i></button>   
                    </span>         
                    <div class="card">
                        <div class="card-img" style="background-image:url(${video[key][0].snippet.thumbnails.medium.url})">
                        <span class="video-num">${video[key].length} <br><i class="fa-solid fa-list"></i></span>
                        </div>
                        <div class="card-body">
                        <p>${key}</p>
                        </div>
                    </div>
                    `;
        
                    btn.querySelector(".card").addEventListener("click",()=>{
                        let vidPlaylists = video[key].sort(() => Math.random() - 0.5); 
                        this.displayPerVideo({
                            key: key,
                            videos: vidPlaylists
                        });
                    })
    
                    btn.querySelector(".remove-list").addEventListener("click",()=>{
                        this.deletePlaylist({
                            playlist: video[key],
                            playlistKey: key,
                        });
                    })
        
                    this.listVideo.append(btn);        

                }         

            })
        })
    }
    displayPerVideo(videoConfig){
        
        this.listVideo.innerHTML = `<p class="title">${videoConfig.key}</p>`;
        Object.keys(videoConfig.videos).forEach(key=>{
            const videos = videoConfig.videos;
            const btn = document.createElement("button");
            btn.classList.add('btn-video');
            btn.innerHTML = `
            <span>
            <button class="btn add-playlist"><i class="fa-solid fa-headphones"></i></button>
            <button class="btn remove-list"><i class="fa-solid fa-eraser"></i></button>   
            </span>         
            <div class="card-video-detal">
                <div class="card-img" style="background-image:url(${videos[key].snippet.thumbnails.medium.url})">
                </div>
                <div class="card-body">
                <p>${videos[key].snippet.title}</p>
                </div>
            </div>
            `;

            btn.querySelector(".card-video-detal").addEventListener("click",()=>{
                this.isPlayingNow = key;
                this.playlistNow = videos;

                this.playVideo({
                    video: videos,
                    index: key,
                });
            })
            btn.querySelector(".add-playlist").addEventListener("click",()=>{
                this.addPlaylist(videos[key])
                console.log(videos[key])
            })

            btn.querySelector(".remove-list").addEventListener("click",()=>{
                this.deleteVideoList({
                    playlistKey: videoConfig.key,
                    videoKey : key,
                    videos: videoConfig.videos,
                });
            })

            this.listVideo.append(btn);
            this.listVideo.classList.add("playlist")
        })
    }
    playVideo(videos){
        this.addTitile({
            element: this.element.querySelector("#title"),
            title: videos.video[`${videos.index}`]['snippet']['title'],
        })
        const playlist = [];

        const playerVideo = this.element.querySelector(".video-player");
        playerVideo.classList.remove("d-none");
        Object.keys(videos.video).forEach(key=>{            
            playlist.push(videos.video[key].id.videoId);
        })
        this.ytVideo.player.init({
            type: "costumePlaylist",
            videoId: {
                playlist: playlist,
                index: videos.index,
            }
        });
    }
    playNextVideo(){
        this.isPlayingNow = Number(this.isPlayingNow) + 1;

        if(this.isPlayingNow >= this.playlistNow.length){
            this.isPlayingNow = 0;
        }

        this.playVideo(this.playlistNow[`${this.isPlayingNow}`]);
    }
    addTitile(titleConfig){
        titleConfig.element.innerHTML = "";
        titleConfig.element.innerHTML = `<p>${titleConfig.title}</p>`;
    }
    async addPlaylist(video){

        const div = document.createElement("div");
        div.classList.add("form-add-playlist");
        div.innerHTML = `
        <div class="playlist-card">
        <input placeholder="playlist" class="playlist-name" name="playlist-name" type="text" list="list-playlist" required>
        <br>
        <p>${video.snippet.title}</p>
        <div class="playlist-img" style="background-image:url(${video.snippet.thumbnails.medium.url})"></div>
        <button type="button" class="btn-add-palylist">Add Playlist</button>
        <button type="button" class="btn cancel">Cancel</button>
        </div>
        `;
       
        

        const dataList = document.createElement("datalist");
        dataList.setAttribute("id","list-playlist");
        Object.values(this.playlist).forEach(video=>{
            Object.keys(video).forEach(key=>{
                const option = document.createElement("option");
                option.value = key;
                option.innerText = `${key}`;
                dataList.appendChild(option);
            })
        })

        div.querySelector(".btn-add-palylist").addEventListener("click",()=>{
            const key = div.querySelector(".playlist-name").value;
            this.savePlaylist(key,video);
            this.saveToLocal();                     
            div.remove("");


        })

        div.querySelector(".cancel").addEventListener("click",()=>{
            div.remove("");
        })

        div.append(dataList);
        this.element.append(div);
    }
    savePlaylist(key,vid){
        //save to this playlist
        //cek jika playlist kosong
        if(Object.keys(this.playlist).length === 0 || this.playlist.length === 0){            
            this.playlist.push({
                [`${key}`]:[vid]
            })
            return;
        }
        //cek jika ada nama playlist yg sama
        const keyMatch = Object.values(this.playlist).find(obj=>{
            return obj[`${key}`] ? true : false;
        })
        if(!keyMatch){
            // jika tidak ada yang sama
            this.playlist.push({
                [`${key}`]:[vid]
            })
            return;
        }
        if(keyMatch){
            // jika ada yg sama
            Object.values(this.playlist).forEach(obj=>{
                Object.keys(obj).find(k=>{
                    if(`${k}` === `${key}`){
                        const cekVideoAda = Object.values(obj[`${key}`]).find(v=>{
                            return `${v.id.videoId}` === `${vid.id.videoId}`;
                        })
                        if(!cekVideoAda){
                            obj[`${key}`].push(vid) 
                        }
                    }
                })
            })
            return;
        }        
    }
    saveToLocal(){
        localStorage.setItem("playlist",JSON.stringify(this.playlist));
    }
    deleteOneVideo(vid){
        Object.values(this.playlist).forEach((video,index)=>{
            Object.keys(video).forEach(key=>{
                if(key === vid.playlistKey){
                    video[key].splice(vid.videoKey,1);
                    this.displayPerVideo({
                        key: vid.playlistKey,
                        videos: vid.videos
                    })
                    if(video[key].length === 0){
                        this.deleteOnePlaylist({
                            playlistKey: key
                        })
                    }
                }
                if(video[key].length === 0 ){
                    console.log(`${vid.playlistKey} habis hapus index ${index} di playlist`)
                    this.playlist.splice(index,1);
                    this.displayPlaylist();
                }
            })
        }) 
        this.saveToLocal(); 
    }
    deleteVideoList(videoConfig){
        const div = document.createElement("div");
        div.classList.add("form-add-playlist");
        div.innerHTML = `
        <div class="playlist-card">
        <p>${videoConfig.videos[`${videoConfig.videoKey}`].snippet.title}</p>
        <div class="playlist-img" style="background-image:url(${videoConfig.videos[`${videoConfig.videoKey}`].snippet.thumbnails.medium.url})"></div>
        <button type="button" class="btn-add-palylist">Delete</button>
        <button type="button" class="btn cancel">Cancel</button>
        </div>
        `;
        this.element.appendChild(div);  

        div.querySelector(".btn-add-palylist").addEventListener("click",()=>{
            this.deleteOneVideo(videoConfig);
            this.saveToLocal();
            div.remove();
        })
        div.querySelector(".cancel").addEventListener("click",()=>{
            div.remove();
        })
    }
    deletePlaylist(videoConfig){
        const div = document.createElement("div");
        div.classList.add("form-add-playlist");
        div.innerHTML = `
        <div class="playlist-card">
        <p>${videoConfig.playlistKey}</p>
        <div class="playlist-img" style="background-image:url(${videoConfig.playlist[0].snippet.thumbnails.medium.url})"></div>
        <button type="button" class="btn-add-palylist">Delete</button>
        <button type="button" class="btn cancel">Cancel</button>
        </div>
        `;

        div.querySelector(".btn-add-palylist").addEventListener("click",()=>{
            this.deleteOnePlaylist(videoConfig);
            div.remove();
    
            this.saveToLocal();
            this.displayPlaylist();
        })        

        div.querySelector(".cancel").addEventListener("click",()=>{
            div.remove();
        })
        this.element.appendChild(div);           
    }

    deleteOnePlaylist(videoConfig){
        Object.keys(this.playlist).forEach(playlist=>{
            Object.keys(this.playlist[playlist]).forEach(playlistKey=>{
                if(playlistKey === videoConfig.playlistKey){
                    this.playlist.splice(playlist,1);
                    console.log("hapus: "+ videoConfig.playlistKey + " at " + playlist)
                }
            })
        })
        this.saveToLocal();
    }
    
    removePlaylist(){
        this.playlist = [];
        this.saveToLocal();
        this.displayPlaylist();
    }
}