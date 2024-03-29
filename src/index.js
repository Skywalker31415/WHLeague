import React, { useRef } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import './App.css';
import bg from './Images/WHBackground.png';
// execute database connection 


//var leagues = ["Kaidan 4", "Kaidan 5", "Kaidan 6", 'Kaidan 7'];
var leagues = [];
/*var playerList1 = ["John", "Paul", "George", "Ringo", "Bob", "Aidan B", "s", "G", "h", "1", "2", "3", "4", "5", "6", "7", "8", "9", "34", "132", "452", "fds", "gfd", "vcxz", "hgesf"];
var playerList2 = ["John", "Paul", "George", "Ringo", "Bob", "Aidan B", "132", "452", "fds", "gfd", "vcxz", "hgesf"];
var playerList3  = ["John", "Paul", "George", "Ringo", "Bob", "Aidan B", "s", "G", "h", "1", "2", "3", "4", "5", "6", "7", "8", "9", "34", "132", "452", "fds", "gfd", "vcxz", "hgesf", "hfd", "lkj", "iuy", "pkogf", "jgkfd", "vnm", "fdhskaf", "we", "2rfew", "6tfd", "hgf", "u4983", "jf"];
var playerLists = [playerList1, playerList3, playerList2, playerList1];*/
var playerLists = [];
const columns = ["Name", "W", "L", "D", "P", "PD", "WCD", "Rank"];
class Dropdown extends React.Component  {
  constructor(props)  {
    super(props);
    this.state = {
      isListOpen: false,
    }
  }

  close = () => {
    this.setState({
      isListOpen: false,
    });
  }
  componentDidUpdate(){
    const { isListOpen } = this.state;
  
    setTimeout(() => {
      if(isListOpen){
        window.addEventListener('click', this.close)
      }
      else{
        window.removeEventListener('click', this.close)
      }
    }, 0)
  }
  toggleList = () => {
    
    this.setState(prevState => ({
      isListOpen: !prevState.isListOpen
   }))

   
   }
   
  selectItem(item) {
    this.props.handler(item);
    this.setState({
      headerTitle: leagues[item],
      isListOpen: false,
    });
  }
  
  getButtons()  {
    var chldrn = [];
    for (var i = 0; i < leagues.length; i++)  {
      chldrn[i] = (this.getButton(i));
    }
    var lbox = <div style = {{marginTop: '7.5vh', alignContent: 'center'}} className='League-box' id="dd" children={chldrn}></div>;    
    return lbox;
  }
  getButton(i) {
    return (<div className = 'drop-down-btn' key={i} onClick={(e) => {
      this.selectItem(i);
    }}
    >
      {leagues[i]}
    </div >);
  }
  render() {
    return (
      <div style = {{display: 'flex', alignContent: 'space-between', height: '100%', background: 'none'}}>
        <button
          type="button"
          className="dd-header"
          onClick={this.toggleList}
          style = {{display: 'flex'}}
        >
          <div style = {{fontSize:'4vh', paddingTop: '1vh', background: 'none'}}>{this.state.isListOpen ? this.props.title + '▲' : this.props.title + '▼'}</div>
        </button>
        {this.state.isListOpen && this.getButtons()}
      </div>
    )
  }
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
      <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
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
class Results extends React.Component {
  constructor(props)  {
    super(props)
    this.state = {
      showResults: 0,
      currentEdit: 0,
      currentTab: 0,
    };
    this.wasFocused = false;
    document.addEventListener('nextOrPrev', () => {this.setState({showResults: 0})}, false);
  }
  
