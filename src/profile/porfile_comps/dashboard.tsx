  import { useEffect } from "react";
import HalfCourt from "./halfcourt";

  function Dashboard() {
    useEffect(() => {
      const drawChart = () => {
        if (!window.google || !window.google.visualization) {
          console.error("Google Charts ainda não carregado.");
          return;
        }
  
        const dataPie = window.google.visualization.arrayToDataTable([
          ["Exercicio", "Reps"],
          ["Arremesso - 2pts", 30],
          ["Bandeja", 40],
          ["Arremesso - 3pts", 20],
          ["Arremesso - PullUp", 20],
        ]);
        
        const optionsPie = {
          title: "Reps por Exercício",
          backgroundColor: "#262626",
          titleTextStyle: { color: "#f9f9f9", fontSize: 18 },
          legend: { textStyle: { color: "#f9f9f9" } },
          colors: ["#262626", "#8C8C8C", "#BFBFBF", "#f9f9f9"],
        };
        
        const chartPie = new window.google.visualization.PieChart(
          document.getElementById("piechart") as HTMLElement
        );
        chartPie.draw(dataPie, optionsPie);
        
        const dataBar = window.google.visualization.arrayToDataTable([
          ["Treino", "Porcentagem %"],
          ["Treino C - 24/07", 58],
          ["Treino A - 28/05", 56.5],
          ["Treino C - 30/01", 56.4],
          ["Treino B - 18/02", 55],
        ]);
  
        const optionsBar = {
          title: "Melhores Treinos (%)",
          backgroundColor: "#262626",
          titleTextStyle: { color: "#f9f9f9", fontSize: 18 },
          legend: "none",
          hAxis: { textStyle: { color: "#f9f9f9" } },
          vAxis: { textStyle: { color: "#f9f9f9" } },
          colors: ["#8C8C8C"],
        };
  
        const chartBar = new window.google.visualization.BarChart(
          document.getElementById("barchart") as HTMLElement
        );
        chartBar.draw(dataBar, optionsBar);
      };
  
      const loadGoogleCharts = () => {
        if (!window.google || !window.google.charts) {
          console.error("Google Charts ainda não carregado corretamente.");
          return;
        }
  
        window.google.charts.load("current", { packages: ["corechart"] });
        window.google.charts.setOnLoadCallback(drawChart);
      };
  
      if (!window.google || !window.google.charts) {
        const script = document.createElement("script");
        script.src = "https://www.gstatic.com/charts/loader.js";
        script.async = true;
        script.onload = () => {
          console.log("Google Charts carregado com sucesso.");
          loadGoogleCharts();
        };
        document.body.appendChild(script);
      } else {
        loadGoogleCharts();
      }
  
      window.addEventListener("resize", drawChart);
  
      return () => {
        window.removeEventListener("resize", drawChart);
      };
    }, []);

   


    return (
      <div className="user_activity">
        <HalfCourt/>
        <div style={{ 
            width: "80%", 
            height: "300px", 
            marginBottom: "20px", 
            marginTop: "20px", 
            borderRadius: "10px", 
            overflow: "hidden" 
        }}>
            <div id="piechart" style={{ width: "100%", height: "100%" }}></div>
        </div>

        <div style={{ 
            width: "80%", 
            height: "300px", 
            marginBottom: "20px",  
            borderRadius: "10px", 
            overflow: "hidden" 
        }}>
            <div id="barchart" style={{ width: "100%", height: "100%" }}></div>
        </div>
      </div>
    );
  }

  export default Dashboard;
