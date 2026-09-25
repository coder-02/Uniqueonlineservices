-- ============================================================
-- Unique Online Services - Cloudflare D1 Database Schema
-- ============================================================
-- Apply this once when you create the D1 database:
--   wrangler d1 execute uos-db --file=./schema.sql --remote
-- (For local dev use --local instead of --remote)
-- ============================================================

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  address TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_customers_mobile ON customers(mobile);

-- Enquiries / Service Requests (from public website form)
CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ref TEXT UNIQUE NOT NULL,          -- e.g. UOS-2026-000123
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  service TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new', -- new | processing | completed | cancelled
  source TEXT DEFAULT 'website',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at);

-- Bills / POS
CREATE TABLE IF NOT EXISTS bills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bill_no TEXT UNIQUE NOT NULL,
  customer_name TEXT,
  customer_mobile TEXT,
  items TEXT NOT NULL,               -- JSON string of line items
  subtotal REAL NOT NULL DEFAULT 0,
  discount REAL NOT NULL DEFAULT 0,
  total REAL NOT NULL DEFAULT 0,
  payment_mode TEXT DEFAULT 'cash',  -- cash | upi | card
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_bills_created ON bills(created_at);

-- Work Orders (jobs in progress)
CREATE TABLE IF NOT EXISTS work_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ref TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_mobile TEXT,
  service TEXT NOT NULL,
  details TEXT,
  amount REAL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | processing | completed | delivered
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_work_status ON work_orders(status);

-- Expenses
CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  amount REAL NOT NULL DEFAULT 0,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_expenses_created ON expenses(created_at);

-- Simple key-value settings (e.g. counters)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
