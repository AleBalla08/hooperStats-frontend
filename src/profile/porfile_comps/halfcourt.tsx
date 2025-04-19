
export default function HalfCourt() {

  const shotData = [
    { position: "corner-L", percentage: 45 },
    { position: "corner-R", percentage: 50 },
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
