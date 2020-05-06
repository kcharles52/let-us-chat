import React from "react";

// components
import { ReactComponent as Chat } from "../../assets/icons/chat.svg";
import { ReactComponent as Leave } from "../../assets/icons/leave.svg";
import { ReactComponent as Mic } from "../../assets/icons/mic.svg";
import { ReactComponent as Screen } from "../../assets/icons/screen.svg";
import { ReactComponent as Video } from "../../assets/icons/video.svg";

const UIIcons = (props) => {
  return (
    <div id="controls">
      <Video onClick={props.toggleVideo} />
      <Mic onClick={props.toggleAudio} />
      <Screen onClick={props.shareScreen} />
      <Chat onClick={props.chat} />
      <Leave onClick={props.leaveRoom} />
    </div>
  );
};

export default UIIcons;
