const fs = require('node:fs');
const thresholds = require('../package.json').jest.coverageThreshold.global;
const data = fs.readFileSync('coverage/lcov.info', 'utf8');
const sum = tag => [...data.matchAll(new RegExp('^' + tag + ':(\\d+)$', 'gm'))].reduce((total, match) => total + Number(match[1]), 0);
const rows = [['Lines', 'LF', 'LH', 'lines'], ['Functions', 'FNF', 'FNH', 'functions'], ['Branches', 'BRF', 'BRH', 'branches']];
const report = ['## Production coverage', '', '| Metric | Coverage | Required |', '| --- | --- | --- |', ...rows.map(([label, total, covered, key]) => {
  const found = sum(total); const hit = sum(covered);
  return `| ${label} | ${found ? (100 * hit / found).toFixed(2) : '100.00'}% (${hit}/${found}) | ${thresholds[key]}% |`;
})].join('\n') + '\n';
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);
process.stdout.write(report);
