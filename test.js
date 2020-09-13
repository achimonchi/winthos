
let data = [
    {
        name : "Reyhan",
        email : "reyhanjovie01@gmail.com"
    },
    {
        name : "Jovie",
        email : "jovie@gmail.com"
    },
    {
        name : "Dwiputra",
        email : "achimonchi.reyhan@gmail.com"
    },
]
const runLoop = async() =>{
    for(const item of data){
        await new Promise((resolve)=>{
            setTimeout(resolve, 3000)
        })
        console.log(item);
    }
}

runLoop();