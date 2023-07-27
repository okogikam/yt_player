class DownloadVideo{
    constructor(config){
        this.videoId = config.videoId;
        this.element = config.element;
        // this.url = `https://www.youtube.com/get_video_info?video_id=${this.videoId}&eurl=https://youtube.googleapis.com/v/${this.videoId}&html5=1&c=TVHTML5&cver=6.20180913`;
        // this.url = `blob:https://www.youtube.com/0181275b-a531-4e4c-861a-07729b86ad63`;
    }

    async download(){
        // const url = `https://youtube-video-download-info.p.rapidapi.com/dl?id=${this.videoId}`;
        // const options = {
        //     method: 'GET',
        //     headers: {
        //         'X-RapidAPI-Key': 'de9bef3dd1msh20158e0d61df5bbp13cbe8jsn51fb908a38bb',
        //         'X-RapidAPI-Host': 'youtube-video-download-info.p.rapidapi.com'
        //     }
        // };

        // try {
        //     const response = await fetch(url, options);
        //     const result = await response.text();
        //     console.log(JSON.parse(result).link[17][0]);
            
        // } catch (error) {
        //     console.error(error);
        // }
    }
    makeElement(href){
        const a = document.createElement("a");
        a.href = href;
        a.download = "filename";
        this.element.appendChild(a);
        a.click();
        a.remove();
    }
}