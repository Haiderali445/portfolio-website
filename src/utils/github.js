/**
 * Automatically extracts or constructs an optimized GitHub avatar image link.
 * @param {string} githubInput -
 * @param {number} [size=40] 
 * @returns {string} 
 */
export const getGitHubAvatar = (githubInput, size = null) => {
  if (!githubInput || typeof githubInput !== 'string') return '';

  let username = githubInput.trim();

  if (username.startsWith('http://') || username.startsWith('https://')) {
    try {
      const url = new URL(username);
      const segments = url.pathname.split('/').filter(Boolean);
      username = segments[0] || ''; // Takes the first segment after domain (e.g., github.com/username)
    } catch {
      // Fallback split logic if URL parsing fails
      username = username.split('/').filter(Boolean).pop() || '';
    }
  }

  username = username.replace(/^@/, '');

  if (!username) return '';

  let avatarUrl = `https://github.com/${username}.png`;

  if (size) {
    avatarUrl += `?size=${size}`;
  }

  return avatarUrl;
};