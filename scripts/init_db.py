import sqlite3
from pathlib import Path

db_path = Path(__file__).resolve().parents[1] / "prisma" / "dev.db"
connection = sqlite3.connect(db_path)
connection.executescript('''
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS User (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT, passwordHash TEXT NOT NULL, cashBalance REAL NOT NULL DEFAULT 100000, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS Holding (id TEXT PRIMARY KEY, userId TEXT NOT NULL, coinId TEXT NOT NULL, symbol TEXT NOT NULL, name TEXT NOT NULL, quantity REAL NOT NULL DEFAULT 0, averageCost REAL NOT NULL DEFAULT 0, updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(userId) REFERENCES User(id) ON DELETE CASCADE, UNIQUE(userId, coinId));
CREATE TABLE IF NOT EXISTS Trade (id TEXT PRIMARY KEY, userId TEXT NOT NULL, coinId TEXT NOT NULL, symbol TEXT NOT NULL, name TEXT NOT NULL, side TEXT NOT NULL, quantity REAL NOT NULL, price REAL NOT NULL, total REAL NOT NULL, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(userId) REFERENCES User(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS NetWorthSnapshot (id TEXT PRIMARY KEY, userId TEXT NOT NULL, value REAL NOT NULL, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(userId) REFERENCES User(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS MonthlyResult (id TEXT PRIMARY KEY, userId TEXT NOT NULL, month TEXT NOT NULL, startValue REAL NOT NULL, endValue REAL NOT NULL, returnPct REAL NOT NULL, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(userId) REFERENCES User(id) ON DELETE CASCADE, UNIQUE(userId, month));
CREATE INDEX IF NOT EXISTS Holding_userId_idx ON Holding(userId);
CREATE INDEX IF NOT EXISTS Trade_userId_createdAt_idx ON Trade(userId, createdAt);
CREATE INDEX IF NOT EXISTS NetWorthSnapshot_userId_createdAt_idx ON NetWorthSnapshot(userId, createdAt);
CREATE INDEX IF NOT EXISTS MonthlyResult_month_returnPct_idx ON MonthlyResult(month, returnPct);
''')
connection.commit()
connection.close()
print(db_path)
