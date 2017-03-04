const { compose, is, map, mapObjIndexed, objOf, of, unless } = require('ramda');

const ensureArray = unless(is(Array), of);
const ensureRuleObject = unless(is(Object), objOf('test'));
const ensureRegularExpressions = mapObjIndexed((text, key) => key === 'reason' ? text : new RegExp(text));

module.exports.normalizeRules = compose(map(compose(ensureRegularExpressions, ensureRuleObject)), ensureArray);
