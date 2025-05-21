SET search_path TO public;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 10000.00
);

CREATE TABLE assets (
    id SERIAL PRIMARY KEY,
    cname VARCHAR(50) UNIQUE NOT NULL,
    quantity DECIMAL(15, 8) NOT NULL DEFAULT 0.0
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50),
    asset_id INT NOT NULL REFERENCES assets(id),
    price DECIMAL(15, 8) NOT NULL,
    total DECIMAL(15, 8) NOT NULL,
    amount DECIMAL(15, 8) NOT NULL,
    profit DECIMAL(15, 8) NOT NULL DEFAULT 0.0,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prepopulate assets table with 20 cryptocurrencies
INSERT INTO assets (name) VALUES
('Bitcoin'), ('Ethereum'), ('Tether'), ('XRP'), ('BNB'),
('Solana'), ('USD Coin'), ('Dogecoin'), ('Cardano'), ('TRON'),
('Chainlink'), ('Avalanche'), ('Shiba Inu'), ('Bitcoin Cash'), ('Toncoin'),
('Litecoin'), ('Polkadot'), ('Uniswap'), ('NEAR Protocol'), ('Polygon');

INSERT INTO users (balance) VALUES (10000.00);
