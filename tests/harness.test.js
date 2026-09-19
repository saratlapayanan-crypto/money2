import test from 'node:test';
import assert from 'node:assert/strict';

import { loadJson } from './helpers/load-json.js';

test('package.json exposes dependency-free test and data validation commands', async () => {
    const packageJson = await loadJson('package.json');

    assert.equal(packageJson.private, true);
    assert.equal(packageJson.type, 'module');
    assert.equal(packageJson.scripts.test, 'node --test tests/*.test.js');
    assert.equal(
        packageJson.scripts['validate:data'],
        'node --test tests/data-integrity.test.js'
    );
});
