# Building Africa’s Open Research Infrastructure: Design, Implementation, and Impact Evaluation of a Unified Grant Marketplace, Collaboration, and Scholarly Publishing Platform

**Mabrig Korie (2026)**  
Mabrig Technologies  
Correspondence: Mabrig@mabrigkorie.org  
Telephone: 07065342818

## Abstract
This article examines AfrigrantPipeline as a proposed and partially implemented socio-technical infrastructure integrating grant discovery, researcher identity, collaboration, mentorship, and scholarly publishing for African research communities. The analysis synthesizes the supplied technical and pilot narrative with established open-science, FAIR-data, and African digital-transformation frameworks. Its central contribution is an integrative architecture and an explicitly testable evaluation framework rather than a demonstrated causal effect. The source manuscript describes favourable early user feedback, but does not supply the participant count, observation dates, instruments, baseline measures, or analyzable event logs required to substantiate statistical improvement. Accordingly, this expanded article treats reported experiences as provisional and specifies an ethically governed, reproducible mixed-methods evaluation for future deployment. The resulting design emphasizes discoverability, identity interoperability, accessibility, security, transparent AI assistance, and sustainable institutional stewardship.

**Keywords:** African research infrastructure; open science; grant discovery; research collaboration; FAIR data; responsible artificial intelligence; digital equity

## 1. Introduction
African research capacity depends not only on individual expertise but also on the infrastructure through which opportunities are found, collaborators identified, research outputs preserved, and institutional trust established. A fragmented digital journey imposes search costs: researchers may discover a call for proposals in one channel, establish identity in another, coordinate teams through informal messaging, and publish results in yet another system. These disconnected activities make continuity, accountability, and equitable participation difficult. The African Union (2020) identifies inclusive digital infrastructure and coordinated transformation as continental priorities; UNESCO (2021) similarly frames open science as an ecosystem of knowledge, infrastructure, engagement, and dialogue.

The original AfrigrantPipeline manuscript proposes a unified environment connecting grant opportunities, profiles, mentorship, collaborative teams, and scholarly publishing. Its distinctive claim is not that each function is novel, but that integration may lower transaction costs for researchers operating across uneven institutional support structures. The proposed platform should be judged against real user outcomes, rather than counts of deployed features alone.

This paper addresses three questions: (1) which socio-technical principles are suitable for inclusive African research infrastructure; (2) how can integration support grant discovery, collaboration and visibility; and (3) what evidence would establish impact, fairness and operational sustainability? The first two questions are addressed through design analysis, while the third is treated as a preliminary assessment and prospective evaluation protocol.

## 2. Related Work and Conceptual Foundations
Open science extends beyond free-to-read articles to include access to scientific knowledge, open infrastructures, participation, and dialogue with society (UNESCO, 2021). Consequently, an African research platform should not be assessed solely by the number of documents hosted. It should also enable transparent governance, reusable metadata, multilingual access, community participation, and equitable benefits.

The FAIR principles—findability, accessibility, interoperability, and reusability—provide a practical framework for machine-actionable research records (Wilkinson et al., 2016). Grant announcements, institutional affiliations, researcher identifiers, article metadata, and repository deposits can be represented with persistent identifiers, controlled vocabularies, machine-readable licensing, and provenance records. FAIR does not automatically imply that sensitive records must be publicly accessible; access conditions and privacy restrictions must remain explicit.

From a socio-technical perspective, adoption depends on governance, incentives, work practices, institutional capacity and trust as well as software quality. An application may be technically functional yet fail when researchers cannot verify funding calls, when mentors receive no recognition, or when institutions decline to validate affiliations. The proposed marketplace therefore requires both technical services and accountable human roles.

Multi-sided platform dynamics offer another explanatory lens. Researchers need reliable opportunities; funders need discoverable eligible applicants; institutions need oversight; and publishers and repositories need credible metadata. Network effects may improve matching as participation grows, but they may also privilege already well-connected universities. Inclusive platform governance must explicitly counteract such concentration.

