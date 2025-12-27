import { useState } from "react";
import "./BillCalculator.css";

export default function BillCalculator() {
  const [form, setForm] = useState({
    lastMonthReading: "",
    recentMonthReading: "",
    totalUnits: "",
    billCost: ""
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculate = async () => {
    setError("");
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/api/bill/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lastMonthReading: Number(form.lastMonthReading),
          recentMonthReading: Number(form.recentMonthReading),
          totalUnits: Number(form.totalUnits),
          billCost: Number(form.billCost)
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1>⚡ Electricity Bill Splitter</h1>
        <p className="subtitle">Fairly split your electricity bill</p>

        <div className="inputs">
          <input name="lastMonthReading" placeholder="Last Month Reading" onChange={handleChange} />
          <input name="recentMonthReading" placeholder="Recent Month Reading" onChange={handleChange} />
          <input name="totalUnits" placeholder="Total Units" onChange={handleChange} />
          <input name="billCost" placeholder="Total Bill Amount (₹)" onChange={handleChange} />
        </div>

        <button onClick={calculate}>Calculate Bill</button>

        {error && <p className="error">{error}</p>}

        {result && (
          <div className="result">
            <h2>💡 Bill Summary</h2>
            <div className="row">
              <span>Units Used (Person A)</span>
              <span>{result.unitsUsedByPersonA}</span>
            </div>
            <div className="row">
              <span>Cost per Unit</span>
              <span>₹{result.costPerUnit}</span>
            </div>
            <div className="row highlight">
              <span>Ground Floor Pays</span>
              <span>₹{result.personAAmount}</span>
            </div>
            <div className="row">
              <span>1st Floor Pays</span>
              <span>₹{result.personBAmount}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
