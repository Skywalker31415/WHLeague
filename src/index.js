import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import './App.css';
import bg from './Images/WHBackground.png';
import MatchDay from './MatchDay.js';
import Results from './Results';
import Rankings from './Rankings';
import Dropdown from './Dropdown';
// execute database connection 


//var leagues = ["Kaidan 4", "Kaidan 5", "Kaidan 6", 'Kaidan 7'];
var leagues = [];
/*var playerList1 = ["John", "Paul", "George", "Ringo", "Bob", "Aidan B", "s", "G", "h", "1", "2", "3", "4", "5", "6", "7", "8", "9", "34", "132", "452", "fds", "gfd", "vcxz", "hgesf"];
var playerList2 = ["John", "Paul", "George", "Ringo", "Bob", "Aidan B", "132", "452", "fds", "gfd", "vcxz", "hgesf"];
var playerList3  = ["John", "Paul", "George", "Ringo", "Bob", "Aidan B", "s", "G", "h", "1", "2", "3", "4", "5", "6", "7", "8", "9", "34", "132", "452", "fds", "gfd", "vcxz", "hgesf", "hfd", "lkj", "iuy", "pkogf", "jgkfd", "vnm", "fdhskaf", "we", "2rfew", "6tfd", "hgf", "u4983", "jf"];
var playerLists = [playerList1, playerList3, playerList2, playerList1];*/
var playerLists = [];
function GetLeagues() {
  useEffect(() => {
    // Using fetch to fetch the api from
    // flask server it will be redirected to proxy
    fetch("/league-list").then((res) =>
        res.json().then((data) => {
            // Setting a data from api
            console.log(data)
            leagues=data
        })
    );
}, []);
return
}

function GetPlayers(league_num) {
  let league = leagues.length > league_num.league_num ? leagues[league_num.league_num] : ""
  useEffect(() => {
    if (league === "")  {
      return
    }
    // Using fetch to fetch the api from
    // flask server it will be redirected to proxy
    fetch("/league-players/" + league).then((res) =>
        res.json().then((data) => {
            // Setting a data from api
            try {
              if (data[0].players.length > 0) {
                console.log(data)
                console.log(data[0].players)
                console.log(playerLists.length)
                console.log(playerLists[0])
                playerLists[playerLists.length - 1]=data[0].players
              }
            } catch (error) {
              console.log("no player data")
            }
        })
    );
}, [league_num, league]);
return
}


class ConfirmLeagueButton extends React.Component {
  constructor(props)  {
    super(props);
    this.state = {
      value: "",
      showPlayers: 0,
      count: 0,
      hasName: false,
    }
    this.players = [];
    this.input = null;
  }
  handleChange(event) {
    if (!this.state.hasName)  {
      var trimmed = event.target.value.trim();
      if (trimmed.length > 0) {
        this.setState({value: event.target.value.trim()});
      }
    }
    else  {
      trimmed = event.target.value.trim();
      if (trimmed.length > 0){
        this.players[this.state.count] = trimmed;
      }
    }
  }

  handleSubmit(event) {
    var trimmed = event.target.value.trim();
    if (trimmed.length > 0){
      event.preventDefault();
      if (!this.state.hasName)  {
        this.setState({hasName: true});
      }
      else  {
        this.setState({
          count: this.state.count + 1,
        });
      }
      event.target.value = "";
      if (this.input === null)  {
        this.input = document.getElementById('inputfield');
      }
      this.input.value = "";
    }
  }

  sendToPlayers()  {
    //this.setState({showPlayers: 1})
    if (this.input === null)  {
      this.input = document.getElementById('inputfield');
    }
    this.input.value = "";
    if (this.players.length > 0)  {
      this.setState({showPlayers: 1});
    }
  }

