import React from "react";

// third-party libraries
import { Col } from "react-bootstrap";

const Card = (props) => {
  return (
    <Col className={"userProfile"}>
      <div id={props.id} className="videoStream"></div>
    </Col>
  );
};

export default Card;
