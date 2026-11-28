// Made-up sample data for trying the generator. No real participants.
(function (root) {
  const NS = root.LPLCovers = root.LPLCovers || {};
  const FIRST = ['Jane', 'Lin', 'Omar', 'Sofia', 'Ravi', 'Ana', 'Tomas', 'Mei', 'Kofi', 'Elena', 'Yusuf', 'Clara', 'Ivan', 'Noor', 'Leo', 'Hana', 'Diego', 'Amara', 'Felix', 'Zoe'];
  const LAST = ['Doe', 'Chen', 'Haddad', 'Rossi', 'Patel', 'Silva', 'Novak', 'Tanaka', 'Mensah', 'Petrova', 'Kaya', 'Weber', 'Ilic', 'Rahman', 'Moreau', 'Sato', 'Garcia', 'Okafor', 'Berg', 'Lund'];

  // One person. `spread` 0..1: how different their factors are from each other.
  function person(T, r, opts = {}) {
    const level = opts.level != null ? opts.level : 15 + r() * 70;
    const spread = opts.spread != null ? opts.spread : 0.2 + r() * 0.8;
    const sc = c => Math.round(Math.max(1, Math.min(99, c)));
    const around = (c, k) => sc(c + (r() - 0.5) * 2 * k);
    const name = FIRST[Math.floor(r() * FIRST.length)] + ' ' + LAST[Math.floor(r() * LAST.length)];
    if (T.id === 'scanin') {
      const belief = {}, importance = {};
      T.domains.forEach(d => { belief[d] = around(level, 55 * spread); importance[d] = sc(r() * 99); });
      return { name, belief, importance };
    }
    // Only facet scores are stored; factor and global scores are worked out from them.
    const facets = {};
    T.factors.forEach(f => { const centre = around(level, 45 * spread); f.facets.forEach(n => (facets[n] = around(centre, 32))); });
    if (T.independent) T.independent.facets.forEach(n => (facets[n] = around(level, 30)));
    return { name, facets };
  }

  NS.sample = function (theory, type, members, seed, opts) {
    const T = NS.THEORIES[theory], r = NS._internal.rng(seed >>> 0);
    const n = type === 'group' ? Math.max(2, members || 6) : 1;
    const people = Array.from({ length: n }, () => person(T, r, opts));
    const day = 1 + Math.floor(r() * 28), mon = 1 + Math.floor(r() * 12);
    return {
      theory, type, people,
      name: type === 'group' ? 'Sample team ' + (1 + Math.floor(r() * 90)) : people[0].name,
      date: `${String(day).padStart(2, '0')}/${String(mon).padStart(2, '0')}/2026`,
    };
  };
})(typeof window !== 'undefined' ? window : globalThis);
