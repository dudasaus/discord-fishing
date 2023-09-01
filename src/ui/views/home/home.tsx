import React from "react";
import { Header } from "../../shared/header/header";
import "./home.scss";
import { Leaderboard } from "../../shared/leaderboard/leaderboard";

export function HomeView() {
  return (
    <>
      <Header />
      <div className="home-grid">
        <div className="panel-1">
          <p className="main-point">
            The <span className="blurple">BEST</span> use of your time
          </p>
          <p className="sub-point">Go fishing every day. Just type /fish.</p>
          <p className="install">
            <a
              className="link-button"
              target="_blank"
              href="https://discord.com/api/oauth2/authorize?client_id=892529887271854130&permissions=2048&scope=bot%20applications.commands"
            >
              Try it now
            </a>
          </p>
        </div>
        <div className="panel-2">
          <Leaderboard />
        </div>
      </div>
    </>
  );
}
