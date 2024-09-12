export const isNotDefined = <T>(value: T | undefined | null): value is undefined | null => value === undefined || value === null;

export const isDefined = <T>(value: T | undefined | null): value is NonNullable<T> => value !== undefined && value !== null;

export const isEmpty = (value: string | undefined | null): value is undefined => value === undefined || value === null || value === '';

export const isNotEmpty = (value: string | undefined | null): value is string => value !== undefined && value !== null && value !== '';

const isFormData = (body: Record<string, unknown> | FormData): body is FormData => body instanceof FormData;

export const sendRequest = async <ResponseData>(
  params:
    | {
        url: string;
        method: string;
        body?: Record<string, unknown> | FormData;
        type?: string;
      }
    | string,
): Promise<{ data?: ResponseData; error?: Error }> => {
  try {
    const url = typeof params === 'string' ? params : params.url;
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      throw new Error('API key is not set in environment variables');
    }

    const headers: HeadersInit = {
      Authorization: `Bearer ${apiKey}`,
    };

    if (typeof params !== 'string' && isDefined(params.body) && !isFormData(params.body)) {
      headers['Content-Type'] = 'application/json';
    }

    const initialResponse = await fetch(url, {
      method: typeof params === 'string' ? 'GET' : params.method,
      mode: 'cors',
      headers,
      body: typeof params !== 'string' && isDefined(params.body) ? (isFormData(params.body) ? params.body : JSON.stringify(params.body)) : undefined,
    });

    if (!initialResponse.ok) {
      throw new Error(`Initial request failed: ${initialResponse.statusText}`);
    }

    const initialData = await initialResponse.json();
    const request_id = initialData?.request_id;

    if (!request_id) {
      throw new Error('No request ID received from initial request');
    }

    // Polling logic
    const maxAttempts = 60; // 5 minutes with 5-second intervals
    const pollInterval = 5000; // 5 seconds

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, pollInterval));

      const statusResponse = await fetch(`${url}/status`, {
        method: 'GET',
        headers: {
          ...headers,
          'X-Request-ID': request_id,
        },
      });

      if (statusResponse.status === 200) {
        // Request completed
        let data: ResponseData | null = null;
        const contentType = statusResponse.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          data = await statusResponse.json();
        } else if (typeof params !== 'string' && params.type === 'blob') {
          data = (await statusResponse.blob()) as ResponseData;
        } else {
          data = (await statusResponse.text()) as ResponseData;
        }
        return data ? { data } : { error: new Error('No data received') };
      } else if (statusResponse.status === 404) {
        throw new Error('Request not found');
      } else if (statusResponse.status === 408) {
        throw new Error('Request timed out');
      }
      // If status is 202, continue polling
    }

    throw new Error('Polling timed out');
  } catch (e) {
    console.error(e);
    return { error: e as Error };
  }
};
