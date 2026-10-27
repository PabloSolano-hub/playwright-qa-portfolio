import type AxeBuilder from '@axe-core/playwright';

// Types derived from AxeBuilder so the suite does not import the transitive axe-core package.
export type AxeResults = Awaited<ReturnType<AxeBuilder['analyze']>>;
type Result = AxeResults['violations'][number];
type NodeResult = Result['nodes'][number];

/** WCAG 2.0 and 2.1, levels A and AA: the usual legal and contractual baseline in the EU. */
export const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

export type AuditedPage = 'home' | 'product' | 'login' | 'cart' | 'contact';

/**
 * Accessibility defects already found in the public demo site (a third-party app we cannot fix).
 * They are reported as annotations instead of failing the run, so that any NEW violation still
 * fails it. Documented in scenarios/accesibilidad.md.
 */
export interface KnownViolation {
  id: string;
  rule: string;
  /** Matches the CSS selector axe reports for the offending node. */
  target: RegExp;
  pages: AuditedPage[];
  summary: string;
}

const ALL_PAGES: AuditedPage[] = ['home', 'product', 'login', 'cart', 'contact'];

export const KNOWN_VIOLATIONS: KnownViolation[] = [
  {
    id: 'DEF-A11Y-001',
    rule: 'label-content-name-mismatch',
    target: /^#language$/,
    pages: ALL_PAGES,
    summary:
      'Language button: aria-label "Select language" does not contain its visible text "EN".',
  },
  {
    id: 'DEF-A11Y-002',
    rule: 'list',
    target: /^\.checkbox:nth-child\(\d+\) > ul$/,
    pages: ['home'],
    summary: 'Category filter lists: <ul> elements contain children other than <li>.',
  },
  {
    id: 'DEF-A11Y-003',
    rule: 'button-name',
    target: /^\.btn-outline-secondary$/,
    pages: ['login'],
    summary: 'Show-password button (eye icon) has no accessible name.',
  },
  {
    id: 'DEF-A11Y-004',
    rule: 'label-content-name-mismatch',
    target: /^a\[data-test="nav-cart"\]$/,
    // The header cart link only renders once the cart has items; only the cart audit has one.
    pages: ['cart'],
    summary:
      'Header cart link: aria-label "cart" does not contain its visible text (the item count).',
  },
];

export interface ViolationNode {
  rule: string;
  impact: string;
  target: string;
  help: string;
}

function flatten(violations: Result[]): ViolationNode[] {
  return violations.flatMap((violation) =>
    violation.nodes.map((node: NodeResult) => ({
      rule: violation.id,
      impact: node.impact ?? violation.impact ?? 'unknown',
      target: node.target.join(' '),
      help: violation.help,
    })),
  );
}

function knownMatch(node: ViolationNode, page: AuditedPage): KnownViolation | undefined {
  return KNOWN_VIOLATIONS.find(
    (known) =>
      known.pages.includes(page) && known.rule === node.rule && known.target.test(node.target),
  );
}

export interface AuditOutcome {
  /** Violations not in the known list: these must fail the test. */
  unexpected: ViolationNode[];
  /** Known defects found on this page, keyed by defect id. */
  known: Map<string, ViolationNode[]>;
  /** Known defects expected on this page that axe no longer reports (possibly fixed upstream). */
  notReproduced: KnownViolation[];
}

export function classify(results: AxeResults, page: AuditedPage): AuditOutcome {
  const unexpected: ViolationNode[] = [];
  const known = new Map<string, ViolationNode[]>();
  for (const node of flatten(results.violations)) {
    const match = knownMatch(node, page);
    if (match) {
      known.set(match.id, [...(known.get(match.id) ?? []), node]);
    } else {
      unexpected.push(node);
    }
  }
  const notReproduced = KNOWN_VIOLATIONS.filter(
    (defect) => defect.pages.includes(page) && !known.has(defect.id),
  );
  return { unexpected, known, notReproduced };
}
