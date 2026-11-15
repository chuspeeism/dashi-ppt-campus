// 「不依赖链接」方式(DASHI_PPT_DEPS_MODE=external)的模块解析钩子,由 scripts/dashi-run.mjs 经
// NODE_OPTIONS=--import 注入每个 node 进程(含 tsx 子进程、后台预览服务)。
//
// Node 的 ESM 解析不认 NODE_PATH,技能目录里又没有 node_modules:这里注册一个 resolve 钩子,
// 裸模块名(react、playwright-core …)按常规解析失败时,改从外部依赖目录再解析一次。
// CommonJS 的 require 由同时设置的 NODE_PATH 兜住。
import { register } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const nodeModules = String(process.env.DASHI_PPT_NODE_MODULES || '').trim();
if (nodeModules && typeof register === 'function') {
  // 从「依赖目录根下的一个文件」出发解析,等价于站在外部依赖旁边 import。
  const parentURL = pathToFileURL(path.join(path.dirname(path.resolve(nodeModules)), 'package.json')).href;
  register('./deps-hook-loader.mjs', import.meta.url, { data: { parentURL } });
}
