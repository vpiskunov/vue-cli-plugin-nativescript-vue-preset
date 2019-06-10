"use strict";
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const gitMan = require('./git')
const { execSync } = require('child_process');

// console.log(`[Generator] started`);
const findReplace = require('./findReplace.js')

let diff, git;

async function gitOps(msg) {
  diff = await git.getChanges();
  console.log('Git files to commit:', diff.files && diff.files.length)

  if(diff && Object.keys(diff).length) {
    await git.commitAll(msg);
  }
}

function cliPluginMain(api, options, rootOptions) {
    if(api.hasPlugin('nativescript-vue')) {
      // console.log('[Generator] options:', options);
      // console.log('[Generator] rootOptions:', rootOptions);
      const projectPath = api.resolve('./');
      git = new gitMan(projectPath);

      // console.log('[Generator] projectPath:', projectPath);
      // console.log('[Generator] hasProjectGit(?):', git.hasProjectGit());

      const rootPath = api.resolve('./src');
      const tempPath = path.resolve(__dirname, 'template', 'src');
      rimraf.sync(tempPath);
      // console.log('[Generator] Rimraf complete');
      fs.mkdirSync(tempPath, { recursive: true });
      // console.log('mkdir tempPath:', tempPath);
      // console.log('[Generator] rootPath:', rootPath);
      findReplace(rootPath, tempPath, `'~/`, `'@/`);
      findReplace(rootPath, tempPath, `VUE_APP_MODE == `, `VUE_APP_MODE === `);
      findReplace(rootPath, tempPath, `'components/HelloWorld'`, `'@/components/HelloWorld'`);
      findReplace(rootPath, tempPath,
        `<!-- copy-webpack-plugin copies asset from src/assets to project output/build directory /assets -->`,
        `<!--
        copy-webpack-plugin copies asset from src/assets to project output/build directory /assets
        -->`);

      api.render('./template');
      if(git.hasProjectGit()) {
        gitOps('vue add nativescript-vue && vue add nativescript-vue-preset');
      }
      console.log('[Generator] Rendered template');
      // var child = execSync('npm run setup-webpack-config');
      // console.log('[Generator] npm run setup-webpack-config complete');

      // diff = await git.getChanges();
      //
      // if(diff && Object.keys(diff).length) {
      //   await git.commitAll('vue add nativescript-vue');
      // }
      // var child = exec('npm run lint -- --mode development.web', (err, stdout, stderr) => {
      //   if (err) {
      //     console.error(err)
      //   }
      //   console.log(`stdout: ${stdout}`);
      //   console.log(`stderr: ${stderr}`);
      //   console.log('[Generator] vue-cli-service lint complete');
      // });
    } else {
      console.log(`You need to run 'vue add nativescript-vue' first!`);
      console.log(`Then reinstall this plugin by running vue invoke nativescript-vue-preset`);
    }
    // api.extendPackage((pkg) => {
    //     console.log(`[Generator] extendPackage`);
    //     console.dir(pkg);
    //     pkg.devDependencies = {
    //         "@bluelovers/tsconfig": "^1.0.2",
    //         "@types/webpack-chain": "^5.2.0",
    //         "terser": "3.17.0",
    //         "terser-webpack-plugin": "^1.2.3",
    //         ...pkg.devDependencies,
    //     };
    //     return pkg;
    // });
    // console.log(`[Generator] options`);
    // console.dir(options);
    // console.log(`[Generator] rootOptions`);
    // console.dir(rootOptions);
    // api.onCreateComplete(() => {
    //   [
    //       '.eslintrc.js',
    //   ].forEach(file => {
    //       console.log('[Generator] forEach file:')
    //       let fpath = api.resolve(file);
    //       let exists = fs.existsSync(fpath);
    //       if (!exists) {
    //           console.log('[Generator] if !exists')
    //           let fpath2 = path.resolve(__dirname, 'files', file);
    //           console.log('[Generator] fpath:', fpath, 'fpath2:', fpath2)
    //           let exists2 = fs.existsSync(fpath2);
    //           console.log('[Generator] exists:', exists, 'exists2:', exists2)
    //           if (exists2) {
    //               console.log('[Generator] if !exists2')
    //               console.log(`[Generator] creating ${file}`);
    //               fs.copyFileSync(fpath2, fpath);
    //           }
    //       }
    //   });
    // });
}
module.exports = cliPluginMain;
