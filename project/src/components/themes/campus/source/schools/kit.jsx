// 学校定制封面 / 目录的共用部件。各校页面(source/schools/<key>/index.jsx)只组合这里的部件,
// 按设计模板的形状坐标(1920×1080 舞台 px,见 output/campus-schools/<key>/slide-<id>.txt)绝对定位。
//
//   SchoolStage   整页舞台:铺满、裁掉越界部分,把学校调色板写成 --sch-* 变量,注入这所学校的字体与样式
//   NativeText    对应模板文字框的可编辑文字:带 data-native-field(导出换回原生页时按它取字)和稳定的编辑路径
//   SchoolImage   图片 / 3D 渲染图(可带裁切、透明度、共享元素标记 data-morph-key)
//   SchoolVideo   视频背景:poster 图垫底 + <video autoplay muted loop playsinline>,按模板裁切还原
//   Layer         提取脚本合成的矢量装饰层 SVG(位置取清单 manifest.json 里的 box)
//   fitText       按框宽估算字号(模拟模板「溢出时缩排文字」),标题变长时自动缩小
//   coverKeyword  关键词版封面的大字(各校共用一条规则,见函数注释)
//   useDeckCover  deck 级封面信息(brand.cover:题目、场景名、答辩人、导师、单位、日期),目录页显示封面信息时用
//   joinInfo      「答辩人：…　指导教师：…」这类信息行的拼法(各校并字段时共用)
//
// 页面 CSS 只读 var(--sch-*)(来自 meta.mjs 的 palette)与字体栈 schoolFontStack(),不写颜色字面量。
import React from 'react';
import { useThemeStyle } from '../../../shared/style.jsx';
import { useDeckBrand } from '../../../shared/DeckBrand.jsx';
import { TEMP_COVER_DEFAULTS, schoolCoverProps } from '../slides/temp-cover-defaults.mjs';
import { schoolAsset } from './registry.mjs';
import { schoolFontFaceCss } from './fonts.mjs';
import { watchSchoolStage } from './availability.mjs';

export const STAGE_W = 1920;
export const STAGE_H = 1080;

/** 3D 学校封面与目录之间做平滑移动的共享元素标记值(两页同值的元素参与过渡,见 template 的 sharedMorph)。 */
export const MORPH_MODEL = 'school-model';
/** 封面与目录上同一张校徽图(位置不同)也可以平滑移动。 */
export const MORPH_LOGO = 'school-logo';

const KIT_CSS = `
.cp-sch{position:absolute;inset:0;overflow:hidden;}
.cp-sch-abs{position:absolute;}
.cp-sch-fill{position:absolute;inset:0;}
.cp-sch-img{position:absolute;display:block;max-width:none;pointer-events:none;user-select:none;}
.cp-sch-clip{position:absolute;overflow:hidden;}
.cp-sch-clip>.cp-sch-img,.cp-sch-clip>video{position:absolute;display:block;max-width:none;}
.cp-sch-video{object-fit:fill;pointer-events:none;background:transparent;}
.cp-sch-text{position:absolute;margin:0;white-space:normal;overflow-wrap:anywhere;word-break:normal;}
.cp-sch-text.is-nowrap{white-space:nowrap;}
.cp-sch-box{display:flex;flex-direction:column;}
.cp-sch-box.is-middle{justify-content:center;}
.cp-sch-box.is-bottom{justify-content:flex-end;}
`;

/** 舞台坐标 [x, y, w, h] → 绝对定位样式。 */
export function box(rect, extra) {
  const [x, y, w, h] = rect;
  return { left: x, top: y, width: w, height: h, ...extra };
}

/** 注入学校页面的样式:kit 通用样式 + 这所学校用到的 @font-face + 页面自己的 CSS。 */
export function useSchoolStyle(school, id, css) {
  useThemeStyle('campus-school-kit-style', KIT_CSS);
  useThemeStyle(`campus-school-${school.key}-fonts`, schoolFontFaceCss(school.fonts || []));
  useThemeStyle(id, css);
}

/** 学校调色板 → CSS 变量(--sch-<name>)。 */
export function paletteVars(school) {
  const vars = {};
  for (const [name, value] of Object.entries(school.palette || {})) vars[`--sch-${name}`] = value;
  return vars;
}

export function SchoolStage({ school, page, className = '', style, children }) {
  // file:// 直接打开且 deck 里没带这所学校的素材时,图片 / 视频加载失败 → 整页退回通用版(schools/availability.mjs)
  const ref = React.useRef(null);
  React.useEffect(() => watchSchoolStage(school.key, ref.current), [school.key]);
  return (
    <div ref={ref} className={`cp-sch cp-sch-${school.key} is-${page} ${className}`} style={{ ...paletteVars(school), ...style }} data-school-stage={school.key}>
      {children}
    </div>
  );
}

