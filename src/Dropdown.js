import React from 'react';

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
        headerTitle: this.props.leagues[item],
        isListOpen: false,
      });
    }
    
    getButtons()  {
      let chldrn = [];
      for (let i = 0; i < this.props.leagues.length; i++)  {
        chldrn[i] = (this.getButton(i));
      }
      let lbox = <div style = {{marginTop: '7.5vh', alignContent: 'center'}} className='League-box' id="dd" children={chldrn}></div>;    
      return lbox;
    }
    getButton(i) {
      return (<div className = 'drop-down-btn' key={i} onClick={(e) => {
        this.selectItem(i);
      }}
      >
        {this.props.leagues[i]}
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

  export default Dropdown