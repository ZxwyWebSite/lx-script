/**
 * 模块：彩字输出(beta)
 * 简介：https://github.com/fatih/color 的不完全重写实现
 */

/** NoColor 定义输出是否着色。 */
export let NoColor = false;

/**
 * DisableColor 禁用颜色输出。对于不更改任何现有代码并且仍然能够输出很有用。
 * 可用于“--no-color”等标志。要重新启用，请使用 EnableColor() 方法。
 */
export function DisableColor() {
  NoColor = true;
}
/**
 * EnableColor 启用颜色输出。与DisableColor() 结合使用。
 * 否则，此方法没有任何副作用。
 */
export function EnableColor() {
  NoColor = false;
}

// Base attributes 基础属性
export const Reset = 0,
  Bold = 1,
  Faint = 2,
  Italic = 3,
  Underline = 4,
  BlinkSlow = 5,
  BlinkRapid = 6,
  ReverseVideo = 7,
  Concealed = 8,
  CrossedOut = 9;

export const ResetBold = 22,
  ResetItalic = 23,
  ResetUnderline = 24,
  ResetBlinking = 25,
  //_ = 26,
  ResetReversed = 27,
  ResetConcealed = 28,
  ResetCrossedOut = 29;

export const mapResetAttributes = {
  Bold: ResetBold,
  Faint: ResetBold,
  Italic: ResetItalic,
  Underline: ResetUnderline,
  BlinkSlow: ResetBlinking,
  BlinkRapid: ResetBlinking,
  ReverseVideo: ResetReversed,
  Concealed: ResetConcealed,
  CrossedOut: ResetCrossedOut,
};

// Foreground text colors 前景文本颜色
export const FgBlack = 30,
  FgRed = 31,
  FgGreen = 32,
  FgYellow = 33,
  FgBlue = 34,
  FgMagenta = 35,
  FgCyan = 36,
  FgWhite = 37;

// Foreground Hi-Intensity text colors 前景高强度文本颜色
export const FgHiBlack = 90,
  FgHiRed = 91,
  FgHiGreen = 92,
  FgHiYellow = 93,
  FgHiBlue = 94,
  FgHiMagenta = 95,
  FgHiCyan = 96,
  FgHiWhite = 97;

// Background text colors 背景文字颜色
export const BgBlack = 40,
  BgRed = 41,
  BgGreen = 42,
  BgYellow = 43,
  BgBlue = 44,
  BgMagenta = 45,
  BgCyan = 46,
  BgWhite = 47;

// Background Hi-Intensity text colors 背景高强度文本颜色
export const BgHiBlack = 100,
  BgHiRed = 101,
  BgHiGreen = 102,
  BgHiYellow = 103,
  BgHiBlue = 104,
  BgHiMagenta = 105,
  BgHiCyan = 106,
  BgHiWhite = 107;

/**
 * New 返回一个新创建的颜色对象。
 * @param {...number} value
 */
export function New(...value) {
  return new Color(...value);
}

// ==================== ↓ zTool ↓ ====================

/**
 * 统一输出 "%s[%dm"
 * @param {string} s
 * @private
 */
function escapeFunc(s) {
  return `\x1b[${s}m`;
}

const resetStr = '0';

// ==================== ↑ zTool ↑ ====================

/** Color 定义了一个由 SGR 参数定义的自定义颜色对象。 */
export class Color {
  /** SGR 序列 */
  params = [];
  /** 禁用颜色输出 */
  noColor = null;
  /**
   * New 返回一个新创建的颜色对象。
   * @param  {...number} value
   */
  constructor(...value) {
    if (NoColor) {
      this.noColor = true;
    }
    this.Add(...value);
  }
  // Set 设置 SGR 序列。
  /**
   * Add 用于链接 SGR 参数。使用尽可能多的参数来组合和创建自定义颜色对象。
   * 示例：Add(color.FgRed, color.Underline)。
   * @param {...number} value
   */
  Add(...value) {
    this.params.push(...value);
    return this;
  }
  /**
   * sequence 返回要插入“\x1b[...m”的格式化 SGR 序列
   * 示例输出可能是：“1;36” -> 粗体青色
   * @private
   */
  sequence() {
    const format = this.params.map(v => String(v));
    return format.join(';');
  }
  /**
   * wrap 用颜色属性包裹 s 字符串。
   * 该字符串已准备好打印。
   * @param {string} s
   */
  Wrap(s) {
    if (this.isNoColorSet()) {
      return s;
    }
    return this.format() + s + this.unformat(); //`${this.format()}${s}${this.unformat()}`;
  }
  /** @private */
  format() {
    return escapeFunc(this.sequence());
  }
  /** @private */
  unformat() {
    // 对于序列中的每个元素，让我们使用特定的重置转义，如果找不到，则使用通用的转义
    const format = this.params.map(v => {
      return mapResetAttributes[v] || resetStr;
    });
    return escapeFunc(format.join(';'));
  }
  /**
   * DisableColor 禁用颜色输出。对于不更改任何现有代码并且仍然能够输出很有用。
   * 可用于“--no-color”等标志。要重新启用，请使用 EnableColor() 方法。
   */
  DisableColor() {
    this.noColor = true;
  }
  /**
   * EnableColor 启用颜色输出。与DisableColor() 结合使用。
   * 否则，此方法没有任何副作用。
   */
  EnableColor() {
    this.noColor = false;
  }
  /** @private */
  isNoColorSet() {
    // 首先检查我们是否有用户设置的操作
    if (this.noColor !== null) {
      return this.noColor;
    }
    // 如果不返回全局选项，默认情况下禁用
    return NoColor;
  }
}
