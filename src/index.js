import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
// import { Monster, Items, Weapons, Player, Boss, Wall, Road, Cell } from "./scripts/entities";
import { Cell } from "./scripts/entities";

// Game Configurations
var gRooms = 10;
// var fog = true;
var yLength = 60, xLength = 100;
var totalEntities = {
    "red": 1,      //player
    "green": 5,    //monsters
    "purple": 3,       //items
    "yellow": 1,     //weapons
    "blue": 1         //boss
};


// Dungeon and player informaiton
var expcap = 10, playerPosition = 0;
var health = 50, level = 1, exp = 0, weapon = 5, dungeon = 1;

// Should optimize the program, takes too much CPU resources
class Main extends React.Component {

    resetMap = (bool) => {
        if (this.state.lvlDungeon === 20) {
            this.setState(this.Initialstate, function validate() {
                this.setState({ dungeon: this.createMap(10) }, this.showMessage(true, true));
            });
        } else
            if (bool) {
                // Won
                var hp = this.state.health, lvl = this.state.level, xp = this.state.exp, ecap = this.state.expcap, wp = this.state.weapon, dlvl = this.state.lvlDungeon;
                this.setState(this.Initialstate, function validate() {
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
                this.setState(this.Initialstate, function validate() {
                    this.setState({ dungeon: this.createMap(10) }, this.showMessage(false, false));
                });
            }
    }

    showMessage = (bool, won) => {
        if (bool && won) {
            console.log("Won the game");
        } else if (bool) {
            console.log("Won dungeon");
            gRooms++;
        } else {
            console.log("Dead");
            gRooms = 10;
        }
    }

    componentDidMount(){
        // this.updateFog(playerPosition);
        this.createMap(gRooms);
    }

    // Creating rooms
    createRoom(position, sizeX, sizeY, available) {
        // this.refs[xLength * (position.row) + (position.column)].setEntity("white");
        for (var x = 0; x <= sizeX; x++) {
            for (var y = 0; y <= sizeY; y++) {
                this.refs[xLength * (position.row + x) + (position.column + y)].setEntity("white");
                available.push(xLength * (position.row + x) + (position.column + y));
            }
        }
    }

    
    // createEntities = () => {
    //     var array = this.state.elements.slice();
    //     var current = 0;
    //     for (var i = 1; i < array.length; i++) {
    //         var tmp = [];
    //         current = array[i];
    //         // console.log(current);
    //         while (current > 0) {
    //             // if(i === 1) tmp.push({hp: Math.floor(Math.random() * (10 * this.state.lvlDungeon) + 5), lvl: Math.floor(Math.random() * (10 * this.state.lvlDungeon) + 1), position: arr.pop()});
    //             // else if(i === 2) tmp.push({heal: Math.floor(Math.random() * 20 + 10), position: arr.pop()});
    //             // else if(i === 3) tmp.push({attack: Math.floor(Math.random() * (10 * this.state.lvlDungeon) + 5), position: arr.pop()});
    //             // else arr.pop();
    //             if (i === 1) tmp.push({ hp: Math.floor(Math.random() * (10 * this.state.lvlDungeon) + 5), lvl: Math.floor(Math.random() * (10 * this.state.lvlDungeon) + 1) });
    //             else if (i === 2) tmp.push({ heal: Math.floor(Math.random() * 20 + 10) });
    //             else if (i === 3) tmp.push({ attack: Math.floor(Math.random() * (10 * this.state.lvlDungeon) + 5) });
    //             else if (i === 4) this.setState({ boss: { hp: 2 * this.state.lvlDungeon, lvl: this.state.lvlDungeon, attack: 2 * this.state.lvlDungeon } })
    //             current--;
    //         }
    //         if (i === 1) this.setState({ monsters: tmp });
    //         if (i === 2) this.setState({ items: tmp });
    //         if (i === 3) this.setState({ weapons: tmp });
    //     }

    // }
    
    // Get a random vacant location on the map
    getRandomPos(available) {
        return available.splice(Math.floor(Math.random() * available.length), 1);
    }


    // To many states to handle at the same time?
    populateDungeon(available) {
        // var array = this.state.elements.slice();
        var occupied = [], current = 0, tmp = {};

        var keys = Object.keys(totalEntities);
        console.log(keys.length);

        for(var i = 0; i < keys.length; i++){
            // console.log(keys[i]);
            for(var y = 0; y < totalEntities[keys[i]]; y++){
                var pos =  available.splice(Math.floor(Math.random() * available.length), 1);
                // this.refs[currentPos].setEntity(keys[i]);
                // occupied.push(current);
                if(keys[i] === "red"){
                    this.refs[pos].setEntity(keys[i], 0, 0);             //player
                    this.refs[pos].fog();
                    playerPosition = pos;
                    
                }
                else if(keys[i] === "green") this.refs[pos].setEntity(keys[i], Math.floor(Math.random() * dungeon + 5),  Math.floor(Math.random() * dungeon + 5));      //monsters
                else if(keys[i] === "blue") this.refs[pos].setEntity(keys[i], Math.floor(Math.random() * dungeon + 20),  Math.floor(Math.random() * dungeon + 10));       //boss
                else if(keys[i] === "yellow") this.refs[pos].setEntity(keys[i], 0, Math.floor(Math.random() * dungeon + 3));     //weapons
                else if(keys[i] === "purple") this.refs[pos].setEntity(keys[i], Math.floor(Math.random() * dungeon + 20), 0);     //items
            }
        }
       
        // for(var p = 0; p < 6000; p++){
        //     if(this.refs[p].getVacancy() === "white") console.log("white");
        
        // }

        // console.log("Hello");
        // for (var i = 0; i < array.length; i++) {
        //     current = array[i];
        //     while (current > 0) {
        //         tmp = this.getRandomPos();
        //         if (!occupied.includes(tmp)) {
        //             occupied.push(tmp);
        //             map[tmp.posY][tmp.posX] = elem[i];
        //             if (i === 0) this.setState({ playerPosition: tmp }, function () { this.updateFog(this.state.playerPosition); });
        //             current--;
        //         }
        //     }
        // }
        // this.createEntities(occupied);
    }

    // Create bindings/tunnels to each room
    createRoad(room1, room2, available) {
        var x1 = room1.column, x2 = room2.column;
        var y1 = room1.row, y2 = room2.row;
        while (x1 !== x2) {
            this.refs[xLength * room1.row + x1].setEntity("white");
            available.push(xLength * room1.row + x1);
            x1 = x1 < x2 ? x1 + 1 : x1 - 1;
        }

        while (y1 !== y2) {
            this.refs[xLength * y1 + room2.column].setEntity("white");
            available.push(xLength * y1 + room2.column);
            y1 = y1 < y2 ? y1 + 1 : y1 - 1;
        }
    }

    // Create rooms
    createMap(rooms) {
        let positionsArray = [], loop = rooms;
        var available = [];

        while (loop--) {
            let sizeX = Math.floor(Math.random() * 12 + 1), sizeY = Math.floor(Math.random() * 12 + 1);
            let position = { column: Math.floor(Math.random() * (xLength - 15) + 2), row: Math.floor(Math.random() * (yLength - 15) + 2) }; // dont start around corners
            positionsArray.push(position);
            this.createRoom(position, sizeX, sizeY, available);
        }
        while (rooms-- !== 1) this.createRoad(positionsArray[rooms], positionsArray[rooms - 1], available);
        // console.log("Hello 1");
        // this.updateFog(this.state.playerPosition);
        // return map;
        this.populateDungeon(available);
        // return map;
    };

    // update the area revealed
    updateFog = (position) => {
        this.refs[position-1].fog();
        this.refs[position-1].fog();
        this.refs[position-xLength].fog();
        this.refs[position+xLength].fog();

        // this.setState({ dungeon: tmp });
    }

    // Move the player around and update the entity we collide with
    updateMap = (position, state) => {
        var tmp = this.state.dungeon;
        var player = this.state.playerPosition;
        tmp[player.posY][player.posX] = [false, false, false, false, false, false, false, this.state.fog];
        tmp[position.posY][position.posX] = state;

        this.setState({ dungeon: tmp, playerPosition: position }, function () { this.updateFog(this.state.playerPosition); });
    }

    // Interarctions of entities
    entitiesInteraction = (entity) => {
        var tmp = [], map = this.state.dungeon;
        var type = this.refs[entity].checkEntity();
        if(type === "green"){
            console.log("monster");
            // return;
            // dead monster
            if(tmp.hp <= 0){
                this.state.monsters.pop();
                this.setState({ exp: this.state.exp + tmp.lvl * Math.floor(Math.random() * 2 + 1) });
                if (this.state.exp >= this.state.expcap) this.setState({ health: this.state.health + 10 * this.state.level, weapon: this.state.weapon + this.state.level, level: this.state.level + 1, exp: this.state.exp - this.state.expcap, expcap: this.state.expcap + this.state.lvlDungeon });
                this.updateMap(entity, [false, true, false, false, false, false, true]);
            }
        } else if(type === "green"){
            tmp = this.state.items.pop();
            this.setState({ health: this.state.health + tmp.heal });
        } else if(type === "green"){
            tmp = this.state.weapons.pop();
            this.setState({ weapon: this.state.weapon + tmp.attack });
        } else if(type === "green"){
            console.log("boss");
            tmp = this.state.boss;
            tmp.hp -= this.state.weapon;
            this.setState({ health: this.state.health - tmp.lvl * tmp.attack });
            // dead monster
            if (tmp.hp <= 0) {
                this.setState({ exp: this.state.exp + tmp.lvl * Math.floor(Math.random() * 5 + 5) });
                if (this.state.exp >= this.state.expcap) this.setState({ health: this.state.health + 10 * this.state.level, weapon: this.state.weapon + this.state.level, level: this.state.level + 1, exp: this.state.exp - this.state.expcap, expcap: this.state.expcap + this.state.lvlDungeon },
                    function () {
                        // this.updateMap(entity, [false, true, false, false, false, false, true]);
                        if (this.state.health > 0) {
                            this.resetMap(true);
                        }
                    }
                );
            }
        }

        if (health <= 0) {
            this.resetMap(false);
        }
    }
    // Movement and interaction
    press = (event) => {
        event.preventDefault();
        // console.log(this.state.playerPosition);
        var key = event.which;
        var move = null;
        if (key === 37) {
            // console.log("left");
            move = playerPosition-1;
        } else if (key === 38) {
            // console.log("up");
            move = playerPosition-xLength;
        } else if (key === 39) {
            move = playerPosition + 1;
            // console.log("right");
        } else if (key === 40) {
            // console.log("down");
            move = playerPosition+xLength;
        }

        
        if(move && move < 6000){
            // console.log(this.refs[move].checkEntity);
            if(this.refs[move].checkEntity() !== "grey"){
                // this.entitiesInteraction(move);
                this.refs[move].setEntity("red");
                this.refs[playerPosition].setEntity("white");
                
                playerPosition = move;
                // this.updateFog(playerPosition);
            }
            
        }
        // this.setState({playerPosition: this.state.playerPosition-1});
        // if (move) {
        //     console.log(move);
        //     // test whether the new cell is occupied
        //     // console.log(this.state.dungeon[move.y][move.x]);
        //     if (!this.state.dungeon[move.posY][move.posX][0]) {
        //         // console.log("free willy");
        //         this.entitiesInteraction(move);
        //         if (!this.state.dungeon[move.posY][move.posX][6]) {
        //             this.updateMap(move, [false, true, false, false, false, false, true]);
        //         }
        //         // this.state.dungeon[move.y][move.x] = [false, true, false, false, false, false, true]
        //     }
        // }
    }


    change = (event) => {
        // fog = !fog;

        var len = 100 * 60;
        // while(len--) tmp[len] = len == 90 ? <Wall key={len} f={!this.state.fogs[len]} /> : <Wall key={len} f={this.state.fogs[len]} />;  
        // tmp[90] = <Wall f={false} />;
        // tmp[100] = <Wall f={false} />;
        // tmp[90].props.f = false;
        while (len--) this.refs[len].fog();
        // this.cell.fog();
        // console.log(this.refs.c0.fog());
        console.log(this.refs[0]);
    }

    render() {
        var cells = [], length = xLength * yLength;
        // console.log(length);
        while (length--) cells[length] = <Cell ref={length} key={length} />;
        // this.createMap(gRooms);
        // this.setState({refArray: cells});
        return (
            <div className="main" onKeyDown={this.press} tabIndex="0">
                <div className="statuses">
                    Health: {health} Level: {level} EXP: {exp} Weapon: {weapon} Dungeon: {dungeon} <button onClick={this.change}>Toggle Darkness</button>
                </div>
                <div className="gameWindow">

                    <div className="game">
                        {cells}
                        {/* <Monster />
                        <Items />
                        <Weapons />
                        <Player />
                        <Boss />
                        <Wall /> */}
                        {/* {
                           this.state.dungeon.map((value, index) => (
                                this.state.dungeon[index].map((value, inx) => (
                                        <Cell key={index + "," + inx} x={index} y={inx} id={"x: " +index + " y: " + inx} arr={value}/>
                                ), this)
                            ), this)
                        } */}
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Main />, document.getElementById('root'));

