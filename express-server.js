const express = require("express");
const app = express();

const PORT = 2000;

const conversionRates = {
  usd: 1500,
  eur: 1700,
  cny: 2000,
};

// Middleware for validation
function validateQuery(req, res, next) {
  const { amount, currency } = req.query;

  if (!amount || !currency) {
    return res.status(400).json({ error: "Missing amount or currency" });
  }

  const numericAmount = Number(amount);

  if (isNaN(numericAmount)) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  if (!conversionRates[currency]) {
    return res.status(400).json({ error: "Unsupported currency" });
  }

  req.numericAmount = numericAmount;
  next();
}

// Route
app.get("/convert", validateQuery, (req, res) => {
  const { currency } = req.query;
  const amount = req.numericAmount;

  const convertedAmount = amount * conversionRates[currency];

  res.json({
    input: {
      amount,
      currency,
    },
    convertedAmount,
    unit: "RWF",
  });
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});