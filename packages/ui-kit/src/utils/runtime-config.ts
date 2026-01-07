type UiKitRuntimeConfig = {
  apiBaseUrl?: string;
  isDev?: boolean;
};

const GLOBAL_KEY = '__BABY_TOYS_UI_KIT_RUNTIME_CONFIG__';
const DEFAULT_DEV_BASE_URL = 'http://localhost:8080';

const importMetaEnv = (import.meta as any)?.env ?? {};
const processEnv = typeof process !== 'undefined' ? process.env ?? {} : {};

const initialConfig: UiKitRuntimeConfig = {
  apiBaseUrl: undefined,
  isDev: undefined,
};

if (typeof importMetaEnv?.VITE_API_BASE_URL === 'string' && importMetaEnv.VITE_API_BASE_URL.length > 0) {
  initialConfig.apiBaseUrl = importMetaEnv.VITE_API_BASE_URL;
} else if (
  typeof (processEnv as Record<string, unknown>)?.VITE_API_BASE_URL === 'string' &&
  ((processEnv as Record<string, string>).VITE_API_BASE_URL?.length ?? 0) > 0
) {
  initialConfig.apiBaseUrl = (processEnv as Record<string, string>).VITE_API_BASE_URL;
}

if (typeof importMetaEnv?.DEV === 'boolean') {
  initialConfig.isDev = importMetaEnv.DEV;
} else if (typeof processEnv?.NODE_ENV === 'string') {
  initialConfig.isDev = processEnv.NODE_ENV !== 'production';
}

const ensureStore = (): UiKitRuntimeConfig => {
  if (typeof globalThis === 'undefined') {
    return initialConfig;
  }

  const globalObj = globalThis as Record<string, UiKitRuntimeConfig | undefined>;

  if (!globalObj[GLOBAL_KEY]) {
    globalObj[GLOBAL_KEY] = { ...initialConfig };
  }

  return globalObj[GLOBAL_KEY] as UiKitRuntimeConfig;
};

export const configureUiKitRuntime = (config: UiKitRuntimeConfig) => {
  const store = ensureStore();

  const entries = Object.entries(config).filter(([, value]) => value !== undefined);

  if (entries.length > 0) {
    Object.assign(store, Object.fromEntries(entries));
  }
};

export const getUiKitRuntimeConfig = (): UiKitRuntimeConfig => ({ ...ensureStore() });

export const getUiKitApiBaseUrl = (): string | undefined => ensureStore().apiBaseUrl ?? initialConfig.apiBaseUrl;

export const isUiKitDevMode = (): boolean => {
  const store = ensureStore();

  if (typeof store.isDev === 'boolean') {
    return store.isDev;
  }

  if (typeof initialConfig.isDev === 'boolean') {
    return initialConfig.isDev;
  }

  return false;
};

export const resolveUiKitBaseUrl = (): string => {
  const store = ensureStore();
  const inferredBase = store.apiBaseUrl ?? initialConfig.apiBaseUrl;

  if (typeof inferredBase === 'string' && inferredBase.length > 0) {
    return inferredBase.endsWith('/') ? inferredBase.slice(0, -1) : inferredBase;
  }

  if (isUiKitDevMode()) {
    return DEFAULT_DEV_BASE_URL;
  }

  return '';
};


