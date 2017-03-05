const validateRule = require('./validate-rule');
const { compose, chain, equals, filter, ifElse, length, prop, reduce, test, __ } = require('ramda');
const { Either: { Right, Left } } = require('ramda-fantasy');

const getMatchingRules = text => filter(compose(test(__, text), prop('test')));

const getEitherNoRulesOrRules = ifElse(
  compose(equals(0), length),
  () => Left('Does not match any rules'),
  Right
);

const validateRules = text => chain(reduce(validateRule, Right(text)));

module.exports = text => compose(
  validateRules(text),
  getEitherNoRulesOrRules,
  getMatchingRules(text)
);
