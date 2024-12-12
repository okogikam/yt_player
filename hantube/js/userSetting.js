class userSetting{
    constructor(conf){
        this.ytvideo = conf.ytvideo;
        this.url = "http://localhost/my_project/hantube/test.php";
    }
   async cekUser(){
        // mengecek data user misalkan tidak ada return false
        // misalkan data ada return data user
        let requiest = await fetch(this.url);
        let respons = await requiest.json();

        if(respons['status'] ==='200'){
            console.log(respons['result']);
            location.reload();
        }else{
            console.log(`Error : ${JSON.stringify(respons['result'])}`);
        }
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
    addNewUser(){
        // menambah user baru
    }
    loginUser(){
        // login user
    }
    logoutUser(){
        // logout user
    }
    init(){
        console.log("login");
        this.cekUser();
    }
}