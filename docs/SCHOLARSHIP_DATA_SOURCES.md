# Scholarship catalogue data sources

The AfriGrantPipeline scholarship catalogue keeps source provenance on every imported record and separates imported records from provider-verified records.

## ScholarFinder Bot dataset

Source: https://github.com/ScottT2-spec/scholar-finder-bot

AfriGrantPipeline imported factual scholarship records from the repository's `data/scholarships.json` file. Imported records remain marked `needs_review` until independently re-verified against the linked scholarship/provider page.

The source repository is licensed under the MIT License:

MIT License

Copyright (c) 2026 Scott

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Scholarship Hunter factual metadata

Source: https://github.com/Hami0095/scholarship-hunter

For the supplementary records, AfriGrantPipeline uses only factual metadata such as scholarship title, provider/host, country, deadline when present, and source/provider URLs. Third-party descriptive prose, eligibility copy, and application-process copy are not imported. These records are also marked `needs_review`.

## Verification policy

- Imported catalogue records are not represented as provider-verified.
- Users should confirm deadline, eligibility, benefits, and application requirements on the linked provider page.
- The agentic scholarship crawler can independently refresh and elevate records to higher-confidence verification states when current source evidence supports them.
