var exec = require('child_process').execSync;

module.exports = function() {
  console.log(exec('git subtree push --prefix dist origin gh-pages').toString().trim());
  exec('git push');
}
