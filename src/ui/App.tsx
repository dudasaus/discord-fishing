import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.scss";
import { useAtom } from "jotai";
import { countAtom } from "./atoms";
import React, { useEffect, useState } from "react";

console.log(import.meta.env);

function App() {
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((body) => {
        setLeaderboard(body);
        setLoading(false);
      });
  }, []);

  function renderLeaderboard() {
    if (loading) return <p>Loading...</p>;
    return (
      <ol>
        {leaderboard.map((entry) => (
          <li>
            {entry.username} - {entry.fish}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <>
      <h1>Discord Fishing Leaderboard</h1>
      {renderLeaderboard()}
    </>
  );
}

export default App;
