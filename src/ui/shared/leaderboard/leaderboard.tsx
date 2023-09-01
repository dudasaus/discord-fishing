import React, { useEffect, useState } from "react";
import { formatLength } from "../../../format_utils";
import "./leaderboard.scss";

export function Leaderboard() {
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((body) => {
        setLeaderboardData(body);
        setLoading(false);
      });
  }, []);

  function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString();
  }

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
      {leaderboardData.map((entry, pos) => (
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
