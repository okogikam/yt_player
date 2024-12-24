class userSetting{
    constructor(conf){
        this.ytvideo = conf.ytvideo;
        this.url = "http://localhost/project/hantube/hantube/test.php";
        this.settingBtn = this.ytvideo.element.querySelector(".setting-btn");
    }
   async cekUser(username){
        // mengecek data user misalkan tidak ada return false
        // misalkan data ada return data user
        let requiest = await fetch(`${this.url}?type=0&un=${username}&ps=`);
        let respons = await requiest.json();

        if(respons['status'] ==='200'){
            return true;
        }

        return false;
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
                <form method="POST" class="form" action="#">
                <label for="un">Username</label>
                <input name="un" class="form-control" type="text" required>
                <label for="em">Email</label>
                <input name="em" class="form-control" type="text" required>
                <label for="pass">Pasword</label>
                <input name="pass" class="form-control" type="password" required>
                <label for="pass2">Confirm Password</label>
                <input name="pass2" class="form-control" type="password" required>
                <span class="pesan"></span>
                </form>
            </div>
            <div class="text-end">
                <button type="button" class="btn btn-secondary reg">Register</button>
                <button type="button" class="btn btn-default">Cancel</button> 
            </div>   
        </div>
        `
        div.querySelector(".reg").addEventListener("click",async ()=>{
            let user = div.querySelector("input[name='un']").value;
            let pass = div.querySelector("input[name='pass']").value;
            let pass2 = div.querySelector("input[name='pass2']").value;
            let cek = await this.cekUser(user);
            if(cek){
                div.querySelector(".pesan").innerHTML = "Username sudah terdaftar";
                return;
            }
            if(pass !== pass2){
                div.querySelector(".pesan").innerHTML = "Password Salah";
                return;
            }
            this.addNewUser({
                form: div.querySelector(".form"),
                un: user,
                ps: pass,
                el: div.querySelector(".pesan")
            })
        })
        div.querySelector(".btn-default").addEventListener("click",()=>{
            div.remove();
        })
    }
    async saveUpdate(conf){
        // mengambil data playlist / history di local
        // kemudian disimpan didatabase
        let data = this.htmlEntities(JSON.stringify(conf.data));
        let form = new FormData();
        form.append("col",conf.colom);
        form.append("data", data);
        form.append("id", conf.id);
        let request = await fetch(`${this.url}?type=3&un=${conf.un}&ps=${conf.ps}`,{
            method: "POST",
            body: form
        });
        let respons = await request.json()
        if(respons["result"] === "sukses"){
            this.ytvideo.userDataLogin[`${conf.colom}`] = data;
            let newDTuser = JSON.stringify(this.ytvideo.userDataLogin);
            localStorage.setItem("hantube-user", newDTuser);
            // console.log(newDTuser);
        }
    }
   async addNewUser(setting){
        // menambah user baru        
        // 
        try{            
            let history = this.htmlEntities(JSON.stringify(this.ytvideo.history));
            let playlist = this.htmlEntities(JSON.stringify(this.ytvideo.playlistVideo.playlist));
            let data = new FormData(setting.form);
            data.append("hs",history);
            data.append("pl",playlist);
            let request = await fetch(`${this.url}?type=2&un=${setting.un}&ps=${setting.ps}`,{
                method: "POST",
                body: data
            });
            let respons = await request.json()
            if(respons['status'] ==='200'){
                let data = JSON.stringify(respons.result);
                localStorage.setItem("hantube-user", data);
                console.log(respons);
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
    htmlEntities(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g,"&qoute1");
    }
    htmlEntitiesDecode(str){
        return String(str).replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,"<").replace(/&quot;/g,'"').replace(/&qoute1/g,"'");
    }
    init(){
        this.displayCard();
        this.settingBtn.click();
    }
}