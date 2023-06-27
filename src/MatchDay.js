class MatchDay  {
    constructor(players, roundRobin) {
      this.players = players;
      this.results = [];
      this.playerCount = 0;
      this.matchups = roundRobin;
      for (let i = 0; i < players.length; i++) {
        this.addPlayer(players[i]);
      }
      this.games = [];
      for (let i = 0; i < 3*roundRobin[0].length; i++) {
        this.games[i] = [0,0,0,0];
      }
      this.prev = undefined;
    }
    changeName(prev, value) {
      for (let i = 0; i < this.results.length; i++) {
        if (this.results[i][0] === prev) {
          this.results[i][0] = value;
          break;
        }
      }
      for (let i = 0; i < this.prev.results.length; i++) {
        if (this.prev.results[i][0] === prev) {
          this.prev.results[i][0] = value;
          break;
        }
      }
  
      for (let i = 0; i < this.matchups[0].length; i++) {
        if (this.matchups[0][i] === prev) {
          this.matchups[0][i] = value;
          break;
        }
        else if (this.matchups[1][i] === prev)  {
          this.matchups[1][i] = value;
          break;
        }
      }
    }
    substitutePlayer(prev, value)  {
      for (let i = 0; i < this.results.length; i++) {
        if (this.results[i][0] === prev) {
          this.results[i] = [value,0,0,0,0,0,0,0,""];
          break;
        }
      }
      for (let i = 0; i < this.prev.results.length; i++) {
        if (this.prev.results[i][0] === prev) {
          this.prev.results[i] = [value,0,0,0,0,0,0,0,""];
          break;
        }
      }
  
      for (let i = 0; i < this.matchups[0].length; i++) {
        if (this.matchups[0][i] === prev) {
          this.matchups[0][i] = value;
          this.games[3*i] = [0,0,0,0];
          this.games[3*i + 1] = [0,0,0,0];
          this.games[3*i + 2] = [0,0,0,0];
          break;
        }
        else if (this.matchups[1][i] === prev)  {
          this.matchups[1][i] = value;
          this.games[3*i] = [0,0,0,0];
          this.games[3*i + 1] = [0,0,0,0];
          this.games[3*i + 2] = [0,0,0,0];
          break;
        }
      }
      
    }
    modifyResult(i, j, newresult) {
      this.results[i][j] = newresult;
    }
    addPlayer(player) {
      if (player === 'bye') {
        return;
      }
      var found = false;
        for (var i = 0; i < this.playerCount; i++)  {
          if (this.results[i][0] === player) {
            found = true;
          }
        }
      if (!found){
        this.results[this.playerCount] = [player,0,0,0,0,0,0,0,""];
        this.playerCount++;
      }
      this.sortRankings();
    }
    getMatchupLeft(pos)  {
      return this.matchups[0][pos];
    }
    getMatchupRight(pos)  {
      return this.matchups[1][pos];
    }
    getData(playerNum)  {
      return this.results[playerNum];
    }
    getPlayerCount()  {
      return this.playerCount;
    }
    getGames(matchNum, idx) {
      return this.games[3*matchNum + idx];
    }
    compare(a, b) {
      if (a[4] === b[4]) {
        if (a[5] === b[5])  {
          if (a[6] === b[6])  {
            return a[0].localeCompare(b[0]);
          }
          return b[6] - a[6];
        }
        return b[5]- a[5];
      }
      return b[4]-a[4];
    }
    findIdx(p1)  {
      for (var p = 0; p < this.results.length; p++) {
        if (this.results[p][0] === p1) {
          return p;
        }
      }
      return -1;
    }
    sortRankings()  {
      for (var p = 0; p < this.results.length; p++) {
        this.calculatePoints(p);
      }
      this.results.sort(this.compare);
      for (var i = 0; i < this.results.length; i++)  {
        this.results[i][7] = i + 1;
      }
    }
    calculatePoints(i)  {
      this.results[i][4] = 2*this.results[i][1] + this.results[i][3]
    }
    addData(val, matchNum, idx, offset) {
      this.games[3*matchNum + idx][offset] = val;
    }
    setData(md)  {
      var array = md.results;
      this.prev = md;
      if (array !== null && array !== undefined){
        for (var i = 0; i < array.length; i++)  {
          this.results[i][0] = array[i][0];
          for (var j = 1; j < array[0].length - 1; j++) {
            this.results[i][j] = array[i][j];
          }
        }
      }
      else {
        for (i = 0; i < array.length; i++)  {
          this.results[i][0] = array[i][0];
          for (j = 1; j < array[0].length - 1; j++) {
            this.results[i][j] = 0;
          }
        }
      }
      this.calculateMatchDay();
      this.sortRankings(); 
    }
    calculateMatchDay() {
      if (this.prev.results !== null && this.prev.results !== undefined && this.prev.results !== [])  {
        //this.prev.calculateMatchDay();
      }
      for (let i = 0; i < this.matchups[0].length; i++) {
        var p1 = this.matchups[0][i];
        var p2 = this.matchups[1][i];
        var p1idx = this.findIdx(p1);
        var p2idx = this.findIdx(p2);
        var prevp1idx = -1;
        var prevp2idx = -1;
        for (var p = 0; p < this.prev.results.length; p++) {
          if (this.prev.results[p][0] === p1) {
            prevp1idx = p;
          }
          if (this.prev.results[p][0] === p2) {
            prevp2idx = p;
          }
        }
        if (p1 === 'bye' || p2 === 'bye') {
          if (p1 !== 'bye') {
          this.results[p1idx][1] = parseInt(this.prev.results[prevp1idx][1]);
          this.results[p1idx][2] = parseInt(this.prev.results[prevp1idx][2]);
          this.results[p1idx][3] = parseInt(this.prev.results[prevp1idx][3]);
          this.results[p1idx][5] = parseInt(this.prev.results[prevp1idx][5]);
          this.results[p1idx][6] = parseInt(this.prev.results[prevp1idx][6]);
          }
          else{
           
            this.results[p2idx][2] = parseInt(this.prev.results[prevp2idx][2]);
            this.results[p2idx][1] = parseInt(this.prev.results[prevp2idx][1]);
            this.results[p2idx][3] = parseInt(this.prev.results[prevp2idx][3]);
            this.results[p2idx][5] = parseInt(this.prev.results[prevp2idx][5]);
            this.results[p2idx][6] = parseInt(this.prev.results[prevp2idx][6]);
          }
          continue;
        }
  
        for (let counter = 0; counter < 3; counter ++){
          
          if (counter === 0){
            this.results[p1idx][5] = parseInt(this.prev.results[prevp1idx][5]) + parseInt(this.games[3*i + counter][0]) - parseInt(this.games[3*i + counter][1]);
            this.results[p2idx][5] = parseInt(this.prev.results[prevp2idx][5]) + parseInt(this.games[3*i + counter][1]) - parseInt(this.games[3*i + counter][0]);
  
            this.results[p1idx][6] = parseInt(this.prev.results[prevp1idx][6]) + parseInt(this.games[3*i + counter][2]) - parseInt(this.games[3*i + counter][3]);
            this.results[p2idx][6] = parseInt(this.prev.results[prevp2idx][6]) + parseInt(this.games[3*i + counter][3]) - parseInt(this.games[3*i + counter][2]);
            if (parseInt(this.games[3*i + counter][0]) > parseInt(this.games[3*i + counter][1]))  {
              this.results[p1idx][1] = parseInt(this.prev.results[prevp1idx][1]) + 1;
              this.results[p2idx][2] = parseInt(this.prev.results[prevp2idx][2]) + 1;
  
              this.results[p1idx][2] = parseInt(this.prev.results[prevp1idx][2]);
              this.results[p2idx][1] = parseInt(this.prev.results[prevp2idx][1]);
  
              this.results[p1idx][3] = parseInt(this.prev.results[prevp1idx][3]);
              this.results[p2idx][3] = parseInt(this.prev.results[prevp2idx][3]);
            }
            else if (parseInt(this.games[3*i + counter][0]) < parseInt(this.games[3*i + counter][1])) {
              this.results[p1idx][2] = parseInt(this.prev.results[prevp1idx][2]) + 1;
              this.results[p2idx][1] = parseInt(this.prev.results[prevp2idx][1]) + 1;
  
              this.results[p1idx][1] = parseInt(this.prev.results[prevp1idx][1]);
              this.results[p2idx][2] = parseInt(this.prev.results[prevp2idx][2]);
  
              this.results[p1idx][3] = parseInt(this.prev.results[prevp1idx][3]);
              this.results[p2idx][3] = parseInt(this.prev.results[prevp2idx][3]);
            }
            else  {
              var temp = (parseInt(this.games[3*i + counter][0])  === 0 && parseInt(this.games[3*i + counter][1]) === 0 )? 0 : 1
              this.results[p1idx][3] = parseInt(this.prev.results[prevp1idx][3]) + temp;
              this.results[p2idx][3] = parseInt(this.prev.results[prevp2idx][3]) + temp;
  
              this.results[p1idx][1] = parseInt(this.prev.results[prevp1idx][1]);
              this.results[p2idx][2] = parseInt(this.prev.results[prevp2idx][2]);
  
              this.results[p1idx][2] = parseInt(this.prev.results[prevp1idx][2]);
              this.results[p2idx][1] = parseInt(this.prev.results[prevp2idx][1]);
            }
          }
          else  {
            this.results[p1idx][5] = parseInt(this.results[p1idx][5]) + parseInt(this.games[3*i + counter][0]) - parseInt(this.games[3*i + counter][1]);
            this.results[p2idx][5] = parseInt(this.results[p2idx][5]) + parseInt(this.games[3*i + counter][1]) - parseInt(this.games[3*i + counter][0]);
  
            this.results[p1idx][6] = parseInt(this.results[p1idx][6]) + parseInt(this.games[3*i + counter][2]) - parseInt(this.games[3*i + counter][3]);
            this.results[p2idx][6] = parseInt(this.results[p2idx][6]) + parseInt(this.games[3*i + counter][3]) - parseInt(this.games[3*i + counter][2]);
            if (parseInt(this.games[3*i + counter][0]) > parseInt(this.games[3*i + counter][1]))  {
              this.results[p1idx][1] = parseInt(this.results[p1idx][1]) + 1;
              this.results[p2idx][2] = parseInt(this.results[p2idx][2]) + 1;
            }
            else if (parseInt(this.games[3*i + counter][0]) < parseInt(this.games[3*i + counter][1])) {
              this.results[p1idx][2] = parseInt(this.results[p1idx][2]) + 1;
              this.results[p2idx][1] = parseInt(this.results[p2idx][1]) + 1;
            }
            else  {
              temp = (parseInt(this.games[3*i + counter][0])  === 0 && parseInt(this.games[3*i + counter][1]) === 0 )? 0 : 1
              this.results[p1idx][3] = parseInt(this.results[p1idx][3]) + temp;
              this.results[p2idx][3] = parseInt(this.results[p2idx][3]) + temp;
            }
          }
        }
      }
    }
    isWin(matchNum, idx) {
      if (this.matchups[0][matchNum] === "bye" || this.matchups[1][matchNum] === "bye") {
        return -1;
      }
      if (parseInt(this.games[3*matchNum][0]) === 0 && parseInt(this.games[3*matchNum][1]) === 0 &&
      parseInt(this.games[3*matchNum + 1][0]) === 0 && parseInt(this.games[3*matchNum + 1][1]) === 0 &&
      parseInt(this.games[3*matchNum + 2][0]) === 0 && parseInt(this.games[3*matchNum + 2][1]) === 0)  {
          return -1;
        }
      if (parseInt(this.games[3*matchNum + idx][0]) > parseInt(this.games[3*matchNum + idx][1]))  {
        return 2;
      }
      if (parseInt(this.games[3*matchNum + idx][0]) < parseInt(this.games[3*matchNum + idx][1]))  {
        return 0;
      }
      return 1;
    }
    wonMatch(matchNum)  {
      var sum = this.isWin(matchNum, 0) + this.isWin(matchNum, 1) + this.isWin(matchNum, 2);
      if (sum === -3) {
        return 3;
      }
      if (sum > 3)  {
        return 2;
      }
      if (sum < 3)  {
        return 0;
      }
      return 1;
    }
    getCoolWords(matchNum, offset) {
      var p1 = this.matchups[offset][matchNum];
      if (p1 === 'bye') {
        return "";
      }
      var p1idx = this.findIdx(p1);
      if (p1idx < 0)  {
        return "";
      }
      return this.results[p1idx][8];
    }
    addCoolWords(val, matchNum, playerNum) {
      var p1 = this.matchups[playerNum][matchNum];
      if (p1 === 'bye') {
        return "";
      }
      var p1idx = this.findIdx(p1);
      if (p1idx < 0)  {
        return;
      }
      this.results[p1idx][8] = val;
    }
    getPD(matchNum) {
      if(this.matchups[0][matchNum] === 'bye' || this.matchups[1][matchNum] === 'bye')  {
        return 0;
      }
      var p1score = parseInt(this.games[3*matchNum][0]) + parseInt(this.games[3*matchNum + 1][0]) + parseInt(this.games[3*matchNum + 2][0]);
      var p2score = parseInt(this.games[3*matchNum][1]) + parseInt(this.games[3*matchNum + 1][1]) + parseInt(this.games[3*matchNum + 2][1]);
      if (p1score === 0 && p2score === 0) {
        return Number.MAX_SAFE_INTEGER;
      }
      return  p1score - p2score;
    }
    getWCD(matchNum)  {
      if(this.matchups[0][matchNum] === 'bye' || this.matchups[1][matchNum] === 'bye')  {
        return 0;
      }
      var p1score =  parseInt(this.games[3*matchNum][2]) + parseInt(this.games[3*matchNum + 1][2]) + parseInt(this.games[3*matchNum + 2][2]);
      var p2score = parseInt(this.games[3*matchNum][3]) + parseInt(this.games[3*matchNum + 1][3]) + parseInt(this.games[3*matchNum + 2][3]);
      if (p1score === 0 && p2score === 0) {
        return Number.MAX_SAFE_INTEGER;
      }
      return p1score - p2score;
    }
    comparePDWCD(matchNum1, matchNum2)  {
      var pd = parseInt(Math.abs(this.getPD(matchNum1))) - parseInt(Math.abs(this.getPD(matchNum2)));
      if  (pd !== 0)  {
        return pd;
      }
      return Math.abs(this.getWCD(matchNum1)) - Math.abs(this.getWCD(matchNum2));
    }
    sortResults(matchNum) {
      for (let i = this.matchups[0].length - 1; i >= 0; i--)  {
        if (this.matchups[0][i] === "bye" || this.matchups[1][i] === "bye") {
          if (i == this.matchups[0].length - 1)  {
            break;
          }
          else  {
            let l = this.matchups[0].length - 1;
  
            let temp = this.matchups[0][i];
            this.matchups[0][i] = this.matchups[0][l];
            this.matchups[0][l] = temp;
            temp = this.matchups[1][i];
            this.matchups[1][i] = this.matchups[1][l];
            this.matchups[1][l] = temp;
  
            temp = this.games[3*(i)];
            this.games[3*(i)] = this.games[3*l];
            this.games[3*l] = temp;
            temp = this.games[3*(i) + 1];
            this.games[3*(i) + 1] = this.games[3*l + 1];
            this.games[3*l+1] = temp;
            temp = this.games[3*(i) + 2];
            this.games[3*(i) + 2] = this.games[3*l + 2];
            this.games[3*l + 2] = temp;
            if (matchNum === this.matchups[0].length - 1) {
              matchNum = i;
            }
            break;
          }
          
        }
      }
      while (matchNum > 0 && this.comparePDWCD(matchNum, matchNum - 1) > 0)  {
        let temp = this.matchups[0][matchNum];
        this.matchups[0][matchNum] = this.matchups[0][matchNum - 1];
        this.matchups[0][matchNum - 1] = temp;
        temp = this.matchups[1][matchNum];
        this.matchups[1][matchNum] = this.matchups[1][matchNum - 1];
        this.matchups[1][matchNum - 1] = temp;
  
        temp = this.games[3*matchNum];
        this.games[3*matchNum] = this.games[3*matchNum - 3];
        this.games[3*matchNum - 3] = temp;
        temp = this.games[3*matchNum + 1];
        this.games[3*matchNum + 1] = this.games[3*matchNum + 1 - 3];
        this.games[3*matchNum + 1 - 3] = temp;
        temp = this.games[3*matchNum + 2];
        this.games[3*matchNum + 2] = this.games[3*matchNum + 2- 3];
        this.games[3*matchNum + 2 - 3] = temp;
  
        matchNum--;
      }
      while (matchNum < this.matchups[0].length - 1 && this.comparePDWCD(matchNum, matchNum + 1) < 0)  {
        let temp = this.matchups[0][matchNum];
        this.matchups[0][matchNum] = this.matchups[0][matchNum + 1];
        this.matchups[0][matchNum + 1] = temp;
        temp = this.matchups[1][matchNum];
        this.matchups[1][matchNum] = this.matchups[1][matchNum + 1];
        this.matchups[1][matchNum + 1] = temp;
  
        temp = this.games[3*matchNum];
        this.games[3*matchNum] = this.games[3*matchNum + 3];
        this.games[3*matchNum + 3] = temp;
        temp = this.games[3*matchNum + 1];
        this.games[3*matchNum + 1] = this.games[3*matchNum + 1 + 3];
        this.games[3*matchNum + 1 + 3] = temp;
        temp = this.games[3*matchNum + 2];
        this.games[3*matchNum + 2] = this.games[3*matchNum + 2+ 3];
        this.games[3*matchNum + 2 + 3] = temp;
  
        matchNum++;
      }
    }
    getHighestScores()  {
      let threshold = 40000;
      let to_return = [];
      for (let i = 0; i < this.games.length; i++) {
        if (this.games[i][0] >= threshold) {
          to_return[to_return.length] = [this.games[i][0], this.matchups[0][parseInt(i/3)]];
        }
        if (this.games[i][1] >= threshold) {
          to_return[to_return.length] = [this.games[i][1], this.matchups[1][parseInt(i/3)]];
        }
      }
      to_return.sort((a,b) => b[0] - a[0]);
      return to_return;
    }
    getHighestWCs() {
      var threshold = 90;
      var to_return = [];
      for (var i = 0; i < this.games.length; i++) {
        if (this.games[i][2] >= threshold) {
          to_return[to_return.length] = [this.games[i][2], this.matchups[0][parseInt(i/3)]];
        }
        if (this.games[i][3] >= threshold) {
          to_return[to_return.length] = [this.games[i][3], this.matchups[1][parseInt(i/3)]];
        }
      }
      to_return.sort((a,b) => b[0] - a[0]);   
      return to_return;
    }
    biggestDefeats(flag)  {
      var biggest = [];
      for (var matchNum = 0; matchNum < this.matchups[0].length; matchNum++)  {
        if(this.matchups[0][matchNum] === 'bye' || this.matchups[1][matchNum] === 'bye')  {
          continue;
        }
        var p1score = parseInt(this.games[3*matchNum][0]) + parseInt(this.games[3*matchNum + 1][0]) + parseInt(this.games[3*matchNum + 2][0]);
        var p2score = parseInt(this.games[3*matchNum][1]) + parseInt(this.games[3*matchNum + 1][1]) + parseInt(this.games[3*matchNum + 2][1]);
         if (p1score !== 0 || p2score !== 0) {
          biggest[biggest.length] = [Math.abs(p1score - p2score), this.matchups[0][matchNum], this.matchups[1][matchNum], matchNum]
        }
      }
      if (flag) {
        biggest.sort((a,b) => b[0] - a[0]);
      }
      else  {
        biggest.sort((a,b) => a[0] - b[0]);
      }
      var to_return = "";
      for (var i = 0; i < 3 && i < biggest.length; i++) {
        var wins = parseInt(this.games[3*biggest[i][3]][0]) > parseInt(this.games[3*biggest[i][3]][1]) ? 1 : 0;
        wins += parseInt(this.games[3*biggest[i][3] + 1][0]) > parseInt(this.games[3*biggest[i][3] + 1][1]) ? 1 : 0;
        wins += parseInt(this.games[3*biggest[i][3] + 2][0]) > parseInt(this.games[3*biggest[i][3] + 2][1]) ? 1 : 0;
  
        var losses = parseInt(this.games[3*biggest[i][3]][0]) < parseInt(this.games[3*biggest[i][3]][1]) ? 1 : 0;
        losses += parseInt(this.games[3*biggest[i][3] + 1][0]) < parseInt(this.games[3*biggest[i][3] + 1][1]) ? 1 : 0;
        losses += parseInt(this.games[3*biggest[i][3] + 2][0]) < parseInt(this.games[3*biggest[i][3] + 2][1]) ? 1 : 0;
  
        var draws = parseInt(this.games[3*biggest[i][3]][0]) === parseInt(this.games[3*biggest[i][3]][1]) ? 1 : 0;
        draws += parseInt(this.games[3*biggest[i][3] + 1][0]) === parseInt(this.games[3*biggest[i][3] + 1][1]) ? 1 : 0;
        draws += parseInt(this.games[3*biggest[i][3] + 2][0]) === parseInt(this.games[3*biggest[i][3] + 2][1]) ? 1 : 0;
  
        if (wins >= losses)  {
          to_return += biggest[i][1] + " " + wins + "-" + losses + (draws!== 0 ? ("-" + draws): "") + " " +  biggest[i][2];
          to_return += " " + (this.getPD(biggest[i][3])/1000) + "k";
          to_return += " " + (this.getWCD(biggest[i][3])) + "w"
        }
        else  {
          to_return += biggest[i][2] + " " + losses + "-" + wins + (draws!== 0 ? ("-" + draws): "") + " " + biggest[i][1];
          to_return += " " + (-1*this.getPD(biggest[i][3])/1000) + "k ";
          to_return += " " + (-1*this.getWCD(biggest[i][3])) + "w"
        }
        to_return += "\n";
      }
  
      return to_return;
    }
    
  }

export default MatchDay