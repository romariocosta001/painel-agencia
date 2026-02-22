
let base44;
const useMock = !import.meta.env.VITE_BASE44_APP_BASE_URL || import.meta.env.MODE === 'development';
if (useMock) {
  // Usa mock local
  base44 = (await import('./Base44Client.mock.js')).base44;
} else {
  const { createClient } = await import('@base44/sdk');
  const { appParams } = await import('@/lib/app-params');
  const { appId, token, functionsVersion, appBaseUrl } = appParams;
  base44 = createClient({
    appId,
    token,
    functionsVersion,
    serverUrl: '',
    requiresAuth: false,
    appBaseUrl
  });
}
export { base44 };
