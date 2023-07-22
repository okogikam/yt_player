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
                    this.displayPerVideo({
                        key: key,
                        videos: video[key]}
                        );
                })

                btn.querySelector(".remove-list").addEventListener("click",()=>{
                    this.deletePlaylist({
                        playlist: video[key],
                        playlistKey: key,
                    });
                })
    
                this.listVideo.append(btn);           

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
            <button class="btn remove-list"><i class="fa-solid fa-eraser"></i></button>   
            </span>         
            <div class="card-video-detal">
                <div class="card-img" style="background-image:url(${videos[key].thumbnails.medium.url})">
                </div>
                <div class="card-body">
                <p>${videos[key].title}</p>
                </div>
            </div>
            `;

            btn.querySelector(".card-video-detal").addEventListener("click",()=>{
                this.isPlayingNow = key;
                this.playlistNow = videos;

                this.playVideo(videos[key]);
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
    playVideo(video){
        this.addTitile({
            element: this.element.querySelector("#title"),
            title: video['title'],
        })

        const playerVideo = this.element.querySelector(".video-player");
        playerVideo.classList.remove("d-none");
        this.ytVideo.player.loadVideoById(video.videoId); 
        console.log(this.ytVideo.player);
        console.log(this.element);
    }
    playNextVideo(){
        this.isPlayingNow = Number(this.isPlayingNow) + 1;

        if(this.isPlayingNow >= this.playlistNow.length){
            this.isPlayingNow = 0;
        }

        this.playVideo(this.playlistNow[`${this.isPlayingNow}`]);
        console.log(typeof this.isPlayingNow);
        // console.log(this.playlistNow[1]['title']);
    }
    addTitile(titleConfig){
        titleConfig.element.innerHTML = "";
        titleConfig.element.innerHTML = `<p>${titleConfig.title}</p>`;
    }
    async addPlaylist(vid){

        const div = document.createElement("div");
        div.classList.add("form-add-playlist");
        div.innerHTML = `
        <div class="playlist-card">
        <input placeholder="playlist" class="playlist-name" name="playlist-name" type="text" list="list-playlist" required>
        <br>
        <p>${vid.snippet.title}</p>
        <div class="playlist-img" style="background-image:url(${vid.snippet.thumbnails.medium.url})"></div>
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
            div.remove("");

            this.savePlaylist(key,vid);

            // console.log(config.playlist);
            this.saveToLocal();                     
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
                [`${key}`]:[{
                    title: vid.snippet.title,
                    videoId: vid.id.videoId,
                    thumbnails: vid.snippet.thumbnails
                }]
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
                [`${key}`]:[{
                    title: vid.snippet.title,
                    videoId: vid.id.videoId,
                    thumbnails: vid.snippet.thumbnails
                }]
            })
            return;
        }
        if(keyMatch){
            // jika ada yg sama
            Object.values(this.playlist).forEach(obj=>{
                Object.keys(obj).find(k=>{
                    if(`${k}` === `${key}`){
                        const cekVideoAda = Object.values(obj[`${key}`]).find(v=>{
                            return `${v.videoId}` === `${vid.id.videoId}`;
                        })
                        console.log(obj);
                        if(!cekVideoAda){
                            obj[`${key}`].push({
                                 title: vid.snippet.title,
                                 videoId: vid.id.videoId,
                                 thumbnails: vid.snippet.thumbnails
                            }) 
                        }
                    }
                })
            })
            console.log("ada yg sama")
            return;
        }        
    }
    saveToLocal(){
        localStorage.setItem("playlist",JSON.stringify(this.playlist));
    }
    findVideoKey(vid){
        Object.values(this.playlist).forEach(video=>{
            Object.keys(video).forEach(key=>{
                if(key === vid.playlistKey){
                    video[key].splice(vid.videoKey,1);
                }
            })
        })
    }
    deleteVideoList(videoConfig){
        const div = document.createElement("div");
        div.classList.add("form-add-playlist");
        div.innerHTML = `
        <div class="playlist-card">
        <p>${videoConfig.videos[`${videoConfig.videoKey}`].title}</p>
        <div class="playlist-img" style="background-image:url(${videoConfig.videos[`${videoConfig.videoKey}`].thumbnails.medium.url})"></div>
        <button type="button" class="btn-add-palylist">Delete</button>
        <button type="button" class="btn cancel">Cancel</button>
        </div>
        `;
        console.log(videoConfig.videos[`${videoConfig.videoKey}`].title);

        div.querySelector(".btn-add-palylist").addEventListener("click",()=>{
            this.findVideoKey(videoConfig);
            this.saveToLocal();
            this.displayPerVideo({
                key: videoConfig.playlistKey,
                videos: videoConfig.videos
            })
            div.remove();
        })
        div.querySelector(".cancel").addEventListener("click",()=>{
            div.remove();
        })
        this.element.appendChild(div);   
        
    }
    deletePlaylist(videoConfig){
        const div = document.createElement("div");
        div.classList.add("form-add-playlist");
        div.innerHTML = `
        <div class="playlist-card">
        <p>${videoConfig.playlistKey}</p>
        <div class="playlist-img" style="background-image:url(${videoConfig.playlist[0].thumbnails.medium.url})"></div>
        <button type="button" class="btn-add-palylist">Delete</button>
        <button type="button" class="btn cancel">Cancel</button>
        </div>
        `;

        div.querySelector(".btn-add-palylist").addEventListener("click",()=>{
            Object.keys(this.playlist).forEach(playlist=>{
                Object.keys(this.playlist[playlist]).forEach(playlistKey=>{
                    if(playlistKey === key){
                        this.playlist.splice(playlist,1);
                    }
                })
            })
    
            this.saveToLocal();
            this.displayPlaylist();
            div.remove();
        })

        div.querySelector(".cancel").addEventListener("click",()=>{
            div.remove();
        })
        this.element.appendChild(div);           
    }
    removePlaylist(){
        this.playlist = [];
        this.saveToLocal();
    }
}