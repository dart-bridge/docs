var exec = require('child_process').execSync;

module.exports = function() {
  var changes = exec('git status --porcelain').toString();
  if (changes != '')
    console.log('Must commit all changes first!');
  console.log(exec('git subtree push --prefix dist origin gh-pages').toString().trim());
}
