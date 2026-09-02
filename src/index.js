import { clearSession, getCategories, getExpenses, getSession, getUsers, saveCategories, saveExpenses, saveSession, saveUsers, } from "./storage";
function byId(id) {
    const element = document.querySelector(`#${id}`);
    if (!element)
        throw new Error(`Missing #${id}`);
    return element;
}
// Calls the elements in the DOM
const authView = byId("authView");
const appView = byId("appView");
const registerForm = byId("registerForm");
const loginForm = byId("loginForm");
const expenseForm = byId("expenseForm");
const categoryForm = byId("categoryForm");
const categorySelect = byId("categorySelect");
const categoryList = byId("categoryList");
const expenseList = byId("expenseList");
const total = byId("total");
const authMessage = byId("authMessage");
const expenseMessage = byId("expenseMessage");
const categoryMessage = byId("categoryMessage");
const signoutButton = byId("signOutBtn");
let currentUser = getSession();
let activeScope = "personal";
function showMessage(target, value = "") {
    target.textContent = value;
}
function makeId() {
    return crypto.randomUUID();
}
function isExpenseScope(value) {
    return value === "personal" || value === "organization";
}
function validateExpense(input) {
    if (!input.title.trim())
        return "Enter an expense title.";
    if (!Number.isFinite(input.amount) || input.amount <= 0) {
        return "Enter an amount greater than Zero";
    }
    if (!input.category)
        return "Choose a category";
    return null;
}
function visibleExpenses() {
    if (!currentUser)
        return [];
    return getExpenses().filter((expense) => {
        return (expense.ownerId === currentUser?.id || expense.scope === "organization");
    });
}
function renderCategories() {
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
function renderExpenses() {
    const expenses = visibleExpenses().filter((expense) => expense.scope === activeScope);
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
//# sourceMappingURL=index.js.map