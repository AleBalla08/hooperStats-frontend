import { Exercise, Session } from "../../components/types";
import { useEffect, useState } from "react";

async function getDoneSessions() {
  const access_token = localStorage.getItem("access_token");

  const resposta = await fetch("http://127.0.0.1:8000/api/get-done-sessions/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  });

  const data = await resposta.json();

  return data;
}

export default function HalfCourt() {
  const [averages, setAverages] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const sessions = await getDoneSessions();
      const positionData: any = {};

      sessions.forEach((session:Session) => {
        session.exercises.forEach((exer:Exercise) => {
          const pos = exer.position;
          const acc = exer.accuracy;

          if (!positionData[pos]) {
            positionData[pos] = { total: 0, count: 0 };
          }

          positionData[pos].total += acc;
          positionData[pos].count += 1;
        });
      });

      const averages: any = {};

      for (const pos in positionData) {
        const { total, count } = positionData[pos];
        averages[pos] = parseFloat((total / count).toFixed(2));
      }

      setAverages(averages);
    }

    fetchData();
  }, []);

  const getCircleColor = (percentage: number) => {
    if (percentage >= 60) return "#A31D1D";
    if (percentage >= 50) return "#FFB433";
    if (percentage >= 40) return "#578FCA";
    return "#8C8C8C";
  };

  const positions = [
    "corner-L",
    "corner-R",
    "fortyfive-L",
    "fortyfive-R",
    "center",
    "midrange-l",
    "midrange-r",
    "freethrow",
  ];

  const shotElements = positions.map((pos) => {
    const percentage = averages?.[pos] ?? 0;
    return (
      <div
        key={pos}
        className={`shot-position ${pos}`}
        style={{
          backgroundColor: getCircleColor(percentage),
          color: "white",
        }}
      >
        {percentage}%
      </div>
    );
  });

  return (
    <>
      <div className="halfcourt__img">
        <img src="public/media/halfcourt.png" alt="Halfcourt" />

        {averages && shotElements}
      </div>
      <div className="color_subtitle">
        <p style={{ color: "#A31D1D" }}>+60%</p>
        <p style={{ color: "#FFB433" }}>+50%</p>
        <p style={{ color: "#578FCA" }}>+40%</p>
        <p style={{ color: "#8C8C8C" }}>-40%</p>
      </div>
    </>
  );
}
