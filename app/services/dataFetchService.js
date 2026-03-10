const BASE_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Fetch a post by ID from JSONPlaceholder.
 * @param {number} id - The post ID (defaults to 1)
 * @returns {Promise<Object>} Parsed post data
 */
export const fetchPost = async (id = 1) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Data Fetch API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      throw new Error('Data Fetch request timed out.');
    }
    throw error;
  }
};
