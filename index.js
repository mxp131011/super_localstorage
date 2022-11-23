module.exports = class SuperLocalStorage {
    /**
     * @param {string} groupName  自定义分组的组名（用于删除本插件创建自定义分组下的所有LocalStorage）
     * @param {string} secretKey 加密的密钥
     */
    constructor(groupName, secretKey) {
        this.namespace = '_MXP_NAMESPACE_';
        this.groupName = String(groupName || '_MXP_GROUP_');
        this.secretKey = String(secretKey || '_MXP_ENCRYPT_');

        if (!window.localStorage) {
            throw new Error('暂不支持localStorage，-BD001');
        }
    }

    /**
     * 设置自定义分组的组名
     *
     * @param {string} groupName  自定义分组的组名
     */
    setGroupName(groupName) {
        this.groupName = groupName;
    }

    /**
     *  设置加密的密钥
     *
     * @param {string} secretKey  加密的密钥
     */
    setSecretKey(secretKey) {
        this.secretKey = secretKey;
    }

    /**
     *  根据key得到存储对象
     *
     * @param {string} key 存储的key
     *
     * @return {any} 存储的值
     */
    get(key) {
        const resultObj = window.localStorage.getItem(this._getStorageKey(key));
        return this._getTrimStorage(resultObj);
    }

    /**
     * 存储对象 【可设置过期日期】
     *
     * @param {string} key 存储的key
     * @param {string} value 存储的值
     * @param {string} time 过期时间 不传代表永久有效
     *
     * @description time合法格式: [2021,10,11,23,59,59,1000], '2021-10-11', '2021/10/11', new Date()对象, 时间戳
     */
    set(key, value, time) {
        const obj = this._getSetValue(value, time) || '';
        window.localStorage.setItem(this._getStorageKey(key), obj);
    }

    /**
     *  根据key得到解密后的存储对象
     *
     * @param {string} key 存储的key
     *
     * @return {any} 存储的值
     */
    getEncrypt(key) {
        const newKey = this._getStorageKey(key);
        const resultObj = window.localStorage.getItem(newKey);
        return this._getTrimStorage(this.secret(this.secretKey, resultObj));
    }

    /**
     * 存储加密的对象 【可设置过期日期】
     *
     * @param {string} key 存储的key
     * @param {string} value 存储的值
     * @param {string} time 过期时间 不传代表永久有效
     *
     * @description time合法格式: [2021,10,11,23,59,59,1000], '2021-10-11', '2021/10/11', new Date()对象, 时间戳
     */
    setEncrypt(key, value, time) {
        const newKey = this._getStorageKey(key);
        const obj = this.secret(this.secretKey, this._getSetValue(value, time)) || '';
        window.localStorage.setItem(newKey, obj);
    }

    /**
     * 删除某个localStorage 【注意】只能删除由本组件创建的localStorage
     *
     * @param {string} key 存储的key
     */
    del(key) {
        window.localStorage.removeItem(this._getStorageKey(key));
    }

    /**
     * 删除某个自定义分组下的所有localStorage
     *
     * @param {string} groupName 自定义分组的名称
     */
    delAGroup(groupName) {
        const group = groupName || this.groupName;
        group && this._delScopeAll(this.namespace + group);
    }

    /**
     * 删除本插件创建的所有localStorage
     */
    delMyAll() {
        const group = this.namespace;
        this._delScopeAll(group);
    }

    /**
     * 删除全部的localStorage 包括非本插件创建的localStorage
     */
    delAll() {
        window.localStorage.clear();
    }

    /** ******************************************************************************************
     *
     *  下面是一些工具方法
     *
     *******************************************************************************************/

    /**
     *  得到最终的key
     */
    _getStorageKey(key) {
        return this.namespace + this.groupName + String(key);
    }

    /**
     * 得到需要的存储对象
     */
    _getTrimStorage(resultObj) {
        try {
            const { result, outDate } = JSON.parse(resultObj);
            if (outDate) {
                return new Date().getTime() <= outDate ? result : null;
            } else {
                return result;
            }
        } catch (error) {
            return null;
        }
    }

    /**
     * 得到需要储存的对象（转化成字符串）
     */
    _getSetValue(value, time) {
        const outDate = this._formatDate(time);
        if (outDate) {
            return JSON.stringify({ result: value, outDate: outDate.getTime() });
        } else if (time && !outDate) {
            throw new Error('过期日期不是一个有效的日期对象，-BD003');
        }
    }

    _delScopeAll(group) {
        if (group && typeof group === 'string') {
            for (let i = 0; i < window.localStorage.length; i++) {
                const key = window.localStorage.key(i) || ''; // 获取本地存储的Key
                if (key.indexOf(group) === 0) {
                    window.localStorage.removeItem(key);
                }
            }
        }
    }

    /**
     * 格式化成Date对象
     * date  { Date, String, Array ,Number}
     * 可格式化
     *     [2021,10,11]  注意第一个为年，第二个为月，第三个为日 月份是从0开始，即0代表1月份，11代表12月
     *    '2021-10-11' 或 '2021/10/11'  日期之字符串
     *     new Date() 日期对象
     *    1631174240 【即时间戳】
     */
    _formatDate(date) {
        try {
            let newDate = new Date();
            if (date instanceof Date) {
                newDate = date;
            } else if (Array.isArray(date) && date.length === 3) {
                newDate = new Date(date[0], date[1], date[2]);
            } else if (typeof date === 'string') {
                newDate = new Date(date.substring(0, 19).replace(/-/g, '/')); // 兼容ios 先把-转换为/
            } else {
                newDate = new Date(date);
            }
            return newDate instanceof Date ? newDate : null;
        } catch (error) {
            return null;
        }
    }

    /**
     *  加解密函数 （运用^运算符给字符串加密解密）
     */
    secret(key, text) {
        const newKey = key || '';
        if (text !== null) {
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
        } else {
            return null;
        }
    }
};
