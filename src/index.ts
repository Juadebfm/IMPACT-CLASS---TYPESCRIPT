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
} from "./storage.js";

function byId<T extends HTMLElement>(id: string): T {
  const element = document.querySelector<T>(`#${id}`);
  if (!element) throw new Error(`Missing #${id}`);

  return element;
}

// Calls the elements in the DOM
const authView = byId<HTMLElement>("authView");
const appView = byId<HTMLElement>("appView");
const registerForm = byId<HTMLFormElement>("registerForm");
const loginForm = byId<HTMLFormElement>("loginForm");
const expenseForm = byId<HTMLFormElement>("expenseForm");
const categoryForm = byId<HTMLFormElement>("categoryForm");
const categorySelect = byId<HTMLSelectElement>("categorySelect");
const categoryList = byId<HTMLUListElement>("categoryList");
const expenseList = byId<HTMLElement>("expenseList");
const total = byId<HTMLElement>("total");

const authMessage = byId<HTMLElement>("authMessage");
const expenseMessage = byId<HTMLElement>("expenseMessage");
const categoryMessage = byId<HTMLElement>("categoryMessage");
const signoutButton = byId<HTMLButtonElement>("signOutBtn");
const welcome = byId<HTMLElement>("welcome");

let currentUser: User | null = getSession();
let activeScope: ExpenseScope | "all" = "personal";

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
    (expense) => activeScope === "all" || expense.scope === activeScope,
  );
  const sum = expenses.reduce((value, expense) => value + expense.amount, 0);
  expenseList.replaceChildren();
  total.textContent = `${expenses.length} expense(s) | Total: ${sum.toLocaleString()}`;

  document
    .querySelectorAll<HTMLButtonElement>("[data-scope]")
    .forEach((button) => {
      const isActive = button.dataset.scope === activeScope;
      button.classList.toggle("active", isActive);
      button.ariaPressed = String(isActive);
    });

  expenses.forEach((expense) => {
    const item = document.createElement("li");
    const details = document.createElement("div");
    const title = document.createElement("strong");
    const meta = document.createElement("p");
    const delExpItem = document.createElement("button");

    item.className = "expense-item";
    title.textContent = expense.title;
    meta.textContent = `${expense.category} | ${expense.scope} | ${expense.amount.toLocaleString()}`;

    delExpItem.type = "button";
    delExpItem.className = "delete";
    delExpItem.dataset.delete = expense.id;
    delExpItem.textContent = "Delete";
    delExpItem.hidden = expense.ownerId != currentUser?.id;

    details.append(title, meta);
    item.append(details, delExpItem);
    expenseList.append(item);
  });
}

function renderApp(): void {
  const signedIn = currentUser !== null;
  authView.hidden = signedIn;
  appView.hidden = !signedIn;

  if (!currentUser) return;

  welcome.textContent = `Welcome, ${currentUser.name}`;
  renderCategories();
  renderExpenses();
}

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(registerForm);
  const name = String(data.get("name") ?? "").trim();
  const email = String(data.get("email") ?? "".trim().toLowerCase());
  const password = String(data.get("password") ?? "");

  const users = getUsers();

  if (!name || !email || password.length < 6) {
    showMessage(
      authMessage,
      "Enter a name, email, and password of at least 6 characters",
    );
    return;
  }

  const user: User = { id: makeId(), name, email, password };
  saveUsers([...users, user]);
  currentUser = user;
  saveSession(user);
  registerForm.reset();
  showMessage(authMessage);
  renderApp();
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(loginForm);
  const email = String(data.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(data.get("password") ?? "");
  const user = getUsers().find(
    (item) => item.email === email && item.password === password,
  );

  if (!user) {
    showMessage(authMessage, "Email or password is incorrect");
    return;
  }

  currentUser = user;
  saveSession(user);
  loginForm.reset();
  showMessage(authMessage);
  renderApp();
});

expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!currentUser) return;

  const data = new FormData(expenseForm);
  const rawScope = String(data.get("scope") ?? "");

  if (!isExpenseScope(rawScope)) {
    showMessage(expenseMessage, "Choose a valid scope");
    return;
  }

  const input: ExpenseInput = {
    title: String(data.get("title") ?? "").trim(),
    amount: Number(data.get("amount")),
    category: String(data.get("category") ?? ""),
    scope: rawScope,
  };

  const error = validateExpense(input);

  if (error) {
    showMessage(expenseMessage, error);
    return;
  }

  const expense: Expense = {
    id: makeId(),
    ownerId: currentUser.id,
    createdAt: new Date().toISOString(),
    ...input,
  };

  saveExpenses([expense, ...getExpenses()]);
  expenseForm.reset();
  showMessage(expenseMessage);
  renderExpenses();
});

categoryForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(categoryForm);
  const category = String(data.get("category") ?? "").trim();
  const categories = getCategories();

  if (!category) {
    showMessage(categoryMessage, "Enter a category name");
    return;
  }

  if (
    categories.some((item) => item.toLowerCase() === category.toLowerCase())
  ) {
    showMessage(categoryMessage, "That category already exists");
    return;
  }

  saveCategories([...getCategories(), category]);
  categoryForm.reset();
  showMessage(categoryMessage);
  renderCategories();
});

categoryList.addEventListener("click", (e) => {
  const target = e.target;

  if (!(target instanceof HTMLButtonElement)) return;

  const category = target.dataset.category;

  if (!category) return;

  saveCategories(getCategories().filter((item) => item !== category));
  renderCategories();
});

// categoryList.addEventListener("click", (e) => {
//   const button = (e.target as HTMLElement).closest<HTMLButtonElement>(
//     "[data-category]",
//   );

//   if (!button) return;

//   const category = button.dataset.category;

//   if (!category) return;

//   if (getExpenses().some((expense) => expense.category === category)) {
//     showMessage(categoryMessage, "Delete expenses using this category first");
//   }

//   saveCategories(getCategories().filter((item) => item !== category));

//   showMessage(categoryMessage);

//   renderCategories();
// });

expenseList.addEventListener("click", (e) => {
  if (!currentUser) return;

  const target = e.target;

  if (!(target instanceof HTMLButtonElement)) return;

  const expenseId = target.dataset.delete;

  if (!expenseId) return;

  const expense = getExpenses().find((item) => item.id === expenseId);

  if (!expense || expense.ownerId !== currentUser.id) return;

  saveExpenses(getExpenses().filter((item) => item.id !== expenseId));

  renderExpenses();
});

document
  .querySelectorAll<HTMLButtonElement>("[data-scope]")
  .forEach((button) => {
    button.addEventListener("click", () => {
      const scope = button.dataset.scope;
      if (scope && (scope === "all" || isExpenseScope(scope))) {
        activeScope = scope;
        renderExpenses();
      }
    });
  });

signoutButton.addEventListener("click", () => {
  currentUser = null;
  clearSession();
  renderApp();
});

renderApp();
