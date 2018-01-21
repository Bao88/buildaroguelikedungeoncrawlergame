import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';

    class Fog extends React.Component {
        render() {
            // console.log("Render");
            return (
                <div className="fog" style={{zIndex: 1}}></div>
            );
        }
    }
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
            occupied: false,
            fog: this.props.arr[7]
        };
    }

    change = (event) => {
        this.setState({wall: !this.state.wall});
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return this.state.wall != nextState.wall;
    // }

render() {
        return (
            <div id={this.props.id} onClick={this.change} className="cell" style={{backgroundColor: this.state.fog ? "black" : this.props.arr[0] ? "grey" : (this.props.arr[1] ? "red": (this.props.arr[2] ? "green": (this.props.arr[3] ? "purple": (this.props.arr[4] ? "yellow" : (this.props.arr[5] ? "blue":"white")))))}}>

            </div>
        )
    };
}

var gRooms = 10;
var fog = false;
// Should optimize the program, takes too much CPU resources
class Main extends React.Component {
    constructor(props){
        super(props);

        this.state = this.Initialstate;

    }

    get Initialstate() {
        var cells = [], cell = [], xLen = 100, yLen = 60;
        // var fogs = [], fog = [];
        while(yLen--){
            while(xLen--){
                cell[xLen] = [true, false, false, false, false, false, true, fog];
                // fog[xLen] = false;
            }
            cells[yLen] = cell.slice();
            // fogs[yLen] = fog.slice();
            xLen = 100;
        }

        return {
            health: 100,
            level: 1,
            weapon: 5,
            exp: 0,
            expcap: 10,
            board: cells,
            emptyBoard: cells.slice(),
            dungeon: cells.slice(),
            // fogofwar: fogs.slice(),
            elements: [1, 5, 5, 1, 1],
            x: 100,
            y: 60,
            playerPosition: {x: 0, y: 0},
            monsters: [],
            items: [],
            weapons: [],
            boss: {hp: 100, lvl: 1, attack: 5},
            lvlDungeon: 1,
            tfog: fog
        };
    }

    resetMap = (bool) => {
        if(this.state.lvlDungeon === 20){
            this.setState(this.Initialstate, function validate(){
                this.setState({dungeon: this.createMap(10)}, this.showMessage(true, true));
            });
        } else
        if(bool){
            // Won
            var hp = this.state.health, lvl = this.state.level, xp = this.state.exp, ecap = this.state.expcap, wp = this.state.weapon, dlvl = this.state.lvlDungeon;
            this.setState(this.Initialstate, function validate(){
                this.setState({
                    dungeon: this.createMap(gRooms++),
                    health: hp,
                    level: lvl,
                    exp: xp,
                    expcap: ecap,
                    weapon: wp,
                    lvlDungeon: dlvl + 1
                });
            });
            this.showMessage(true, false);
        } else {
            // Dead, Dark souls difficulty, you start at dungeon level 1 again peasant!
            // var hp = this.state.health, lvl = this.state.level, wp = this.state.weapon, dlvl = this.state.lvlDungeon;
            this.setState(this.Initialstate, function validate(){
                this.setState({dungeon: this.createMap(10)}, this.showMessage(false, false));
            });
        }
    }

    showMessage = (bool, won) => {
        if(bool && won){
            console.log("Won the game");
        } else if(bool){
            console.log("Won dungeon");
            gRooms++;
        } else {
            console.log("Dead");
            gRooms = 10;
        }
    }

