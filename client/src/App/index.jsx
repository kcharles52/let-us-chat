import React, { Component } from "react";
import { Container } from "react-bootstrap";

import "./App.css";

// third party libraries
import { connect } from "react-redux";

// thunks
import { getSessionInfo } from "../store/rooms";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openedRoom: {
        roomId: "",
        opened: false,
      },
      createdRoom: null
    };
  }

  componentDidMount() {
    this.setState((prevState) => {
      return {
        ...prevState,
        createdRoom: {
          apiKey: "",
          sessionId: "",
          token: "",
        },
      };
    });
  }

  renderMainWindow = () => {
    return (
      <div className="MainWindow">
        <button onClick={this.props.getSessionInfo}>Create a room</button>
        <button >Rooms</button>
      </div>
    );
  };

  render() {
    return (
      <Container fluid>
        <h1>Let's Chat</h1>
        {this.renderMainWindow()}
      </Container>
    );
  }
}

export const mapStateToProps = (state) => ({
  createdRoom: state.rooms.createdRoom,
});

export const mapDispatchToProps = (dispatch) => ({
  getSessionInfo: () => dispatch(getSessionInfo()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);