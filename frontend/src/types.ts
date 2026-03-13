export interface OutreachEmails {
  ceo: { subject: string; body: string };
  cfo: { subject: string; body: string };
  head_of_finance: { subject: string; body: string };
}

export interface Lead {
  id?: number;
  domain: string;
  company_name: string;
  industry: string;
  size: string;
  location: string;
  main_product: string;
  pain_points: string[];
  fit_score: number;
  fit_justification: string;
  outreach_emails: OutreachEmails;
  date_added?: string;
}
