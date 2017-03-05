const validateRules = require('../src/validate-rules')
const { expect } = require('chai')
const { Either: { Right, Left } } = require('ramda-fantasy')

describe('validateRules', () => {
  const validateRulesForName = validateRules('name')

  it('returns a Right if all matching rules are satisfied', () => {
    expect(validateRulesForName([ {
      test: /^n/,
      require: /ame/
    }, {
      test: /^x/,
      require: /y/
    } ])).to.deep.equal(Right('name'))
  })

  it('returns a Left if no rules match', () => {
    expect(validateRulesForName([ {
      test: /^z/,
      require: /ame/
    }, {
      test: /^x/,
      require: /y/
    } ])).to.deep.equal(Left('Does not match any rules'))
  })

  it('returns a Left if there are no rules', () => {
    expect(validateRulesForName([])).to.deep.equal(Left('Does not match any rules'))
  })

  it('returns an empty Left if one matching rule is violated', () => {
    expect(validateRulesForName([ {
      test: /^n/,
      require: /ame/
    }, {
      test: /^n/,
      require: /y/
    } ])).to.deep.equal(Left())
  })

  it('returns a Left with a reason if provided', () => {
    expect(validateRulesForName([ {
      test: /^n/,
      reason: 'reason ame',
      require: /ame/
    }, {
      test: /^n/,
      reason: 'reason y',
      require: /y/
    } ])).to.deep.equal(Left('reason y'))
  })
})