  submitLeague()  {
    if (this.players.length > 0)  {
      leagues[leagues.length] = this.state.value; 
      playerLists[leagues.length - 1] = this.players;
      this.props.handler();
    }
  }
  removeItem(event) {
    this.players.splice(parseInt(event.target.getAttribute("value")),1);
    this.setState({count: this.state.count - 1});
  }
  render()  {
    const gStyle={
      //backgroundImage: `url(${textbox})`,
      borderColor: 'black',
      borderRadius: '10px',
      backgroundColor: 'white',
      width: 'min-content',
      fontSize:'20px',
      alignItems: 'center',
      paddingLeft: '5px',
    };
    var chldrn = [];
    for (var i = 0; i < this.state.count; i++)  {
      chldrn[i] = <div style = {{cursor: 'pointer'}} onClick = {(e) => {e.stopPropagation(); this.removeItem(e);}} key = {i} value = {i}> {this.players[i]} </div>
    }
    if (this.state.showPlayers === 0) {
      return (
        <div className='new-league-row'>
            <div className='new-league-col' children={chldrn} ></div>    

            <div className='new-league-col' style={{fontSize: '4vh'}}>
            {this.state.hasName && (<div style={{paddingBottom: '20px', fontSize: '6vh', fontWeight: '800'}}>
                {this.state.value}
              </div>)}
              <div>
                {"Enter " + (this.state.hasName ? "Player Names": "League Title")}
              </div>
              <div style={{fontSize: '2vh', fontWeight: '400'}}>
                {"Press Enter to Submit " + (this.state.hasName ? "Name": "League Title")}
              </div>
              <input onClick = {(e) => {e.stopPropagation();}}
                  onSubmit = {(e) => {this.handleSubmit(e)}}
                  onChange = {(e) => {this.handleChange(e)}}
                  onKeyDown = {(e) => {if (e.key === 'Enter'){this.handleSubmit(e)}}}
                  style={gStyle}
                  id = 'inputfield'
                >
              </input>
              {this.state.hasName && (<div style={{fontSize: '2vh', fontWeight: '400'}}>
                Click on Name to Remove
              </div>)}
              {this.state.hasName && (<div style={{paddingTop: '20px', fontSize: '3vh', fontWeight: '600'}}>
                Click to Confirm List
              </div>)}
              {this.state.hasName && (<div className='confirm-league-btn' onClick={(e)=>{this.sendToPlayers(); e.stopPropagation()}}>
              </div>)}
            </div>
          </div>
      )
    }
    
    return (
      
      <div className='new-league-row'>
        <div className='confirm-confirm-league-btn' onClick={() => {this.submitLeague()}}>
            Confirm
        </div>
        <div className='back-league-btn' onClick={(e) => {e.stopPropagation(); this.setState({showPlayers: 0})}}>
            Back
        </div>
      </div>
    )
  }
}
class NewLeague extends React.Component {
  constructor(props)  {
    super(props);
    this.state = {
      isOpen: leagues.length <= 0,
      editLeague: false,
      editPlayerName: false,
      playerChange: -1,
      value: "",
      confirmDeleteLeague: false,
    }
    this.handler2 = this.handler2.bind(this);
  }

