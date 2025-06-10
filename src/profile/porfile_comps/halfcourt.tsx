import { Session } from "../../components/types";

async function getDoneSessions() {
  const access_token = localStorage.getItem('access_token');

  const resposta = await fetch('http://127.0.0.1:8000/api/get-done-sessions/', {
    method: 'GET',
    headers: {
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${access_token}`
    }
  });

  const data = await resposta.json();
  
  return data;
}

export default function HalfCourt() {
  const getDones = getDoneSessions();
  
  getDones.then(sessions => {
    console.log(sessions)
    const positionData:any = {};
    
    sessions.forEach(session => {
      session.exercises.forEach(exer => {
        const pos = exer.position;
        const acc = exer.accuracy;

        console.log(pos, acc)

        if (!positionData[pos]) {
          positionData[pos] = { total: 0, count: 0 };
        }

        positionData[pos].total += acc;
        positionData[pos].count += 1;
      });
    });

    const averages:any = {};

    for (const pos in positionData){
      const {total, count} = positionData[pos];
      averages[pos] = (total / count).toFixed(2);
    }

    console.log('averg', averages)

    const shotData = [
      { position: "midrange-l", percentage: 45 },
      { position: "midrange-r", percentage: 50 },
      { position: "fortyfive-L", percentage: 38 },
      { position: "fortyfive-R", percentage: 42 },
      { position: "center", percentage: 47 },
      { position: "two-corner-L", percentage: 55 },
      { position: "two-corner-R", percentage: 53 },
      { position: "freethrow", percentage: 90 },
    ];

    const getCircleColor = (percentage: number) => {
      if (percentage >= 60) return "#A31D1D";
      if (percentage >= 50) return "#FFB433";
      if (percentage >= 40) return "#578FCA";
      return "#8C8C8C";
    };

    const shotElements = shotData.map((shot) => (
      <div
        key={shot.position}
        className={`shot-position ${shot.position}`} 
        style={{
          backgroundColor: getCircleColor(shot.percentage),
          color: "white",
        }}
      >
        {shot.percentage}%
      </div>
    ));
    
  })

  

  return (
    <>
    <div className="halfcourt__img">
      <img src="public/media/halfcourt.png" alt="Halfcourt" />

      {shotElements}

    </div>
    <div className="color_subtitle">
        <p style={{color: '#A31D1D'}}>+60%</p>
        <p style={{color: '#FFB433'}}>+50%</p>
        <p style={{color: '#578FCA'}}>+40%</p>
        <p style={{color: '#8C8C8C'}}>-40%</p>
    </div>
    </>
  );
}