Finally, AI-supported scholarly workflows introduce distinctive risks: fabricated citations, inaccurate eligibility interpretations, inappropriate authorship substitution, and leakage of confidential proposals. The UNESCO Recommendation on the Ethics of Artificial Intelligence (2021) offers a governance basis for human oversight, fairness, accountability and transparency. AI-generated text must be labeled as assistance and verified against authoritative sources.

## 3. System Design and Architecture
The supplied manuscript describes a Next.js 15 and TypeScript frontend, an Express.js API, MongoDB Atlas, Cloudflare protection, Cloudinary storage, Resend email and extensible AI services. These are reported design choices, not independently audited production configurations. The architecture separates public discovery pages from authenticated researcher workflows and administrative moderation.

The grant marketplace should store funder identity, programme title, thematic focus, geographic eligibility, career stage, institutional restrictions, opening and closing dates, source URL, currency, funding amount, last-verification time, and confidence status. Rather than silently rewriting opportunities, an ingestion service should preserve source provenance, detect duplicates, flag expired calls, and route uncertain entries for human review.

Researcher identity should support optional ORCID integration, consent-based institutional affiliation verification, expertise tags, publications, and visibility controls. Collaboration records should define roles, invitations, milestones, conflict-of-interest declarations and access rights. Mentorship matching should incorporate subject expertise, availability, language, and transparent opt-in consent.

The publishing layer should distinguish a repository deposit from formal peer-reviewed publication. Depositing a preprint does not imply editorial acceptance. The system should expose clear document status, licensing, version history, moderation decisions and withdrawal policies. Metadata should support standards-based discovery and eventual integration with DOI registration agencies, ORCID and institutional repositories.

AI assistance should use retrieval-augmented workflows with source links, timestamped evidence, user confirmation and explicit uncertainty. Grant eligibility recommendations should be explainable through matched criteria; citation suggestions must resolve to real records. Every generated proposal should remain the responsibility of its human authors. Prompt injection in scraped funder pages and malicious uploaded documents should be treated as security threats.

Security controls should include role-based access, encryption in transit, secret management, rate limits, audit logs, backup recovery tests, vulnerability management, and restricted file uploads. Cross-border data flows and retention policies require jurisdiction-specific legal review. Cloud infrastructure location alone does not establish compliance with data sovereignty requirements.

## 4. Implementation and Reproducibility
The source document describes iterative, agent-assisted development beginning with backend models and API routes, followed by authenticated dashboards, public pages, and research assistance features. For research reproducibility, subsequent releases should publish a versioned architecture diagram, dependency inventory, API contract, test coverage, threat model, accessibility audit, and deployment changelog. Public repository code can support verification, but cannot by itself prove that a particular production environment has enabled every documented feature.

A reproducible ingestion pipeline should log source retrieval date, parser version, original announcement URL, normalization steps and review decisions. Matching algorithms should be evaluated against a manually labeled eligibility benchmark covering countries, disciplines, funding stages and applicant categories. Accuracy, precision, recall, false exclusion rates and explanation quality should be reported separately.

Operational acceptance testing should cover low-bandwidth mobile use, keyboard navigation, error recovery, interrupted connections, email delivery, upload limits, and accessibility. Performance targets should be declared before evaluation; results should report observed values rather than aspirational service-level objectives.

## 5. Impact Evaluation
The supplied paper reports that a mixed-methods pilot involved Nigerian higher-education users and drew on analytics, feedback forms and interviews. It also describes greater funding awareness, more collaboration requests, useful AI drafting support, and positive feedback about mobile access. However, no participant-level records, recruitment protocol, sample size, question wording, dates, descriptive statistics or interview transcripts are supplied. Terms such as “significantly higher” therefore cannot be interpreted as a statistical finding.

A rigorous follow-up study should register hypotheses and recruit participants across public and private universities, career stages, regions, disciplines, gender categories and bandwidth conditions. A comparison group using existing search practices would strengthen causal inference. At baseline and at predeclared follow-up points, researchers should complete identical grant-search and collaboration tasks.

