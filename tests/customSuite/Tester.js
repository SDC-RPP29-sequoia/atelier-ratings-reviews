class Tester {
  constructor() {
    this.numberPassed = 0;
    this.numberFailed = 0;
  }

  areEqual = function(value1, value2) {
    if (value1 === null || value2 === null) {
      return (value1 === null && value2 === null);
    } else if (Array.isArray(value1) && Array.isArray(value2)) {
      return this.areEqualArrays(value1, value2);
    } else if (typeof value1 === 'object' && typeof value2 === 'object') {
      return this.areEqualObjects(value1, value2);
    } else {
      return value1 === value2;
    }
  }

  areEqualArrays = function(array1, array2) {
    if (array1.length !== array2.length) {
      return false;
    }

    // assumed that array position matters for equality
    for (let i = 0; i < array1.length; i++) {
      if (!this.areEqual(array1[i], array2[i])) {
        return false;
      }
    }

    return true;
  }

  areEqualObjects = function(object1, object2) {
    let object1Keys = Object.keys(object1);
    let object2Keys = Object.keys(object2);

    if (object1Keys.length !== object2Keys.length) {
      return false;
    }

    for (let i = 0; i < object1Keys.length; i++) {
      const key = object1Keys[i];
      if (!object2Keys.includes(key)) {
        return false;
      }
      if (!this.areEqual(object1[key], object2[key])) {
        return false;
      }
    }

    return true;
  }

  expected = (description, result, expected, input, callback) => {
    let message = '';
    let formatting = '';
    if (callback(result, expected)) {
      message = `\u2705 Passed! ${description}`;
      this.numberPassed++;
    } else {
      let inputMsg = input === undefined ? '' :  ` from ${JSON.stringify(input)}`;
      message = `\u274c Failed! Expected ${JSON.stringify(expected)} but got ${JSON.stringify(result)}${inputMsg} for ${description}.`;
      formatting = 'color: #FF0000';
      this.numberFailed++;
    }
    console.log('%c' + message, formatting);
  }

  deeplyEquals = function(description, result, expected, input) {
    return this.expected(description, expected, result, input, this.areEqual);
  };

  isDefined = (description, result, input) => {
    return this.expected(description, undefined, result, input, (result) => result !== undefined);
  }

  isUndefined = (description, result, input) => {
    return this.expected(description, undefined, result, input, (result) => result === undefined);
  }

  // TODO: Make a method for shallowEquals

  testSummary = function() {
    console.log('Test Run Summary');
    if (numberPassed > 0) {
      console.log(`  %c\u2705 Passed: ${this.numberPassed}`, 'color: #00FF00');
    }
    if (numberFailed > 0) {
      console.log(`  %c\u274c Failed: ${this.numberFailed}`, 'color: #FF0000');
    }
  }
}

module.exports.Tester = Tester;