// Config for `playwright merge-reports` on CI. The API job runs on the runner and the E2E jobs
// run inside the Playwright container, so their blob reports have different root paths;
// a shared testDir lets the merge map them onto one tree.
export default {
  testDir: 'tests',
  reporter: [['html', { open: 'never' }]],
};
