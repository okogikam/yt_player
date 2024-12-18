class userSetting{
    constructor(conf){
        this.ytvideo = conf.ytvideo;
        this.url = "http://localhost/project/hantube/hantube/test.php";
        this.settingBtn = this.ytvideo.element.querySelector(".setting-btn");
    }
   async cekUser(){
        // mengecek data user misalkan tidak ada return false
        // misalkan data ada return data user
        let requiest = await fetch(this.url);
        let respons = await requiest.json();

        if(respons['status'] ==='200'){
            console.log(respons['result']);
        }else{
            console.log(`Error : ${JSON.stringify(respons['result'])}`);
        }
    }
    displayCard(){
        let div = document.createElement("div");
        div.classList.add("form-add-playlist");
        div.innerHTML = `
        <div class="playlist-card">
            <p class="text-center">LOGIN</p>
            <div class="m-3">
                <label for="un">USERNAME</label>
                <input name="un" class="form-control" type="text" required>
                <label for="ps">PASSWORD</label>
                <input name="ps" class="form-control" type="password" required>
                <span class="pesan"></span>
            </div>
            <div class="text-end">
                <button type="button" class="btn btn-primary log">Login</button>
                <button type="button" class="btn btn-secondary reg">Register</button>
                <button type="button" class="btn btn-default">Cancel</button> 
            </div>   
        </div>
        `;
        div.querySelector(".log").addEventListener("click",()=>{
            let user = div.querySelector("input[name='un']").value;
            let pass = div.querySelector("input[name='ps']").value;
            this.loginUser({
                un: user,
                ps: pass,
                el: div.querySelector(".pesan")
            })
        })
        div.querySelector(".reg").addEventListener("click",()=>{
            this.displayCard2(div);
        })
        div.querySelector(".btn-default").addEventListener("click",()=>{
            div.remove();
        })
        this.ytvideo.element.appendChild(div);
    }
    displayCard2(div){
        div.innerHTML = `
        <div class="playlist-card">
            <p class="text-center">LOGIN</p>
            <div class="m-3">
                <label for="un">Username</label>
                <input name="un" class="form-control" type="text" required>
                <label for="em">Email</label>
                <input name="em" class="form-control" type="text" required>
                <label for="ps">Pasword</label>
                <input name="ps" class="form-control" type="password" required>
                <label for="ps2">Confirm Password</label>
                <input name="ps2" class="form-control" type="password" required>
                <span class="pesan"></span>
            </div>
            <div class="text-end">
                <button type="button" class="btn btn-secondary reg">Register</button>
                <button type="button" class="btn btn-default">Cancel</button> 
            </div>   
        </div>
        `
        div.querySelector(".reg").addEventListener("click",()=>{
            let user = div.querySelector("input[name='un']").value;
            let email = div.querySelector("input[name='em']").value;
            let pass = div.querySelector("input[name='ps']").value;
            let pass2 = div.querySelector("input[name='ps2']").value;
            if(pass !== pass2){
                div.querySelector(".pesan").innerHTML = "Password Salah";
                return;
            }
            this.addNewUser({
                un: user,
                em: email,
                ps: pass,
                el: div.querySelector(".pesan")
            })
        })
        div.querySelector(".btn-default").addEventListener("click",()=>{
            div.remove();
        })
    }
    getPlaylist(){
        // mengambil data playlist di server
        // kemudian disimpan dilokal
    }
    getHistory(){
        // mengambil data history di server
        // kemudian disimpan dilokal
    }
    savePlaylist(){
        // mengambil data playlist di local
        // kemudian disimpan didatabase
    }
    saveHistory(){
        // mengambil data history di local
        // kemudian disimpan di database
    }
    saveUser(){
        // simpan data user dilocal
    }
   async addNewUser(setting){
        // menambah user baru
        try{
            let hs = JSON.stringify(this.ytvideo.history);
            let pl = JSON.stringify(this.ytvideo.playlistVideo.playlist);
            let request = await fetch(`${this.url}?type=2&un=${setting.un}&ps=${setting.ps}&em=${setting.em}&pl=${pl}&hs=${hs}`);
            let respons = await request.json()
            if(respons['status'] ==='200'){
                let data = JSON.stringify(respons.result);
                localStorage.setItem("hantube-user", data);
                location.reload();
                return;
            }
            setting.el.innerHTML = "Username atau Pasword salah";
        }catch(e){
            setting.el.innerHTML = e;
        }
    }
    async loginUser(setting){
        // login user
        try{
            let request = await fetch(`${this.url}?type=1&un=${setting.un}&ps=${setting.ps}`);
            let respons = await request.json()
            if(respons['status'] ==='200'){
                let data = JSON.stringify(respons.result);
                localStorage.setItem("hantube-user", data);
                location.reload();
                return;
            }
            setting.el.innerHTML = "Username atau Pasword salah";
        }catch(e){
            setting.el.innerHTML = e;
        }
    }
    logoutUser(){
        // logout user
        localStorage.setItem("hantube-user", []);
    }
    init(){
        this.displayCard();
        this.settingBtn.click();
    }
}