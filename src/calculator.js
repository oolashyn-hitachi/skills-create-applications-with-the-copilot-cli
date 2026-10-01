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

function calculate(operation, left, right) {
  const normalizedOperation = operations[operation.toLowerCase()];

  if (!normalizedOperation) {
    throw new Error(`Unsupported operation: ${operation}`);
  }

  const functions = {
    addition,
    subtraction,
    multiplication,
    division,
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
  if (args.length !== 3) {
    throw new Error('Usage: node src/calculator.js <operation> <number> <number>');
  }

  const [operation, leftValue, rightValue] = args;
  const result = calculate(
    operation,
    parseNumber(leftValue, 1),
    parseNumber(rightValue, 2),
  );

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
  calculate,
};
