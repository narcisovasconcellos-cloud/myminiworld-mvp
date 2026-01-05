import { useState } from "react";

export default function Home() {
  const [day, setDay] = useState(1);
  const [population, setPopulation] = useState(1);

  // recursos
  const [food, setFood] = useState(5);

  // prédio inicial
  const [houseLevel] = useState(1); // por enquanto fixo

  function nextDay() {
    // produção
    const producedFood = 2 * houseLevel; // casa lvl1 = +2/dia
    // consumo
    const consumedFood = population * 1; // 1 por habitante

    let newFood = food + producedFood - consumedFood;
    let newPopulation = population;

    // fome: se faltar comida, morre 1
    if (newFood < 0) {
      newFood = 0;
      newPopulation = Math.max(0, newPopulation - 1);
    }

    setDay(day + 1);
    setFood(newFood);
    setPopulation(newPopulation);
  }

  return (
    <main style={{ padding: 24, maxWidth: 520, fontFamily: "system-ui" }}>
      <h1 style={{ marginBottom: 8 }}>MyMiniWorld</h1>
      <p style={{ marginTop: 0, color: "#555" }}>
        Sua cidade começa aqui.
      </p>

      <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 10 }}>
        <p><b>Dia:</b> {day}</p>
        <p><b>Habitantes:</b> {population}</p>
        <p><b>Comida:</b> {food}</p>
        <p><b>Casa:</b> Nível {houseLevel} (produz {2 * houseLevel}/dia)</p>

        <button
          onClick={nextDay}
          style={{
            marginTop: 12,
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #222",
            cursor: "pointer",
            background: "white",
          }}
        >
          Passar o dia
        </button>
      </div>

      <p style={{ marginTop: 12, color: "#666", fontSize: 13 }}>
        Regras: Casa produz comida. Habitantes consomem. Se faltar comida, morre 1 habitante.
      </p>
    </main>
  );
}
