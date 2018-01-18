import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';

class Cell extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            x: props.x,
            y: props.y,
            wall: true,
            player: false,
            monster: false,
            items: false,
            weapon: false,
            boss: false,
            occupied: false
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

// Should optimize the program, takes too much CPU resources
class Main extends React.Component {
    constructor(props){
        super(props);

        this.state = this.Initialstate;

    }

    get Initialstate() {
        var cells = [], cell = [], xLen = 100, yLen = 60;
        while(yLen--){
            while(xLen--) cell[xLen] = [true, false, false, false, false, false, true];
            cells[yLen] = cell.slice();
            xLen = 100;
        }

        return {
            health: -1,
            level: 1,
            weapon: 10,
            board: cells,
            emptyBoard: cells.slice(),
            dungeon: cells.slice(),
            elements: [1, 5, 5, 1, 1],
            x: 100,
            y: 60,
            playerPosition: {x: 0, y: 0},
            monsters: [],
            items: [],
            weapons: [],
            boss: {hp: 100, lvl: 1, attack: 10},
            lvlDungeon: 1
        };
    }

    resetMap = (bool) => {
        if(bool){

        } else {
            this.setState(this.Initialstate);
            this.setState({dungeon: this.createMap(10), lvlDungeon: this.state.lvlDungeon});
        }
    }

