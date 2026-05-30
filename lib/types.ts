export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'nitpick';
export type Verdict  = 'MERGE' | 'REQUEST_CHANGES' | 'REJECT';
export type Category = 'security' | 'performance' | 'accessibility' | 'quality' | 'architecture';

export interface Finding {
  id:           string;
  category:     Category;
  severity:     Severity;
  title:        string;
  description:  string;
  suggestion:   string;
  lineRef?:     string;
  codeSnippet?: string;
}

export interface ReviewResult {
  verdict:        Verdict;
  roastLine:      string;
  summary:        string;
  findings:       Finding[];
  praise:         string[];
  scores: {
    security:      number;
    performance:   number;
    accessibility: number;
    quality:       number;
    overall:       number;
  };
  language:       string;
  detectedStack:  string[];
}

export interface ReviewRecord {
  id:             string;
  user_id:        string | null;
  input_type:     'code' | 'github_pr';
  raw_input:      string;
  language:       string | null;
  pr_title:       string | null;
  pr_author:      string | null;
  verdict:        Verdict;
  summary:        string;
  roast_line:     string;
  findings:       Finding[];
  praise:         string[];
  score_security: number;
  score_perf:     number;
  score_a11y:     number;
  score_quality:  number;
  score_overall:  number;
  is_public:      boolean;
  view_count:     number;
  share_count:    number;
  created_at:     string;
}