Primary outcomes should include time to identify an eligible grant, proportion of correctly identified eligible calls, successful contact with a collaborator, and verified application submission. Secondary outcomes may include proposal completion time, repository discoverability, satisfaction, perceived agency, and retention. Actual award rates require longer observation and adjustment for discipline, funding size, prior experience and institutional resources.

Quantitative analysis should report sample size, missingness, uncertainty intervals and appropriate effect estimates. Qualitative interviews should be coded using a documented framework, with discrepant cases retained. Any publication claiming statistical significance should specify tests, assumptions and multiplicity handling. Participant consent, data minimization and secure storage must precede collection.

Equity evaluation is essential: platform benefits should be disaggregated by institutional resources, geographic location, career stage and connectivity where consent and sample size permit. An apparently positive average effect could conceal widening gaps between well-resourced and under-resourced researchers.

## 6. Discussion and Policy Implications
The integrated design offers a plausible response to fragmented research services, but feasibility, adoption, and measurable impact are distinct claims. Technical integration can reduce context switching; institutional endorsement can improve trust; and open metadata can improve discoverability. None guarantees funded grants or indexed publications without longitudinal evidence.

Sustainability requires careful separation of public-good functions from revenue-generating services. Basic discovery, researcher identity portability and repository metadata should remain accessible where feasible. Optional institutional analytics, training or advanced assistance could finance operations, subject to transparent pricing, non-discrimination and safeguards against pay-to-publish incentives.

Governance should include representation from universities, early-career researchers, librarians, research administrators, funders and civil society. A public transparency report could disclose moderation actions, false grant listings, security incidents, AI correction rates and accessibility progress. Institutional partnerships should prioritize interoperability over lock-in.

The platform aligns conceptually with the African Union’s digital transformation agenda and UNESCO’s open-science framework (African Union, 2020; UNESCO, 2021). Alignment is a policy interpretation, not evidence of African Union endorsement or certification.

## 7. Conclusion and Future Work
AfrigrantPipeline is best understood at this stage as an integrative research-infrastructure design with preliminary, unverified pilot observations. Its value proposition is to connect opportunity discovery, researcher identity, collaboration, mentorship, and scholarly dissemination in one accountable workflow. The contribution becomes stronger when technical documentation, governance and user outcomes can be independently inspected.

Priority next steps are to verify the live feature inventory, document the pilot cohort, conduct a preregistered multi-institution evaluation, implement standards-based identity and metadata exchange, audit AI-grounding performance, and establish a participatory sustainability model. The ultimate measure of success is not the volume of AI-generated documents or registered accounts, but whether a wider and more diverse set of African researchers can reliably access opportunities and contribute visible, trustworthy scholarship.

## References
African Union. (2020). *The digital transformation strategy for Africa (2020–2030).* https://au.int/sites/default/files/documents/38507-doc-DTS_for_Africa_2020-2030_English.pdf

UNESCO. (2021). *UNESCO recommendation on open science.* https://unesdoc.unesco.org/ark:/48223/pf0000379949

UNESCO. (2021). *Recommendation on the ethics of artificial intelligence.* https://unesdoc.unesco.org/ark:/48223/pf0000381137

Wilkinson, M. D., Dumontier, M., Aalbersberg, I. J. J., et al. (2016). The FAIR guiding principles for scientific data management and stewardship. *Scientific Data, 3*, Article 160018. https://doi.org/10.1038/sdata.2016.18

Page, M. J., McKenzie, J. E., Bossuyt, P. M., et al. (2021). The PRISMA 2020 statement: An updated guideline for reporting systematic reviews. *BMJ, 372*, n71. https://doi.org/10.1136/bmj.n71

---

*Editorial verification note: The original manuscript did not provide empirical datasets or author affiliation. These require author confirmation before journal submission. PRISMA is provided as a methodological resource, not a claim that this article is a systematic review.*

**Publication status:** Public manuscript/repository deposit only; not peer reviewed, DOI registered, or journal accepted.
