const { Tester } = require('./Tester');

let input;
let expected;
let result;
const tester = new Tester();

input = '';
expected = '';
result = testCategory(input);
tester.deeplyEquals('Description', expected, result, input);

tester.testSummary();