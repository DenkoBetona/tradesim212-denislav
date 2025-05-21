import 'bulma/css/bulma.min.css';
import React, { useEffect, useState } from "react";

const CRYPTOS = [
  { name: "Bitcoin", ticker: "XBT/USD", display: "BTC/USD" },
  { name: "Ethereum", ticker: "ETH/USD" },
  { name: "Tether", ticker: "USDT/USD" },
  { name: "XRP", ticker: "XRP/USD" },
  { name: "BNB", ticker: "BNB/USD" },
  { name: "Solana", ticker: "SOL/USD" },
  { name: "USD Coin", ticker: "USDC/USD" },
  { name: "Dogecoin", ticker: "XDG/USD", display: "DOGE/USD"},
  { name: "Cardano", ticker: "ADA/USD" },
  { name: "TRON", ticker: "TRX/USD" },
  { name: "Chainlink", ticker: "LINK/USD" },
  { name: "Avalanche", ticker: "AVAX/USD" },
  { name: "Shiba Inu", ticker: "SHIB/USD" },
  { name: "Bitcoin Cash", ticker: "BCH/USD" },
  { name: "Toncoin", ticker: "TON/USD" },
  { name: "Litecoin", ticker: "LTC/USD" },
  { name: "Polkadot", ticker: "DOT/USD" },
  { name: "Uniswap", ticker: "UNI/USD" },
  { name: "NEAR Protocol", ticker: "NEAR/USD" },
  { name: "Polygon", ticker: "POL/USD" },
];

const INITIAL_BALANCE = 0;

