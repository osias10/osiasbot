function rockPaperScissors(player, input) {
    const hands = ['가위', '바위', '보'];
    const resultMsg = ['비겼습니다.', `${player} 님이 이겼습니다!`, `${player} 님이 졌습니다...`];
    const user = hands.indexOf(input);
    const com = Math.floor(Math.random() * 3);

    if (user != -1) {
        let game = (3 + user - com) % 3;
        console.log(player + ': ' + hands[user] + '\t 컴퓨터: ' + hands[com] + '\n' + resultMsg[game]);
        return `
        ${player} : ${hands[user]}\t 컴퓨터: ${hands[com]} 
        결과는 ${resultMsg[game]}`;
    } else {
        return `${player} 님의 반칙입니다`;
    }
}

function dice(commandList) {
    if (commandList.length > 2 && !isNaN(commandList[1]) && !isNaN(commandList[2])) {
        return `${Math.min(Number(commandList[1]), Number(commandList[2])) + Math.floor(Math.random() * Math.abs(Number(commandList[1]) - Number(commandList[2])))}`;
    } else {
        return '(시작할 숫자) (마지막 숫자) 를 입력해 주세요';
    }
}

module.exports = {
    rockPaperScissors,
    dice
};