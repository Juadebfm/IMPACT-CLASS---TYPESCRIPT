import type { Expense, ExpenseInput, ExpenseScope, User } from "./types";

import {
  clearSession,
  getCategories,
  getExpenses,
  getSession,
  getUsers,
  saveCategories,
  saveExpenses,
  saveSession,
  saveUsers,
} from "./storage";

function byId<T extends HTMLElement>(id: string): T {
  const element = document.querySelector<T>(`#${id}`);
  if (!element) throw new Error(`Missing #${id}`);

  return element;
}

// Calls the elements in the DOM
const authView = byId<HTMLElement>("authView");
const appView = byId<HTMLElement>("appView");
const registerForm = byId<HTMLElement>("registerForm");
const loginForm = byId<HTMLElement>("loginForm");
const expenseForm = byId<HTMLElement>("expenseForm");
const categoryForm = byId<HTMLElement>("categoryForm");
const categorySelect = byId<HTMLElement>("categorySelect");
const categoryList = byId<HTMLElement>("categoryList");
const expenseList = byId<HTMLElement>("expenseList");
const total = byId<HTMLElement>("total");

const authMessage = byId<HTMLElement>("authMessage");
const expenseMessage = byId<HTMLElement>("expenseMessage");
const categoryMessage = byId<HTMLElement>("categoryMessage");
const signoutButton = byId<HTMLElement>("signOutBtn");

let currentUser: User | null = getSession();
let activeScope: ExpenseScope = "personal";

function showMessage(target: HTMLElement, value = ""): void {
  target.textContent = value;
}

function makeId(): string {
  return crypto.randomUUID();
}

function isExpenseScope(value: string): value is ExpenseScope {
  return value === "personal" || value === "organization";
}

function validateExpense(input: ExpenseInput): string | null {
  if (!input.title.trim()) return "Enter an expense title.";
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    return "Enter an amount greater than Zero";
  }
  if (!input.category) return "Choose a category";
  return null;
}

function visibleExpenses(): Expense[] {
  if (!currentUser) return [];
  return getExpenses().filter((expense) => {
    return (
      expense.ownerId === currentUser?.id || expense.scope === "organization"
    );
  });
}

function renderCategories(): void {
  const categories = getCategories();
  categorySelect.replaceChildren();
  categoryList.replaceChildren();

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.append(option);

    const chip = document.createElement("span");
    const remove = document.createElement("button");
    chip.className = "chip";
    chip.textContent = category;
    remove.type = "button";
    remove.dataset.category = category;
    remove.textContent = "X";
    chip.append(remove);
    categoryList.append(chip);
  });
}

function renderExpenses(): void {
  const expenses = visibleExpenses().filter(
    (expense) => expense.scope === activeScope,
  );
  const sum = expenses.reduce((value, expense) => value + expense.amount, 0);
  expenseList.replaceChildren();
  total.textContent = `${expenses.length} expense(s) | Total: ${sum.toLocaleString()}`;

  expenses.forEach((expense) => {
    const item = document.createElement("li");
    const remove = document.createElement("button");
    const details = document.createElement("div");
    item.className = "expense_item";

    const title = document.createElement("strong");
    title.textContent = expense.title;

    const meta = document.createElement("p");
    // meta.className = "expense_meta";
    meta.textContent = `${expense.category} | ${expense.scope} | ${expense.amount.toLocaleString()}`;

    remove.type = "button";
    // remove.className = "danger";
    remove.dataset.delete = expense.id;
    remove.textContent = "Delete";

    remove.hidden = expense.ownerId !== currentUser?.id;
    details.append(title, meta);
    item.append(details, remove);
    expenseList.append(item);
  });
}

