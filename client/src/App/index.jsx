import React, { Component } from "react";
import { Container } from "react-bootstrap";

import "./App.css";

// third party libraries
import { connect } from "react-redux";

// thunks
import { getSessionInfo, getAvailableRooms, deleteRoom } from "../store/rooms";

// components
import Room from "../components/room";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      room: {
        roomId: "",
        opened: false,
      },
      createdRoom: null,
      showAvailableRooms: false,
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

  componentDidUpdate(prevProps, prevState) {
    const { sessionId } = this.props.createdRoom;
    if (sessionId !== prevProps.createdRoom.sessionId) {
      this.enterRoom(sessionId);
    }

    if (this.props.availableRooms !== prevState.rooms) {
      this.setState((prevState) => {
        return {
          ...prevState,
          rooms: this.props.availableRooms,
        };
      });
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
  };

  showAvailableRooms = () => {
    const { rooms } = this.state.rooms;
    const availableRooms = [];

    if (rooms) {
      rooms.map((room) => {
        availableRooms.push(
          <div className="roomButtons" key={room}>
            <button
              id={room}
              key={`${room}j`}
              onClick={() => this.enterRoom(room)}
            >
              Join Room
            </button>
            <button
              key={`${room}d`}
              onClick={() => this.props.deleteRoom(room)}
            >
              Delete Room
            </button>
          </div>
        );
      });
    }

    return availableRooms;
  };

  showsRooms = async () => {
    await this.props.getAvailableRooms();
    this.setState((prevState) => {
      return {
        ...prevState,
        showAvailableRooms: true,
      };
    });
  };

  renderMainWindow = () => {
    return (
      <div className="MainWindow">
        <button onClick={this.props.getSessionInfo}>Create a room</button>
        <button onClick={this.showsRooms}>Rooms</button>
        <div>{this.state.showAvailableRooms && this.showAvailableRooms()}</div>
      </div>
    );
  };

  render() {
    const { room } = this.state;
    return (
      <Container fluid>
        <h1>Let's Chat</h1>
        {!room.opened && this.renderMainWindow()}
        {room.opened && (
          <Room roomId={room.roomId} closeRoom={this.closeRoom} />
        )}
      </Container>
    );
  }
}

export const mapStateToProps = (state) => ({
  createdRoom: state.rooms.createdRoom,
  availableRooms: state.rooms.availableRooms,
});

export const mapDispatchToProps = (dispatch) => ({
  getSessionInfo: () => dispatch(getSessionInfo()),
  getAvailableRooms: () => dispatch(getAvailableRooms()),
  deleteRoom: (roomId) => dispatch(deleteRoom(roomId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
