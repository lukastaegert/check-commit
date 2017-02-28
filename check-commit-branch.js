#!/usr/bin/env node

const findup = require('findup');
const {readFileSync} = require('fs');
const {resolve} = require('path');
const repoInfo = require('git-repo-info')();
const {compose, is, isNil, path, F, tryCatch, when} = require('ramda');
const chalk = require('chalk');

const getConfigFilePath = fileName => resolve(findup.sync(process.cwd(), fileName), fileName);
const parseConfigFile = compose(JSON.parse, readFileSync, getConfigFilePath);
const getConfigFile = tryCatch(parseConfigFile, F);

const userConfig = path(['config', 'checkCommit', 'branch'], getConfigFile('package.json'));
if (isNil(userConfig)) {
  console.error(`No ${chalk.cyan('check-commit-branch')} configuration found.`);
  process.exit(1);
}

const ensureConfigObject = when(is(String), require => ({require}));
const ensureArray = when(is(Object), configObject => [configObject]);
const normalizeConfig = compose(ensureArray, ensureConfigObject);

const doesBranchMatch = regExpString => (new RegExp(regExpString)).test(repoInfo.branch);
const validateRule = ({require, exclude, reason}) => {
  if ((require && !doesBranchMatch(require)) || (exclude && doesBranchMatch(exclude))) {
    console.error(`You are not allowed to commit on branch ${chalk.cyan(repoInfo.branch)}.`);
    reason && console.error(`${chalk.bold(reason)}`);
    return process.exit(1);
  }
};

normalizeConfig(userConfig).forEach(validateRule);
