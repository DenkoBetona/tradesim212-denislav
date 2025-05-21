import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from './App';

// Default mock for fetch for all tests
beforeEach(() => {
  global.fetch = jest.fn((url, opts) => {
    if (url.includes('/api/users/balance')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(10000) });
    }
    if (url.includes('/api/assets')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve([
        { cname: "Bitcoin", quantity: 1 },
        { cname: "Ethereum", quantity: 2 }
      ]) });
    }
    if (url.includes('/api/transactions')) {
      // For PUT (buy/sell), just resolve ok; for GET, return empty array
      if (opts && opts.method === 'PUT') {
        return Promise.resolve({ ok: true });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    }
    if (url.includes('/api/reset')) {
      return Promise.resolve({ ok: true });
    }
    if (url.includes('/api/assets/update')) {
      return Promise.resolve({ ok: true });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

test('renders Crypto Trading Simulator title', async () => {
  await act(async () => {
    render(<App />);
  });
  expect(screen.getByText(/Crypto Trading Simulator/i)).toBeInTheDocument();
});

test('shows alert on invalid amount for buy', async () => {
  await act(async () => {
    render(<App />);
  });
  const amountInput = screen.getByPlaceholderText(/amount/i);
  fireEvent.change(amountInput, { target: { value: '-1' } });
  const buyButton = screen.getByText(/buy/i);
  fireEvent.click(buyButton);
  expect(await screen.findByText(/invalid amount/i)).toBeInTheDocument();
});

test('shows alert on invalid amount for sell', async () => {
  await act(async () => {
    render(<App />);
  });
  const amountInput = screen.getByPlaceholderText(/amount/i);
  fireEvent.change(amountInput, { target: { value: '-1' } });
  const sellButton = screen.getByText(/sell/i);
  fireEvent.click(sellButton);
  expect(await screen.findByText(/invalid amount/i)).toBeInTheDocument();
});

test('shows insufficient holdings alert on sell', async () => {
  await act(async () => {
    render(<App />);
  });
  const amountInput = screen.getByPlaceholderText(/amount/i);
  fireEvent.change(amountInput, { target: { value: '100' } });
  const sellButton = screen.getByText(/sell/i);
  fireEvent.click(sellButton);
  expect(await screen.findByText(/insufficient holdings/i)).toBeInTheDocument();
});

test('shows insufficient balance alert on buy', async () => {
  await act(async () => {
    render(<App />);
  });

  // Wait for balance to be loaded in the DOM
  await screen.findByText(/\$10 000/);

  const amountInput = screen.getByPlaceholderText(/amount/i);
  fireEvent.change(amountInput, { target: { value: '10000' } });
  const buyButton = screen.getByText(/buy/i);
  fireEvent.click(buyButton);

  await waitFor(() => expect(screen.getByText(/insufficient balance/i)).toBeInTheDocument());
});

test('shows success alert on reset', async () => {
  await act(async () => {
    render(<App />);
  });
  const resetButton = screen.getByText(/reset/i);
  fireEvent.click(resetButton);
  await waitFor(() => expect(screen.getByText(/reset successful/i)).toBeInTheDocument());
});

test('shows success alert on buy', async () => {
  await act(async () => {
    render(<App />);
  });
  const amountInput = screen.getByPlaceholderText(/amount/i);
  fireEvent.change(amountInput, { target: { value: '1' } });
  const buyButton = screen.getByText(/buy/i);
  fireEvent.click(buyButton);
  await waitFor(() => expect(screen.getByText(/purchase successful/i)).toBeInTheDocument());
});

test('shows success alert on sell', async () => {
  await act(async () => {
    render(<App />);
  });
  const amountInput = screen.getByPlaceholderText(/amount/i);
  fireEvent.change(amountInput, { target: { value: '1' } });
  const sellButton = screen.getByText(/sell/i);
  fireEvent.click(sellButton);
  await waitFor(() => expect(screen.getByText(/sell successful/i)).toBeInTheDocument());
});