/** 文字里的换行(\n)渲染成 <br>;导出侧把 <br> 读回 \n(模板里表示分段)。 */
export function lines(text) {
  const parts = String(text ?? '').split('\n');
  return parts.map((part, i) => (i ? [<br key={`br${i}`} />, part] : part));
}

/**
 * 对应模板文字框的可编辑文字。
 *   field   模板里的字段名(与 catalog.json 一致);目录条目写 toc.<i>.title / desc / en / num
 *   school  学校 key,与 field 一起组成稳定的编辑路径(换学校、换变体都不串)
 *   sync    同一段文字出现在封面和目录上时写同一个名字,预览里改一处两页一起变
 *   rect    舞台坐标 [x, y, w, h];anchor 'top' | 'middle' | 'bottom' 对应模板的垂直对齐
 *   letterGap 模板里靠插空格撑字距的文字框(交大副标题「学 校 概 况…」、「C O N T E N T S」):网页用 letter-spacing,
 *           DOM 里是不带空格的原文;这里写模板原文两字之间的字符串(通常是 ' '),导出换回原生页时每两个字符之间插入它
 *           (输出 data-native-letter-gap,换行两侧不插)
 */
export function NativeText({ field, school, sync, rect, anchor = 'top', nowrap = false, letterGap, className = '', style, children }) {
  const gapAttr = letterGap ? { 'data-native-letter-gap': letterGap } : {};
  const classes = ['cp-sch-text', rect ? 'cp-sch-box' : '', anchor === 'middle' ? 'is-middle' : anchor === 'bottom' ? 'is-bottom' : '', nowrap ? 'is-nowrap' : '', className].filter(Boolean).join(' ');
  if (rect && anchor !== 'top') {
    // 垂直居中 / 底对齐:外层是定位框,里层才是文字块(编辑和导出取里层)
    return (
      <div className={`cp-sch-abs cp-sch-box ${anchor === 'middle' ? 'is-middle' : 'is-bottom'}`} style={box(rect)}>
        <div className={['cp-sch-text-inner', nowrap ? 'is-nowrap' : '', className].filter(Boolean).join(' ')} style={style}
          data-native-field={field || undefined} data-editable-path={school && field ? `school.${school}.${field}` : undefined}
          data-sync-text={sync || undefined} {...gapAttr}>{lines(children)}</div>
      </div>
    );
  }
  return (
    <div className={classes} style={rect ? box(rect, style) : style}
      data-native-field={field || undefined} data-editable-path={school && field ? `school.${school}.${field}` : undefined}
      data-sync-text={sync || undefined} {...gapAttr}>{lines(children)}</div>
  );
}

/**
 * 图片 / 3D 渲染图。rect 是模板里形状的位置;crop 是模板的裁切比例 {l, t, r, b}(0–1),
 * 有裁切时外层按 rect 裁切、里层按整张图的尺寸铺开。morph 给共享元素标记。
 */
export function SchoolImage({ school, file, rect, crop, alpha, morph, className = '', style, alt = '' }) {
  const src = schoolAsset(school.key, file);
  const morphAttr = morph ? { 'data-morph-key': morph } : {};
  if (crop && (crop.l || crop.t || crop.r || crop.b)) {
    const full = cropFrame(rect, crop);
    return (
      <div className={`cp-sch-clip ${className}`} style={box(rect, { opacity: alpha ?? undefined, ...style })} {...morphAttr} aria-hidden="true">
        <img className="cp-sch-img" src={src} alt={alt} style={full} decoding="async" draggable="false" />
      </div>
    );
  }
  return <img className={`cp-sch-img ${className}`} src={src} alt={alt} style={box(rect, { opacity: alpha ?? undefined, ...style })} decoding="async" draggable="false" {...morphAttr} aria-hidden="true" />;
}

/** 模板裁切 → 整张图在外框里的位置(外框 = 显示区域)。 */
export function cropFrame(rect, crop = {}) {
  const [, , w, h] = rect;
  const l = crop.l || 0, r = crop.r || 0, t = crop.t || 0, b = crop.b || 0;
  const fullW = w / Math.max(0.05, 1 - l - r);
  const fullH = h / Math.max(0.05, 1 - t - b);
  return { left: -l * fullW, top: -t * fullH, width: fullW, height: fullH };
}

/**
 * 视频背景:poster 图垫在下面(缩略图、导出截图、不能自动播放时看到的都是它),<video> 叠在上面。
 * 视频只在当前页播放(编辑器的 syncVideoActivity 负责播放 / 暂停),静音循环。
 */
