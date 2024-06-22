/**
 * 模块：日志输出(beta)
 * 简介：统一输出日志
 */

import {
  New as Color_New,
  FgCyan as Color_FgCyan,
  FgYellow as Color_FgYellow,
  FgRed as Color_FgRed,
  BgRed as Color_BgRed,
  FgWhite as Color_FgWhite,
  Bold as Color_Bold,
  FgGreen as Color_FgGreen,
  FgBlue as Color_FgBlue,
  FgMagenta as Color_FgMagenta,
} from './color';

// 定义常量

export const // 日志等级
  /** 关闭 */
  LevelNone = 0,
  /** 提示 */
  LevelInfo = 1,
  /** 警告 */
  LevelWarn = 2,
  /** 调试 */
  LevelDebu = 3;

export const // 等级前缀
  /** 提示 */
  l_Info = 'Info',
  /** 警告 */
  l_Warn = 'Warn',
  /** 错误 */
  l_Erro = 'Error',
  /** 致命错误 */
  l_Fata = 'Fatal',
  /** 调试 */
  l_Debu = 'Debug',
  /** 惊慌失措 */
  l_Pani = 'Panic';

export let // 全局参数
  /** 默认等级 */
  Levell = LevelWarn;

/**
 * 修改级别
 * @param {number} level
 */
export function SetLevel(level) {
  Levell = level;
}

// 日志颜色
/*const colors = {
  'Info': Color_New(Color_FgCyan).Add(Color_Bold).Wrap,
  'Warn': Color_New(Color_FgYellow).Add(Color_Bold).Wrap,
  'Error': Color_New(Color_FgRed).Add(Color_Bold).Wrap,
  'Fatal': Color_New(Color_BgRed).Add(Color_Bold).Wrap,
  'Debug': Color_New(Color_FgWhite).Add(Color_Bold).Wrap,
  'Panic': Color_New(Color_BgRed).Add(Color_Bold).Wrap,
};*/

// 获取前缀间隔的另一种实现方式
/*function getSpaces(s) {
  if (s == l_Info || s == l_Warn) {
    return ' ';
  }
  return '';
}*/

// 格式化日期
/*function formatDate(date, layout) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return layout.replace('2006', year).replace('01', month).replace('02', day).replace('15', hours).replace('04', minutes).replace('05', seconds);
}*/

/** Loger 日志对象 */
export class Loger {
  /** 日志等级 */
  level = null;
  /** 程序名称 */
  name = '';
  /** 日志组项 */
  group = [];
  /** 错误回调 */
  deferr = null;
  /**
   * New 创建新的日志对象
   * @param {string} name
   * @param {string} group
   */
  constructor(name, group) {
    this.name = name;
    this.group = [group];
  }
  /**
   * 修改名称
   * @param {string} name
   */
  SetName(name) {
    this.name = name;
    return this;
  }
  /**
   * 修改级别
   * @param {number} level
   */
  SetLevel(level) {
    this.level = level;
    return this;
  }
  /** @private */
  getLevel() {
    return this.level !== null ? this.level : Levell;
  }
  /** 创建副本 */
  Clone() {
    const l = new Loger(this.name, this.group);
    l.level = this.level;
    l.deferr = this.deferr;
    return l;
  }
  /**
   * 重建日志组
   * @param {string} g
   */
  NewGroup(g) {
    return this.Clone().SetGroup(g);
  }
  /**
   * 添加组项
   * @param {string} item
   */
  AddGroup(item) {
    this.group.push(item);
    return this;
  }
  /**
   * 重建组项
   * @param {string} item
   */
  AppGroup(item) {
    return this.Clone().AddGroup(item);
  }
  /**
   * 设置组项
   * @param {string} item
   */
  SetGroup(item) {
    this.group = [item];
    return this;
  }
  /**
   * Println 打印
   * @param {string} prefix
   * @param {...any} msg
   * @private
   */
  println(prefix, ...msg) {
    let arr = [];
    if (this.name) arr.push(Color_New(Color_FgGreen, Color_Bold).Wrap(`[${this.name}]`));
    arr.push(
      prefix,
      Color_New(Color_FgBlue, Color_Bold).Wrap(
        (date => {
          return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
            .getDate()
            .toString()
            .padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date
            .getMinutes()
            .toString()
            .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
        })(new Date())
      ),
      Color_New(Color_FgMagenta, Color_Bold).Wrap(this.group.map(v => `[${v}]`).join(' '))
    );
    if (msg[0]) arr.push(msg[0]);
    let out = [arr.join(' ')];
    const ms1 = msg.slice(1);
    ms1 && out.push(...ms1);
    /*
    let arr = [
      // [Logs] [Info] yyyy-mm-dd hh:mm:ss [Main] [Group?] Msg
      // this.name && Color_New(Color_FgGreen).Add(Color_Bold).Wrap(`[${this.name}]`),
      prefix, // colors[prefix](`[${prefix}]`) + getSpaces(prefix),
      Color_New(Color_FgBlue).Add(Color_Bold).Wrap(((date) => {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
      })(new Date())),
      Color_New(Color_FgMagenta).Add(Color_Bold).Wrap(this.group.map(v => `[${v}]`).join(' ')),
    ];
    if (this.name) arr.unshift(Color_New(Color_FgGreen).Add(Color_Bold).Wrap(`[${this.name}]`));
    if (msg[0]) arr.push(msg[0]);
    let out = [arr.join(' ')]; const ms1 = msg.slice(1); ms1 && out.push(...ms1);
    */
    // msg.slice(1) && out.push(...msg.slice(1));
    console.log(...out);
  }
  /**
   * Info 信息
   * @param {...any} format
   */
  Info(...format) {
    if (this.getLevel() >= LevelInfo)
      this.println(Color_New(Color_FgCyan, Color_Bold).Wrap(`[${l_Info}]`) + ' ', ...format);
    return this;
  }
  /**
   * Warning 警告
   * @param {...any} format
   */
  Warn(...format) {
    if (this.getLevel() >= LevelWarn)
      this.println(Color_New(Color_FgYellow, Color_Bold).Wrap(`[${l_Warn}]`) + ' ', ...format);
    return this;
  }
  /**
   * Error 错误
   * @param {...any} format
   */
  Error(...format) {
    if (this.getLevel() >= LevelNone)
      this.println(Color_New(Color_FgRed, Color_Bold).Wrap(`[${l_Erro}]`), ...format);
    return this;
  }
  /**
   * Fatal 致命错误
   * @param {...any} format
   */
  Fatal(...format) {
    if (this.getLevel() >= LevelNone)
      this.println(Color_New(Color_BgRed, Color_Bold).Wrap(`[${l_Fata}]`), ...format);
    if (this.deferr != null) this.deferr();
    throw new Error(format.toString());
  }
  /**
   * Debug 校验
   * @param {...any} format
   */
  Debug(...format) {
    if (this.getLevel() >= LevelDebu)
      this.println(Color_New(Color_FgWhite, Color_Bold).Wrap(`[${l_Debu}]`), ...format);
    return this;
  }
  /**
   * Panic 极端错误
   * @param {...any} format
   */
  Panic(...format) {
    if (this.getLevel() >= LevelNone)
      this.println(Color_New(Color_BgRed, Color_Bold).Wrap(`[${l_Pani}]`), ...format);
    throw new Error(format.toString());
  }
}

export default new Loger('Logs', 'Main');
