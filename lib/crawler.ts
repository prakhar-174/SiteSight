import axios from 'axios';

/**
 * Validates the provided URL string.
 * Ensures the URL is properly formatted and includes the http/https protocol.
 * @param url The URL string to validate.
 * @throws Error if the URL is invalid.
 */
function validateUrl(url: string): URL {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new Error('URL must start with http:// or https://');
    }
    return parsedUrl;
  } catch (_e) {
    throw new Error('Invalid URL format. Please provide a valid URL like https://example.com');
  }
}

/**
 * Result of the crawlUrl function.
 */
export interface CrawlResult {
  html: string;
  finalUrl: string;
  statusCode: number;
  redirected: boolean;
}

/**
 * Crawls a given URL to fetch its HTML content.
 * 
 * Flow:
 * 1. Validates the input URL.
 * 2. Checks {origin}/robots.txt to respect "User-agent: *" "Disallow: /" directives.
 * 3. Fetches the HTML content with a realistic User-Agent.
 * 
 * @param url - The target URL to crawl.
 * @returns A promise that resolves to the CrawlResult containing HTML and HTTP status details.
 * @throws Error if URL is invalid, blocked by robots.txt, or fetch fails (e.g. 404, 403, timeout).
 */
export async function crawlUrl(url: string): Promise<CrawlResult> {
  const parsedUrl = validateUrl(url);
  const origin = parsedUrl.origin;
  const userAgent = 'Mozilla/5.0 compatible; SiteSight/1.0';

  // 1. Check robots.txt
  try {
    const robotsUrl = `${origin}/robots.txt`;
    const robotsRes = await axios.get(robotsUrl, { timeout: 5000 });
    const robotsTxt = robotsRes.data.toString().toLowerCase();

    // A simple check for "User-agent: *" and "Disallow: /"
    if (robotsTxt.includes('user-agent: *') && robotsTxt.includes('disallow: /')) {
       const lines = robotsTxt.split('\n').map((l: string) => l.trim());
       let isWildcardAgent = false;
       for (const line of lines) {
         if (line.startsWith('user-agent: *')) {
           isWildcardAgent = true;
         } else if (line.startsWith('user-agent:') && !line.includes('*')) {
           isWildcardAgent = false;
         }
         
         if (isWildcardAgent && line === 'disallow: /') {
           throw new Error("This site's robots.txt disallows automated crawling.");
         }
       }
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "This site's robots.txt disallows automated crawling.") {
      throw err; // Re-throw the explicit block error
    }
    // Ignore 404 or other errors for robots.txt (it's optional)
  }

  // 2. Fetch the actual HTML page
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      },
      timeout: 10000, // 10 second timeout
      maxRedirects: 5,
      responseType: 'text', // Prevent automatic JSON parsing
      maxContentLength: 5 * 1024 * 1024 // Reject payloads larger than 5MB
    });

    const contentType = String(response.headers['content-type'] || '');
    if (!contentType.includes('text/html')) {
      throw new Error('Target URL does not return HTML content.');
    }

    // In Node.js environment, axios uses response.request.res.responseUrl for final URL
    const finalUrl = response.request?.res?.responseUrl || url;
    
    return {
      html: response.data,
      finalUrl,
      statusCode: response.status,
      redirected: finalUrl !== url
    };
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.response) {
        if (err.response.status === 404) {
          throw new Error('Page not found (404). Please check the URL.');
        }
        if (err.response.status === 403) {
          throw new Error('Access denied (403). The site might be blocking bots.');
        }
        throw new Error(`Server responded with error code: ${err.response.status}`);
      } else if (err.request) {
        if (err.code === 'ECONNREFUSED') {
          throw new Error('Connection refused. The server might be down.');
        }
        if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
          throw new Error('Request timed out after 10 seconds.');
        }
        throw new Error('Could not reach the server. Please check the URL.');
      }
    }
    throw new Error('An unexpected error occurred while fetching the page.');
  }
}
