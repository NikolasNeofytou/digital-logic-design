# Digital Logic Design Helper

This project provides a small web app to explore Boolean expressions and Karnaugh maps.

## Usage

1. Install dependencies with `npm install`.
2. Run the server using `node index.js` and open `http://localhost:3000` in a browser.
3. Use the on-screen keypad to build a Boolean expression with variables **A-D**, operators **NOT ('), AND (*), OR (+)** and parentheses.
4. Click **Analyze** to see detected variables, minterms and a 4x4 Karnaugh map. The page also lists a few basic Boolean algebra theorems used in simplification.

Expressions follow common notation. For example:

```
A'B + AB'
(A + B)C
```

The keypad allows quick entry without remembering all symbols.
