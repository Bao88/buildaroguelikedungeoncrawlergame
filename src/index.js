import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';

class Cell extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            x: props.x,
            y: props.y,
            wall: 1,
            player: false,
            monster: false,
            items: false,
            weapon: false,
            boss: false
        };
    }

    change = (event) => {
        this.setState({wall: !this.state.wall});
    }
    render() {
        return (
            <div id={this.props.id} onClick={this.change} className="cell" style={{backgroundColor: this.props.arr[0] ? "grey" : (this.props.arr[1] ? "red": (this.props.arr[2] ? "green": (this.props.arr[3] ? "purple": (this.props.arr[4] ? "yellow" : (this.props.arr[5] ? "black":"white")))))}}>

            </div>
        )
    };
}
class Main extends React.Component {
    constructor(props){
        super(props);

        var cells = [], cell = [], xLen = 100, yLen = 60;
        while(yLen--){
            while(xLen--) cell[xLen] = [true, false, false, false, false, false];
            cells[yLen] = cell.slice();
            xLen = 100;
        }
        this.state = {
            board: cells,
            emptyBoard: cells.slice(),
            elements: [1, 5, 5, 1, 1],
            x: 100,
            y: 60
        };
    }

    createRoom(map, position, sizeX, sizeY){
        map[position.y][position.x][0] = false;

        for(var x = 0; x <= sizeX; x++){
            map[position.y][position.x+x][0] = false;
            for(var y = 0; y <= sizeY; y++){
                map[position.y+y][position.x+x][0] = false;
            }
        }

        return map;
    }

    getRandomPos(map){
        var pos = {}, x = 0, y = 0;
        while(true){
            x = Math.floor(Math.random() * this.state.x);
            y = Math.floor(Math.random() * this.state.y);
            if(!map[y][x][0]){
                pos = {posY: y, posX: x}
                break;
            }
        }
        return pos;
    }
    populateDungeon(map){
        var array = this.state.elements.slice();
        var occupied = [], current = 0, tmp = {};
        var elem = {
            0: [false, true, false, false, false, false],
            1: [false, false, true, false, false, false],
            2: [false, false, false, true, false, false],
            3: [false, false, false, false, true, false],
            4: [false, false, false, false, false, true]
        };

        for(var i = 0; i < array.length; i++){
            current = array[i];
            while(current > 0){
                tmp = this.getRandomPos(map);
                if(!occupied.includes(tmp)){
                    occupied.push(tmp);
                    map[tmp.posY][tmp.posX] = elem[i];
                    current--;
                }
            }
        }
    }
    // Create bindings/tunnels to each room
    createRoad(map, position1, position2){
        var x1 = position1.x, x2 = position2.x;
        var y1 = position1.y, y2 = position2.y;

        while(x1 !== x2){
            map[position1.y][x1][0] = false;
            x1 = x1 < x2 ? x1 + 1 : x1 - 1;
        }

        while(y1 !== y2){
            map[y1][position2.x][0] = false;
            y1 = y1 < y2 ? y1 + 1 : y1 - 1;
        }
    }

    // Create rooms
    createMap(rooms) {
        let map = this.state.emptyBoard.slice();
        let positionsArray = [], loop = rooms;

        while(loop--){
            let sizeX = Math.floor(Math.random() * 15 + 1), sizeY = Math.floor(Math.random() * 15 + 1);
            let position = {x: Math.floor(Math.random() * 84 + 1), y: Math.floor(Math.random() * 43 + 1)}; // dont start around corners
            positionsArray.push(position);
            this.createRoom(map, position, sizeX, sizeY);
        }
        while(rooms-- !== 1) this.createRoad(map, positionsArray[rooms], positionsArray[rooms-1]);
        this.populateDungeon(map);
        return map;
    };

// Movement and interaction
    press = (event) => {
        event.preventDefault();
        console.log("Hello");
    }

    change = (event) => {
        console.log("Hello");
    }
    render(){
        var dungeon = this.createMap(20);
        return (
            <div className="main" onKeyDown={this.press} tabIndex="0">
                <div className="statuses">
                    Health Level Weapon
                </div>
                <div className="gameWindow">
                    <div className="game">
                        {
                           dungeon.map((value, index) => (
                                dungeon[index].map((value, inx) => (
                                    <Cell key={index + "," + inx} x={index} y={inx} id={"x: " +index + " y: " + inx} arr={value} onClick={this.change}/>
                                ), this)
                            ), this)
                        }
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Main />, document.getElementById('root'));
