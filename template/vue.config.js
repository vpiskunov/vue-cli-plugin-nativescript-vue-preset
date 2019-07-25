/* eslint-disable func-names */
/* eslint-disable no-extend-native */
String.prototype.parse = function () { return this.replace(/\\n/g, '\n'); };
String.prototype.unparse = function () { return this.replace(/\n/g, '\\n'); };
/* eslint-enable func-names */
/* eslint-enable no-extend-native */

const packs = {
  web: ['web', 'w', 'cross'],
  ios: ['native', 'n', 'ios', 'apple', 'cross'],
  android: ['native', 'n', 'android', 'cross'],
};
const platform_match = process.env.npm_config_argv
  ? process.env.npm_config_argv.match(/"\w+:(ios|android|web)"/i) : null;

const platform = process.env.VUE_APP_PLATFORM
  || (platform_match ? platform_match[1] : null) || undefined;

if (!platform) {
  throw Error('Platform could not be determined! \r\n\
    Checked `env.VUE_APP_PLATFORM` & `env.npm_config_argv` - no luck :(\r\n\
    To set alternative method of specifying platform: \r\n\
    edit vue.config.js: "const platform"');
}

const possible_string = [...new Set([].concat(...Object.values(packs)))].join('|');
const options = { multiple: [] };

options.multiple.push({ // replaces [no-replace] -> <NOREPLACE> mid-string,
  // to prevent px|pt stripping
  search: '^[^\\n]*(\\[no-replace\\]).*$',
  replace: line => line
    .parse()
    .replace(/^[^\n]*(\[no-replace\]).*$/gmi, fullmatch => fullmatch
      .replace(/\[no-replace\]/i, '')
      .replace(/(\d*\.?\d+)\s{0,4}(px|pt)/gi, '$1<NOREPLACE>$2'))
    .unparse(), // '$1', // $1 = match1
  flags: 'gim',
  strict: false,
});

if (process.env.VUE_APP_MODE !== 'web') {
  options.multiple.push({ // strips unit type from values - only in native
    search: '(\\d*\\.?\\d+)\\s{0,4}(px|pt)',
    replace: '$1', // $1 = match1
    flags: 'gim',
    strict: false,
  });
}

options.multiple.push({ // strips unit type from values - only in native
  search: '(<NOREPLACE>)',
  replace: '',
  flags: 'gim',
  strict: false,
});


const regex = new RegExp(`^.*\\[(?:${possible_string})\\].*`, 'gm');

options.multiple.push({ // strips non-targeted platform code by (tags)
  // search: '^.*\\[(?!.*:).*',
  search: `^.*\\[(?:${possible_string})\\].*`,
  replace: line => line
    .parse()
    .replace(regex, (fm) => {
      const tags = fm.match(/\[([^\]]+)\]/g).map(tag => tag.replace(/[[\]]/g, ''));
      const matched = tags.filter(tag => packs[platform].indexOf(tag) !== -1);
      return matched.length ? fm.replace(/\[([^\]]+)\]/g, '') : '';
    }).unparse(),
  flags: 'gm',
  strict: false,
});

const rules = ['css', 'postcss', 'scss', 'sass', 'less', 'stylus'];
const oneofs = ['vue-modules', 'vue', 'normal-modules', 'normal'];

/* eslint-disable indent */
module.exports = {
  chainWebpack: (config) => {
    rules.forEach((rule) => {
      oneofs.forEach((oneof) => {
        config.module
          .rule(rule)
          .oneOf(oneof)
          .use('string-replace-loader')
          .loader('string-replace-loader')
          .before('css-loader')
          .options(options)
          .end();
      });
    });
  },
};
/* eslint-enable indent */