export function SchoolVideo({ school, file, poster, rect, crop, loop = true, className = '' }) {
  const src = schoolAsset(school.key, file);
  const posterSrc = schoolAsset(school.key, poster);
  const frame = cropFrame(rect, crop);
  return (
    <div className={`cp-sch-clip cp-sch-video-box ${className}`} style={box(rect)} aria-hidden="true" data-school-video={file}>
      <img className="cp-sch-img" src={posterSrc} alt="" style={frame} decoding="async" draggable="false" />
      <video className="cp-sch-video" style={frame} src={src} poster={posterSrc} autoPlay muted loop={loop} playsInline preload="auto" />
    </div>
  );
}

/** 提取脚本合成的矢量装饰层(layers.json → <name>.svg,box 来自清单)。 */
export function Layer({ school, name, rect, className = '', style }) {
  return <img className={`cp-sch-img ${className}`} src={schoolAsset(school.key, `${name}.svg`)} alt="" style={box(rect, style)} decoding="async" draggable="false" aria-hidden="true" />;
}

// ———— 文字容量与自动缩小 ————

/** 视觉宽度(em):全角 1、半角 ~0.55、空格 0.3。与 kit 的 textWidthEm 口径接近,用于估算是否放得下。 */
export function widthEm(text) {
  let w = 0;
  for (const ch of String(text ?? '')) {
    const code = ch.codePointAt(0);
    if (ch === ' ') w += 0.3;
    else if (code < 0x2e80) w += /[A-Z0-9]/.test(ch) ? 0.62 : 0.52;
    else w += 1;
  }
  return w;
}

/** 视觉字数(全角计 1、半角计 0.5),与契约 copyBudgets 同一把尺。 */
export function charCount(text) {
  let n = 0;
  for (const ch of String(text ?? '')) n += ch.codePointAt(0) < 0x2e80 ? 0.5 : 1;
  return n;
}

/**
 * 按框宽估算字号:每一行(\n 分开)在 size 下的宽度(含字距)不超过 width 时用 size,否则等比缩小,最小 minScale。
 * spacing 是字距(px,按 size 时的值,随字号等比缩放)。返回 px。
 */
export function fitText(text, { size, width, spacing = 0, minScale = 0.45 }) {
  const rows = String(text ?? '').split('\n');
  let need = 0;
  for (const row of rows) {
    const n = Array.from(row).length;
    need = Math.max(need, widthEm(row) * size + spacing * Math.max(0, n));
  }
  if (!need || need <= width) return size;
  return Math.max(size * minScale, Math.floor(size * (width / need) * 100) / 100);
}

/**
 * 拉丁文短语按框宽在词与词之间折行(模板里不自动缩小的英文小标,如武大目录「ABOUT / WUHAN UNIV」):
 * 一行放得下就不折;否则贪心折成不超过 maxLines 行(超出的词并进最后一行),返回带 \n 的文字。
 * 导出时 \n 是分段,原生页和网页的排法一致;折完仍放不下的由 fitText / 导出侧缩字。已有换行的原样返回。
 */
export function wrapWords(text, { size, width, spacing = 0, maxLines = 2 }) {
  const raw = String(text ?? '').trim();
  if (!raw || raw.includes('\n')) return raw;
  const w = s => widthEm(s) * size + spacing * Array.from(s).length;
  if (w(raw) <= width) return raw;
  const words = raw.split(/\s+/);
  const rows = [];
  let cur = '';
  for (const word of words) {
    const next = cur ? `${cur} ${word}` : word;
    if (cur && w(next) > width && rows.length < maxLines - 1) {
      rows.push(cur);
      cur = word;
    } else cur = next;
  }
  rows.push(cur);
  return rows.join('\n');
}

