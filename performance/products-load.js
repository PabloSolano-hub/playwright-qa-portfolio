// Low-load performance check of the public Products API (k6).
// The target is a shared public demo, so the load is deliberately small:
// at most 3 virtual users with 1-3 s think time (~4 requests/s at peak) for one minute.
// Scenario: scenarios/rendimiento.md (ESC-PERF-001).
import http from 'k6/http';
import { check, group, sleep } from 'k6';

const API_URL = __ENV.API_URL || 'https://api.practicesoftwaretesting.com';
const HEADERS = { Accept: 'application/json' };
const SEARCH_TERMS = ['pliers', 'hammer', 'saw', 'drill', 'wrench'];
const P95_MS = 1500;

export const options = {
  scenarios: {
    browse_catalogue: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '15s', target: 3 },
        { duration: '30s', target: 3 },
        { duration: '15s', target: 0 },
      ],
      gracefulRampDown: '5s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.99'],
    'http_req_duration{endpoint:list}': [`p(95)<${P95_MS}`],
    'http_req_duration{endpoint:detail}': [`p(95)<${P95_MS}`],
    'http_req_duration{endpoint:search}': [`p(95)<${P95_MS}`],
  },
};

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function get(path, endpoint) {
  return http.get(`${API_URL}${path}`, { headers: HEADERS, tags: { endpoint } });
}

export function setup() {
  // The demo database is recreated at the top of every hour: for about a minute the API
  // answers 5xx and every id changes. Measuring then would only measure the reset.
  const minute = new Date().getUTCMinutes();
  if (minute >= 58 || minute <= 2) {
    throw new Error(
      `UTC minute ${minute} is inside the hourly reset window of the demo database; run after HH:03.`,
    );
  }

  const res = get('/products?page=1', 'setup');
  check(res, { 'setup: product list is 200': (r) => r.status === 200 });
  const ids = res.json('data.#.id');
  if (!ids || ids.length === 0) {
    throw new Error(`Could not read product ids from /products (status ${res.status}).`);
  }
  return { ids, lastPage: res.json('last_page') || 1 };
}

export default function (data) {
  group('list products', () => {
    const page = 1 + Math.floor(Math.random() * data.lastPage);
    const res = get(`/products?page=${page}`, 'list');
    check(res, {
      'list: status 200': (r) => r.status === 200,
      'list: has products': (r) => (r.json('data.#') || 0) > 0,
    });
  });

  group('product detail', () => {
    const id = pick(data.ids);
    const res = get(`/products/${id}`, 'detail');
    check(res, {
      'detail: status 200': (r) => r.status === 200,
      'detail: same id': (r) => r.json('id') === id,
    });
  });

  group('search', () => {
    const term = pick(SEARCH_TERMS);
    const res = get(`/products/search?q=${term}`, 'search');
    check(res, { 'search: status 200': (r) => r.status === 200 });
  });

  // Think time: keeps the load at a few requests per second.
  sleep(1 + Math.random() * 2);
}

function ms(metric, stat) {
  const value = metric && metric.values ? metric.values[stat] : undefined;
  return value === undefined ? 'n/a' : `${value.toFixed(0)} ms`;
}

export function handleSummary(data) {
  const m = data.metrics;
  const failedRate = m.http_req_failed ? m.http_req_failed.values.rate : 0;
  const lines = [
    'Products API, low-load check (ESC-PERF-001)',
    `  requests:       ${m.http_reqs ? m.http_reqs.values.count : 0}`,
    `  failed:         ${(failedRate * 100).toFixed(2)} % (threshold < 1 %)`,
    `  checks passed:  ${m.checks ? (m.checks.values.rate * 100).toFixed(2) : 'n/a'} %`,
    `  p95 list:       ${ms(m['http_req_duration{endpoint:list}'], 'p(95)')} (threshold < ${P95_MS} ms)`,
    `  p95 detail:     ${ms(m['http_req_duration{endpoint:detail}'], 'p(95)')} (threshold < ${P95_MS} ms)`,
    `  p95 search:     ${ms(m['http_req_duration{endpoint:search}'], 'p(95)')} (threshold < ${P95_MS} ms)`,
    '',
  ];
  return {
    stdout: lines.join('\n'),
    'performance/results/summary.json': JSON.stringify(data, null, 2),
  };
}
