import React from "react";

export class Cell extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            entity: "grey",
            health: null,
            attack: null,
            exp: null,
            fog: true
        };
    }

    getVacancy(){
        return this.state.entity;
    }

    checkEntity() {
        return this.state.entity;
    }

    setEntity(type, hp, att) {
        this.setState({entity: type, health: hp, attack: att});
    }

    fog() {
        if(this.state.entity === "red");
        else if(this.state.fog) this.setState({ fog: !this.state.fog });
    }

    shouldComponentUpdate(prevProps, prevState){
        return prevState !== this.state.fog;
    }

    componentDidUpdate(){
        // console.log("Updated");
    }

    render() {
        return (
            <div id={this.props.id} className="cell" style={{ backgroundColor: this.state.fog ? "black" : this.state.entity }}>

            </div>
        )
    };
}

export class Monster extends React.Component {
    state = {
        fog: false
    };

    shouldComponentUpdate(nextProps, nextState){
        return this.state.fog !== nextState.fog;
    }

    render(){
        return (
            <div className="cell" style={{backgroundColor: this.state.fog ? "black" : "blue"}}></div>
        )
    }
}

export class Items extends React.Component {
 state = {
        fog: false
    };

    shouldComponentUpdate(nextProps, nextState){
        return this.state.fog !== nextState.fog;
    }

    render(){
        return (
            <div className="cell" style={{backgroundColor: this.state.fog ? "black" : "Green"}}></div>
        )
    }
}

export class Weapons extends React.Component {
    state = {
        fog: false
    };

    shouldComponentUpdate(nextProps, nextState){
        return this.state.fog !== nextState.fog;
    }

    render(){
        return (
            <div className="cell" style={{backgroundColor: this.state.fog ? "black" : "yellow"}}></div>
        )
    }
}

export class Boss extends React.Component {

 state = {
        fog: false
    };

    shouldComponentUpdate(nextProps, nextState){
        return this.state.fog !== nextState.fog;
    }

    render(){
        return (
            <div className="cell" style={{backgroundColor: this.state.fog ? "black" : "purple"}}></div>
        )
    }
}

export class Player extends React.Component {


    // shouldComponentUpdate(nextProps, nextState){
    //     return this.state.fog !== nextState.fog;
    // }

    render(){
        return (
            <div className="cell" style={{backgroundColor: "red"}}></div>
        )
    }
}

export class Wall extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            fog: props.f
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        // console.log(nextProps);
        
        // console.log(nextState);
        return this.state.fog !== nextProps;
    }

    componentDidUpdate(prevProps, prevState){
        // console.log(prevProps);
        
        // console.log(prevState);
        // console.log("Updated");
    }

    hello = () => {
        console.log("Hello from outer space");
    }

    fog = () => {
        this.setState({fog: !this.state.fog});
    }

    render(){
        return (
            <div className="cell" ref={this.props.reference} style={{backgroundColor: this.state.fog ? "black" : "grey"}}></div>
        )
    }
}

export class Road extends React.Component {
    render(){
        return (<div className="cell" style={{backgroundColor: "white"}}></div>)
    }
}

// module.exports = {
//     monster: Monster,
//     item: Items,
//     boss: Boss,
//     weapon: Weapons,
//     player: Player,
//     wall: Wall
// }