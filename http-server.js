const http = require("http");
const url = require("url");

const PORT = 2000;

const conversionRates = {
  usd: 1500,
  eur: 1700,
  cny: 2000,
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (req.method === "GET" && parsedUrl.pathname === "/convert") {
    const { amount, currency } = parsedUrl.query;

    // Validation
    if (!amount || !currency) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Missing amount or currency" }));
    }

    const numericAmount = Number(amount);

    if (isNaN(numericAmount)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Invalid amount" }));
    }

    if (!conversionRates[currency]) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Unsupported currency" }));
    }

    const convertedAmount = numericAmount * conversionRates[currency];

    const response = {
      input: {
        amount: numericAmount,
        currency,
      },
      convertedAmount,
      unit: "RWF",
    };

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});