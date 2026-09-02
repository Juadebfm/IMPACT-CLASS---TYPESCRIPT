// 01 - primitives || normal data types
const courseName = "Typescript Foundations";
const sessionMinutes = 150;
const isProjectReady = false;
let statusMessage = "Starting";
let currentTime = 0;
statusMessage = "Ready";
currentTime = 18500;
console.log({
    courseName,
    sessionMinutes,
    isProjectReady,
    statusMessage,
    currentTime,
});
const expenses = [
    { title: "Groceries", amount: 18500 }, // item 1
    { title: "Internet", amount: 50000 }, // item 2
];
function calculateTotal(items) {
    return items.reduce((total, item) => total + item.amount, 0);
}
function expensesTitles(items) {
    return items.map((item) => item.title);
}
console.log(calculateTotal(expenses));
console.log(expensesTitles(expenses));
function isExpenseScope(value) {
    return value === "personal" || value === "organization";
}
function labelScope(value) {
    if (isExpenseScope(value)) {
        return `Selected Scope: ${value}`;
    }
    return "Select personal or organization";
}
console.log(labelScope("organization")); // Organization
console.log(labelScope("team"));
const operationsBudget = {
    name: "Operations",
    limit: 50000,
    spent: 125000,
};
function remainingBudget(budget) {
    return budget.limit - budget.spent;
}
function isOverBudget(budget) {
    return budget.spent > budget.limit;
}
console.log("The remaing budget is: ", remainingBudget(operationsBudget));
console.log("This is an over budget true or false: ", isOverBudget(operationsBudget));
export {};
//# sourceMappingURL=index%20copy.js.map