// deps-hook.mjs 注册的解析钩子(运行在 Node 的模块钩子线程里)。
let fallbackParentURL = '';

export async function initialize(data) {
  fallbackParentURL = String(data?.parentURL || '');
}

export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    if (!fallbackParentURL || error?.code !== 'ERR_MODULE_NOT_FOUND' || !isBareSpecifier(specifier)) throw error;
    if (context?.parentURL === fallbackParentURL) throw error;
    return nextResolve(specifier, { ...context, parentURL: fallbackParentURL });
  }
}

function isBareSpecifier(specifier) {
  const value = String(specifier || '');
  if (!value || value.startsWith('.') || value.startsWith('/') || value.startsWith('#')) return false;
  if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(value)) return false; // node: / file: / data: / http: / Windows 盘符
  return true;
}
