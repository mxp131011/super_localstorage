type $ValueType = string | number | boolean | unknown[] | Record<string | number, unknown>;

export default class SuperLocalStorage {
  /**
   * 全局的命名空间（用于删除所有本插件创建的LocalStorage）
   * @default '_MXP_NAMESPACE_'
   */
  private namespace: string;

  /**
   * 自定义分组的组名（用于删除本插件创建自定义分组下的所有LocalStorage）
   * @default '_MXP_GROUP_'
   */
  private groupName: string;

  /**
   * 加密的密钥
   * @default '_MXP_ENCRYPT_'
   */
  private secretKey: string;

  /**
   * @param {string} [groupName] - 自定义分组的组名（用于删除本插件创建自定义分组下的所有LocalStorage）
   * @param {string} [secretKey] - 加密的密钥
   */
  public constructor(groupName?: string, secretKey?: string) {
    this.namespace = '_MXP_NAMESPACE_';
    this.groupName = String(groupName || '_MXP_GROUP_');
    this.secretKey = String(secretKey || '_MXP_ENCRYPT_');

    if (!window.localStorage) {
      throw new Error('暂不支持localStorage，-BD001');
    }
  }

  /**
   * 设置自定义分组的组名
   * @param {string} groupName - 自定义分组的组名
   */
  public setGroupName(groupName: string) {
    this.groupName = groupName;
  }

  /**
   * 设置加密的密钥
   * @param {string} secretKey - 加密的密钥
   */
  public setSecretKey(secretKey: string) {
    this.secretKey = secretKey;
  }

