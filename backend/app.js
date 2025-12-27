
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

function calculateElectricityBill({ lastMonthReading, recentMonthReading, totalUnits, billCost }) {
  const varAMT = recentMonthReading - lastMonthReading;
  const costPerUnit = billCost / totalUnits;
  const CostOfRent = costPerUnit * varAMT;
  const PrimaryCost = billCost - CostOfRent;

  return {
    unitsUsedByPersonA: varAMT,
    costPerUnit: Number(costPerUnit.toFixed(2)),
    personAAmount: Number(CostOfRent.toFixed(2)),
    personBAmount: Number(PrimaryCost.toFixed(2))
  };
}

app.post("/api/bill/calculate", (req, res) => {
  try {
    const result = calculateElectricityBill(req.body);
    res.json(result);
  } catch {
    res.status(400).json({ error: "Invalid input" });
  }
});

app.listen(5000, () => console.log("Backend running on port 5000"));
