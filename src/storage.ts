import type { Expense, User } from "./types";

const KEYS = {
  users: "expense-tracker-users",
  expenses: "expense-tracker-expenses",
  categories: "expense-tracker-categories",
  session: "expense-tracker-session",
};

// Helper functions: Load and Save
function load<T>(key: string, fallback: T): T {
  // take localstorage as the DB
  const saved = localStorage.getItem(key);

  if (!saved) return fallback;

  //   Use that value
  try {
    return JSON.parse(saved) as T;
  } catch (error) {
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// The functions that will use the helper functions as a callback
export function getUsers(): User[] {
  return load<User[]>(KEYS.users, []);
}

export function saveUsers(users: User[]): void {
  save(KEYS.users, users);
}

export function getExpenses(): Expense[] {
  return load<Expense[]>(KEYS.expenses, []);
}

export function saveExpenses(expenses: Expense[]): void {
  save(KEYS.expenses, expenses);
}

export function getCategories(): string[] {
  return load<string[]>(KEYS.categories, ["Food", "Transport", "Utilities"]);
}

export function saveCategories(categories: string[]): void {
  save(KEYS.categories, categories);
}

export function getSession(): User | null {
  return load<User | null>(KEYS.session, null);
}

export function saveSession(user: User): void {
  save(KEYS.session, user);
}

export function clearSession(): void {
  localStorage.removeItem(KEYS.session);
}