  /**
   * 根据key得到存储的值 (如果没有则返回null)
   * @param {string} key - 存储的key
   * @returns {string | number | boolean | object | null} 存储的值
   */
  public get(key: string): $ValueType | null {
    const resultObj = window.localStorage.getItem(this._getStorageKey(key));
    try {
      if (resultObj) {
        return this._getTrimStorage(JSON.parse(resultObj));
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  /**
   * 存储对象 【可设置过期日期】
   * @param {string} key - 存储的key
   * @param { string | number | boolean | object } value - 存储的值
   * @param {Date | number} [time] - 过期的日期对象 或者 时间戳 (不传代表永久有效)
   */
  public set(key: string, value: $ValueType, time?: Date | number) {
    const obj = this._getSetValue(value, time) || '';
    window.localStorage.setItem(this._getStorageKey(key), JSON.stringify(obj));
  }

  /**
   * 根据key得到解密后的存储对象
   * @param {string} key - 存储的key
   * @returns { string | number | boolean | object | null} 存储的值
   */
  public getEncrypt(key: string): $ValueType | null {
    const newKey = this._getStorageKey(key);
    const resultObj = window.localStorage.getItem(newKey);
    try {
      if (resultObj) {
        const result = this.secret(this.secretKey, resultObj);
        if (result) {
          return this._getTrimStorage(JSON.parse(result));
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  /**
   * 存储加密的对象 【可设置过期日期】
   * @param {string} key - 存储的key
   * @param { string | number | boolean | object } value - 存储的值
   * @param {Date | number} [time] - 过期的日期对象 或者 时间戳 (不传代表永久有效)
   * @description time合法格式: [2021,10,11,23,59,59,1000], '2021-10-11', '2021/10/11', new Date()对象, 时间戳
   */
  public setEncrypt(key: string, value: $ValueType, time?: Date | number) {
    const newKey = this._getStorageKey(key);
    const obj = this._getSetValue(value, time);
    window.localStorage.setItem(newKey, this.secret(this.secretKey, JSON.stringify(obj)));
  }

  /**
   * 删除某个localStorage 【注意】只能删除由本组件创建的localStorage
   * @param {string} key - 存储的key
   */
  public del(key: string): void {
    window.localStorage.removeItem(this._getStorageKey(key));
  }

  /**
   * 删除某个自定义分组下的所有localStorage
   * @param {string} groupName - 自定义分组的名称
   */
  public delAGroup(groupName?: string): void {
    const group = groupName || this.groupName;
    group && this._delScopeAll(this.namespace + group);
  }

  /**
   * 删除本插件创建的所有localStorage
   */
  public delMyAll() {
    this._delScopeAll(this.namespace);
  }

  /**
   * 删除全部的localStorage 包括非本插件创建的localStorage
   */
  public delAll() {
    window.localStorage.clear();
  }

  /**
   * ******************************************************************************************
   *
   * 下面是一些工具方法
   *
   ******************************************************************************************
   */

  /**
   * 得到最终的key
   * @param {string} key - 需要操作的key
   * @returns {string} 最终的key
   */
  private _getStorageKey(key: string): string {
    return this.namespace + this.groupName + String(key);
  }

  /**
   * 得到真实存储的值(如设置了过期时间且已过期则返回null)
   * @param {object} resultObj - 包含过期时间的的封装后的存储对象
   * @param {unknown} resultObj.result - 真实存储的值
   * @param {number} resultObj.outDate - 过期时间
   * @returns {unknown} 真实存储的值(如设置了过期时间且已过期则返回null)
   */
  private _getTrimStorage(resultObj: { result: unknown; outDate: number }): $ValueType | null {
    try {
      const { result, outDate } = resultObj;
      const newResult = outDate ? (new Date().getTime() <= outDate ? result : null) : result;
      return ['boolean', 'number', 'string', 'object'].includes(typeof newResult) ? (newResult as $ValueType) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * 得到经过封装后的存储对象（转化成字符串）
   * @param {unknown} value - 需要储存的值
   * @param { Date | number} [time] - 可以被转化的日期对象
   * @returns { { result: unknown; outDate?: number } } 经过封装后的存储对象
   */
  private _getSetValue<T = unknown>(value: T, time?: Date | number): { result: T; outDate?: number } {
    const outDate = time ? this._formatDate(time) : null;
    if (outDate) {
      return { result: value, outDate: outDate.getTime() };
    } else if (time && !outDate) {
      throw new Error('过期日期不是一个有效的日期对象，-BD003');
    } else {
      return { result: value };
    }
  }

  /**
   * 删除某个分组下的所有存储值
   * @param {string} group - 分组的组名
   */
  private _delScopeAll(group: string): void {
    if (group && typeof group === 'string') {
      for (var key in window.localStorage) {
        if (key.indexOf(group) === 0) {
          window.localStorage.removeItem(key);
        }
      }
    }
  }

  /**
   * 格式化成Date对象
   * @param {Date | number} date - 日期对象 或 时间戳
   * @example
   *   _formatDate(new Date()) 日期对象
   *   _formatDate(1631174240) 时间戳
   */
  private _formatDate(date: Date | number): Date | null {
    try {
      let newDate = new Date();
      if (date instanceof Date) {
        newDate = date;
      } else {
        newDate = new Date(date);
      }
      return newDate instanceof Date ? newDate : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * 根据按位运算进行加密或解密 (第一次调用为加密第二次调用为解密)
   * @param {string} key - 解密的key
   * @param {string} text - 需要加密或解密的字符串
   * @returns {string } 加密或解密后的字符串
   */
  private secret(key: string, text: string): string {
    const newKey = key || '';
    let result = '';
    for (let i = 0; i < text.length; i++) {
      // 分解字符串为字符
      let text2 = Infinity;
      for (let j = 0; j < newKey.length; j++) {
        const char = newKey.charCodeAt(j); // 字符转为 Unicode 编码
        // eslint-disable-next-line no-bitwise
        text2 = text.charCodeAt(i) ^ char; // ^运算
      }
      result += text2 !== Infinity ? String.fromCharCode(text2) : ''; //  Unicode 编码 转为字符拼接成字符串
    }
    return result;
  }
}