  handleClick = () => {
    if (!this.state.editLeague){
      this.setState({
        isOpen: !this.state.isOpen
      });
    }
  }
  handler2() {
    this.props.handler();
    this.handleClick();
  }
  getNameColumn() {
    var chldrn = [];
    for (var i = 0; i < playerLists[this.props.leagueNum].length; i++)  {
      if (playerLists[this.props.leagueNum][i] != "bye")
      {
      chldrn[i] = (<div className='edit-player' val = {i} onClick = {(e) => {this.setState({confirmDeleteLeague: false, value: "", editPlayerName: true, playerChange: e.target.getAttribute("val")});}} style = {{display: 'flex', justifyContent: 'center',cursor: 'pointer',width: '100%', fontSize: '3vh', borderBottom: 'black', borderBottomWidth: '2px', borderBottomStyle: 'solid'}} key = {i}>
        {playerLists[this.props.leagueNum][i]}
      </div>);
      }
    }
    var lbox = <div className='edit-league-col' children={chldrn} ></div>; 
    return lbox;
  }
  submitNewName() {
    if (this.state.value === "")  {
      return;
    }
    if(!this.state.editPlayerName)  {
      this.props.changeLeagueName(this.state.value)
    }
    else  {
      this.props.updatePlayers(this.state.playerChange, this.state.value);
    }
  }
  substitutePlayer()  {
    if (this.state.value === "")  {
      return;
    }
    this.props.substitute(this.state.playerChange, this.state.value);
  }
  render()  {
    return(
      <div className = 'new-league' style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
        <div className='edit-league-btn' onClick={(e) => {e.stopPropagation(); if(!this.state.isOpen){this.setState({value: "", editLeague: !this.state.editLeague})}}}>
          {this.state.editLeague && !this.state.isOpen && 
            (<div onClick={(e) => {e.stopPropagation();}} style={{cursor: 'default', display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
            <div className='edit-league-panel'>
              <div className='edit-league-row' style = {{cursor: 'pointer'}} onClick = {() => {this.setState({confirmDeleteLeague: false, playerChange: -1, editPlayerName: false})}}>
                {"Edit " + leagues[this.props.leagueNum]}
              </div>
              <div className='edit-league-row'>
                {this.getNameColumn()}
                <div className='edit-league-col'>
                  <div style = {{fontSize: '4vh'}}>
                    {"Enter New " + (this.state.editPlayerName ? "Player Name" : "League Name")}
                  </div>
                  <input placeholder={this.state.editPlayerName ? playerLists[this.props.leagueNum][this.state.playerChange] : leagues[this.props.leagueNum]} onChange={(e) => {this.setState({value: e.target.value});}} value = {this.state.value} style = {{fontSize: '4vh',width: '15vw', padding: '2vh', border: 'black', borderWidth: '2px', borderStyle: 'solid', borderRadius: '10px', marginLeft: '5px'}}>
                  </input>
                  <div className='confirm-league-btn' onClick={(e) => {e.stopPropagation();this.submitNewName();this.setState({confirmDeleteLeague: false, value: ""})}}>
                  </div>
                  {this.state.editPlayerName &&
                    (<div style = {{marginTop: '8vh', fontSize: '2.3vh'}}>
                      Substitute player- this cannot be undone.
                    </div>)}
                  {this.state.editPlayerName && 
                    (<div className = 'sub-player-btn' onClick={(e) => {e.stopPropagation();this.substitutePlayer();}}>
                      
                    </div>)}
                </div>
              </div>
              {!this.state.confirmDeleteLeague && (
                <div className='edit-league-row'>
                  <div  className = 'delete-league-btn' onClick={(e) => {e.stopPropagation();this.setState({confirmDeleteLeague: true});}}>
                    Delete League
                  </div>
                  <div  className = 'close-new-league-panel' onClick={(e) => {e.stopPropagation();this.setState({editLeague: !this.state.editLeague, editPlayer: false, editPlayerName:false, playerChange: -1})}}>
                    Close
                  </div>
                </div>)
              }
              {this.state.confirmDeleteLeague && (
                <div className='edit-league-row'>
                  <div  className = 'close-new-league-panel' onClick={(e) => {e.stopPropagation();this.setState({confirmDeleteLeague: false,})}}>
                    Cancel
                  </div>
                  <div  className = 'delete-league-btn' onClick={(e) => {e.stopPropagation();this.setState({confirmDeleteLeague: false, editLeague: !this.state.editLeague, editPlayer: false, editPlayerName:false, playerChange: -1}); this.props.removeLeague(this.props.leagueNum)}}>
                    Confirm
                  </div>
                </div>
              )}
              </div>
          </div>
          )}
        </div>
        <div className='plus-btn' onClick={this.handleClick} >
          {this.state.isOpen && !this.state.editLeague && 
          (<div onClick={(e) => {e.stopPropagation();}} style={{cursor: 'default', display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
            <div className='new-league-panel'>
              <ConfirmLeagueButton handler = {this.handler2}>

              </ConfirmLeagueButton>
              <div className='new-league-row'>
                <div  className = 'close-new-league-panel' onClick={(e) => {e.stopPropagation();this.handleClick()}}>
                  Close
                </div>
              </div>
            </div>
          </div>)
          }
        </div>
      </div>
    )
  }
}


class App extends React.Component {
  constructor(props)  {
    super(props);
    this.state = {
      leagueState:(leagues.length-1),
      round: 0,
      players: playerLists[leagues.length-1],
      data:[],
      roundRobin:[],
      focusmode: 0,
    };
    //create matchdays
    for (var i = 0; i < leagues.length; i++)  {
      this.state.players = playerLists[i];
      this.calculateRoundRobin();
      this.state.data[i] = [];
      for (var j = 0; j < this.state.players.length - 1; j++)  {
        this.state.data[i][j] = new MatchDay(playerLists[i], this.state.roundRobin[j]);
        if (j > 0)  {
          this.state.data[i][j].setData(this.state.data[i][j-1]);
        }
        else  {
          this.state.data[i][j].setData(new MatchDay(playerLists[i], this.state.roundRobin[j]));
        }
      }
    }
    this.handler = this.handler.bind(this);
    this.focusMode = this.focusMode.bind(this);
    this.createNewLeague = this.createNewLeague.bind(this);
    this.changeLeagueName = this.changeLeagueName.bind(this);
    this.updatePlayers = this.updatePlayers.bind(this);
    this.removeLeague = this.removeLeague.bind(this);
    this.substitute = this.substitute.bind(this);
  }
  changeLeagueName(newName)  {
    leagues[this.state.leagueState] = newName;
    this.setState({leagueState: this.state.leagueState});
  }
  updatePlayers(i, value) {
    var prev =  playerLists[this.state.leagueState][i];
    playerLists[this.state.leagueState][i] = value;

    if (prev !== value) {
      for (var i = 0; i < this.state.data[this.state.leagueState].length; i++)  {
        this.state.data[this.state.leagueState][i].changeName(prev, value);
      }
      this.setState({players: playerLists[this.state.leagueState]});
    }
  }
  calculateRoundRobin(in_render = false) {
    if (this.state.players.length % 2 === 1) {
      this.state.players[this.state.players.length] = "bye";
    }
    var playerCount = this.state.players.length;
    for (var r = 0; r < playerCount - 1; r++)  {
      if (r === 0)  {
        this.state.roundRobin[r] = [[],[]]
        for (var i = 0; i < playerCount/2; i++)  {
          this.state.roundRobin[r][0][i] = this.state.players[i];
        }
        for (i = 0; i < playerCount/2; i++)  {
          this.state.roundRobin[r][1][i] = this.state.players[i + playerCount/2];
        }
      }
      else  {
        this.state.roundRobin[r] = [[],[]]
        this.state.roundRobin[r][0][0] = this.state.roundRobin[r-1][0][0];
        if (playerCount > 2) {
          this.state.roundRobin[r][0][1] = this.state.roundRobin[r - 1][1][0];
        }
        for (i = 2; i < playerCount/2; i++)  {
          this.state.roundRobin[r][0][i] = this.state.roundRobin[r - 1][0][i - 1];
        }
        for (i = 0; i < playerCount/2 - 1; i++)  {
          this.state.roundRobin[r][1][i] = this.state.roundRobin[r - 1][1][i + 1];
        }
        if (playerCount > 2) {
          this.state.roundRobin[r][1][playerCount/2 - 1] = this.state.roundRobin[r - 1][0][playerCount/2 - 1];
        }
      }
    }
    if (!in_render)
    {
      this.setState({roundRobin: this.state.roundRobin, players: this.state.players});
    }
  }
  focusMode(i) {
    if (this.state.focusmode !== 0 && this.state.focusmode !== 3) {
      this.setState({focusmode: 0});
    }
    else  {
      this.setState({focusmode: i});
    }
  }
  createNewLeague() {
    let i = leagues.length - 1;
      this.state.players = playerLists[i];
      this.calculateRoundRobin();
      this.state.data[i] = [];
      for (let j = 0; j < this.state.players.length - 1; j++)  {
        this.state.data[i][j] = new MatchDay(playerLists[i], this.state.roundRobin[j]);
        if (j > 0)  {
          this.state.data[i][j].setData(this.state.data[i][j-1]);
        }
        else  {
          this.state.data[i][j].setData(new MatchDay(playerLists[i], this.state.roundRobin[j]));
        }
      }
      this.setState({leagueState: i, round: 0});
    
  }
  handler(i) {
    const event = new Event('nextOrPrev', {
      bubbles: true,
      cancelable: true,
      composed: false
    })
    document.dispatchEvent(event);
    if (i >= playerLists.length)  {
      this.setState({
        round: 0,
      })
      playerLists[i] = [];
      this.state.players = playerLists[i];
      this.calculateRoundRobin();
      this.state.data[i] = [];
      for (var j = 0; j < this.state.players.length - 1; j++)  {
        this.state.data[i][j] = new MatchDay(playerLists[i], this.state.roundRobin[j]);
        if (j > 0)  {
          this.state.data[i][j].setData(this.state.data[i][j-1]);
        }
        else  {
          this.state.data[i][j].setData(new MatchDay(playerLists[i], this.state.roundRobin[j]));
        }
      }
      this.setState({
        leagueState: i,
        players: playerLists[i],
        round: 0,
        data: this.state.data
      })
    }
    else{
      var min = this.state.round;
      if (playerLists[i].length - 1 <= this.state.round)  {
        min = playerLists[i].length - 2;
      }
      this.setState({
        leagueState: i,
        players: playerLists[i],
        round: min
      })
    }
  }
  changeRound(i)  {
    this.setState({round: this.state.round + i});
  }
  returnDropdown()  {
      return(<Dropdown
      title={leagues.length > 0 ? leagues[this.state.leagueState] : "Create A New League!"}
      handler = {this.handler}
      getter = {this.getter}
      leagues = {leagues}
    >

    </Dropdown>)
  }
  removeLeague(i) {
    playerLists.splice(i, 1);
    leagues.splice(i,1);
    this.state.data.splice(i,1);
    var max = i >= leagues.length ? leagues.length - 1 : i;
    this.setState({leagueState: max});
  }
  substitute(i, value)  {
    let prev =  playerLists[this.state.leagueState][i];
    playerLists[this.state.leagueState][i] = value;

    if (prev !== value) {
      for (let i = 0; i < this.state.data[this.state.leagueState].length; i++)  {
        this.state.data[this.state.leagueState][i].substitutePlayer(prev, value);
      }
      this.setState({players: playerLists[this.state.leagueState]});
    }
  }
  copyDailyResults()  {
    var to_copy = "Matchday " + (this.state.round + 1) + " Stats!\n";
    var data = this.state.data[this.state.leagueState][this.state.round];
    var results = data.results;

    to_copy += "\nBiggest Defeats:\n"
    to_copy += data.biggestDefeats(true);

    to_copy += "\n Closest Matchups:\n"
    to_copy += data.biggestDefeats(false);

    to_copy += "\nCool Words: \n";
    
    for (var i = 0; i < results.length; i++)  {
      if (results[i][0] !== 'bye' && results[i][8] !== "")  {
        to_copy += results[i][0] + " - " + results[i][8] + "\n";
      }
    }

    to_copy += "\nHighest Scores: \n";
    var highestScores = data.getHighestScores();
    for(i = 0; i < highestScores.length; i ++) {
      to_copy += highestScores[i][1] + " - " + highestScores[i][0]/1000 + "k\n"
    }

    var highestWCs = data.getHighestWCs();
    to_copy += "\nHighest Word Counts: \n";
    for(i = 0; i < highestWCs.length; i ++) {
      to_copy += highestWCs[i][1] + " - " + highestWCs[i][0] + "\n"
    }

    navigator.clipboard.writeText(to_copy);
  }
  render() {
    const event = new Event('nextOrPrev', {
      bubbles: true,
      cancelable: true,
      composed: false
    })
    const bgStyle={
      backgroundImage: `url(${bg})`,
      minHeight:'100vh',
      fontSize:'50px',
      backgroundSize: 'cover',
      backgroundRepeat: 'repeat',
    };
    let newLeague = this.state.leagueState < 0 || this.state.leagueState >= leagues.length || this.state.leagueState >= playerLists.length || playerLists[this.state.leagueState].length === 0;
    
    //if no data exists, create some
    if (this.state.data.length > this.state.leagueState && this.state.leagueState >= 0 && playerLists.length > this.state.leagueState && playerLists[this.state.leagueState].length > 0)  {
      if (this.state.data[this.state.leagueState].length === 0) {
        let i = leagues.length - 1;
        this.state.players = playerLists[i];
        this.calculateRoundRobin(true);
        this.state.data[i] = [];
        for (let j = 0; j < this.state.players.length - 1; j++)  {
          this.state.data[i][j] = new MatchDay(playerLists[i], this.state.roundRobin[j]);
          if (j > 0)  {
            this.state.data[i][j].setData(this.state.data[i][j-1]);
          }
          else  {
            this.state.data[i][j].setData(new MatchDay(playerLists[i], this.state.roundRobin[j]));
          }
        }
      }
    }
    
    
    
    return (
      <div className="container" style={bgStyle}>
        <GetLeagues></GetLeagues>
        <GetPlayers league_num={this.state.leagueState}></GetPlayers>
        <div className='header-container'>
            <header className="App-header">    
                Word Hunt League!
            </header>
            
            {this.returnDropdown()}
            <NewLeague leagueNum = {this.state.leagueState} substitute = {this.substitute} removeLeague = {this.removeLeague} handler = {this.createNewLeague} changeLeagueName = {this.changeLeagueName} updatePlayers = {this.updatePlayers}>

            </NewLeague>
        </div>

        {!newLeague && (<div className='round-header'>
        {<div className='first-btn' onClick={() => {this.setState({round: 0}); document.dispatchEvent(event);}}> </div>}
          <div className='round-header-middle'>
            {"Match Day " + (this.state.round + 1)}
            <div className='copy-to-clipboard' onClick={() => this.copyDailyResults()}>
            </div>
          </div>
          <div className='last-btn' onClick={() => {
            for (var i = 0; i < playerLists[this.state.leagueState].length - 2; i++)  {
              this.state.data[this.state.leagueState][i].calculateMatchDay();
            }
            this.setState({round: playerLists[this.state.leagueState].length - 2});
            document.dispatchEvent(event);
            }}> </div>
        </div>)}
        {!newLeague && (<div className='big-box'>
          <div className='next-col'>
          {this.state.round > 0 && (<div className='prev-btn' onClick={(e) => {this.changeRound(-1); e.stopPropagation(); document.dispatchEvent(event);}}>
            
            </div>)}
          </div>
          {this.state.focusmode !== 2 && (<Rankings id = "Rankings" players={this.state.players} data = {this.state.data[this.state.leagueState][this.state.round]} focus = {this.focusMode}>
            
          </Rankings>)}
          {this.state.focusmode !== 1 && this.state.focusmode !== 3 && (<Results id = "Results" players={this.state.players} data = {this.state.data[this.state.leagueState][this.state.round]} focus = {this.focusMode}>
            
          </Results>)}
          <div className='next-col'>
            {this.state.round < this.state.players.length - 2 && (<div className='next-btn' onClick={(e) => {this.changeRound(1); e.stopPropagation(); document.dispatchEvent(event);}}>
            </div>)}
          </div>
        </div>)}
      </div>
    );
  }
}
//const root = ReactDOM.createRoot(document.getElementById("root"));
//root.render(<Game />);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();