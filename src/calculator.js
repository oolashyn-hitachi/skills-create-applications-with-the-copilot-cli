const operations = {
  '+': 'addition',
  add: 'addition',
  addition: 'addition',
  '-': 'subtraction',
  subtract: 'subtraction',
  subtraction: 'subtraction',
  '*': 'multiplication',
  multiply: 'multiplication',
  multiplication: 'multiplication',
  '/': 'division',
  divide: 'division',
  division: 'division',
  '%': 'modulo',
  mod: 'modulo',
  modulo: 'modulo',
  '^': 'power',
  '**': 'power',
  power: 'power',
  sqrt: 'squareRoot',
  'square-root': 'squareRoot',
  'square root': 'squareRoot',
  squareroot: 'squareRoot',
};

// Supports addition of two numbers.
function addition(left, right) {
  return left + right;
}

// Supports subtraction of the second number from the first.
function subtraction(left, right) {
  return left - right;
}

// Supports multiplication of two numbers.
function multiplication(left, right) {
  return left * right;
}

// Supports division of the first number by the second.
function division(left, right) {
  if (right === 0) {
    throw new RangeError('Cannot divide by zero.');
  }

  return left / right;
}

// Supports modulo by returning the remainder after division.
function modulo(left, right) {
  if (right === 0) {
    throw new RangeError('Cannot calculate modulo with a zero divisor.');
  }

  return left % right;
}

// Supports exponentiation by raising the base to the given exponent.
function power(base, exponent) {
  return base ** exponent;
}

// Supports square root for non-negative numbers.
function squareRoot(number) {
  if (number < 0) {
    throw new RangeError('Cannot calculate the square root of a negative number.');
  }

  return Math.sqrt(number);
}

function calculate(operation, left, right) {
  const operationKey = operation.toLowerCase();
  const normalizedOperation = Object.hasOwn(operations, operationKey)
    ? operations[operationKey]
    : undefined;

  if (!normalizedOperation) {
    throw new Error(`Unsupported operation: ${operation}`);
  }

  if (normalizedOperation === 'squareRoot') {
    if (left === undefined || right !== undefined) {
      throw new Error('Square root requires exactly one operand.');
    }

    return squareRoot(left);
  }

  if (left === undefined || right === undefined) {
    throw new Error(`${normalizedOperation} requires two operands.`);
  }

  const functions = {
    addition,
    subtraction,
    multiplication,
    division,
    modulo,
    power,
  };

  return functions[normalizedOperation](left, right);
}

function parseNumber(value, position) {
  if (value.trim() === '') {
    throw new Error(`Operand ${position} must be a number.`);
  }

  const number = Number(value);
  if (!Number.isFinite(number)) {
    throw new Error(`Operand ${position} must be a finite number.`);
  }

  return number;
}

function main(args) {
  if (args.length < 2 || args.length > 3) {
    throw new Error(
      'Usage: node src/calculator.js <operation> <number> [second-number]',
    );
  }

  const [operation, leftValue, rightValue] = args;
  const left = parseNumber(leftValue, 1);
  const right = rightValue === undefined ? undefined : parseNumber(rightValue, 2);
  const result = calculate(operation, left, right);

  console.log(result);
}

if (require.main === module) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  addition,
  subtraction,
  multiplication,
  division,
  modulo,
  power,
  squareRoot,
  calculate,
};
