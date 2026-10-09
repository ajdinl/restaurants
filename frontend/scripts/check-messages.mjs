// Fails when messages/bs.json and messages/en.json do not have exactly the same keys.
import { readFileSync } from 'node:fs';

const locales = ['bs', 'en'];

function flatten(object, prefix = '') {
    return Object.entries(object).flatMap(([key, value]) => {
        const path = prefix ? `${prefix}.${key}` : key;
        return typeof value === 'object' && value !== null ? flatten(value, path) : [path];
    });
}

const keys = Object.fromEntries(
    locales.map((locale) => [
        locale,
        new Set(flatten(JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url))))),
    ])
);

let failed = false;
for (const locale of locales) {
    for (const other of locales.filter((l) => l !== locale)) {
        const missing = [...keys[other]].filter((key) => !keys[locale].has(key));
        if (missing.length > 0) {
            failed = true;
            console.error(`Missing in ${locale}.json:\n  ${missing.join('\n  ')}`);
        }
    }
}

if (failed) process.exit(1);
console.log(`Messages in sync (${keys.bs.size} keys).`);
