const tmpdir = os.tmpdir();

const {createCanvas,Image}= require("canvas");
const bgColor=randomColor({
    luminosity:'dark',
});



const filepath=path.join(tmpdir,filename);