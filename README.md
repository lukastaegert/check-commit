# check-commit
Command line tools for commit validation with regular expressions suitable for
[husky](https://github.com/typicode/husky).

## Usage

check-commit requires Node 6+.
Add check-commit and husky to your project:
```bash
npm install check-commit husky --save-dev
```
Then enable commit branch name validation by adding this your `package.json` file:
```json
{
  "scripts": {
    "precommit": "check-commit-branch"
  },
  "config": {
    "checkCommit": {
      "branch": "^feature/\\w+$"
    }
  }
}
```
Now you can only commit on branches that satisfy the pattern `feature/<identifier>`

## API
```bash
npm install check-commit --save-dev
```
will locally install a binary `check-commit-branch` which is then available to your `package.json` scripts.

`check-commit-branch` will evaluate the `config.checkCommit.branch` key of your `package.json` file. The following configuration
formats are supported:
* Simple regular expression
  ```
  "branch": "<RegExp>"
  ```
  Only allow commits if the current branch satisfies `<RegExp>`.

* Array of regular expressions
  ```
  "branch": ["<RegExp1>", "<RegExp2>", "<RegExp3>"]
  ```
  Only allow commits if the current branch satisfies either of the regular expressions `<RegExp1>`, `<RegExp2>` or
  `<RegExp3>`.

* Array of validation rules
  ```
  "branch": [
    {
      test: "<RegExp1>",
      forbid: "<ForbiddenRegExp1>",
      reason: "Lovely commits need to be cool"
    },
    {
      test: "<RegExp2>",
      require: "<RequiredRegExp2>",
      reason: "Cool commits need to be lovely"
    },
    "<RegExp3>"
  ]
  ```
  In the previous case, you can replace regular expressions by validation rules. Validation rule objects can have the
  following fields:
  - `test` (mandatory): This rule only applies to branches which satisfy this regular expression. A branch can only be
    valid if it satisfies at least one rule.
  - `require` (optional): An additional regular expression that needs to be satisfied by branches satisfying `test`
  - `forbid` (optional): An additional regular expression that branches that satisfy `test` must not satisfy
  - `reason` (optional): A description why this rule is in place. This is printed to the console as additional
    information when this rule is violated.
   
  If a branch satisfies the `test` expressions of several rules, all `require` and `forbid` conditions of these rules
  need to be met in order for the commit to pass.
  
  If you only have a single validation rule, you do not need to wrap it in an array.
  
  Simple strings are equivalent to rules that only have a `test` field.

## Troubleshooting
You may safely check your configured hook against the current branch without committing by running
```bash
npm run precommit
```

### Git hooks triggering
If the git hooks do not trigger on commit, there might have already been custom git hooks defined in your git repository
before you installed husky. To solve this, you can run
```bash
rm .git/hooks/*
npm install husky
```
which will replace all git hooks by husky's hooks.


### Using `yarn`
If you install husky using yarn, it is possible that husky's post-install scripts do not run. In that case, you can try
running
```bash
npm install husky
```
after the installation, which will not change your `package.json` or `yarn.lock` file but make sure husky's scripts run.
