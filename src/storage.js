const KEYS = {
    users: "expense-tracker-users",
    expenses: "expense-tracker-expenses",
    categories: "expense-tracker-categories",
    session: "expense-tracker-session",
};
// Helper functions: Load and Save
function load(key, fallback) {
    // take localstorage as the DB
    const saved = localStorage.getItem(key);
    if (!saved)
        return fallback;
    //   Use that value
    try {
        return JSON.parse(saved);
    }
    catch (error) {
        return fallback;
    }
}
function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
// The functions that will use the helper functions as a callback
export function getUsers() {
    return load(KEYS.users, []);
}
export function saveUsers(users) {
    save(KEYS.users, users);
}
export function getExpenses() {
    return load(KEYS.expenses, []);
}
export function saveExpenses(expenses) {
    save(KEYS.expenses, expenses);
}
export function getCategories() {
    return load(KEYS.categories, ["Food", "Transport", "Utilities"]);
}
export function saveCategories(categories) {
    save(KEYS.categories, categories);
}
export function getSession() {
    return load(KEYS.session, null);
}
export function saveSession(user) {
    save(KEYS.session, user);
}
export function clearSession() {
    localStorage.removeItem(KEYS.session);
}
//# sourceMappingURL=storage.js.map