import React, { Component } from "react";
import { Container } from "react-bootstrap";

import "./App.css";

// third party libraries
import { connect } from "react-redux";

// thunks
import { getSessionInfo } from "../store/rooms";

// components
import Room from '../components/room';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      room: {
        roomId: "",
        opened: false,
      },
      createdRoom: null,
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

  componentDidUpdate(prevProps) {
    const { sessionId } = this.props.createdRoom;
    if (sessionId !== prevProps.createdRoom.sessionId) {
      this.enterRoom(sessionId);
    }
  }

  enterRoom = (roomId) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        room: {
          roomId,
          opened: true,
        },
      };
    });
  };

  closeRoom = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        room: {
          roomId: "",
          opened: false,
        },
      };
    });
  }

  renderMainWindow = () => {
    return (
      <div className="MainWindow">
        <button onClick={this.props.getSessionInfo}>Create a room</button>
        <button>Rooms</button>
      </div>
    );
  };

  render() {
    const { room } = this.state
    return (
      <Container fluid>
        <h1>Let's Chat</h1>
        {!room.opened && this.renderMainWindow()}
        {room.opened && <Room roomId={room.roomId} closeRoom={this.closeRoom} />}
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
