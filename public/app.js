const theorems = [
  {
    rule: 'A + A = A',
    explanation: 'Idempotent Law: duplicating a term does not change the expression.'
  },
  {
    rule: 'A + A\' = 1',
    explanation: 'Complement Law: a variable ORed with its complement is 1.'
  },
  {
    rule: 'A A\' = 0',
    explanation: 'Complement Law: a variable ANDed with its complement is 0.'
  }
];

const exprInput = document.getElementById('expr');

// virtual keyboard for easier input
document.querySelectorAll('#pad button[data-val]').forEach(btn => {
  btn.addEventListener('click', () => {
    exprInput.value += btn.getAttribute('data-val');
  });
});
document.getElementById('backspace').addEventListener('click', () => {
  exprInput.value = exprInput.value.slice(0, -1);
});
document.getElementById('clear').addEventListener('click', () => {
  exprInput.value = '';
});

function convertExpression(expr) {
  let res = expr.replace(/([A-Z])'/g, '!$1');
  res = res.replace(/([A-Z])(!?[A-Z])/g, '$1&&$2');
  res = res.replace(/\*/g, '&&');
  res = res.replace(/\+/g, '||');
  res = res.replace(/ /g, '');
  res = res.replace(/([A-Z])(?=\()/g, '$1&&');
  res = res.replace(/\)(?=[A-Z])/g, ')&&');
  return res;
}

document.getElementById('analyze').addEventListener('click', () => {
  const expr = exprInput.value;
  const stepsEl = document.getElementById('steps');
  const kmapEl = document.getElementById('kmap');
  const theoremsEl = document.getElementById('theorems');

  stepsEl.textContent = '';
  kmapEl.innerHTML = '';
  theoremsEl.textContent = '';

  if (!expr) {
    stepsEl.textContent = 'Please enter an expression.';
    return;
  }

  const variables = Array.from(new Set(expr.match(/[A-Z]/g))).sort();
  if (variables.length === 0 || variables.length > 4) {
    stepsEl.textContent = 'Expression must contain 1-4 variables named A-D';
    return;
  }

  stepsEl.textContent += `Variables detected: ${variables.join(', ')}\n`;

  const minterms = [];
  const total = 1 << variables.length;
  for (let i = 0; i < total; i++) {
    const assignment = {};
    variables.forEach((v, index) => {
      assignment[v] = (i >> (variables.length - index - 1)) & 1;
    });
    let jsExpr = convertExpression(expr);
    variables.forEach(v => {
      jsExpr = jsExpr.replace(new RegExp(v, 'g'), `assignment['${v}']`);
    });
    let value = false;
    try {
      value = eval(jsExpr);
    } catch (e) {
      stepsEl.textContent += `Error evaluating expression: ${e.message}`;
      return;
    }
    if (value) {
      minterms.push(i);
    }
  }
  stepsEl.textContent += `Minterms: ${minterms.join(', ')}\n`;

  // Build Karnaugh map for up to 4 variables
  const gray = [0,1,3,2];
  const cells = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const index = (gray[r] << 2) | gray[c];
      const cell = document.createElement('div');
      cell.className = 'kcell';
      cell.textContent = minterms.includes(index) ? '1' : '0';
      kmapEl.appendChild(cell);
      cells.push(cell);
    }
  }

  stepsEl.textContent += 'K-map generated using Gray code order 00,01,11,10 for rows and columns.\n';

  theorems.forEach(t => {
    theoremsEl.textContent += `${t.rule} : ${t.explanation}\n`;
  });
});
