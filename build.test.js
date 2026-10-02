const {execFileSync} = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

test('build ships only local runtime assets and public licenses', () => {
  execFileSync(process.execPath, ['scripts/build.js']);
  const html = fs.readFileSync('output/site/index.html', 'utf8');
  expect(html).not.toMatch(/https?:\/\/|text\/babel/);
  for (const match of html.matchAll(/src="([^"]+)"/g)) expect(fs.existsSync(path.join('output/site', match[1]))).toBe(true);
  expect(fs.readdirSync('output/site').sort()).toEqual(['LICENSE', 'assets', 'index.html']);
  expect(fs.readFileSync('output/site/assets/app.js', 'utf8')).not.toMatch(/<ScreenTester/);
});

test('Pages can deploy only validated default-branch output', () => {
  const yaml = require('js-yaml');
  const read = file => yaml.safeLoad(fs.readFileSync('.github/workflows/' + file, 'utf8'));
  const deploy = read('deploy-page.yml');
  expect(deploy.on.push.branches).toEqual(['master', 'main']);
  expect(deploy.on.pull_request).toBeUndefined();
  expect(deploy.jobs.deploy.needs).toBe('build');
  expect(deploy.jobs.build.if).toContain("github.ref == 'refs/heads/master'");
  expect(deploy.jobs.build.if).toContain("github.ref == 'refs/heads/main'");
  const validate = read('validate.yml');
  const steps = validate.jobs.validate.steps;
  const upload = steps.findIndex(step => step.name === 'Upload validated public site');
  expect(steps[upload].with.path).toBe('output/site');
  for (const command of ['npm ci --ignore-scripts', 'npm run security:audit', 'npm run build']) {
    const index = steps.findIndex(step => step.run === command);
    expect(index).toBeGreaterThanOrEqual(0);
    expect(index).toBeLessThan(upload);
    expect(steps[index]['continue-on-error']).not.toBe(true);
  }
  expect(steps.some(step => step.run && step.run.startsWith('npm run test:coverage'))).toBe(true);
  expect(read('security-audit.yml').on.schedule).toHaveLength(1);
});
