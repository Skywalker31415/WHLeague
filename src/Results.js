import React from 'react';

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
      const greenFont = {
        color: 'green'
      };
      const redFont = {
        color: '#D50003'
      };
      const navyFont = {
        color: 'navy'
      };
      let fonts = [redFont, navyFont, greenFont];
  
      const winBG = {
        backgroundColor: '#8DC890',
        //EBD848
        fontWeight: '800'
      }
      const loseBG = {
        backgroundColor: '#C37973',
        //D50003
        fontWeight: '600'
      }
      const drawBG = {
        backgroundColor: '#90C1CD',
        fontWeight: '600'
      }
      const defaultBG = {
        backgroundColor: 'linen',
        fontWeight: '600'
      }
      let BGs = [loseBG, drawBG, winBG, defaultBG];
  
      let chldrn = [];
      
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
      let lbox = <div className='matchup-row' key = {i} children={chldrn} ></div>;    
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
        const onTabStyle = {
          backgroundColor: 'rgb(22, 153, 224)',
          flexGrow: 3,
          height: '100%',
        }
        const offTabStyle = {
          backgroundColor: 'rgb(17, 121, 178)',
          flexGrow: 1,
          height: '100%',
        }
        const tabStyles = [onTabStyle, offTabStyle];
  
        let chldrn = [];
        chldrn[0] = (<div className='results-header' key={"-1"}>
          <div className='results-header-col' style={tabStyles[(this.state.currentTab === 0 ? 0 : 1)]} onClick = {() => {this.setState({currentTab: 0})}}>
          {"Results"}
          </div>
          <div className='results-header-col' style={tabStyles[(this.state.currentTab === 1 ? 0 : 1)]} onClick = {() => {this.setState({currentTab: 1})}}>
          {"Cool Words"}
          </div>
          <div className='results-header-col' style={tabStyles[(this.state.currentTab === 2 ? 0 : 1)]} onClick = {() => {this.setState({currentTab: 2})}}>
          {"Highest Scores"}
          </div>
        </div>);
        if (this.state.currentTab === 0 || this.state.currentTab === 1) {
          for (let i = 0; i < this.props.data.getMatchupCount(); i++)  {
            chldrn[i + 1] = (
                this.getRow(i)
            );
          }
        }
        else if (this.state.currentTab === 2) {
          let leftBox = []
          leftBox[0] = (<div key = {0} style = {{fontSize: '2.2vh', fontWeight: 'bold'}}>{"Highest Scores:"}</div>)
          let rightBox = [];
          rightBox[0] = (<div key = {0} style = {{fontSize: '2.2vh', fontWeight: 'bold'}}>{"Highest Word Counts:"}</div>)
          let highestScores = this.props.data.getHighestScores();
          let highestWCs = this.props.data.getHighestWCs();
          for (let i = 0; i < highestScores.length; i++)  {
            leftBox[i + 1] = (<div key = {i} style = {{fontSize: '1.7vh'}}>{highestScores[i][1] + " - " + highestScores[i][0]/1000 + "k"}</div>)
          }
          for (let i = 0; i < highestWCs.length; i++)  {
            rightBox[i + 1] = (<div key = {i} style = {{fontSize: '1.7vh'}}>{highestWCs[i][1] + " - " + highestWCs[i][0]}</div>)
          }
          
          chldrn[1] = (<div className = 'matchup-row' key={1} style={{justifyContent: "center", alignItems: 'stretch'}}>
            <div className='matchup-col' children = {leftBox} style={{paddingTop: '1vh', overflowY: 'default', border: 'black', borderStyle: 'solid', justifyContent: "flex-start", minWidth: '99.5%'}}>
            </div>
          </div>);  
          chldrn[2] = (<div className = 'matchup-row' key={2} style={{justifyContent: "center"}}>
             <div className='matchup-col' children = {rightBox} style={{paddingTop: '1vh', overflowY: 'default', justifyContent: "flex-start", minWidth: '99.5%'}}>
            </div>
          </div>);
        }
        let lbox = <div className='main-col2' children={chldrn} onDoubleClick={() => {this.props.focus(2); this.wasFocused = !this.wasFocused;} }></div>;    
        return lbox
      }
      else if (this.state.showResults === 1) {
        let val = this.state.currentEdit;
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

  export default Results