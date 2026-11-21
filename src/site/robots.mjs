// AI crawlers are listed explicitly so the site stays visible in AI answers.
// The same list feeds robots.txt and /.well-known/ai.txt, so the two files
// cannot drift apart.
export const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "meta-externalagent",
  "DuckAssistBot",
  "MistralAI-User",
];

const groups = (list) => list.map((ua) => `User-agent: ${ua}\nAllow: /\nDisallow: /api/`).join("\n\n");

export function robotsTxt(site) {
  const host = new URL(site.url).host;
  return `# ${host}
# AI crawlers are explicitly welcome: this site publishes llms.txt and
# /.well-known/ai.txt for them.

User-agent: *
Allow: /
Disallow: /api/

${groups(AI_CRAWLERS)}

Sitemap: ${site.url}/sitemap.xml
# llms.txt: ${site.url}/llms.txt
# ai.txt: ${site.url}/.well-known/ai.txt
`;
}

export function aiTxt(site) {
  return `# ai.txt — AI access and usage policy
# ${site.url}/.well-known/ai.txt
# Updated: ${site.updated}
# Owner: ${site.owner} <${site.email}>
#
# This site welcomes AI search and answer engines. Quote the page with
# attribution and a link to the source. Do not present generated answers as the
# owner's own words. Personal data sent through the contact form is not
# licensed for any use beyond answering that message.

User-agent: *
Allow: /
Disallow: /api/

${groups(AI_CRAWLERS)}

Sitemap: ${site.url}/sitemap.xml
LLMs: ${site.url}/llms.txt
RSS: ${site.url}/feed.xml
Canonical: ${site.url}/
Contact: mailto:${site.email}
`;
}
