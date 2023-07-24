class Player{
    constructor (config){
        this.element = config.element
        this.origin = config.origin || "https://youtube.com";
        this.attribute = `autoplay=1&origin=${this.origin}&enablejsapi=1`;
        this.playerReady = false;
        this.isPlaying = false;
    }
    makeElement(){
        const iframe = document.createElement("iframe");
        iframe.setAttribute("id","player")
        iframe.setAttribute("height","360");
        iframe.setAttribute("frameborder","0");
        iframe.setAttribute("allow","accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
        iframe.setAttribute("allowfullscreen","");
        iframe.setAttribute("src",`https://www.youtube.com/embed/?${this.attribute}`)
        this.element.appendChild(iframe);

        //cek iframe
        this.ytIframe = new YT.Player(iframe,{
            events:{
                "onReady": this.ready(),
                "onStateChange": this.getPlayerState(),
            }
        });
    }

    video(videoId){
        this.ytIframe.loadVideoById(videoId);
        this.isPlaying = true;
    }
    ready(){
        this.playerReady = true;
    }
    playlist(videoId){
        this.ytIframe.loadPlaylist({
            playlist: videoId.playlist,
            index:videoId.key
        })
    }
    getPlayerState(event){
        if(this.playerReady && this.isPlaying){
            console.log(event.data)
        }
    }
   async startLoop(){
        if(this.playerReady && this.isPlaying){
            this.playerState = this.ytIframe.getPlayerState();
        }


        requestAnimationFrame(()=>{
            this.startLoop();
        })
    }
    init(config){
        this[config.type](config.videoId);
        // this.startLoop()
    }
}