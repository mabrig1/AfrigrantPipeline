import { z } from "zod";

export const submissionSchema = z.object({
  title: z.string().min(10).max(300),
  abstract: z.string().min(100).max(10000),
  authors: z.array(z.object({ name: z.string().min(2), orcid: z.string().optional() })).min(1),
  references: z.array(z.object({ citation: z.string(), doi: z.string().optional(), verified: z.boolean().default(false) })).default([]),
  keywords: z.array(z.string()).default([]),
  manuscriptUrl: z.string().url().optional()
});
export type Submission = z.infer<typeof submissionSchema>;
export type Finding = { code: string; severity: "info" | "warning" | "blocker"; message: string };
export type Screening = { status: "needs_editor_review"; findings: Finding[]; checkedAt: string };

export function screenSubmission(input: Submission): Screening {
  const findings: Finding[] = [];
  if (input.abstract.trim().split(/\s+/).length < 150) findings.push({code:"SHORT_ABSTRACT",severity:"warning",message:"Abstract contains fewer than 150 words."});
  if (input.references.length === 0) findings.push({code:"NO_REFERENCES",severity:"blocker",message:"No references supplied."});
  for (const [index, ref] of input.references.entries()) {
    if (!ref.verified) findings.push({code:"UNVERIFIED_REFERENCE",severity:"warning",message:`Reference ${index + 1} requires external verification.`});
    if (ref.doi && !/^10\.\d{4,9}\/\S+$/i.test(ref.doi)) findings.push({code:"INVALID_DOI_FORMAT",severity:"warning",message:`Reference ${index + 1} has an invalid DOI format.`});
  }
  if (!input.manuscriptUrl) findings.push({code:"NO_MANUSCRIPT_FILE",severity:"blocker",message:"Manuscript file URL is missing."});
  return {status:"needs_editor_review",findings,checkedAt:new Date().toISOString()};
}
