import React from 'react';
const columns = ["Name", "W", "L", "D", "P", "PD", "WCD", "Rank"];

class Rankings extends React.Component {
    constructor(props)  {
      super(props);
      this.state = {
        ticker: false
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

export default Rankings