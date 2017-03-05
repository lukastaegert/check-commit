#!/usr/bin/env node

const repoInfo = require('git-repo-info')();
const chalk = require('chalk');
const { Either } = require('ramda-fantasy');

const validateRules = require('../src/validate-rules');
const getRulesForType = require('../src/get-rules-for-type');

Either.either(
  reason => {
    console.error(`You are not allowed to commit on branch ${chalk.cyan(repoInfo.branch)}.`);
    reason && console.error(`${chalk.bold(reason)}`);
    process.exit(1);
  },
  () => process.exit(0),
  getRulesForType('branch').chain(validateRules(repoInfo.branch))
);
