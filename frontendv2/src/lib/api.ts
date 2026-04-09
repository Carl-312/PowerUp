import type { PowerUpApiError, PowerUpApiSuccess } from "./contracts";
import { getDevFallbackPayload } from "./dev-fallbacks";

const configuredBaseUrl = import.meta.env.VITE_POWERUP_API_BASE_URL?.trim();
const apiBaseUrl = configuredBaseUrl
  ? configuredBaseUrl.replace(/\/$/, "")
  : "/api/v1";

export class PowerUpApiRequestError extends Error {
  status: number;
  code?: string;

  constructor(message: string, options: { status: number; code?: string }) {
    super(message);
    this.name = "PowerUpApiRequestError";
    this.status = options.status;
    this.code = options.code;
  }
}

const buildApiUrl = (path: string) => `${apiBaseUrl}${path}`;

const maybeReturnDevFallback = <T>(path: string): T | null => {
  if (!import.meta.env.DEV) {
    return null;
  }

  return getDevFallbackPayload<T>(path);
};

const requestTimeoutMs = import.meta.env.DEV ? 1800 : 8000;

export const fetchPowerUpApi = async <T>(
  path: string,
  init?: RequestInit,
): Promise<T> => {
  let response: Response;
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort("powerup_api_timeout"), requestTimeoutMs);
  const upstreamSignal = init?.signal;

  if (upstreamSignal) {
    if (upstreamSignal.aborted) {
      controller.abort(upstreamSignal.reason);
    } else {
      upstreamSignal.addEventListener(
        "abort",
        () => controller.abort(upstreamSignal.reason),
        { once: true },
      );
    }
  }

  try {
    response = await fetch(buildApiUrl(path), {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...init?.headers,
      },
    });
  } catch (error) {
    window.clearTimeout(timeoutId);
    const fallback = maybeReturnDevFallback<T>(path);

    if (fallback) {
      return fallback;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new PowerUpApiRequestError(`Request timed out for ${path}.`, {
        status: 504,
        code: "request_timeout",
      });
    }

    throw error;
  }

  window.clearTimeout(timeoutId);

  let payload: PowerUpApiSuccess<T> | PowerUpApiError | null = null;

  try {
    payload = (await response.json()) as PowerUpApiSuccess<T> | PowerUpApiError;
  } catch {
    payload = null;
  }

  if (!response.ok || (payload && "error" in payload)) {
    const fallback = maybeReturnDevFallback<T>(path);

    if (fallback) {
      return fallback;
    }

    const error =
      payload && "error" in payload
        ? payload.error
        : {
            code: "unexpected_response",
            message: `Unexpected API response for ${path}.`,
          };

    throw new PowerUpApiRequestError(error.message, {
      status: response.status,
      code: error.code,
    });
  }

  if (!payload || "error" in payload) {
    const fallback = maybeReturnDevFallback<T>(path);

    if (fallback) {
      return fallback;
    }

    throw new PowerUpApiRequestError(`Unexpected API response for ${path}.`, {
      status: response.status,
      code: "unexpected_response",
    });
  }

  return payload.data;
};
