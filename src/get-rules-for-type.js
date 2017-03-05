const findup = require('findup');
const { readFileSync } = require('fs');
const { resolve } = require('path');
const {
  chain, compose, ifElse, is, isNil, map, mapObjIndexed, merge, objOf, of, path, prop, tryCatch, unless
} = require('ramda');
const { Either: { Left, Right } } = require('ramda-fantasy');

const getConfigFilePath = fileName => resolve(findup.sync(process.cwd(), fileName), fileName);

const parseConfigFile = compose(
  Right,
  JSON.parse,
  readFileSync,
  getConfigFilePath
);

const getConfigFile = tryCatch(
  parseConfigFile,
  () => Left('Cannot parse configuration file')
);

const chainOrElse = (errorMessage, mapTo) => chain(compose(
  ifElse(
    isNil,
    () => Left(errorMessage),
    Right
  ),
  mapTo
));

const getCheckCommitConfig = () => chainOrElse(
  'No configuration found',
  path([ 'config', 'checkCommit' ])
)(getConfigFile('package.json'));

const getConfigForType = type => chainOrElse(
  'No rules found',
  prop(type)
)(getCheckCommitConfig());

const ensureArray = unless(is(Array), of);
const ensureRuleObject = unless(is(Object), objOf('test'));
const ensureRegularExpressions = mapObjIndexed((text, key) => key === 'reason' ? text : new RegExp(text));
const ensureRegularRuleObject = compose(
  merge({ test: /.*/, require: /.*/, forbid: /.^/ }),
  ensureRegularExpressions,
  ensureRuleObject
);

module.exports = compose(
  map(map(ensureRegularRuleObject)),
  map(ensureArray),
  getConfigForType
);
