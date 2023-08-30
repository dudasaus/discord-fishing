import "./App.scss";
import React, { useEffect, useState } from "react";
import { formatLength } from "../format_utils";

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
            {entry.username} - {entry.fish}, {formatLength(entry.size)}
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
