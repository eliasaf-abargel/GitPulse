export interface Repository {
  name: string;
  url: string;
  private: boolean;
  organization: string;
}
export interface GitHubMember {
  login: string;
  html_url: string;
}
