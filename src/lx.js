const { EVENT_NAMES, on, send, request, version, env } = globalThis.lx;

const { api: lxApi } = globalThis.ls;

/** 脚本配置 */
const conf = {
  /** 接口相关 */
  api: {
    /** 服务端地址 */
    addr: lxApi.addr,
    /** 验证密钥 */
    pass: lxApi.pass,
    /** 大版本号 */
    glbv: 'v1',
  },
  /** 其它杂项 */
  etc: {
    /** 调试模式 */
    devmode: true,
  },
};

export { EVENT_NAMES, on, send, request, version, env, conf };
