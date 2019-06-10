# vue add nativescript-vue-preset
Fixes most errors caused by installing &lt;nativescript-vue> plugin. 

**IMPORTANT:** run \"vue invoke nativescript-vue-preset\" twice after adding. 

What does it do:
* Adds .eslint.js, with support for fixed module-require resolving + disables unreasonable rules `(you can always edit .eslintrc.js to suit your style)`
* replaces `~/`tilde with `@/`at paths: fixes `Unable to resolve path to module` `import/no-unresolved` &amp; `import/extensions`
