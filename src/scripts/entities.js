import React from "react";

export class Cell extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.InitialState;
    }

    get InitialState(){
        return {
            entity: "grey",
            health: null,
            attack: null,
            exp: null,
            fog: true
        };
    }

    reset(){
        this.setState(this.InitialState);
    }

    getStats(){
        return {hp: this.state.health, att: this.state.attack};
    }

    checkEntity() {
        return this.state.entity;
    }

    setEntity(type, hp, att) {
        this.setState({entity: type, health: hp, attack: att});
    }

    fog(bool) {
        if(this.state.entity === "red");
        else this.setState({ fog: bool });
    }

    shouldComponentUpdate(prevProps, prevState){
        return prevState !== this.state.fog;
    }

    render() {
        return (
            <div id={this.props.id} className="cell" style={{ backgroundColor: this.state.fog ? "black" : this.state.entity }}></div>
        )
    };
}