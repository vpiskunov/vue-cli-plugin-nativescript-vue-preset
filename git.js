const { execSync } = require('child_process');
let git, cwd;

function gitMan (projectDir) {
  cwd = projectDir;
  git = require('simple-git/promise')(cwd);
}

gitMan.prototype.hasProjectGit = function hasProjectGit() {
  let result
  try {
    execSync('git status', { stdio: 'ignore', cwd })
    result = true
  } catch (e) {
    result = false
  }
  return result
}

gitMan.prototype.getChanges = async function getChanges() {
  let diff;
  try {
    diff = await git.status();
    ['ahead', 'behind', 'tracking', 'current'].forEach(k => delete diff[k]);
    Object.keys(diff).forEach(k => {
      if ( !diff[k] || !diff[k].length ) {
        delete diff[k]
      }
    });
    // if(diff && Object.keys(diff).length) {
    //   console.log('Uncommitted changes detected:')
    //   Object.keys(diff)
    //     .filter(k => k !== 'files')
    //     .forEach(k =>
    //       console.log(`${k[0].toUpperCase()+k.toString().substr(1)} files\r\n`, diff[k])
    //     );
    // }
  } catch (e) { throw Error(e) }

  return diff;
}

gitMan.prototype.commitAll = async (msg) => {
  let result;
  console.log(`Committing as '${msg}'`)
  try {
    result = await git.add('.')
    // console.log('git add . :', result)
    result = await git.commit(msg)
    console.log('Changes have been committed to Git:\r\n\t✅ ', result.summary)
  } catch (e) {
    throw Error(e);
  }
  return result;
}

module.exports = gitMan;
