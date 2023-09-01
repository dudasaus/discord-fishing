import "./App.scss";
import React, { useEffect, useState } from "react";
import { formatLength } from "../format_utils";
import { Header } from "./shared/header/header";

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

  function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString();
  }

  function renderLeaderboard() {
    if (loading) return <p>Loading...</p>;
    return (
      <table className="leaderboard">
        <tr>
          <th>Pos</th>
          <th>User</th>
          <th>Catch</th>
          <th>Size</th>
          <th>Date</th>
        </tr>
        {leaderboard.map((entry, pos) => (
          <tr>
            <td>{pos + 1}</td>
            <td>{entry.username}</td>
            <td>{entry.fish}</td>
            <td>{formatLength(entry.size)}</td>
            <td>{formatDate(entry.timestamp)}</td>
          </tr>
        ))}
      </table>
    );
  }

  return (
    <>
      <Header />
      {renderLeaderboard()}
    </>
  );
}

export default App;
