import { useState } from "react";

export default function Home() {
  const [day, setDay] = useState(1);
  const [population, setPopulation] = useState(1);

  return (
    <main style={{ padding: 20 }}>
      <h1>MyMiniWorld</h1>

      <p>Dia: {day}</p>
      <p>Habitantes: {population}</p>

      <button onClick={() => setDay(day + 1)}>
        Passar o dia
      </button>
    </main>
  );
}
