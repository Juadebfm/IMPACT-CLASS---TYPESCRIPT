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
export {};
//# sourceMappingURL=index.js.map