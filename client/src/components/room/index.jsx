import React from "react";

import "./room.css";

// third party libraries
import OT from "@opentok/client";
import { connect } from "react-redux";
import { Container, Row } from "react-bootstrap";

// components
import RoomUser from "../roomUser";
import UserControls from "../userIcons";

// thunks
import { getToken } from "../../store/rooms";

// helper function
const handleError = (error) => {
  if (error) {
    alert(error.message);
  }
};

class Room extends React.Component {
  initialState = {
    roomUsers: [],
    roomId: "",
    session: null,
    publishers: [],
  };
  state = {
    ...this.initialState,
  };

  componentDidMount() {
    this.props.getToken(this.props.roomId);
    this.setState((prevState) => {
      return {
        ...prevState,
        roomId: this.props.roomId,
      };
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.userToken.token !== prevProps.userToken.token) {
      this.joinRoom(this.state.roomId);
    }
  }

  initializeSession = ({ apiKey, sessionId }) => {
    return OT.initSession(apiKey, sessionId);
  };

  addRoomUser = (newUser) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        roomUsers: [...prevState.roomUsers, newUser],
      };
    });
  };

  usersInARoom = () => {
    let users = [];
    const { roomUsers } = this.state;

    roomUsers.map((id) => users.push(<RoomUser id={id} key={id} />));

    return users;
  };

  joinRoom = async (sessionId) => {
    const apiKey = process.env.REACT_APP_API_KEY;
    const token = this.props.userToken.token;
    const auth = {
      apiKey,
      sessionId,
    };
    const session = this.initializeSession(auth);

    session.on({
      streamCreated: (event) => {
        const streamId = event.stream.streamId;

        this.setState(
          (prevState) => {
            return {
              ...prevState,
              roomUsers: [...prevState.roomUsers, streamId],
            };
          },
          () => {
            session.subscribe(
              event.stream,
              `${event.stream.id}`,
              {
                insertMode: "replace",
              },
              handleError
            );
          }
        );
      },
      streamDestroyed: (event) => {
        const streamId = event.stream.streamId;
        this.setState((prevState) => {
          const roomUsers = prevState.roomUsers.filter(
            (user) => user !== streamId
          );
          return {
            ...prevState,
            roomUsers,
          };
        });
      },
      sessionDisconnected: (event) => {
        if (event.reason === "networkDisconnected") {
          alert("Your network connection terminated.");
        }
      },
    });
    session.connect(token, (error) => {
      if (error) {
        handleError(error);
      } else {
        if (!session) {
          return;
        }
        const userId = session.connection.id;
        
        this.addRoomUser(userId);

        const publisher = OT.initPublisher(
          `${userId}`,
          {
            insertMode: "replace",
            showControls: false,
          },
          handleError
        );

        session.publish(publisher, handleError);

        this.setState((prevState) => {
          return {
            ...prevState,
              session,
              publishers: [...prevState.publishers, publisher],
          };
        });
      }
    });
  };

  render() {
    return (
      <Container id="Room">
        <div>
          <Row id="videos">
            <Row id="people">{this.usersInARoom()}</Row>
          </Row>
        </div>
      </Container>
    );
  }
}

export const mapStateToProps = (state) => ({
  userToken: state.rooms.userToken,
});

export const mapDispatchToProps = (dispatch) => ({
  getToken: (sessionId) => dispatch(getToken(sessionId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);
