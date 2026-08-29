export type ExpenseScope = "personal" | "organization";
export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}
export interface Expense {
    id: string;
    ownerId: string;
    title: string;
    amount: number;
    category: string;
    scope: ExpenseScope;
    createdAt: string;
}
export interface ExpenseInput {
    title: string;
    amount: number;
    category: string;
    scope: ExpenseScope;
}
//# sourceMappingURL=types.d.ts.map