# Location data source

`algeria_cities.json` is vendored unmodified from
https://github.com/othmanus/algeria-cities (file `json/algeria_cities.json`, branch `master`,
downloaded 2026-10-13). 58 wilayas, 1541 communes, French (ASCII) and Arabic names, built from
the official list of the Algerian Ministry of the Interior. The repository has no license file;
credit goes to its authors.

`npm run algeria` validates it and writes the compact `src/data/algeria.json` used by checkout.

Algeria moved to 69 wilayas by law 26-06 (April 2026). To switch: replace this file with a 69-wilaya
source of the same shape (or adapt `scripts/build-algeria.mjs`), update `EXPECTED_WILAYAS` there,
and run `npm run algeria`. No component changes are needed.