    componentDidMount = () => {
        
        this.setState({dungeon: this.createMap(10)});
    }
    createRoom(map, position, sizeX, sizeY){
        map[position.y][position.x] = [false, false, false, false, false, false, false];;

        for(var x = 0; x <= sizeX; x++){
            map[position.y][position.x+x] = [false, false, false, false, false, false, false];;
            for(var y = 0; y <= sizeY; y++){
                map[position.y+y][position.x+x] = [false, false, false, false, false, false, false];;
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

    // Monsters i = 1, items i = 2 and weapons i = 3
        createEntities = () => {
            var array = this.state.elements.slice();
            var current = 0;
            for(var i = 1; i < array.length-1; i++){
                var tmp = [];
                current = array[i];
                // console.log(current);
                while(current > 0){
                    // if(i === 1) tmp.push({hp: Math.floor(Math.random() * (10 * this.state.lvlDungeon) + 5), lvl: Math.floor(Math.random() * (10 * this.state.lvlDungeon) + 1), position: arr.pop()});
                    // else if(i === 2) tmp.push({heal: Math.floor(Math.random() * 20 + 10), position: arr.pop()});
                    // else if(i === 3) tmp.push({attack: Math.floor(Math.random() * (10 * this.state.lvlDungeon) + 5), position: arr.pop()});
                    // else arr.pop();
                    if(i === 1) tmp.push({hp: Math.floor(Math.random() * (10 * this.state.lvlDungeon) + 5), lvl: Math.floor(Math.random() * (10 * this.state.lvlDungeon) + 1)});
                    else if(i === 2) tmp.push({heal: Math.floor(Math.random() * 20 + 10)});
                    else if(i === 3) tmp.push({attack: Math.floor(Math.random() * (10 * this.state.lvlDungeon) + 5)});
                    current--;
                }
                if(i === 1) this.setState({monsters: tmp});
                if(i === 2) this.setState({items: tmp});
                if(i === 3) this.setState({weapons: tmp});
            }
            
        }
    // myPosition = {};
    // To many states to handle at the same time?
    populateDungeon(map){
        var array = this.state.elements.slice();
        var occupied = [], current = 0, tmp = {};
        var elem = {
            0: [false, true, false, false, false, false, true], //player
            1: [false, false, true, false, false, false, true], //monster
            2: [false, false, false, true, false, false, false], //items
            3: [false, false, false, false, true, false, false], //weapons
            4: [false, false, false, false, false, true, true]  //boss
        };

        for(var i = 0; i < array.length; i++){
            current = array[i];
            while(current > 0){
                tmp = this.getRandomPos(map);
                if(!occupied.includes(tmp)){
                    occupied.push(tmp);
                    map[tmp.posY][tmp.posX] = elem[i];
                    if(i === 0) this.setState({playerPosition: tmp});
                    current--;
                }
            }
        }
        this.createEntities(occupied);
    }
    // Create bindings/tunnels to each room
    createRoad(map, position1, position2){
        var x1 = position1.x, x2 = position2.x;
        var y1 = position1.y, y2 = position2.y;

        while(x1 !== x2){
            map[position1.y][x1] = [false, false, false, false, false, false, false];
            x1 = x1 < x2 ? x1 + 1 : x1 - 1;
        }

        while(y1 !== y2){
            map[y1][position2.x] = [false, false, false, false, false, false, false];
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

    updateMap = (position, state) => {
        var tmp = this.state.dungeon;
        tmp[this.state.playerPosition.posY][this.state.playerPosition.posX] = [false, false, false, false, false, false, false];
        tmp[position.posY][position.posX] = state;
        this.setState({dungeon: tmp, playerPosition: position});
    }

    entitiesInteraction = (entity) => {
        //    wall, player, monster, items, weapon, boss occupied
        // 1: [false, false, true, false, false, false, true],
        // 2: [false, false, false, true, false, false, true],
        // 3: [false, false, false, false, true, false, true],
        // 4: [false, false, false, false, false, true, true]
        // console.log("monster " + this.state.monsters[0].position);
        // console.log("items " + this.state.items[0].position);
        // console.log("weapon " + this.state.weapons[0].position.posY);
        // console.log("boss " + this.state.boss.hp + this.state.boss.lvl + this.state.boss.attack);

        var tmp = [], map = this.state.dungeon;
        if(this.state.dungeon[entity.posY][entity.posX][2]){
            
            tmp = this.state.monsters[this.state.monsters.length-1];
            tmp.hp -= this.state.weapon;
            this.setState({health: this.state.health - tmp.lvl});
            // dead monster
            if(tmp.hp <= 0){
                this.state.monsters.pop();
                this.updateMap(entity, [false, true, false, false, false, false, true]);
            }
        } else if(this.state.dungeon[entity.posY][entity.posX][3]){
            tmp = this.state.items.pop();
            this.setState({health: this.state.health + tmp.heal});
        } else if(this.state.dungeon[entity.posY][entity.posX][4]){
            tmp = this.state.weapons.pop();
            this.setState({weapon: this.state.weapon + tmp.attack});
            // console.log("weapon");
        } else if(this.state.dungeon[entity.posY][entity.posX][5]){
            console.log("boss");
        }

        if(this.state.health <= 0){
            this.resetMap(false);
        }
    }
// Movement and interaction
    press = (event) => {
        event.preventDefault();
        // console.log(this.state.playerPosition);
        var key = event.which;
        var move = null;
        if(key === 37){
            // console.log("left");
            move = {posY: this.state.playerPosition.posY, posX: this.state.playerPosition.posX-1};
        } else if(key === 38){
            // console.log("up");
            move = {posY: this.state.playerPosition.posY-1, posX: this.state.playerPosition.posX};
        } else if(key === 39){
            move = {posY: this.state.playerPosition.posY, posX: this.state.playerPosition.posX+1};
            // console.log("right");
        } else if(key === 40){
            // console.log("down");
            move = {posY: this.state.playerPosition.posY+1, posX: this.state.playerPosition.posX};
        }

        if(move){
            // console.log(move);
            // test whether the new cell is occupied
            // console.log(this.state.dungeon[move.y][move.x]);
            if(!this.state.dungeon[move.posY][move.posX][0]){
                // console.log("free willy");
                this.entitiesInteraction(move);
                if(!this.state.dungeon[move.posY][move.posX][6]){
                    this.updateMap(move, [false, true, false, false, false, false, true]);
                }
                // this.state.dungeon[move.y][move.x] = [false, true, false, false, false, false, true]
            }
        }
    }

    change = (event) => {
        console.log("Hello");
    }
    render(){
        // var dungeon = this.state.dungeon;
        return (
            <div className="main" onKeyDown={this.press} tabIndex="0">
                <div className="statuses">
                    Health: {this.state.health} Level: {this.state.level} Weapon: {this.state.weapon} Dungeon: {this.state.lvlDungeon}
                </div>
                <div className="gameWindow">
                    <div className="game">
                        {
                           this.state.dungeon.map((value, index) => (
                                this.state.dungeon[index].map((value, inx) => (
                                    <Cell key={index + "," + inx} x={index} y={inx} id={"x: " +index + " y: " + inx} arr={value} onClick={this.change}/>
                                ), this)
                            ), this)
                        }
                        {/* {dungeon} */}
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Main />, document.getElementById('root'));