export default function App() {
  const [prices, setPrices] = useState({"XBT/USD": 9999});
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [holdings, setHoldings] = useState({});
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(CRYPTOS[0].name);
  const [amount, setAmount] = useState("");
  const [alert, setAlert] = useState({});
  const [transacted, setTransacted] = useState(0);

  useEffect(() => {
    const ws = new WebSocket("wss://ws.kraken.com");
    //WebSocket connection to Kraken API
    //Subscribes to the ticker channel for all pairs
    ws.onopen = () => {
      const pairs = CRYPTOS.map((c) => c.ticker);
      ws.send(
        JSON.stringify({
          event: "subscribe",
          pair: pairs,
          subscription: { name: "ticker" },
        })
      );
    };
    //Handles incoming messages
    //Updates the prices state
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (Array.isArray(data) && data.length >= 4 && data[1]?.c) {
        const pair = data[3];
        const price = parseFloat(data[1].c[0]);
        setPrices((prev) => ({ ...prev, [pair]: price }));
      }
    };
  
    return () => {
      ws.close();
    };
  }, []);

  //Render balance, holdings and transactions
  //Triggers on change of the transacted state
  //And upon mounting of the component
  useEffect(() => {
    async function fetchUltimate() {
      //Fetch balance
      try {
        const balanceRes = await fetch('http://localhost:8080/api/users/balance');
        const balance = await balanceRes.json();
        setBalance(balance);
      } catch (error) {
        setAlert({message: 'Failed to fetch balance!', type: 'error'});
        console.error("Failed to fetch balance:", error);
      }

      //Fetch holdings
      try {
        const res = await fetch('http://localhost:8080/api/assets');
        const assets = await res.json();
        const holdingsObj = {};
        Array.isArray(assets) && assets.forEach(asset => {
          holdingsObj[asset.cname] = asset.quantity;
        });
        setHoldings(holdingsObj);
      } catch (error) {
        setAlert({message: 'Failed to fetch holdings!', type: 'error'});
        console.error("Failed to fetch holdings:", error);
      }

      //Fetch transactions
      try {
        const trRes = await fetch('http://localhost:8080/api/transactions');
        const transactions = await trRes.json();
        setHistory(transactions);
      } catch (error) {
        setAlert({message: 'Failed to fetch transactions!', type: 'error'});
        console.error("Failed to fetch transactions:", error);
      }
    }
    fetchUltimate();
  }, [transacted]);

  const currentPrice = prices[selected] || 0;

  const handleBuy = async () => {
    try {
      //Validate amount
      if (isNaN(amount) || amount <= 0) {
        setAlert({ message: 'Invalid amount!', type: 'error' });
        return;
      }
//console.log("Buying", selected, amount);
      //Fetch the current balance
      const balanceRes = await fetch('http://localhost:8080/api/users/balance');
      const balance = await balanceRes.json();

      const selectedIndex = CRYPTOS.findIndex(c => c.name === selected);
      const price = prices[CRYPTOS[selectedIndex].ticker];
      const totalCost = amount * price;

      //Validate balance
      if (totalCost > balance) {
        setAlert({message: 'Insufficient balance!', type: 'error'});
        return;
      }

      //Update balance
      await fetch('http://localhost:8080/api/users/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          balance: balance - totalCost,
        }),
      });

      //Update assets
      await fetch('http://localhost:8080/api/assets/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          assetId: selectedIndex + 1,
          quantity: amount,
        }),
      });

      //Create the new transaction
      await fetch('http://localhost:8080/api/transactions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          assetId: selectedIndex + 1,
          type: 'buy',
          price,
          amount,
        }),
      });

      //Trigger rerender/fetchUltimate
      setTransacted((prev) => prev + 1);
      setAlert({message: 'Purchase successful!', type: 'success'});
    } catch (error) {
      console.error(error);
      setAlert({message: 'An error occurred during the purchase.', type: 'error'});
    }
  };

  const handleSell = async () => {
    try {
      //Validate amount
      if (isNaN(amount) || amount <= 0) {
        setAlert({ message: 'Invalid amount!', type: 'error' });
        return;
      }
      const selectedIndex = CRYPTOS.findIndex(c => c.name === selected);
      const price = prices[CRYPTOS[selectedIndex].ticker];
      const sellAmount = Number(amount);

      //Validate holdings
      const currentHoldings = holdings[selected] || 0;
      if (sellAmount > currentHoldings) {
        setAlert({message: 'Insufficient holdings!', type: 'error'});
        return;
      }

      //Update assets
      //quantity positive for purchase,
      //negative for sale.
      await fetch('http://localhost:8080/api/assets/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          assetId: selectedIndex + 1,
          quantity: -sellAmount,
        }),
      });

      //Update balance.
      //profit here means the change in balance
      //not to be confused with profit/loss in transactions
      const profit = sellAmount * price;
      await fetch('http://localhost:8080/api/users/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          balance: balance + profit,
        }),
      });

      //Create the new transaction
      await fetch('http://localhost:8080/api/transactions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          assetId: selectedIndex + 1,
          type: 'sell',
          price,
          amount: sellAmount,
        }),
      });

      //Trigger rerender/fetchUltimate
      setTransacted((prev) => prev + 1);
      setAlert({message: 'Sell successful!', type: 'success'});
    } catch (error) {
      console.error(error);
      alert('An error occurred during the sale.');
    }
  };

  //Reset button handler
  function handleReset() {
    fetch('http://localhost:8080/api/reset', {
      method: 'POST',
    })
      .then(() => {
        setAlert({message: 'Reset successful!', type: 'success'});
        setTransacted(-1);
      })
      .catch((error) => {
        console.error('Failed to reset:', error);
        alert('Reset failed!');
      });
  }

