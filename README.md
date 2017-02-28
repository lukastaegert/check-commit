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

* Validation object
  ```
  "branch": {
    require: "<RegExp1>",
    exclude: "<RegExp2>",
    reason: "This is a bad branch name"
  }
  ```
  Only allow commits if the current branch satisfies `<RegExp1>` and does not satisfy `<RegExp2>`. If validation fails,
  `reason` is printed out as additional information to tell the user why this check is in place.
  `require`, `exclude` and `reason` are all optional and may be omitted.

* Array of validation objects
  ```
  "branch": [
    {require: "...", exclude: "...", reason: "..."},
    {require: "...", exclude: "...", reason: "..."}
  ]
  ```
  Similar to the previous version except that all validation objects are checked in the provided order.

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
