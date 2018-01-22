import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
// import { Monster, Items, Weapons, Player, Boss, Wall, Road, Cell } from "./scripts/entities";
import { Cell } from "./scripts/entities";


// Game Configurations
var gRooms = 10, cells = [];
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
var health = 50, level = 1, exp = 0, weapon = 2, dungeon = 1;

// Should optimize the program, takes too much CPU resources
class Main extends React.Component {
    constructor(props){
        super(props);
        this.state = this.Initialstate;
    }

    get Initialstate(){
        return {dungeon: []};
    }

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
                if(keys[i] === "red"){
                    this.refs[pos].setEntity(keys[i], 0, 0);             //player
                    this.refs[pos].fog();
                    playerPosition = pos;
                    
                }
                else if(keys[i] === "green") this.refs[pos].setEntity(keys[i], Math.floor(Math.random() * dungeon + 5),  Math.floor(Math.random() * dungeon + 5));      //monsters
                else if(keys[i] === "blue") this.refs[pos].setEntity(keys[i], Math.floor(Math.random() * dungeon + 10),  Math.floor(Math.random() * dungeon + 10));       //boss
                else if(keys[i] === "yellow") this.refs[pos].setEntity(keys[i], 0, Math.floor(Math.random() * dungeon + 3));     //weapons
                else if(keys[i] === "purple") this.refs[pos].setEntity(keys[i], Math.floor(Math.random() * dungeon + 20), 0);     //items
            }
        }
       
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
        this.populateDungeon(available);
    };

    // update the area revealed
    updateFog(move){
        var position = parseInt(move, 10);
        
        for(var i = -2; i < 3; i++){
            this.refs[position-2*xLength+i].fog();
            this.refs[position-xLength+i].fog();
            this.refs[position-i].fog();
            this.refs[position+xLength+i].fog();
            this.refs[position+2*xLength+i].fog();
        }
        playerPosition = position;
    }

    updateStats(){
        document.getElementById("hp").innerHTML = health;
        document.getElementById("wp").innerHTML = weapon;
        document.getElementById("xp").innerHTML = exp;
        document.getElementById("lvl").innerHTML = level;
        document.getElementById("dng").innerHTML = dungeon;
    }
    // Interarctions of entities
    entitiesInteraction = (entity) => {
        var type = this.refs[entity].checkEntity(), entityStats = this.refs[entity].getStats();
        var hp = 0, att = 0;
        if(type === "green" || type === "blue"){ //monster
            hp = entityStats.hp - weapon;
            health -= entityStats.att;
            this.refs[entity].setEntity(type, hp, entityStats.att);

            document.getElementById("hp").innerHTML = health;
            if(hp <= 0){
                console.log("Dead");
                exp += entityStats.att;

                if(expcap <= exp){   // level up
                    exp = exp - expcap, health += 50, weapon += 5, level++, expcap += 5*dungeon;
                    this.updateStats();
                }
                document.getElementById("xp").innerHTML = exp;

                if(type === "blue"){
                    dungeon++;
                    this.reset();
                }

                return true;
            }
            
        } else if(type === "purple"){ //items
            health += entityStats.hp;
            document.getElementById("hp").innerHTML = health;
            return true;
        } else if(type === "yellow"){ //weapons
            weapon += entityStats.att;
            document.getElementById("wp").innerHTML = weapon;
            return true;
        }
       
        if (health <= 0) {
            console.log("resetmap");
            // this.resetMap(false);
        }
        return false;
    }
    // Movement and interaction
    press = (event) => {
        event.preventDefault();
        var position = parseInt(playerPosition, 10);
        // console.log(React.Children.count(this.props.children));
        var key = event.which;
        var move = null;
        if (key === 37) {
            // console.log("left");
            move = position-1;
        } else if (key === 38) {
            // console.log("up");
            move = position-xLength;
        } else if (key === 39) {
            move = position + 1;
            // console.log("right");
        } else if (key === 40) {
            // console.log("down");
            move = position+xLength;
        }

        // console.log(document.getElementById("hp").innerHTML);
        if(move){
            // console.log(this.refs[move].checkEntity);
            if(this.refs[move].checkEntity() !== "grey"){
                if(this.entitiesInteraction(move) || this.refs[move].checkEntity() === "white"){

                    this.refs[move].setEntity("red");
                    this.refs[playerPosition].setEntity("white");

                    this.updateFog(move);
                }
            }
        }
    }


    change = (event) => {
        var len = 100 * 60;
        while (len--) this.refs[len].fog();
    }

    renderCreate(length){
    }

    componentDidMount(){
        // this.setState({dungeon: cells});
        this.forceUpdate();
        // console.log(this.refs);
    }

    componentDidUpdate(){
        console.log("updated");
        this.createMap(gRooms);
        // console.log(playerPosition);
        // console.log(playerPosition+1);
        // console.log(this.refs[playerPosition+1]);
        // console.log(this.refs[playerPosition+1].fog());
        this.updateFog(playerPosition);
    }



    reset=()=>{
        var length = xLength*yLength;
        while (length--) this.refs[length].reset();
        // cells = [];
        // document.getElementById("gameCells").innerHTML =  "";

        this.forceUpdate();
        // cells = [];
        // this.unmountMe();
        // this.render();
        
        // var length = xLength*yLength;
        // while (length--) cells[length] = <Cell ref={length} key={length} />;
        // this.setState(this.Initialstate);
    }

    render() {
        var length = xLength*yLength;
        // console.log(length);
        while (length--) cells[length] = <Cell ref={length} key={length} />;
        // this.setState({dungeon: cells});
        return (
            <div className="main" onKeyDown={this.press} tabIndex="0">
                <div className="statuses" ref="stats">
                    <button onClick={this.reset}>Reset</button> Health: <span id="hp">{health}</span> Level: <span id="lvl">{level}</span> EXP: <span id="xp">{exp}</span> Weapon: <span id="wp">{weapon}</span> Dungeon: <span id="dng">{dungeon}</span> <button onClick={this.change}>Toggle Darkness</button>
                </div>
                <div className="gameWindow">

                    <div id="gameCells" className="game">
                        {cells}
                        {/* {this.state.dungeon} */}
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Main />, document.getElementById('root'));

