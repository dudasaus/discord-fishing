import React from "react";
import { Header } from "../../shared/header/header";
import "./home.scss";

export function HomeView() {
  return (
    <div>
      <Header />
      <div className="home-grid">
        <div className="panel-1">
          <p className="main-point">
            The <span className="blurple">BEST</span> use of your time
          </p>
          <p className="sub-point">Go fishing every day. Just type /fish.</p>
        </div>
      </div>
    </div>
  );
}
