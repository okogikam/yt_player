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
        // iframe.setAttribute("width","640");
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
        console.log(this.ytIframe);
    }

    video(videoId){
        // const url = `https://www.youtube.com/embed/${videoId}?${this.attribute}`;
        // const iframe  =  this.element.querySelector("#player");
        // iframe.src = url;

        this.ytIframe.loadVideoById(videoId);
        this.isPlaying = true;
    }
    ready(){
        this.playerReady = true;
    }
    playlist(videoId){
        // const url = `https://www.youtube.com/embed/${videoId}?listType=playlist&loop=1&${this.attribute}`;
        // const iframe  =  this.element.querySelector("#player");
        // iframe.src = url;

        this.ytIframe.cuePlaylist({
            list: "PLxSscENEp7JipogV7W74-hbDbYaQx78Oq",
            startSeconds: 0,
        })
        this.ytIframe.playVideo();
    }
    getPlayerState(event){
        if(this.playerReady && this.isPlaying){
            console.log(event.data)
        }
    }
    init(config){
        this[config.type](config.videoId);
    }
}