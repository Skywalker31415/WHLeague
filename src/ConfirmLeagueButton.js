import React from 'react';

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

  export default ConfirmLeagueButton