  getRow(i)  {
    var greenFont = {
      color: 'green'
    };
    var redFont = {
      color: '#D50003'
    };
    var navyFont = {
      color: 'navy'
    };
    var fonts = [redFont, navyFont, greenFont];

    var winBG = {
      backgroundColor: '#8DC890',
      //EBD848
      fontWeight: '800'
    }
    var loseBG = {
      backgroundColor: '#C37973',
      //D50003
      fontWeight: '600'
    }
    var drawBG = {
      backgroundColor: '#90C1CD',
      fontWeight: '600'
    }
    var defaultBG = {
      backgroundColor: 'linen',
      fontWeight: '600'
    }
    var BGs = [loseBG, drawBG, winBG, defaultBG];

    var chldrn = [];
    
      chldrn[0] = (
        <div className='matchup-col' key={i + "-0"} style = {BGs[this.props.data.wonMatch(i)]}>
          <div>
          {this.props.data.getMatchupLeft(i)}
          </div>
          <div style = {{fontWeight: 300}}>
          {this.props.data.getPD(i) !== Number.MAX_SAFE_INTEGER && this.props.data.getMatchupLeft(i) !== 'bye' && this.props.data.getMatchupRight(i) !== 'bye'? this.props.data.getPD(i) + " PD": ""}
          </div >
          <div style = {{fontWeight: 300}}>
          {this.props.data.getWCD(i)  !== Number.MAX_SAFE_INTEGER && this.props.data.getMatchupLeft(i) !== 'bye' && this.props.data.getMatchupRight(i) !== 'bye'? this.props.data.getWCD(i) + " WCD": ""}
          </div>
        </div>
      );
      chldrn[1] = (
          <div className='matchup-col' key={i + "-1"} onClick = {() => {this.editResults(i)}}>
              {this.state.currentTab === 0 && (<div className='game-box' style={fonts[Math.abs(this.props.data.isWin(i, 0))]}>
              {(this.props.data.getGames(i,0))[0] + " (" + this.props.data.getGames(i,0)[2] +" WC)"}
              </div>)}
              {this.state.currentTab === 0 && (<div className='game-box' style={fonts[Math.abs(this.props.data.isWin(i, 1))]}>
              {(this.props.data.getGames(i,1))[0]+ " (" + this.props.data.getGames(i,1)[2] +" WC)"}
              </div>)}
              {this.state.currentTab === 0 && (<div className='game-box' style={fonts[Math.abs(this.props.data.isWin(i, 2))]}>
              {(this.props.data.getGames(i,2))[0]+ " (" + this.props.data.getGames(i,2)[2] +" WC)"}
              </div>)}
              {this.state.currentTab === 1 ? this.props.data.getCoolWords(i, 0) : ""}
          </div>
      );
      chldrn[2] = (
        <div className='matchup-col' key={i + "-2"} onClick = {() => {this.editResults(i)}}>
            {this.state.currentTab === 0 && (<div className='game-box' style={fonts[2 - Math.abs(this.props.data.isWin(i, 0))]}>
            {(this.props.data.getGames(i,0))[1]+ " (" + this.props.data.getGames(i,0)[3] +" WC)"}
            </div>)}
            {this.state.currentTab === 0 && (<div className='game-box' style={fonts[2 - Math.abs(this.props.data.isWin(i, 1))]}>
            {(this.props.data.getGames(i,1))[1]+ " (" + this.props.data.getGames(i,1)[3] +" WC)"}
            </div>)}
            {this.state.currentTab === 0 && (<div className='game-box' style={fonts[2 - Math.abs(this.props.data.isWin(i, 2))]}>
            {(this.props.data.getGames(i,2))[1]+ " (" + this.props.data.getGames(i,2)[3] +" WC)"}
            </div>)}
            {this.state.currentTab === 1 ? this.props.data.getCoolWords(i, 1) : ""}
        </div>
      );
      chldrn[3] = (
        <div className='matchup-col' key={i + "-3"} style = {BGs[this.props.data.wonMatch(i) < 3 ? 2 - this.props.data.wonMatch(i) : 3]}>
          <div>
          {this.props.data.getMatchupRight(i)}
          </div>
          <div style = {{fontWeight: 300}}>
          {this.props.data.getPD(i) !== Number.MAX_SAFE_INTEGER && this.props.data.getMatchupLeft(i) !== 'bye' && this.props.data.getMatchupRight(i) !== 'bye'? (-1*parseInt(this.props.data.getPD(i))) + " PD": ""}
          </div >
          <div style = {{fontWeight: 300}}>
          {this.props.data.getWCD(i)  !== Number.MAX_SAFE_INTEGER && this.props.data.getMatchupLeft(i) !== 'bye' && this.props.data.getMatchupRight(i) !== 'bye'?(-1*parseInt(this.props.data.getWCD(i))) + " WCD": ""}
          </div>
        </div>
      );
    var lbox = <div className='matchup-row' key = {i} children={chldrn} ></div>;    
    return lbox;
  }
  editResults(i)  {
    this.props.data.sortRankings();
    if (this.state.showResults === 0) {
      this.setState({showResults: 1, currentEdit: i});
      return (this.getRow(i));
    }
    else  {
      const myEvent = new Event('myevent', {
        bubbles: true,
        cancelable: true,
        composed: false
      })
      document.dispatchEvent(myEvent);
      this.props.data.sortResults(this.state.currentEdit);
      this.setState({showResults: 0});
      return;
    }
  }
 
