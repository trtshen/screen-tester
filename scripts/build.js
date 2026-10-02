const fs = require('node:fs');
const path = require('node:path');
const babel = require('@babel/core');
const repo = path.resolve(__dirname, '..');
const site = path.join(repo, 'output/site');
fs.rmSync(site, {recursive: true, force: true});
fs.mkdirSync(path.join(site, 'assets'), {recursive: true});
for (const name of ['index.html', 'LICENSE']) fs.copyFileSync(path.join(repo, name), path.join(site, name));
for (const name of ['react', 'react-dom']) {
  const root = path.dirname(require.resolve(name + '/package.json'));
  fs.copyFileSync(path.join(root, 'umd', name + '.production.min.js'), path.join(site, 'assets', name + '.production.min.js'));
  fs.copyFileSync(path.join(root, 'LICENSE'), path.join(site, 'assets', name + '.LICENSE'));
}
const result = babel.transformFileSync(path.join(repo, 'app.js'), {
  configFile: false, babelrc: false,
  presets: [[require.resolve('@babel/preset-react'), {runtime: 'classic'}]],
  comments: false,
});
fs.writeFileSync(path.join(site, 'assets/app.js'), result.code + '\n');
console.log('Built output/site with local React assets and compiled JSX.');
