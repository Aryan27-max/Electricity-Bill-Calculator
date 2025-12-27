import express from "express";
import cors from "cors";

const app = express();

/* =====================
   MIDDLEWARE
===================== */
app.use(cors({ origin: "*" }));   // allow frontend access
app.use(express.json());          // parse JSON body

/* =====================
   BUSINESS LOGIC
===================== */
function calculateElectricityBill({
  lastMonthReading,
  recentMonthReading,
  totalUnits,
  billCost
}) {
  const unitsUsedByPersonA = recentMonthReading - lastMonthReading;
  const costPerUnit = billCost / totalUnits;

  const personAAmount = unitsUsedByPersonA * costPerUnit;
  const personBAmount = billCost - personAAmount;

  return {
    unitsUsedByPersonA,
    costPerUnit: Number(costPerUnit.toFixed(2)),
    personAAmount: Number(personAAmount.toFixed(2)),
    personBAmount: Number(personBAmount.toFixed(2)),
  };
}

/* =====================
   ROUTES
===================== */
app.post("/api/bill/calculate", (req, res) => {
  try {
    const result = calculateElectricityBill(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: "Invalid input" });
  }
});

/* =====================
   SERVER (RENDER SAFE)
===================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
