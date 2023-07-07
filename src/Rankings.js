import React from 'react';
const columns = ["Name", "W", "L", "D", "P", "PD", "WCD", "Rank", "Cool Words", "Total Score", "High Score",
"Low Score", "TWC", "HWC", "LWC", "Avg PPW", "HPPW", "LPPW", "P%D"];
const Columns = {
  Name: 0,
  Wins: 1,
  Losses: 2,
  Draws: 3,
  Points: 4,
  PD: 5,
  WCD: 6,
  Rank: 7,
  Total_Score: 9,
  High_Score: 10,
  Low_Score: 11,
  TWC: 12,
  HWC: 13,
  LWC: 14,
  Avg_PPW: 15,
  High_PPW: 16,
  Low_PPW: 17,
  PpercentD: 18
}
class Rankings extends React.Component {
    constructor(props)  {
      super(props);
      this.state = {
        ticker: false,
        currentTab: 0
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
  
      let chldrn = [];
      chldrn[0] = (<div className='stat-box' key={-1} color={'red'}>
          {columns[0]}
          </div>);
      for (let i = 0; i < this.props.data.getPlayerCount(); i++)  {
        let bgstyle = greenBG;
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
      let lbox = <div className='ranking-box' children={chldrn}></div>;    
      return lbox;
    }
    getColumn(col, class_name='ranking-box')  {
      const greenFont = {
        color: 'green'
      }
      const redFont = {
        color: 'red'
      }
      const defaultFont = {
        color: 'black'
      }
      let chldrn = [];
      chldrn[0] = (<div className='stat-box' key={-1} color={'red'}>
          {columns[col]}
          </div>);
      for (let i = 0; i <this.props.data.getPlayerCount(); i++)  {
        let font = defaultFont;
        let altfont = defaultFont;
        if (col === 5 || col === 6) {
          font = greenFont;
          altfont = redFont;
        }
        if (this.props.data.getData(i)[0] === "bye") {
          continue;
        }
        let temp = this.props.data.getData(i)[col];
        chldrn[i + 1] = (
            <div className='stat-box' key={i} style={(col ===5 || col ===6) && temp >= 0 ? font : altfont}>
              {temp}
            </div>
        );
      }
      let lbox = <div className={class_name} children={chldrn}></div>;    
      return lbox;
    }
    handler() {
      this.setState({ticker: !this.state.ticker});
    }
    render()  {
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

      this.props.data.calculateMatchDay();
      this.props.data.sortRankings();
      return(
        <div className='results-box'>
          <div className='rankings-header' key={"-1"}>
            <div className='rankings-header-col' style={tabStyles[(this.state.currentTab === 0 ? 0 : 1)]} onClick = {() => {this.setState({currentTab: 0})}}>
            {"Rankings"}
            </div>
            <div className='rankings-header-col' style={tabStyles[(this.state.currentTab === 1 ? 0 : 1)]} onClick = {() => {this.setState({currentTab: 1})}}>
            {"Extra Stats"}
            </div>
          </div>
          <div className='main-col' onDoubleClick={() => {this.props.focus(1); this.setState({ticker: !this.state.ticker});}}>
            {this.getColumn(Columns.Rank)}
            {this.getUsers()}
            {this.state.currentTab === 0 && this.getColumn(Columns.Wins)}
            {this.state.currentTab === 0 && this.getColumn(Columns.Losses)}
            {this.state.currentTab === 0 && this.getColumn(Columns.Draws)}
            {this.state.currentTab === 0 && this.getColumn(Columns.Points)}
            {this.state.currentTab === 0 && this.getColumn(Columns.PD)}
            {this.state.currentTab === 0 && this.getColumn(Columns.WCD)}

            {this.state.currentTab === 1 && this.getColumn(Columns.Total_Score, "ranking-box-extra")}
            {this.state.currentTab === 1 && this.getColumn(Columns.High_Score,"ranking-box-extra")}
            {this.state.currentTab === 1 && this.getColumn(Columns.Low_Score,"ranking-box-extra")}
            {this.state.currentTab === 1 && this.getColumn(Columns.TWC,"ranking-box-extra")}
            {this.state.currentTab === 1 && this.getColumn(Columns.HWC,"ranking-box-extra")}
            {this.state.currentTab === 1 && this.getColumn(Columns.LWC,"ranking-box-extra")}
            {this.state.currentTab === 1 && this.getColumn(Columns.Avg_PPW,"ranking-box-extra")}
            {this.state.currentTab === 1 && this.getColumn(Columns.High_PPW,"ranking-box-extra")}
            {this.state.currentTab === 1 && this.getColumn(Columns.Low_PPW,"ranking-box-extra")}
            {this.state.currentTab === 1 && this.getColumn(Columns.PD,"ranking-box-extra")}
            {this.state.currentTab === 1 && this.getColumn(Columns.PpercentD,"ranking-box-extra")}
          </div>
        </div>
      )
    }
  }
/*Total_Score: 8,
  High_Score: 9,
  Low_Score: 10,
  TWC: 11,
  HWC: 12,
  LWC: 13,
  Avg_PPW: 14,
  High_PPW: 15,
  Low_PPW: 16,
  PpercentD: 17*/
export default Rankings