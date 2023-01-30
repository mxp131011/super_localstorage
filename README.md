# super-localstorage

## 介绍

**super-localstorage** 是利用`window.localStorage`进行直接存储或获取`Array`，`Object`，`Boolean`，`Number`，`String`类型数据的插件其功能主要有：

1. 支持接存储 `Array`，`Object`,`Boolean`等类型数据。无需做`JSON.parse()`等处理，获取 `Array`，`Object`,`Boolean`等数据时也不用做 `JSON.stringify()` 等处理处理
2. 支持分组管理（可设置分组，可配合用户角色删除某个角色下的所有`localstorage`）
3. 支持设置过期日期（仅支持时间戳或 Date 实例类型的过期时间）
4. 支持加密存储 （使用^运算符操作加密，可自定义密匙，无依赖，高效率）
5. 支持删除某条由本插件创建的`localstorage`
6. 支持按分组删除所有该分组下的`localstorage`
7. 支持删除全部由本插件创建的`localstorage`
8. 支持删除所有的 localstorage 即不管是不是本插件创建的`localstorage`都删除
9. 无依赖，高效率，超轻量，压缩后仅 3kb 左右

遵循 MIT 开源协议。开源地址：[https://gitee.com/mxp131011/super-localstorage.git](https://gitee.com/mxp131011/super-localstorage.git)

## 问题反馈和功能建议

1. [在 gitee 中提交 issues](https://gitee.com/mxp131011/super-localstorage/issues)
2. 邮箱：mxp131011@qq.com
3. 微信：mxp131011

## 安装

```bash
npm install super-localstorage
```

## 引入 super-localstorage

```js
import SuperLocalstorage from 'super-localstorage';
```

## 创建实例

```js
/**
 * 第一个参数是自定义分组的组名，不传默认为：'_MXP_GROUP_'
 * 第二个参数加密的密匙，不传默认为：'_MXP_ENCRYPT_'
 */
const storage = new SuperLocalstorage();
const storage2 = new SuperLocalstorage('admin', 'my_secret_Key');
```

## 存储数据 【非加密】

### 仅支持存储 Array，Object，Number，Boolean, String 类型对象 (无需做 JSON.stringify()等类似处理)

```js
// 永久有效
storage.set('aa', { foo: 100 });
// 设置过期时间 (支持Date实例或时间戳)
storage.set('bb', true, new Date());
storage.set('cc', [true, 0, '2', { a: 1 }], new Date().getTime());
```

## 获取数据【非加密】

### 得到存储的数据 (如未设置或者已过期则返回 null)

```js
storage.get('aa');
storage.get('bb');
storage.get('cc');
```

## 存储数据 【加密】

仅支持存储 Array，Object，Number，Boolean, String 类型对象 (无需做 JSON.stringify()等类似处理)

```js
// 永久有效
storage.setEncrypt('aa', { foo: 100 });
// 设置过期时间 (支持Date实例或时间戳)
storage.setEncrypt('bb', true, new Date());
storage.setEncrypt('cc', [true, 0, '2', { a: 1 }], new Date().getTime());
```

## 获取数据【加密】

得到存储的数据 (如未设置或者已过期则返回 null)

```js
storage.getEncrypt('aa');
storage.getEncrypt('bb');
storage.getEncrypt('cc');
```

## 设置或修改组名

```js
storage.setGroupName('user');
```

## 设置或修改加密的密匙

```js
storage.setSecretKey('_user_encrypt_');
```

## 删除某个由本插件创建的 localStorage

```js
storage.del('aa');
```

## 删除某个分组下的所有 localStorage

```js
// 删除默认分组下的所有 localStorage
storage.delGroup();
// 删除指定分组下的所有 localStorage
storage.delGroup('user');
```

## 删除本插件创建的所有 localStorage

```js
storage.delMyAll();
```

## 删除全部的 localStorage

```js
/**
 * 删除全部的localStorage 包括非本插件创建的localStorage
 */
storage.delAll();
```
