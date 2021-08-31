
const mapPath='./src/files/games/amongus/maps/';

function amongus(command){
    const command2 = command[1];

    if (command2){
        if (command[1] == '맵' && command[2]){
            const map=amongusPrintMap(command[2]);
            if (map != "no"){
                return ["어몽어스맵", map];
            }
            else{
                return(["없는 맵입니다."])
            }
            
        }
        else{
            return ["어몽어스 맵 (번호 or 이름) 을 입력해주세요\n종류: \n1 the_skeld\n2 mira_hq\n3 polus\n4 the_airship"];

        }
    }
    else{
        return ["어몽어스 맵 (번호 or 이름) 을 입력해주세요\n종류: \n1 the_skeld\n2 mira_hq\n3 polus\n4 the_airship"];
    }
}

function amongusSelectMap(command){
    
    if (command == "1" || command == "the_skeld") {return ("the_skeld.png");}
        
    else if(command == "2" || command == "mira_hq") {return ("mira_hq.png");}
    else if( command == "3" || command == "polus") {return ("polus.png");}
    else if( command == "4" || command == "the_airship") {return ("the_airship.png");}

    else{
            return("no")
    }
            
    
}

function amongusPrintMap(command){
    const map = amongusSelectMap(command)
    if (map != "no"){
        return (`${mapPath}${map}`);
    }
    else return "no";

}

module.exports = {
    amongus
}