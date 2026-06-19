
import { generateBOQ } from "../lib/boq-calculator";

// Test Case 1: 100 sq.m, 1 Story
console.log("--- Test Case 1: 100 sq.m, 1 Story ---");
const items1 = generateBOQ({ area: 100, storyType: "1" });
const total1 = items1.reduce((sum, item) => sum + item.totalPrice, 0);
console.log("Total Price:", total1.toLocaleString());
console.log("Price per sqm:", (total1 / 100).toLocaleString());

// Test Case 2: 200 sq.m, 2 Stories
console.log("\n--- Test Case 2: 200 sq.m, 2 Stories ---");
const items2 = generateBOQ({ area: 200, storyType: "2" });
const total2 = items2.reduce((sum, item) => sum + item.totalPrice, 0);
console.log("Total Price:", total2.toLocaleString());
console.log("Price per sqm:", (total2 / 200).toLocaleString());

// Test Case 3: 150 sq.m, 1.5 Stories
console.log("\n--- Test Case 3: 150 sq.m, 1.5 Stories ---");
const items3 = generateBOQ({ area: 150, storyType: "1.5" });
const total3 = items3.reduce((sum, item) => sum + item.totalPrice, 0);
console.log("Total Price:", total3.toLocaleString());
console.log("Price per sqm:", (total3 / 150).toLocaleString());
