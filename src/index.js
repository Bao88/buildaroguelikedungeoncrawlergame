import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import { Cell } from "./scripts/entities";

// Game Configurations
var gRooms = 10, cells = [], fog = false;
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
    // Creating rooms
    createRoom(position, sizeX, sizeY, available) {
        for (var x = 0; x <= sizeX; x++) {
            for (var y = 0; y <= sizeY; y++) {
                this.refs[xLength * (position.row + x) + (position.column + y)].setEntity("white");
                available.push(xLength * (position.row + x) + (position.column + y));
            }
        }
    }

    populateDungeon(available) {
        var keys = Object.keys(totalEntities);

        for(var i = 0; i < keys.length; i++){
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
            let position = { column: Math.floor(Math.random() * (xLength - 15) + 2), row: Math.floor(Math.random() * (yLength - 15) + 2) }; // dont start around corners nor edges
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

    // Cheating, not the react way
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
                } else return true;
                
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
            expcap = 10, health = 50, level = 1, exp = 0, weapon = 2, dungeon = 1;
            this.reset();
            alert("You died!, start at the beginning peasant!");
        }
        return false;
    }
    // Movement and interaction
    press = (event) => {
        event.preventDefault();
        var position = parseInt(playerPosition, 10);

        var key = event.which;
        var move = null;
        if (key === 37) move = position-1;
        else if (key === 38) move = position-xLength;
        else if (key === 39) move = position + 1;
        else if (key === 40) move = position+xLength;
        
        if(move){
            if(this.refs[move].checkEntity() !== "grey"){
                if(this.entitiesInteraction(move) || this.refs[move].checkEntity() === "white"){
                    this.refs[move].setEntity("red");
                    this.refs[playerPosition].setEntity("white");
                    this.updateFog(move);
                }
            }
        }
    }

    toggleFogofWar = () => {
        var len = xLength * yLength;
        while (len--) this.refs[len].fog(fog);
        fog = !fog;
        this.updateFog(playerPosition);
    }

    componentDidMount(){
        this.forceUpdate();
        this.refs.gamefocus.focus();
    }

    componentDidUpdate(){
        this.createMap(gRooms);
        this.updateFog(playerPosition);
    }

    reset=()=>{
        var length = xLength*yLength;
        while (length--) this.refs[length].reset();
        this.forceUpdate();
    }

    render() {
        var length = xLength*yLength;
        while (length--) cells[length] = <Cell ref={length} key={length} />;
        return (
            <div className="main" onKeyDown={this.press} tabIndex="0" ref="gamefocus">
                <div className="statuses" ref="stats">
                    <button onClick={this.reset}>Reset</button> Health: <span id="hp">{health}</span> Level: <span id="lvl">{level}</span> EXP: <span id="xp">{exp}</span> Weapon: <span id="wp">{weapon}</span> Dungeon: <span id="dng">{dungeon}</span> <button onClick={this.toggleFogofWar}>Toggle Fog Of War</button>
                </div>
                <div className="gameWindow">

                    <div id="gameCells" className="game">
                        {cells}
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Main />, document.getElementById('root'));

