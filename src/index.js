import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';

class Cell extends React.Component{
    render() {
        return (
            <div id={this.props.id} onClick={this.props.onClick} className="cell" style={{backgroundColor: this.props.wall ? "grey" : "white"}}>

            </div>
        )
    };
}
class Main extends React.Component {
    constructor(props){
        super(props);

        var cells = [], size = 100*70;
        while(size--) cells[size] = Math.random() >= 0.5;
        this.state = {
            board: cells
        };
    }

    change = (event) => {
        var tmp = this.state.board;
        tmp[event.target.id.substring(1)] = !tmp[event.target.id.substring(1)];
        console.log(event.target.id.substring(1));
        this.setState({board: tmp});
    }
    render(){
        return (
            <div className="main">
                <div className="statuses">
                    Health Level Weapon
                </div>
                <div className="gameWindow">
                    <div className="game">
                        {
                            this.state.board.map((value, index) => (
                                <Cell key={index} id={"c" + index} wall={value} onClick={this.change}/>
                            ), this)
                        }
                    </div>
                </div>
            </div>
        );
    }
}



ReactDOM.render(<Main />, document.getElementById('root'));
