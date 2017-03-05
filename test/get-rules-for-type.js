const getRulesForType = require('../src/get-rules-for-type');
const { expect } = require('chai');
const { Either: { Left, Right } } = require('ramda-fantasy');

describe('getRulesForType', () => {
  const initialWorkingDir = process.cwd();

  beforeEach(() => {
    process.chdir('test/test-configs');
  });

  afterEach(() => {
    process.chdir(initialWorkingDir);
  });

  it('wraps a rule object in an array and converts regular expressions', () => {
    expect(getRulesForType('ruleObject')).to.deep.equal(Right([ {
      test: /regExpRuleObject/,
      require: /regExpRequire/,
      forbid: /regExpForbid/,
      reason: 'My Reason'
    } ]))
  });

  it('adds correct defaults for missing regular expressions', () => {
    expect(getRulesForType('missingExpressions')).to.deep.equal(Right([ {
      test: /.*/,
      require: /.*/,
      forbid: /.^/,
      reason: 'My Reason'
    } ]))
  });

  it('converts a string to an array with a rule object', () => {
    expect(getRulesForType('simple')).to.deep.equal(Right([ {
      test: /regExpSimple/,
      require: /.*/,
      forbid: /.^/
    } ]))
  });

  it('replaces the regular expressions in a given rule array', () => {
    expect(getRulesForType('ruleArray')).to.deep.equal(Right([ {
      test: /regExpRule1/,
      require: /regExpRequire/,
      forbid: /.^/,
      reason: 'Reason 1'
    }, {
      test: /regExpRule2/,
      require: /.*/,
      forbid: /regExpForbid/,
      reason: 'Reason 2'
    } ]))
  });

  it('returns a Left if no rules can be found', () => {
    expect(getRulesForType('nonExisting')).to.deep.equal(Left('No rules found'))
  });

  it('returns a Left if no configuration can be found', () => {
    process.chdir('missing-config');
    expect(getRulesForType('any')).to.deep.equal(Left('No configuration found'))
  });

  it('searches upward for a package.json file', () => {
    process.chdir('no-package-json');
    expect(getRulesForType('simple')).to.deep.equal(Right([ {
      test: /regExpSimple/,
      require: /.*/,
      forbid: /.^/
    } ]))
  });

  it('returns a Left if the configuration file cannot be parsed', () => {
    process.chdir('invalid-config-file');
    expect(getRulesForType('any')).to.deep.equal(Left('Cannot parse configuration file'))
  });
});
