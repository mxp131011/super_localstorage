export declare class SuperLocalStorage {
    /**
     *  全局的命名空间（用于删除所有本插件创建的LocalStorage）
     *
     * @default '_MXP_NAMESPACE_'
     */
    private readonly namespace: string;

    /**
     *  自定义分组的组名（用于删除本插件创建自定义分组下的所有LocalStorage）
     *
     * @default '_MXP_GROUP_'
     */
    private groupName: string;

    /**
     *  加密的密钥
     *
     * @default '_MXP_ENCRYPT_'
     */
    private secretKey: string;

    /**
     * @param {string} groupName  自定义分组的组名（用于删除本插件创建自定义分组下的所有LocalStorage）
     * @param {string} secretKey 加密的密钥
     */
    constructor(groupName?: string, secretKey?: string);

    /**
     * 设置自定义分组的组名
     *
     * @param {string} groupName  自定义分组的组名
     */
    setGroupName(groupName: string): void;

    /**
     *  设置加密的密钥
     *
     * @param {string} secretKey  加密的密钥
     */
    setSecretKey(secretKey: string): void;

    /**
     *  根据key得到存储对象
     *
     * @param {string} key 存储的key
     *
     * @return {any} 存储的值
     */
    get(key: string): any;

    /**
     * 存储对象 【可设置过期日期】
     *
     * @param {string} key 存储的key
     * @param {string} value 存储的值
     * @param {string} time 过期时间 不传代表永久有效
     *
     * @description time合法格式: [2021,10,11,23,59,59,1000], '2021-10-11', '2021/10/11', new Date()对象, 时间戳
     */
    set(key: string, value: any, time?: string | Date | number[] | number): void;

    /**
     *  根据key得到解密后的存储对象
     *
     * @param {string} key 存储的key
     *
     * @return {any} 存储的值
     */
    getEncrypt(key: string): any;

    /**
     * 存储加密的对象 【可设置过期日期】
     *
     * @param {string} key 存储的key
     * @param {string} value 存储的值
     * @param {string} time 过期时间 不传代表永久有效
     *
     * @description time合法格式: [2021,10,11,23,59,59,1000], '2021-10-11', '2021/10/11', new Date()对象, 时间戳
     *
     */
    setEncrypt(key: string, value: any, time?: string | Date | number[] | number): void;

    /**
     * 删除某个localStorage 【注意】只能删除由本组件创建的localStorage
     *
     * @param {string} key 存储的key
     */
    del(key: string): void;

    /**
     * 删除某个自定义分组下的所有localStorage
     *
     * @param {string} groupName 自定义分组的组名 [可选]
     */
    delGroup(groupName?: string): void;

    /**
     * 删除本插件创建的所有localStorage
     */
    delMyAll(): void;

    /**
     * 删除全部的localStorage 包括非本插件创建的localStorage
     */
    delAll(): void;
}

export default SuperLocalStorage;
