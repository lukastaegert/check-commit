const validateRule = require('../src/validate-rule')
const { expect } = require('chai')
const { Either: { Right, Left } } = require('ramda-fantasy')

describe('validateRule', () => {
  it('returns a Right if there is neither a require nor a forbid clause', () => {
    expect(validateRule(Right('Text'), {
      test: /^Text/,
      reason: 'Reason'
    })).to.deep.equal(Right('Text'))
  })

  it('returns a Right if there is a satisfied require clause', () => {
    expect(validateRule(Right('Text1'), {
      require: /^Text\d/
    })).to.deep.equal(Right('Text1'))
  })

  it('returns an empty Left if there is a require clause which is violated', () => {
    expect(validateRule(Right('TextX'), {
      require: /^Text\d/
    })).to.deep.equal(Left())
  })

  it('returns a Left containing the reason if there is also a reason given', () => {
    expect(validateRule(Right('TextX'), {
      require: /^Text\d/,
      reason: 'Reason'
    })).to.deep.equal(Left('Reason'))
  })

  it('returns a Right if there is a unsatisfied forbid clause', () => {
    expect(validateRule(Right('TextX'), {
      forbid: /^Text\d/
    })).to.deep.equal(Right('TextX'))
  })

  it('returns an empty Left if there is a satisfied forbid clause', () => {
    expect(validateRule(Right('Text1'), {
      forbid: /^Text\d/
    })).to.deep.equal(Left())
  })

  it('returns a Left containing the reason if there is also a reason given', () => {
    expect(validateRule(Right('Text1'), {
      forbid: /^Text\d/,
      reason: 'Reason'
    })).to.deep.equal(Left('Reason'))
  })
})
