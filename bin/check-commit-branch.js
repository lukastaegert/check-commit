#!/usr/bin/env node

const findup = require('findup');
const { readFileSync } = require('fs');
const { resolve } = require('path');
const repoInfo = require('git-repo-info')();
const chalk = require('chalk');
const { compose, isNil, path, F, tryCatch } = require('ramda');
const { Either } = require('ramda-fantasy');

const { normalizeRules } = require('../src/normalize-rules');
const { validateRules } = require('../src/validate-rules');

const getConfigFilePath = fileName => resolve(findup.sync(process.cwd(), fileName), fileName);
const parseConfigFile = compose(JSON.parse, readFileSync, getConfigFilePath);
const getConfigFile = tryCatch(parseConfigFile, F);

const userConfig = path([ 'config', 'checkCommit', 'branch' ], getConfigFile('package.json'));
if (isNil(userConfig)) {
  console.error(`No ${chalk.cyan('check-commit-branch')} configuration found.`);
  process.exit(1);
}

const getValidationResult = compose(validateRules(repoInfo.branch), normalizeRules);

Either.either(
  reason => {
    console.error(`You are not allowed to commit on branch ${chalk.cyan(repoInfo.branch)}.`);
    reason && console.error(`${chalk.bold(reason)}`);
    process.exit(1);
  },
  () => process.exit(0),
  getValidationResult(userConfig)
);