return (
  <div
    className="is-flex is-justify-content-center is-align-items-center"
    style={{
      minHeight: "100vh",
      width: "100vw",
      background: "#181a1b",
      padding: 24,
    }}
  >
    <div
      className="box"
      style={{
        maxWidth: 1400,
        width: "100%",
        margin: "0 auto",
        background: "#23272b",
        color: "#f5f5f5",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      <h1 className="mb-1 title is-3 has-text-centered has-text-light">
        Crypto Trading Simulator
      </h1>
      <h2 className="subtitle has-text-centered">
        by Denislav Nikolov
      </h2>

      <div
        className="box mb-5"
        style={{
          minWidth: 350,
          margin: "0 auto 2rem auto",
          background: "#181a1b",
          color: "#f5f5f5",
        }}
      >
        {/* Input area for buying/selling crypto */}
        <div className="columns is-vcentered is-mobile">
          <div className="column">
            <div className="field is-grouped is-grouped-multiline is-justify-content-flex-start">
              <div className="control">
                <div className="select is-dark">
                  <select
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                    style={{ background: "#23272b", color: "#f5f5f5" }}
                  >
                    {CRYPTOS.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.display || c.ticker})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="control">
                <input
                  className="input"
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  min="0"
                  onChange={(e) => setAmount(e.target.value)}
                  style={{
                    width: 120,
                    background: "#23272b",
                    color: "#f5f5f5",
                    border: "1px solid #444",
                  }}
                />
              </div>
              <div className="control">
                <button className="button is-primary" onClick={handleBuy}>
                  Buy
                </button>
              </div>
              <div className="control">
                <button className="button is-danger" onClick={handleSell}>
                  Sell
                </button>
              </div>
              {alert && alert.message && (
                <p className={`help has-text-weight-bold mt-2 is-${alert.type=='error'?'danger':"success"}`} style={{ fontSize: "1rem" }}>
                  {alert.message}
                </p>
              )}
            </div>
          </div>
          <div className="column is-narrow">
            <div className="level is-mobile" style={{ justifyContent: "flex-end" }}>
              <div className="level-item">
                <strong>Balance:</strong>&nbsp;
                <span className="tag is-primary is-large ">
                  ${balance.toLocaleString()}
                </span>
              </div>
              <div className="level-item">
                <button className="button is-warning" onClick={handleReset}>
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Assets and Transactions columns */}
      <div className="columns" style={{ minHeight: "60vh" }}>
        {/* Asset list table column*/}
        <div className="column is-half">
          <div className="table-container mb-5" style={{ width: "100%" }}>
            <table className="table is-striped is-fullwidth is-hoverable is-dark has-text-centered">
              <thead>
                <tr>
                  <th className="has-text-light">Name</th>
                  <th className="has-text-light">Ticker</th>
                  <th className="has-text-light">Current Price ($)</th>
                  <th className="has-text-light">Holdings</th>
                </tr>
              </thead>
              <tbody>
                {CRYPTOS.map((c) => (
                  <tr key={c.ticker}>
                    <td className="has-text-light">
                      <img
                        src={'/cryptos/'+c.name+'.png'}
                        alt={c.name}
                        style={{ width: 20, height: 20, marginTop: -5, marginRight: 8, verticalAlign: "middle" }}
                      />
                      {c.name}
                    </td>
                    <td className="has-text-light">{c.display || c.ticker}</td>
                    <td className="has-text-light">
                      {prices[c.ticker]?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 10 }) || "Loading..."}
                    </td>
                    <td className="has-text-light">
                      {holdings[c.name] ? (Math.floor(holdings[c.name] * 100) / 100).toFixed(6) : 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Transaction history table column*/}
        <div className="column is-half">
          <div className="table-container" style={{ width: "100%" }}>
            <table className="table is-fullwidth is-hoverable is-narrow is-dark has-text-centered">
              <thead>
                <tr>
                  <th className="has-text-light">Type</th>
                  <th className="has-text-light">Ticker</th>
                  <th className="has-text-light">Amount</th>
                  <th className="has-text-light">Price ($)</th>
                  <th className="has-text-light">Total ($)</th>
                  <th className="has-text-light">Time</th>
                  <th className="has-text-light">Profit/Loss</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="has-text-centered has-text-light">
                      No transactions yet.
                    </td>
                  </tr>
                ) : (
                  Array.isArray(history) && history.map((h, i) => (
                    <tr key={i}>
                      <td>
                        <span
                          className={
                            h.type === "buy"
                              ? "tag is-success"
                              : "tag is-danger"
                          }
                        >
                          {h.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="has-text-light">{CRYPTOS[h.assetId-1].ticker}</td>
                      <td className="has-text-light">{h.amount}</td>
                      <td className="has-text-light">{h.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 10 })}</td>
                      <td className="has-text-light">{h.total.toLocaleString()}</td>
                      <td className="has-text-light">
                        {
                          new Date(h.transactionDate)
                          .toLocaleString("en-GB", {
                            day: "2-digit", month: "2-digit",
                            year: "2-digit", hour: "2-digit",
                            minute: "2-digit", hour12: false}).replace(",", "")
                        }
                      </td>
                      <td
                        className={
                          h.profit > 0
                            ? "has-text-success"
                            : h.profit < 0
                            ? "has-text-danger"
                            : "has-text-light"
                        }
                      >
                        {h.profit == 0 ? "-" : (Math.floor(h.profit * 100) / 100).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}