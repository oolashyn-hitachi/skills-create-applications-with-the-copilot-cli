const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const test = require('node:test');

const {
  addition,
  subtraction,
  multiplication,
  division,
  modulo,
  power,
  squareRoot,
  calculate,
} = require('../calculator');

const calculatorPath = path.join(__dirname, '..', 'calculator.js');

test('addition adds two numbers', () => {
  assert.equal(addition(2, 3), 5);
  assert.equal(addition(-2, 3), 1);
});

test('subtraction subtracts the second number from the first', () => {
  assert.equal(subtraction(10, 4), 6);
  assert.equal(subtraction(4, 10), -6);
});

test('multiplication multiplies two numbers', () => {
  assert.equal(multiplication(45, 2), 90);
  assert.equal(multiplication(-3, 2), -6);
});

test('division divides the first number by the second', () => {
  assert.equal(division(20, 5), 4);
  assert.equal(division(7, 2), 3.5);
});

test('division rejects a zero divisor', () => {
  assert.throws(() => division(1, 0), {
    name: 'RangeError',
    message: 'Cannot divide by zero.',
  });
});

test('modulo returns the remainder after division', () => {
  assert.equal(modulo(5, 2), 1);
  assert.equal(modulo(10, 5), 0);
  assert.equal(modulo(-5, 2), -1);
});

test('modulo rejects a zero divisor', () => {
  assert.throws(() => modulo(5, 0), {
    name: 'RangeError',
    message: 'Cannot calculate modulo with a zero divisor.',
  });
});

test('power raises a base to its exponent', () => {
  assert.equal(power(2, 3), 8);
  assert.equal(power(5, 0), 1);
  assert.equal(power(2, -1), 0.5);
});

test('square root returns the square root of a non-negative number', () => {
  assert.equal(squareRoot(16), 4);
  assert.equal(squareRoot(0), 0);
  assert.equal(squareRoot(2), Math.sqrt(2));
});

test('square root rejects negative numbers', () => {
  assert.throws(() => squareRoot(-1), {
    name: 'RangeError',
    message: 'Cannot calculate the square root of a negative number.',
  });
});

test('calculate accepts operation names and symbols', () => {
  assert.equal(calculate('addition', 2, 3), 5);
  assert.equal(calculate('-', 10, 4), 6);
  assert.equal(calculate('multiply', 45, 2), 90);
  assert.equal(calculate('/', 20, 5), 4);
  assert.equal(calculate('modulo', 5, 2), 1);
  assert.equal(calculate('^', 2, 3), 8);
  assert.equal(calculate('square root', 16), 4);
});

test('calculate rejects unsupported operations', () => {
  for (const operation of ['unknown', 'constructor', 'toString', '__proto__']) {
    assert.throws(
      () => calculate(operation, 7, 2),
      new RegExp(`Unsupported operation: ${operation}`),
    );
  }
});

test('calculate validates unary and binary operand counts', () => {
  assert.throws(() => calculate('square root', 16, 2), /exactly one operand/);
  assert.throws(() => calculate('square root'), /exactly one operand/);
  assert.throws(() => calculate('addition', 2), /requires two operands/);
});

test('CLI prints results for the examples in the exercise', () => {
  const examples = [
    ['+', '2', '3', '5'],
    ['-', '10', '4', '6'],
    ['*', '45', '2', '90'],
    ['/', '20', '5', '4'],
  ];

  for (const [operation, left, right, expected] of examples) {
    const result = spawnSync(
      process.execPath,
      [calculatorPath, operation, left, right],
      { encoding: 'utf8' },
    );

    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout.trim(), expected);
  }
});

test('CLI reports invalid operands and division by zero', () => {
  const invalidOperand = spawnSync(
    process.execPath,
    [calculatorPath, '+', 'not-a-number', '2'],
    { encoding: 'utf8' },
  );
  assert.equal(invalidOperand.status, 1);
  assert.match(invalidOperand.stderr, /Operand 1 must be a finite number/);

  const divisionByZero = spawnSync(
    process.execPath,
    [calculatorPath, '/', '20', '0'],
    { encoding: 'utf8' },
  );
  assert.equal(divisionByZero.status, 1);
  assert.match(divisionByZero.stderr, /Cannot divide by zero/);
});

test('CLI runs modulo, power, and square root operations', () => {
  const examples = [
    [['modulo', '5', '2'], '1'],
    [['power', '2', '3'], '8'],
    [['square-root', '16'], '4'],
  ];

  for (const [args, expected] of examples) {
    const result = spawnSync(process.execPath, [calculatorPath, ...args], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout.trim(), expected);
  }
});

test('CLI reports negative square root and zero modulo divisor errors', () => {
  const negativeSquareRoot = spawnSync(
    process.execPath,
    [calculatorPath, 'sqrt', '-1'],
    { encoding: 'utf8' },
  );
  assert.equal(negativeSquareRoot.status, 1);
  assert.match(negativeSquareRoot.stderr, /square root of a negative number/);

  const moduloByZero = spawnSync(
    process.execPath,
    [calculatorPath, '%', '5', '0'],
    { encoding: 'utf8' },
  );
  assert.equal(moduloByZero.status, 1);
  assert.match(moduloByZero.stderr, /modulo with a zero divisor/);
});
