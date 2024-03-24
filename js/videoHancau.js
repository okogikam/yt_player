class videoHancau{
    constructor(conf){
        this.id = conf.vidId;
        this.url = `https://api.hancau.net/v2/?type=viewpage&v=${this.id}`;
        this.vidios = [];
    }
    async videoList(){
        await fetch(this.url)
        .then((result)=>{
            return result.json();
        })
        .then((data)=>{
            let vids = data.next_video;
            Object.values(vids).forEach(vid=>{
                let v = {
                    "etag": "",
                    "id":{
                        "kind": "youtube#video",
                        "videoId": vid.videoId,                        
                    },
                    "snippet":{
                        "channelId": "",
                        "channelTitle": "",
                        "description": "",
                        "liveBroadcastContent": "none",
                        "publishTime": "",
                        "publishedAt": "",
                        "thumbnails":{
                            "default":{
                                "height": vid.thumbnail.thumbnails[0].height,
                                "width":vid.thumbnail.thumbnails[0].width,
                                "url":vid.thumbnail.thumbnails[0].url,
                            },
                            "medium":{
                                "height": vid.thumbnail.thumbnails[1].height,
                                "width":vid.thumbnail.thumbnails[1].width,
                                "url":vid.thumbnail.thumbnails[1].url,
                            },
                            "heigh":{
                                "height": vid.thumbnail.thumbnails[1].height,
                                "width":vid.thumbnail.thumbnails[1].width,
                                "url":vid.thumbnail.thumbnails[1].url,
                            }
                        },
                        "title": vid.title.simpleText
                    }
                }
                this.vidios.push(v);
            })
        })
        return this.vidios;
    }
}
