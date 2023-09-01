import React from "react";
import fishingSvg from "../../public/fishing.svg";
import "./header.scss";

export function Header() {
  return (
    <header className="header">
      <a className="header-link" href="/">
        <img className="logo" src={fishingSvg} alt="Discord Fishing Logo" />
        <h1 className="header-name">Discord Fishing</h1>
      </a>
    </header>
  );
}
