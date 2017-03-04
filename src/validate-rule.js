const { Either: { Left, Right } } = require('ramda-fantasy');
const { compose, defaultTo, ifElse, not, test } = require('ramda');

const satisfiesRequire = rule => compose(not, test(defaultTo(/.*/, rule.require)));
const satisfiesForbid = rule => test(defaultTo(/.^/, rule.forbid));

const validateRule = (rule, satisfies) => ifElse(satisfies(rule), () => Left(rule.reason), Right);

module.exports.validateRule = (EitherTextOrFailure, rule) =>
  EitherTextOrFailure
    .chain(validateRule(rule, satisfiesRequire))
    .chain(validateRule(rule, satisfiesForbid));
