import React from "react";
import styled from "styled-components";

const Star = styled.button`
  font-size: 1.5rem;
  border: 0px solid transparent;
  background: none;
  color: ${(props) => (props.active ? "#FFD700" : "white")};

  vertical-align: middle;

  &:hover {
    cursor: pointer;
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: #ffd700;
  }

  &:focus {
    outline: none;
  }

  &:after {
    content: "";
  }
  ${(props) => props.lastItem && "padding-right: 0;"}
`;

const arr = [0, 1, 2, 3, 4, 5];
export const Stars = (setStar, active) => (
  <div>
    {arr.map((v, index) => (
      <Star
        lastItem={index + 1 === arr.length ? true : false}
        onClick={() => setStar(v)}
        key={v}
        active={active >= v ? true : false}
        data-testid={index}
      >
        {v > 0 ? "★" : renderCircle()}
      </Star>
    ))}
  </div>
);

const renderCircle = () => (
  <span
    style={{
      fontSize: "2rem",
      fontWeight: "700",
      textShadow: "0.5px 0.5px #ffd700",
    }}
  >
    ○
  </span>
);
