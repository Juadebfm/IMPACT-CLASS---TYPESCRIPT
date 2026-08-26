// 01 - primitives || normal data types
const courseName: string = "Typescript Foundations";
const sessionMinutes: number = 150;
const isProjectReady: boolean = false;

let statusMessage: string = "Starting";
let currentTime: number = 0;

statusMessage = "Ready";
currentTime = 18500;

console.log({
  courseName,
  sessionMinutes,
  isProjectReady,
  statusMessage,
  currentTime,
});

// 02 - Dealing with Arrays-functions use interfaces for the explicit data type allocation
interface SimpleExpenseType {
  title: string;
  amount: number;
}

const expenses: SimpleExpenseType[] = [
  { title: "Groceries", amount: 18500 }, // item 1
  { title: "Internet", amount: 50000 }, // item 2
];

function calculateTotal(items: SimpleExpenseType[]): number {
  return items.reduce((total, item) => total + item.amount, 0);
}

function expensesTitles(items: SimpleExpenseType[]): string[] {
  return items.map((item) => item.title);
}
console.log(calculateTotal(expenses));
console.log(expensesTitles(expenses));

// 03 - aliases and (narrowing -- talk about later)
type ExpenseScope = "personal" | "organization";

function isExpenseScope(value: string): value is ExpenseScope {
  return value === "personal" || value === "organization";
}

function labelScope(value: string): string {
  if (isExpenseScope(value)) {
    return `Selected Scope: ${value}`;
  }

  return "Select personal or organization";
}

console.log(labelScope("organization")); // Organization
console.log(labelScope("team"));