  onChangeHandler(val, game, idx, offset) {
    if (val === '') {
      val = 0;
    }
    if (offset < 4) {
      this.props.data.addData(val, game, idx, offset);
      this.props.data.calculateMatchDay();
    }
    else if (offset === 4 || offset === 5)  {
      this.props.data.addCoolWords(val, game, offset - 4);
    }
    this.props.data.getHighestWCs();
  }
  render()  {
    
    if (this.state.showResults === 0){
      var onTabStyle = {
        backgroundColor: 'rgb(22, 153, 224)',
        flexGrow: 3,
        height: '100%',
      }
      var offTabStyle = {
        backgroundColor: 'rgb(17, 121, 178)',
        flexGrow: 1,
        height: '100%',
      }
      var tabStyles = [onTabStyle, offTabStyle];

      var chldrn = [];
      chldrn[0] = (<div className='results-header' key={"-1"}>
        <div className='results-header-col' style={tabStyles[(this.state.currentTab === 0 ? 0 : 1)]} onClick = {() => {this.setState({currentTab: 0})}}>
        {"Results"}
        </div>
        <div className='results-header-col2' style={tabStyles[(this.state.currentTab === 1 ? 0 : 1)]} onClick = {() => {this.setState({currentTab: 1})}}>
        {"Cool Words"}
        </div>
        <div className='results-header-col2' style={tabStyles[(this.state.currentTab === 2 ? 0 : 1)]} onClick = {() => {this.setState({currentTab: 2})}}>
        {"Highest Scores"}
        </div>
      </div>);
      if (this.state.currentTab === 0 || this.state.currentTab === 1) {
        for (var i = 0; i < this.props.data.getPlayerCount()/2; i++)  {
          chldrn[i + 1] = (
              this.getRow(i)
          );
        }
      }
      else if (this.state.currentTab === 2) {
        var leftBox = []
        leftBox[0] = (<div key = {0} style = {{fontSize: '2.2vh', fontWeight: 'bold'}}>{"Highest Scores:"}</div>)
        var rightBox = [];
        rightBox[0] = (<div key = {0} style = {{fontSize: '2.2vh', fontWeight: 'bold'}}>{"Highest Word Counts:"}</div>)
        var highestScores = this.props.data.getHighestScores();
        var highestWCs = this.props.data.getHighestWCs();
        for (i = 0; i < highestScores.length; i++)  {
          leftBox[i + 1] = (<div key = {i} style = {{fontSize: '1.7vh'}}>{highestScores[i][1] + " - " + highestScores[i][0]/1000 + "k"}</div>)
        }
        for (i = 0; i < highestWCs.length; i++)  {
          rightBox[i + 1] = (<div key = {i} style = {{fontSize: '1.7vh'}}>{highestWCs[i][1] + " - " + highestWCs[i][0]}</div>)
        }
        
        chldrn[1] = (<div className = 'matchup-row' style={{justifyContent: "center", alignItems: 'stretch'}}>
          <div className='matchup-col' children = {leftBox} style={{paddingTop: '1vh', overflowY: 'default', border: 'black', borderStyle: 'solid', justifyContent: "flex-start", minWidth: '99.5%'}}>
          </div>
        </div>);  
        chldrn[2] = (<div className = 'matchup-row' style={{justifyContent: "center"}}>
           <div className='matchup-col' children = {rightBox} style={{paddingTop: '1vh', overflowY: 'default', justifyContent: "flex-start", minWidth: '99.5%'}}>
          </div>
        </div>);  
      }
      var lbox = <div className='main-col2' children={chldrn} onDoubleClick={() => {this.props.focus(2); this.wasFocused = !this.wasFocused;} }></div>;    
      return lbox;
    }
    else if (this.state.showResults === 1) {
      var val = this.state.currentEdit;
      const inputStyle = {
        display: 'flex',
        alignItems:'center',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '90%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,.2)',
        outline: 'none',
        fontSize: '2vh',
        color: 'black',
      }
      return (
        <div className='edit-result-box'>
         
            <div className='edit-result-row'>
              <div className='edit-result-col'>
                {this.props.data.getMatchupLeft(val)}
              </div>
              <div className='edit-result-col'>
              {this.props.data.getMatchupRight(val)}
              </div>
            </div>

            <div className='edit-result-row'>
              <div className='edit-result-col'>
                <input style={inputStyle} defaultValue = {this.props.data.getGames(val,0)[0]} onChange = {(e) => {this.onChangeHandler(e.target.value, val, 0, 0);}} onSubmit = {(e) => {e.defaultPrevented();}}>
                  
                </input>
              </div>
              <div className='edit-result-col'>
                <input style={inputStyle} defaultValue = {this.props.data.getGames(val,0)[2]} onChange = {(e) => {this.onChangeHandler(e.target.value, val, 0, 2);}} onSubmit = {(e) => {e.defaultPrevented();}}>
                  
                </input>
                <div>
                  WC
                </div>
              </div>
              <div className='edit-result-col'>
                <input style={inputStyle} defaultValue = {this.props.data.getGames(val,0)[1]} onChange = {(e) => {this.onChangeHandler(e.target.value, val, 0, 1);}} onSubmit = {(e) => {e.defaultPrevented();}}>
                  
                </input>
              </div>
              <div className='edit-result-col'>
                <input style={inputStyle} defaultValue = {this.props.data.getGames(val,0)[3]} onChange = {(e) => {this.onChangeHandler(e.target.value, val, 0, 3);}} onSubmit = {(e) => {e.defaultPrevented();}}>
                  
                </input>
                <div>
                  WC
                </div>
              </div>
            </div>

            <div className='edit-result-row'>
              <div className='edit-result-col'>
                <input style={inputStyle} defaultValue = {this.props.data.getGames(val,1)[0]} onChange = {(e) => {this.onChangeHandler(e.target.value, val, 1, 0);}} onSubmit = {(e) => {e.defaultPrevented();}}>
                  
                </input>
              </div>
              <div className='edit-result-col'>
                <input style={inputStyle} defaultValue = {this.props.data.getGames(val,1)[2]} onChange = {(e) => {this.onChangeHandler(e.target.value, val, 1, 2);}} onSubmit = {(e) => {e.defaultPrevented();}}>
                  
                </input>
                <div>
                  WC
                </div>
              </div>
              <div className='edit-result-col'>
                <input style={inputStyle} defaultValue = {this.props.data.getGames(val,1)[1]} onChange = {(e) => {this.onChangeHandler(e.target.value, val, 1, 1);}} onSubmit = {(e) => {e.defaultPrevented();}}>
                  
                </input>
              </div>
              <div className='edit-result-col'>
                <input style={inputStyle} defaultValue = {this.props.data.getGames(val,1)[3]} onChange = {(e) => {this.onChangeHandler(e.target.value, val, 1, 3);}} onSubmit = {(e) => {e.defaultPrevented();}}>
                  
                </input>
                <div>
                  WC
                </div>
              </div>
            </div>
            <div className='edit-result-row'>
              <div className='edit-result-col'>
                <input style={inputStyle} defaultValue = {this.props.data.getGames(val,2)[0]} onChange = {(e) => {this.onChangeHandler(e.target.value, val, 2, 0);}} onSubmit = {(e) => {e.defaultPrevented();}}>
                  
                </input>
              </div>
              <div className='edit-result-col'>
                <input style={inputStyle} defaultValue = {this.props.data.getGames(val,2)[2]} onChange = {(e) => {this.onChangeHandler(e.target.value, val, 2, 2);}} onSubmit = {(e) => {e.defaultPrevented();}}>
                  
                </input>
                <div>
                  WC
                </div>
              </div>
              <div className='edit-result-col'>
                <input style={inputStyle} defaultValue = {this.props.data.getGames(val,2)[1]} onChange = {(e) => {this.onChangeHandler(e.target.value, val, 2, 1);}} onSubmit = {(e) => {e.defaultPrevented();}}>
                  
                </input>
              </div>
              <div className='edit-result-col'>
                <input style={inputStyle} defaultValue = {this.props.data.getGames(val,2)[3]} onChange = {(e) => {this.onChangeHandler(e.target.value, val, 2, 3);}} onSubmit = {(e) => {e.defaultPrevented();}}>
                  
                </input>
                <div>
                  WC
                </div>
              </div>
            </div>
            <div className='edit-result-row'>
              <div className='edit-result-col2'>
                <div>
                  Cool Words:
                </div>
                <textarea resize = 'none' style={inputStyle} defaultValue = {this.props.data.getCoolWords(val,0)} onChange = {(e) => {this.onChangeHandler(e.target.value, val, 0, 4);}} onSubmit = {(e) => {e.defaultPrevented();}}>
                  
                </textarea>
              </div>
              <div className='edit-result-col2'>
                <div>
                  Cool Words:
                </div>
                <textarea resize = 'none' style={inputStyle} defaultValue = {this.props.data.getCoolWords(val,1)} onChange = {(e) => {this.onChangeHandler(e.target.value, val, 0, 5);}} onSubmit = {(e) => {e.defaultPrevented();}}>
                  
                </textarea>
              </div>
            </div>
            <div className='edit-result-row'>
              <div className='confirm-results' onClick = {() => {this.editResults(0)}}>
                Confirm
              </div>
            </div>
          </div>
        );
    }
    return (<div> </div>);
  }
}
class Rankings extends React.Component {
  constructor(props)  {
    super(props);
    this.state = {
      ticker:false
    };
    this.handler = this.handler.bind(this);
    document.addEventListener('myevent', () => {this.setState({ticker: !this.state.ticker})}, false);
  }
  getUsers()  {
    const greenBG = {
      backgroundColor: "#8DC890"
    }
    const blueBG = {
      backgroundColor: '#90C1CD'
    }
    const purpleBG = {
      backgroundColor: '#b2a0db'
    }
    const redBG = {
      backgroundColor: '#C37973'
    }

    var chldrn = [];
    chldrn[0] = (<div className='stat-box' key={-1} color={'red'}>
        {columns[0]}
        </div>);
    for (var i = 0; i < this.props.data.getPlayerCount(); i++)  {
      var bgstyle = greenBG;
      if (i > this.props.data.getPlayerCount()/4) {
        bgstyle = blueBG;
      }
      if (i > 2*this.props.data.getPlayerCount()/4) {
        bgstyle = purpleBG;
      }
      if (i > 3*this.props.data.getPlayerCount()/4) {
        bgstyle = redBG;
      }

      if (this.props.data.getData(i)[0] === "bye") {
        continue;
      }
      chldrn[i + 1] = (
          <div className='stat-box' key={i} style={bgstyle}>
            {this.props.data.getData(i)[0]}
          </div>
      );
    }
    var lbox = <div className='ranking-box' children={chldrn}></div>;    
    return lbox;
  }
  getColumn(col)  {
    const greenFont = {
      color: 'green'
    }
    const redFont = {
      color: 'red'
    }
    const defaultFont = {
      color: 'black'
    }
    var chldrn = [];
    chldrn[0] = (<div className='stat-box' key={-1} color={'red'}>
        {columns[col]}
        </div>);
    for (var i = 0; i <this.props.data.getPlayerCount(); i++)  {
      var font = defaultFont;
      var altfont = defaultFont;
      if (col === 5 || col === 6) {
        font = greenFont;
        altfont = redFont;
      }
      if (this.props.data.getData(i)[0] === "bye") {
        continue;
      }
      var temp = this.props.data.getData(i)[col];
      chldrn[i + 1] = (
          <div className='stat-box' key={i} style={(col ===5 || col ===6) && temp >= 0 ? font : altfont}>
            {temp}
          </div>
      );
    }
    var lbox = <div className='ranking-box' children={chldrn}></div>;    
    return lbox;
  }
  handler() {
    this.setState({ticker: !this.state.ticker});
  }
  render()  {
    this.props.data.calculateMatchDay();
    this.props.data.sortRankings();
    return(
      <div className='main-col' onDoubleClick={() => {this.props.focus(1); this.setState({ticker: !this.state.ticker});}}>
        {this.getColumn(7)}
        {this.getUsers()}
        {this.getColumn(1)}
        {this.getColumn(2)}
        {this.getColumn(3)}
        {this.getColumn(4)}
        {this.getColumn(5)}
        {this.getColumn(6)}
      </div>
    )
  }
}
class MatchDay  {
  constructor(players, roundRobin) {
    this.players = players;
    this.results = [];
    this.playerCount = 0;
    this.matchups = roundRobin;
    for (var i = 0; i < players.length; i++) {
      this.addPlayer(players[i]);
    }
    this.games = [];
    for (i = 0; i < 3*roundRobin[0].length; i++) {
      this.games[i] = [0,0,0,0];
    }
    this.prev = undefined;
  }
  changeName(prev, value) {
    for (var i = 0; i < this.results.length; i++) {
      if (this.results[i][0] === prev) {
        this.results[i][0] = value;
        break;
      }
    }
    for (var i = 0; i < this.prev.results.length; i++) {
      if (this.prev.results[i][0] === prev) {
        this.prev.results[i][0] = value;
        break;
      }
    }

    for (i = 0; i < this.matchups[0].length; i++) {
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
    for (var i = 0; i < this.results.length; i++) {
      if (this.results[i][0] === prev) {
        this.results[i] = [value,0,0,0,0,0,0,0,""];
        break;
      }
    }
    for (var i = 0; i < this.prev.results.length; i++) {
      if (this.prev.results[i][0] === prev) {
        this.prev.results[i] = [value,0,0,0,0,0,0,0,""];
        break;
      }
    }

    for (i = 0; i < this.matchups[0].length; i++) {
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
    /*for (var game = 0; game < this.games.length; game++)  {
      this.games[game][0] = Math.round(10*Math.random());
      this.games[game][1] = Math.round(10*Math.random());
      this.games[game][2] = Math.round(100*Math.random());
      this.games[game][3] = Math.round(100*Math.random());
    }*/
    this.calculateMatchDay();
    this.sortRankings(); 
  }
  calculateMatchDay() {
    if (this.prev.results !== null && this.prev.results !== undefined && this.prev.results !== [])  {
      //this.prev.calculateMatchDay();
    }
    for (var i = 0; i < this.matchups[0].length; i++) {
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

      for (var counter = 0; counter < 3; counter ++){
        
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
    for (var i = this.matchups[0].length - 1; i >= 0; i--)  {
      if (this.matchups[0][i] === "bye" || this.matchups[1][i] === "bye") {
        if (i == this.matchups[0].length - 1)  {
          break;
        }
        else  {
          var l = this.matchups[0].length - 1;

          temp = this.matchups[0][i];
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
      var temp = this.matchups[0][matchNum];
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
      temp = this.matchups[0][matchNum];
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
    var threshold = 40000;
    var to_return = [];
    for (var i = 0; i < this.games.length; i++) {
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
  calculateRoundRobin() {
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
    this.setState({roundRobin: this.state.roundRobin, players: this.state.players});
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
    var i = leagues.length - 1;
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
    var prev =  playerLists[this.state.leagueState][i];
    playerLists[this.state.leagueState][i] = value;

    if (prev !== value) {
      for (var i = 0; i < this.state.data[this.state.leagueState].length; i++)  {
        this.state.data[this.state.leagueState][i].substitutePlayer(prev, value);
      }
      this.setState({players: playerLists[this.state.leagueState]});
    }
  }
  copyDailyResults()  {
    var to_copy = "Matchday " + (this.state.round + 1) + " Stats!\n";
    var data = this.state.data[this.state.leagueState][this.state.round];
    var results = data.results;
    var games = data.games;
    var matchups = data.matchups;

    to_copy += "\nBiggest Defeats:\n"
    to_copy += data.biggestDefeats(true);

    to_copy += "\n Closest Matchups:\n"
    to_copy += data.biggestDefeats(false);

    to_copy += "\nCool Words: \n";
    
    for (var i = 0; i < results.length; i++)  {
      if (results[i][0] != 'bye' && results[i][8] != "")  {
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
    var newLeague = this.state.leagueState < 0 || this.state.leagueState >= leagues.length || this.state.leagueState >= playerLists.length || playerLists[this.state.leagueState].length === 0;

    
    return (
      <div className="container" style={bgStyle}>
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