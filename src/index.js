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


var flag = true;
function GetLeagues({onUpdateLeagues}) {
  return
  useEffect(() => {
    // Using fetch to fetch the api from
    // flask server it will be redirected to proxy
    fetch("/league-list").then((res) =>
        res.json().then((data) => {
            // Setting a data from api
            onUpdateLeagues(data);
        })
    );
});
return
}

function GetPlayers({league_num, modifyPlayerLists, playerLists, leagues}) {
  return
  let league = leagues.length > league_num ? leagues[league_num] : ""
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
                let playerLists_copy = [...playerLists]
                playerLists_copy[league_num] = data[0].players
                modifyPlayerLists(playerLists_copy)
              }
            } catch (error) {
              console.log("no player data")
            }
        })
    );
}, [league_num, league, playerLists, modifyPlayerLists]);
return
}

function PostData({data, league}) {
  return
  useEffect(() => {
    if (!flag)  {
      return;
    }
    flag = false;
    const postData = async () => {
    try{
      const response = await fetch("/save-data/" + league, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
      } else {
        throw new Error("Request failed");
      }
    } catch (error) {
      console.error(error);
    }
  }
  postData();
  },[data, league]);
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
    if (event.target.value.trim() === "" || event.target.value === "bye")  {
      return;
    }
    if (!this.state.hasName)  {
      let trimmed = event.target.value.trim();
      if (trimmed.length > 0) {
        this.setState({value: event.target.value.trim()});
      }
    }
    else  {
      let trimmed = event.target.value.trim();
      if (trimmed.length > 0){
        if (this.players.length === 0 || !this.players.includes(trimmed,0))  {
          this.players[this.state.count] = trimmed;
        }
      }
    }
  }

  handleSubmit(event) {
    if (event.target.value.trim() === ""|| event.target.value === "bye")  {
      return;
    }
    let trimmed = event.target.value.trim();
    if (this.players.length !== 0 && this.players.slice(0,-1).includes(trimmed,0))  {
      return
    }
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
      let leagues_copy = this.props.leagues;
      leagues_copy[leagues_copy.length] = this.state.value; 
      this.props.modifyLeagues(leagues_copy);
      let playerLists_copy = this.props.playerLists;
      this.players = this.players.filter(function( element ) {
        return element !== undefined;
      });
      playerLists_copy[leagues_copy.length - 1] = this.players;
      this.props.modifyPlayerLists(playerLists_copy);
      this.props.new_league_handler();
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
    let chldrn = [];
    for (let i = 0; i < this.state.count; i++)  {
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
      isOpen: this.props.leagues.length <= 0,
      editLeague: false,
      editPlayerName: false,
      playerChange: -1,
      value: "",
      confirmDeleteLeague: false,
    }
    this.modifyLeagues = this.props.modifyLeagues.bind(this);
    this.modifyPlayerLists = this.props.modifyPlayerLists.bind(this);
  }

  handleClick = () => {
    if (!this.state.editLeague){
      this.setState({
        isOpen: !this.state.isOpen
      });
    }
  }
  getNameColumn() {
    let chldrn = [];
    for (let i = 0; i < this.props.playerLists[this.props.leagueNum].length; i++)  {
      if (this.props.playerLists[this.props.leagueNum][i] !== "bye")
      {
      chldrn[i] = (<div className='edit-player' val = {i} onClick = {(e) => {this.setState({confirmDeleteLeague: false, value: "", editPlayerName: true, playerChange: e.target.getAttribute("val")});}} style = {{display: 'flex', justifyContent: 'center',cursor: 'pointer',width: '100%', fontSize: '3vh', borderBottom: 'black', borderBottomWidth: '2px', borderBottomStyle: 'solid'}} key = {i}>
        {this.props.playerLists[this.props.leagueNum][i]}
      </div>);
      }
    }
    let lbox = <div className='edit-league-col' children={chldrn} ></div>; 
    return lbox;
  }
  submitNewName() {
    if (this.state.value === "" || this.state.value === undefined)  {
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
                {"Edit " + this.props.leagues[this.props.leagueNum]}
              </div>
              <div className='edit-league-row'>
                {this.getNameColumn()}
                <div className='edit-league-col'>
                  <div style = {{fontSize: '4vh'}}>
                    {"Enter New " + (this.state.editPlayerName ? "Player Name" : "League Name")}
                  </div>
                  <input placeholder={this.state.editPlayerName ? this.props.playerLists[this.props.leagueNum][this.state.playerChange] : this.props.leagues[this.props.leagueNum]} onChange={(e) => {this.setState({value: e.target.value});}} value = {this.state.value} style = {{fontSize: '4vh',width: '15vw', padding: '2vh', border: 'black', borderWidth: '2px', borderStyle: 'solid', borderRadius: '10px', marginLeft: '5px'}}>
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
              <ConfirmLeagueButton modifyPlayerLists = {this.modifyPlayerLists} modifyLeagues = {this.modifyLeagues} leagues = {this.props.leagues} playerLists = {this.props.playerLists} new_league_handler = {this.handleClick}>

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
      leagueState:-1,
      round: 0,
      players: [],
      data:[],
      roundRobin:[],
      focusmode: 0,
      leagues: [],
      playerLists: []
    };
    //create matchdays
    for (let _league = 0; _league < this.state.leagues.length; _league++)  {
      this.state.players = this.state.playerLists[_league];
      this.calculateRoundRobin();
      this.state.data[_league] = [];
      for (let md = 0; md < this.state.players.length - 1; md++)  {
        this.state.data[_league][md] = new MatchDay(this.state.playerLists[_league], this.state.roundRobin[md]);
        if (md > 0)  {
          this.state.data[_league][md].setData(this.state.data[_league][md-1]);
        }
        else  {
          this.state.data[_league][md].setData(new MatchDay(this.state.playerLists[_league], this.state.roundRobin[md]));
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

  modifyPlayerListsAndCreateNewLeague = (newPlayerLists) => {
    let newPlayerLists_copy = [...newPlayerLists]
    this.setState({ playerLists: newPlayerLists_copy, players: newPlayerLists_copy[newPlayerLists_copy.length - 1] }, () => {
      this.calculateRoundRobin()
    });
  }
  modifyLeagues = (newLeagues) => {
    this.setState({leagues: newLeagues.slice()});
  }

  loadLeagues = (newLeagues) => {
    this.setState({leagues: newLeagues.slice(), leagueState: newLeagues.length - 1});
  }

  modifyPlayerLists = (newPlayerLists) => {
    let newPlayerLists_copy = [...newPlayerLists]
    this.setState({ playerLists: newPlayerLists_copy, players: newPlayerLists_copy[newPlayerLists_copy.length - 1] });
  }

  changeLeagueName(newName)  {
    let league_copy = [...this.state.leagues];
    league_copy[this.state.leagueState] = newName;
    this.setState({leagues: league_copy, leagueState: this.state.leagueState});
  }
  updatePlayers(i, value) {
    let prev =  this.state.playerLists[this.state.leagueState][i];
    if (value === "bye" || (this.state.players.length !== 0 && this.state.playerLists[this.state.leagueState].includes(value,0))) {
      return;
    }
    let player_lists_copy = [...this.state.playerLists]
    player_lists_copy[this.state.leagueState][i] = value;

    if (prev !== value) {
      for (let i = 0; i < this.state.data[this.state.leagueState].length; i++)  {
        this.state.data[this.state.leagueState][i].changeName(prev, value);
      }
      this.setState({playerLists: player_lists_copy, players: player_lists_copy[this.state.leagueState]});
    }
  }
  calculateRoundRobin(in_render = false) {
    let players_copy = [...this.state.players]
    let playerCount = players_copy.length;
    if (players_copy.length % 2 === 1) {
      playerCount += 1;
      players_copy[players_copy.length] = "bye";
    }
    
    let roundRobin = [];
    for (let r = 0; r < playerCount - 1; r++)  {
      if (r === 0)  {
        roundRobin[r] = [[],[]]
        for (let i = 0; i < playerCount/2; i++)  {
          roundRobin[r][0][i] = players_copy[i];
        }
        for (let i = 0; i < playerCount/2; i++)  {
          roundRobin[r][1][i] = players_copy[i + playerCount/2];
        }
      }
      else  {
        roundRobin[r] = [[],[]]
        roundRobin[r][0][0] = roundRobin[r-1][0][0];
        if (playerCount > 2) {
          roundRobin[r][0][1] = roundRobin[r - 1][1][0];
        }
        for (let i = 2; i < playerCount/2; i++)  {
          roundRobin[r][0][i] = roundRobin[r - 1][0][i - 1];
        }
        for (let i = 0; i < playerCount/2 - 1; i++)  {
          roundRobin[r][1][i] = roundRobin[r - 1][1][i + 1];
        }
        if (playerCount > 2) {
          roundRobin[r][1][playerCount/2 - 1] = roundRobin[r - 1][0][playerCount/2 - 1];
        }
      }
    }
    if (!in_render)
    {
      this.setState({roundRobin: roundRobin, players: players_copy}, () => {
        this.createNewLeague();
      });
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
    for (let i in this.state.roundRobin)  {
      for (let j in i)  {
        for (let k in j)  {
          if (k === undefined)  {
            this.calculateRoundRobin();
            return;
          }
        }
      }
    }
    let i = this.state.leagues.length - 1;
      console.log("step 2");
      console.log(this.state.leagues);
      console.log(this.state.leagues.length);
      console.log(this.state.players);
      console.log(this.state.players.length);
      console.log(this.state.playerLists);
      console.log(this.state.roundRobin);
      console.log(this.state.playerLists[i]);
      let data = [...this.state.data]
      data[i] = [];

      for (let j = 0; j < this.state.players.length - 1; j++)  {
        data[i][j] = new MatchDay(this.state.playerLists[i], this.state.roundRobin[j]);
        if (j > 0)  {
          data[i][j].setData(data[i][j-1]);
        }
        else  {
          data[i][j].setData(new MatchDay(this.state.playerLists[i], this.state.roundRobin[j]));
        }
      }
      console.log("step 3");
      this.setState({data: data, leagueState: i, round: 0});
  }
  handler(i) {
    const event = new Event('nextOrPrev', {
      bubbles: true,
      cancelable: true,
      composed: false
    })
    document.dispatchEvent(event);
    if (i >= this.state.playerLists.length)  {
      this.setState({
        round: 0,
      })
      this.state.players = this.state.playerLists[i];
      this.calculateRoundRobin();
      this.state.data[i] = [];
      for (let j = 0; j < this.state.players.length - 1; j++)  {
        this.state.data[i][j] = new MatchDay(this.state.playerLists[i], this.state.roundRobin[j]);
        if (j > 0)  {
          this.state.data[i][j].setData(this.state.data[i][j-1]);
        }
        else  {
          this.state.data[i][j].setData(new MatchDay(this.state.playerLists[i], this.state.roundRobin[j]));
        }
      }
      this.setState({
        leagueState: i,
        players: this.state.playerLists[i],
        round: 0,
        data: this.state.data
      })
    }
    else{
      let min = this.state.round;
      if (this.state.playerLists[i].length - 1 <= this.state.round)  {
        min = this.state.playerLists[i].length - 2;
      }
      this.setState({
        leagueState: i,
        players: this.state.playerLists[i],
        round: min
      })
    }
  }
  changeRound(i)  {
    this.setState({round: this.state.round + i});
  }
  returnDropdown()  {
      return(<Dropdown
      title={this.state.leagues.length > 0 ? this.state.leagues[this.state.leagueState] : "Create A New League!"}
      handler = {this.handler}
      getter = {this.getter}
      leagues = {this.state.leagues}
    >

    </Dropdown>)
  }
  removeLeague(i) {
    this.state.playerLists.splice(i, 1);
    this.state.leagues.splice(i,1);
    this.state.data.splice(i,1);
    let max = i >= this.state.leagues.length ? this.state.leagues.length - 1 : i;
    this.setState({playerLists: this.state.playerLists, leagues: this.state.leagues, leagueState: max});
  }
  substitute(i, value)  {
    let prev =  this.state.playerLists[this.state.leagueState][i];
    this.state.playerLists[this.state.leagueState][i] = value;

    if (prev !== value) {
      for (let i = 0; i < this.state.data[this.state.leagueState].length; i++)  {
        this.state.data[this.state.leagueState][i].substitutePlayer(prev, value);
      }
      this.setState({players: this.state.playerLists[this.state.leagueState]});
    }
  }
  copyDailyResults()  {
    let to_copy = "Matchday " + (this.state.round + 1) + " Stats!\n";
    let data = this.state.data[this.state.leagueState][this.state.round];
    let results = data.results;

    to_copy += "\nBiggest Defeats:\n"
    to_copy += data.biggestDefeats(true);

    to_copy += "\n Closest Matchups:\n"
    to_copy += data.biggestDefeats(false);

    to_copy += "\nCool Words: \n";
    
    for (let i = 0; i < results.length; i++)  {
      if (results[i][0] !== 'bye' && results[i][8] !== "")  {
        to_copy += results[i][0] + " - " + results[i][8] + "\n";
      }
    }

    to_copy += "\nHighest Scores: \n";
    let highestScores = data.getHighestScores();
    for(let i = 0; i < highestScores.length; i ++) {
      to_copy += highestScores[i][1] + " - " + highestScores[i][0]/1000 + "k\n"
    }

    let highestWCs = data.getHighestWCs();
    to_copy += "\nHighest Word Counts: \n";
    for(let i = 0; i < highestWCs.length; i ++) {
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
    let newLeague = this.state.leagueState < 0 || this.state.leagueState >= this.state.leagues.length || this.state.leagueState >= this.state.playerLists.length || this.state.playerLists[this.state.leagueState].length === 0;
    
    
    return (
      <div className="container" style={bgStyle}>
        <GetLeagues onUpdateLeagues={this.loadLeagues}></GetLeagues>
        <GetPlayers league_num={this.state.leagueState} modifyPlayerLists={this.modifyPlayerLists} leagues={this.state.leagues} playerLists={this.state.playerLists}></GetPlayers>
        <PostData data ={{'key': 'value'}} league={"wordHuntLeagues"}></PostData>
        <div className='header-container'>
            <header className="App-header">    
                Word Hunt League!
            </header>
            
            {this.returnDropdown()}
            <NewLeague modifyPlayerLists = {this.modifyPlayerListsAndCreateNewLeague} modifyLeagues = {this.modifyLeagues} leagues = {this.state.leagues} playerLists = {this.state.playerLists} leagueNum = {this.state.leagueState} substitute = {this.substitute} removeLeague = {this.removeLeague} changeLeagueName = {this.changeLeagueName} updatePlayers = {this.updatePlayers}>

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
            for (let i = 0; i < this.state.playerLists[this.state.leagueState].length - 2; i++)  {
              this.state.data[this.state.leagueState][i].calculateMatchDay();
            }
            this.setState({round: this.state.playerLists[this.state.leagueState].length - 2});
            document.dispatchEvent(event);
            }}> </div>
        </div>)}
        {!newLeague && (<div className='big-box'>
          <div className='next-col'>
          {this.state.round > 0 && (<div className='prev-btn' onClick={(e) => {this.changeRound(-1); e.stopPropagation(); document.dispatchEvent(event);}}>
            
            </div>)}
          </div>
          {this.state.focusmode !== 2 && (
          <Rankings id = "Rankings" players={this.state.players} data = {this.state.data[this.state.leagueState][this.state.round]} focus = {this.focusMode}>  
          </Rankings>)}
          {this.state.focusmode !== 1 && this.state.focusmode !== 3 && (
          <Results id = "Results" players={this.state.players} data = {this.state.data[this.state.leagueState][this.state.round]} focus = {this.focusMode}>  
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