/** 把长标题拆成不超过 perLine 字的两行:优先在「 · 」「：」「——」「，」处断开,否则从中间断。 */
export function splitTitle(title, perLine) {
  const text = String(title ?? '').trim();
  if (text.includes('\n')) return text.split('\n').slice(0, 2).join('\n');
  if (charCount(text) <= perLine) return text;
  const marks = [' · ', '·', '：', ':', '——', '—', '，', ',', ' '];
  const chars = Array.from(text);
  let best = null;
  for (const mark of marks) {
    let from = 0;
    while (true) {
      const at = text.indexOf(mark, from);
      if (at < 0) break;
      const head = text.slice(0, at).trim();
      const tail = text.slice(at + mark.length).trim();
      const keep = /[：:]/.test(mark) ? `${head}${mark.trim()}` : head;
      const score = Math.max(charCount(keep), charCount(tail));
      if (head && tail && (!best || score < best.score)) best = { text: `${keep}\n${tail}`, score };
      from = at + mark.length;
    }
    if (best && best.score <= perLine) return best.text;
  }
  // 没有标点时按中文虚词断:「的」留在上一行末尾,「与 / 和 / 及 / 暨」放到下一行开头,取两行最均衡的位置
  let wordBreak = null;
  chars.forEach((ch, i) => {
    const at = '的之'.includes(ch) ? i + 1 : '与和及暨并'.includes(ch) ? i : -1;
    if (at <= 0 || at >= chars.length) return;
    const score = Math.max(charCount(chars.slice(0, at).join('')), charCount(chars.slice(at).join('')));
    if (!wordBreak || score < wordBreak.score) wordBreak = { at, score };
  });
  if (wordBreak && wordBreak.score <= perLine) return `${chars.slice(0, wordBreak.at).join('')}\n${chars.slice(wordBreak.at).join('')}`;
  if (best && best.score <= perLine) return best.text;
  // 都超出时取更均衡的一处(超出的部分由 fitText 缩小字号),实在没有断点才从中间断
  const mid = Math.ceil(chars.length / 2);
  const midScore = Math.max(charCount(chars.slice(0, mid).join('')), charCount(chars.slice(mid).join('')));
  const fallback = [best, wordBreak && { text: `${chars.slice(0, wordBreak.at).join('')}\n${chars.slice(wordBreak.at).join('')}`, score: wordBreak.score }]
    .filter(Boolean).sort((a, b) => a.score - b.score)[0];
  if (fallback && fallback.score <= midScore + 2) return fallback.text;
  return `${chars.slice(0, mid).join('')}\n${chars.slice(mid).join('')}`;
}


// ———— 关键词版大字(各校共用) ————

/**
 * 从场景名(kicker)推一个不超过 4–5 个字的短词,推不出来返回 ''。规则按顺序匹配:
 *   含「开题」→ 开题报告;含「博士 / 硕士」且含「答辩」→ 学位答辩;含「答辩」→ 毕业答辩;
 *   含「汇报」→ 学习汇报;含「课程 / 课堂」→ 课程汇报。
 */
export function sceneKeyword(kicker) {
  const k = String(kicker ?? '');
  if (/开题/.test(k)) return '开题报告';
  if (/博士|硕士/.test(k) && /答辩/.test(k)) return '学位答辩';
  if (/答辩/.test(k)) return '毕业答辩';
  if (/汇报/.test(k)) return '学习汇报';
  if (/课程|课堂/.test(k)) return '课程汇报';
  return '';
}

/**
 * 关键词版封面的大字:goal 写了 keyword 就用它;否则从场景名推短词(sceneKeyword);
 * 都推不出来才用这所学校的默认短语(meta.defaults.keyword,校名或学校口号),再没有用校名。
 * 典礼 / 迎新 / 招生这类只适合特定场合的口号只能作为最后的兜底,能从场景名推出短词时不会出现。
 */
export function coverKeyword(school, p) {
  return String(p?.keyword ?? '').trim() || sceneKeyword(p?.kicker) || school?.defaults?.keyword || school?.name || '';
}

// ———— deck 级封面信息 ————

/**
 * 封面页上的题目、场景名、答辩人(及标签)、导师、单位、日期(src/deck-cover.mjs,经 DeckBrandContext 的 brand.cover 提供;
 * 生成时与浏览器里拿到的是同一份,预览里改了封面属性后封面重绘时更新),按封面的默认值补齐(标签与封面上显示的一致)。
 * 只在学校定制页面里用;目录页上与封面同一段的文字仍写 data-sync-text,预览里直接改封面文字时目录跟着变。
 */
export function useDeckCover() {
  const cover = useDeckBrand()?.cover;
  return React.useMemo(() => deckCoverProps(cover), [cover]);
}

/** brand.cover → 补齐封面默认值的通用封面字段(没有封面信息时就是默认值)。 */
export function deckCoverProps(cover) {
  return schoolCoverProps({ ...TEMP_COVER_DEFAULTS, ...(cover || {}) });
}

/** 「标签：内容」;内容为空返回 ''。 */
export function labeled(label, value, fallbackLabel) {
  const v = String(value ?? '').trim();
  if (!v) return '';
  const l = String(label ?? '').trim() || fallbackLabel || '';
  return l ? `${l}：${v}` : v;
}

/** 把几段信息用分隔符连起来(空段跳过)。 */
export function joinInfo(parts, sep = '　') {
  return parts.map(part => String(part ?? '').trim()).filter(Boolean).join(sep);
}
