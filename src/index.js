import { EVENT_NAMES, on, send, request, version, env, conf } from './lx';
// import { checkLatestVersion } from './update';
import Loger, { LevelDebu } from './loger';
import { DisableColor } from './color';
import pkg from '../package.json';

/**
 * 网络请求
 * @param {string} url 地址
 * @param {{
 *  method: string,
 *  headers: {},
 *  body: any,
 *  form: any,
 *  formData: *,
 *  timeout: number,
 * }} options 参数
 */
const httpRequest = (url, options) =>
  new Promise((resolve, reject) => {
    options.headers = {
      ...{
        'User-Agent': `Mozilla/5.0 (compatible; lx-music-${env ? env : 'request'}/${version})`,
        Accept: 'application/json, text/plain, */*',
        // 'X-Request-Key': conf.api.pass,
        'X-LxM-Auth': conf.api.pass,
      },
      ...options.headers,
    };
    if (!options.timeout) options.timeout = 1000 * 15;
    request(url, options, (err, resp) => {
      if (err) return reject(err);
      resolve(resp.body);
    });
  });

/**
 * 音乐解析
 * @param {string} mode 模式 url / pic / lrc
 * @param {string} source 平台 kw/kg/tx/wy/mg/local
 * @param {string} musicId 音乐ID
 * @param {string} quality 音质 ['128k', '320k', 'flac', 'flac24bit']
 */
/*const l = async (mode, source, musicId, quality) => {
  const query = `${source}/${musicId}/${quality}`;
  const body = await httpRequest(`${conf.api.addr}${mode}/${query}`, { method: 'GET' });
  if (body.data === '') throw body.msg;
  return body.data;
};*/

/**
 * 请求处理
 * @param {string} mode 模式 url / pic / lrc
 * @param {string} source 平台 kw/kg/tx/wy/mg/local
 * @param {any} info 音乐信息
 * @param {string} quality 音质 ['128k', '320k', 'flac', 'flac24bit']
 */
const handleRequest = async (mode, source, info, quality) => {
  const start = new Date().getTime();
  const id = info.hash ?? info.copyrightId ?? info.songmid;
  const query = `${source}/${id}/${quality}`;
  Loger.Info('创建任务: %s, 音乐信息: %O', query, info);
  const body = await httpRequest(`${conf.api.addr}${mode}/${query}`, { method: 'GET' });
  Loger.Info('返回数据: %O', body, `, 耗时 ${new Date().getTime() - start} ms`);
  if (body.code !== 0) Loger.Warn(`${body.code}:`, body.msg);
  return body.data !== '' ? body.data : Promise.reject(body.msg);
};

// 注册应用API请求事件
// source 音乐源，可能的值取决于初始化时传入的sources对象的源key值
// info 请求附加信息，内容根据action变化
// action 请求操作类型，目前只有musicUrl，即获取音乐URL链接，
//    当action为musicUrl时info的结构：{type, musicInfo}，
//        info.type：音乐质量，可能的值有128k / 320k / flac / flac24bit（取决于初始化时对应源传入的qualitys值中的一个）
//                   特殊情况：源为local时，该值为 null
//        info.musicInfo：音乐信息对象，里面有音乐ID、名字等信息
const actions = {
  musicUrl: 'url', // action 为 musicUrl 时需要在 Promise 返回歌曲 url
  lyric: 'lrc', // action 为 lyric 时需要在 Promise 返回歌词信息
  pic: 'pic', // action 为 pic 时需要在 Promise 返回歌曲封面 url
};
on(EVENT_NAMES.request, ({ source, action, info }) => {
  // 被调用时必须返回 Promise 对象
  return handleRequest(actions[action], source, info.musicInfo, info.type);
});

if (env === 'desktop') {
  console.log(`  _                ____                           
 | |   __  __     / ___|  ___  _   _ _ __ ___ ___ 
 | |   \\ \\/ /  _  \\___ \\ / _ \\| | | | '__/ __/ _ \\
 | |___ >  <  (_)  ___) | (_) | |_| | | | (_|  __/
 |_____/_/\\_\\     |____/ \\___/ \\__,_|_|  \\___\\___| Beta
${''.padEnd(56, '=')}`);
} else {
  DisableColor();
}
Loger.SetLevel(LevelDebu).SetName('').Info('欢迎使用 Lx-Script 洛雪音乐自定义源脚本 ^_^');

/** 可用源列表 */
const sources = {};

// 初始化脚本
await (async () => {
  const loger = Loger.NewGroup('Init');
  loger.Info('初始化脚本, 版本: %s, 服务端地址: %s', pkg.version, conf.api.addr);
  const body = await httpRequest(conf.api.addr, { method: 'GET', timeout: 1000 * 10 });
  if (!body) throw '无返回数据';
  loger.Info('获取服务端数据成功: %o, 版本: %s', body, body.version);
  // 显示服务端状态
  const elapsed = new Date() - new Date(body.summary.StartAt * 1000);
  loger.Info(
    '已持续运行',
    String(Math.floor(elapsed / 864e5)).padStart(2, '0'),
    '天',
    String(Math.floor((elapsed % 864e5) / 36e5)).padStart(2, '0'),
    '时',
    String(Math.floor((elapsed % 36e5) / 6e4)).padStart(2, '0'),
    '分',
    String(Math.floor((elapsed % 6e4) / 1000)).padStart(2, '0'),
    '秒,',
    '调用:',
    body.summary.Accessn,
    '/解析:',
    body.summary.Request,
    '/成功:',
    body.summary.Success
  );
  // 检查Api大版本
  if (body.msg !== `Hello~::^-^::~${conf.api.glbv}~`)
    throw 'Api大版本不匹配，请检查服务端与脚本是否兼容！';
  // 检查脚本更新
  const lv = pkg.version.split('.'),
    rv = body.script.ver.split('.');
  for (var i = 0; i < 3; i++) {
    if (lv[i] < rv[i]) {
      loger.Info(
        '发现更新, 版本: %s, 地址: %s, 强制推送: %o',
        body.script.ver,
        body.script.url,
        body.script.force
      );
      send(EVENT_NAMES.updateAlert, {
        log: `提示：${body.script.force ? '强制' : '发现'}更新：${body.script.log}`,
        updateUrl: conf.api.addr + body.script.url + '?raw',
      });
      if (body.script.force) return;
      break;
    } else if (lv[i] > rv[i]) break;
  }
  // 检查必要参数
  if (body.auth.apikey && conf.api.pass === '') throw '未填写请求密钥';
  // 激活可用源
  for (const [name, qualitys] of Object.entries(body.source)) {
    if (qualitys !== null)
      sources[name] = {
        name: name,
        type: 'music',
        actions: ['musicUrl', 'pic', 'lyric'],
        qualitys: qualitys,
      };
  }
})();

// 完成初始化
send(EVENT_NAMES.inited, {
  status: true,
  // eslint-disable-next-line no-undef
  openDevTools: mode === 'development', // conf.etc.devmode,
  sources,
});

// httpRequest(conf.api.addr, { method: 'GET', timeout: 1000 * 10 }).then(resp => {});

/*checkLatestVersion().then(version => {
  if (!version) return;
  send(EVENT_NAMES.updateAlert, { log: '发现新版本 v' + version.version, updateUrl: version.url });
});*/
