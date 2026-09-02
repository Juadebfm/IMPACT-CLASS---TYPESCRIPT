import type { Expense, User } from "./types";
export declare function getUsers(): User[];
export declare function saveUsers(users: User[]): void;
export declare function getExpenses(): Expense[];
export declare function saveExpenses(expenses: Expense[]): void;
export declare function getCategories(): string[];
export declare function saveCategories(categories: string[]): void;
export declare function getSession(): User | null;
export declare function saveSession(user: User): void;
export declare function clearSession(): void;
//# sourceMappingURL=storage.d.ts.map