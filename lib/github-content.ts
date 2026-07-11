const owner = "oasisfxl";
const repository = "xulin-academic-portfolio";
const branch = "main";

type ExistingContent = { sha?: string };

function headers() {
  const token = process.env.GITHUB_CONTENT_TOKEN;
  if (!token) throw new Error("GITHUB_CONTENT_TOKEN is not configured.");
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function endpoint(filePath: string) {
  return `https://api.github.com/repos/${owner}/${repository}/contents/${filePath
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

export async function writeRepositoryFile(
  filePath: string,
  source: string,
  message: string
) {
  const requestHeaders = headers();
  const existingResponse = await fetch(`${endpoint(filePath)}?ref=${branch}`, {
    headers: requestHeaders,
    cache: "no-store",
  });
  let sha: string | undefined;
  if (existingResponse.ok) {
    sha = ((await existingResponse.json()) as ExistingContent).sha;
  } else if (existingResponse.status !== 404) {
    throw new Error(`Unable to read repository content (${existingResponse.status}).`);
  }

  const response = await fetch(endpoint(filePath), {
    method: "PUT",
    headers: requestHeaders,
    body: JSON.stringify({
      branch,
      message,
      content: Buffer.from(source, "utf8").toString("base64"),
      ...(sha ? { sha } : {}),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`GitHub publish failed (${response.status}): ${detail.slice(0, 220)}`);
  }
  return response.json();
}
