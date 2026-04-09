import {
  POWERUP_API_VERSION,
  type PowerUpApiError,
  type PowerUpApiSuccess,
} from "../../../../shared/powerup-api-contract";

const createApiMeta = () => ({
  version: POWERUP_API_VERSION,
  generatedAt: new Date().toISOString(),
});

export const jsonOk = <T>(data: T, init?: ResponseInit) =>
  Response.json(
    {
      data,
      meta: createApiMeta(),
    } satisfies PowerUpApiSuccess<T>,
    init,
  );

export const jsonError = (
  status: number,
  code: string,
  message: string,
  init?: Omit<ResponseInit, "status">,
) =>
  Response.json(
    {
      error: {
        code,
        message,
      },
      meta: createApiMeta(),
    } satisfies PowerUpApiError,
    {
      ...init,
      status,
    },
  );