    componentDidMount = () => {
        this.setState({dungeon: this.createMap(gRooms++)});

    }
    createRoom(map, position, sizeX, sizeY){
        map[position.y][position.x] = [false, false, false, false, false, false, false, this.state.tfog];

        for(var x = 0; x <= sizeX; x++){
            map[position.y][position.x+x] = [false, false, false, false, false, false, false, this.state.tfog];
            for(var y = 0; y <= sizeY; y++){
                map[position.y+y][position.x+x] = [false, false, false, false, false, false, false, this.state.tfog];
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
            for(var i = 1; i < array.length; i++){
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
                    else if(i === 4) this.setState({boss: {hp: 2*this.state.lvlDungeon, lvl: this.state.lvlDungeon, attack: 2*this.state.lvlDungeon}})
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
            0: [false, true, false, false, false, false, true, false], //player
            1: [false, false, true, false, false, false, true, this.state.tfog], //monster
            2: [false, false, false, true, false, false, false, this.state.tfog], //items
            3: [false, false, false, false, true, false, false, this.state.tfog], //weapons
            4: [false, false, false, false, false, true, true, this.state.tfog]  //boss
        };

        for(var i = 0; i < array.length; i++){
            current = array[i];
            while(current > 0){
                tmp = this.getRandomPos(map);
                if(!occupied.includes(tmp)){
                    occupied.push(tmp);
                    map[tmp.posY][tmp.posX] = elem[i];
                    if(i === 0) this.setState({playerPosition: tmp}, function(){this.updateFog(this.state.playerPosition);});
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
            map[position1.y][x1] = [false, false, false, false, false, false, false, this.state.tfog];
            x1 = x1 < x2 ? x1 + 1 : x1 - 1;
        }

        while(y1 !== y2){
            map[y1][position2.x] = [false, false, false, false, false, false, false, this.state.tfog];
            y1 = y1 < y2 ? y1 + 1 : y1 - 1;
        }
    }

    // Create rooms
    createMap(rooms) {
        let map = this.state.emptyBoard.slice();
        let positionsArray = [], loop = rooms;

        while(loop--){
            let sizeX = Math.floor(Math.random() * 15 + 1), sizeY = Math.floor(Math.random() * 15 + 1);
            let position = {x: Math.floor(Math.random() * 84 + 2), y: Math.floor(Math.random() * 43 + 2)}; // dont start around corners
            positionsArray.push(position);
            this.createRoom(map, position, sizeX, sizeY);
        }
        while(rooms-- !== 1) this.createRoad(map, positionsArray[rooms], positionsArray[rooms-1]);
        this.populateDungeon(map);
        // this.updateFog(this.state.playerPosition);
        return map;
    };

    // update the area revealed
    updateFog = (position) => {
        var tmp = this.state.dungeon;
        // // console.log(position);
        // // console.log(position);
        tmp[position.posY-2][position.posX][7] = false;
        tmp[position.posY-1][position.posX][7] = false;
        tmp[position.posY+1][position.posX][7] = false;
        tmp[position.posY+2][position.posX][7] = false;
        tmp[position.posY][position.posX-1][7] = false;
        tmp[position.posY][position.posX+1][7] = false;
        tmp[position.posY][position.posX-2][7] = false;
        tmp[position.posY][position.posX+2][7] = false;
        tmp[position.posY-1][position.posX-1][7] = false;
        tmp[position.posY-1][position.posX+1][7] = false;
        tmp[position.posY+1][position.posX+1][7] = false;
        tmp[position.posY+1][position.posX-1][7] = false;

        this.setState({dungeon: tmp});
    }

    // Move the player around and update the entity we collide with
    updateMap = (position, state) => {
        var tmp = this.state.dungeon;
        var player = this.state.playerPosition;
        tmp[player.posY][player.posX] = [false, false, false, false, false, false, false, this.state.fog];
        tmp[position.posY][position.posX] = state;
        
        this.setState({dungeon: tmp, playerPosition: position}, function(){this.updateFog(this.state.playerPosition);});
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
                this.setState({exp: this.state.exp + tmp.lvl * Math.floor(Math.random()*2 + 1)});
                if(this.state.exp >= this.state.expcap) this.setState({health: this.state.health + 10*this.state.level, weapon: this.state.weapon + this.state.level, level: this.state.level+1, exp: this.state.exp-this.state.expcap, expcap: this.state.expcap + this.state.lvlDungeon});
                this.updateMap(entity, [false, true, false, false, false, false, true]);
            }
        } else if(this.state.dungeon[entity.posY][entity.posX][3]){
            tmp = this.state.items.pop();
            this.setState({health: this.state.health + tmp.heal});
        } else if(this.state.dungeon[entity.posY][entity.posX][4]){
            tmp = this.state.weapons.pop();
            this.setState({weapon: this.state.weapon + tmp.attack});
        } else if(this.state.dungeon[entity.posY][entity.posX][5]){
            console.log("boss");
            tmp = this.state.boss;
            tmp.hp -= this.state.weapon;
            this.setState({health: this.state.health - tmp.lvl*tmp.attack});
            // dead monster
            if(tmp.hp <= 0){
                this.setState({exp: this.state.exp + tmp.lvl * Math.floor(Math.random()*5 + 5)});
                if(this.state.exp >= this.state.expcap) this.setState({health: this.state.health + 10*this.state.level, weapon: this.state.weapon + this.state.level, level: this.state.level+1, exp: this.state.exp-this.state.expcap, expcap: this.state.expcap + this.state.lvlDungeon},
                    function(){
                        // this.updateMap(entity, [false, true, false, false, false, false, true]);
                        if(this.state.health > 0){
                            this.resetMap(true);
                        }
                    }
                );
            }
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
        fog = !fog;
        var tmp = this.state.dungeon;
        for(var x = 0; x < tmp.length; x++){
            for(var y = 0; y < tmp[x].length; y++){
                tmp[x][y][7] = !fog;
            }
        }
        this.setState({dungeon: tmp}, function() {this.updateFog(this.state.playerPosition);});
    }
    render(){
        return (
            <div className="main" onKeyDown={this.press} tabIndex="0">
                <div className="statuses">
                    Health: {this.state.health} Level: {this.state.level} EXP: {this.state.exp} Weapon: {this.state.weapon} Dungeon: {this.state.lvlDungeon} <button onClick={this.change}>Toggle Darkness</button>
                </div>
                <div className="gameWindow">
                        
                    <div className="game">
                        {
                           this.state.dungeon.map((value, index) => (
                                this.state.dungeon[index].map((value, inx) => (
                                        <Cell key={index + "," + inx} x={index} y={inx} id={"x: " +index + " y: " + inx} arr={value}/>
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
