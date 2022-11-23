# super-localstorage

## 介绍

**super-localstorage** 是利用`window.localStorage`进行直接存储或获取【`Array`，`Object`，`Boolean`，`Number`，`String`】等类型数据的插件其功能主要有：

1. 储存 `Array`，`Object`等数据时不用做`JSON.parse()`处理，获取 `Array`，`Object`等数据时不用做 `JSON.stringify()` 处理
2. 储存`Boolean`类型返回的也是 `Boolean`
3. 分组管理 （可设置分组，可配合用户角色删除某个角色下的所有`localstorage`）
4. 普通存储和获取 【可设置过期时间】
5. 加密存储和获取【^运算符操作加密，可自定义密匙】【可设置过期时间】
6. 按分组删除所有该分组下的`localstorage`
7. 删除某条由本插件创建的`localstorage`
8. 删除全部由本插件创建的`localstorage`
9. 删除所有的localstorage即不管是不是本插件创建的`localstorage`都删除

 遵循MIT开源协议。开源地址：[https://gitee.com/mxp131011/super-localstorage.git](https://gitee.com/mxp131011/super-localstorage.git)

## 问题反馈和功能建议

1. [在gitee中提交issues](https://gitee.com/mxp131011/super-localstorage/issues)
2. 邮箱：mxp131011@qq.com
3. 微信：mxp131011

## 安装

```bash
npm install super-localstorage
```

## 引入super-localstorage

```js
import SuperLocalstorage from 'super-localstorage';
```

## 创建实例

```js

/**
 *  第一个参数是组名，用于分组
 *  第二个参数加密的自定义密匙，只能为 Number或String类型，加密解密到需要用到这个密匙 不需要加密，解密可不传
 * 【注意】第一个参数不传时内部会创建一个 '_MXP_GROUP_' 字段作为默认的字段作为全局默认组名【用于删除由本插件创建的localstorage】
 * 【注意】第二个参数不传时内部会创建一个 '_MXP_ENCRYPT_' 字段作为加解密的默认密匙
 */
 const storage = new SuperLocalstorage('admin','my_secret_Key');
 
```

## 存储和获取数据 【非加密】

```js

// 存入 Array，Object等数据时不用做 JSON.stringify() 处理
storage.set('aa', { foo: 100 }); // 不设置过期时间 
storage.set('bb', 0, '2021-10-12'); // 2021年10月12日过期   支持【 '2021-10-12' 或 '2021/10/12'】两种格式的字符串时间
storage.set('cc', true, new Date()); // 2021年10月12日过期 支持传入new Date() 日期对象
storage.set('dd', 'eewewewe', [2021, 9, 12]); // 2021年10月12日过期 支持传入一个数组格式为 [年, 月, 日, 时,分 ,秒毫秒] （不建议传数组）  注意 【必传年，月其他可不传】 且月份从0开始，即0代表1月，11代表12月
storage.set('ee', [true, 0, '2', { a: 1 }], 1631241037000);// 2021年10月12日过期 支持时间戳   '1631241037000' 或 1631241037000 都可以 注意传0代表日期为：1970-1-1 8:0:0
storage.set('ff', '任意基本类型数据或JSON数据都可以存储' , 'October 12, 2021 11:13:00');  // 其他可以被new Date()解析的字符串也是可以的


// 存入的是Array，Object取出的就是Array，Object 无需做 JSON.parse() 处理 
// 不存在或过期都返回null
storage.get('aa'); // 得到的就是一个Object对象无需 JSON.parse() 处理
storage.get('bb');
storage.get('cc'); // 得到的就是一个Boolean对象无需其他处理
storage.get('dd');
storage.get('ee'); // 得到的就是一个Array对象无需 JSON.parse() 处理
storage.get('ff');

```

## 存储和获取数据 【加密】

```js

// 存入 Array，Object等数据时不用做 JSON.stringify() 处理
storage.setEncrypt('aa', { foo: 100 }); // 不设置过期时间 
storage.setEncrypt('bb', 0, '2021-10-12'); // 2021年10月12日过期   支持【 '2021-10-12' 或 '2021/10/12'】两种格式的字符串时间
storage.setEncrypt('cc', true, new Date()); // 2021年10月12日过期 支持传入new Date() 日期对象
storage.setEncrypt('dd', 'true', [2021, 9, 12]); // 2021年10月12日过期 支持传入一个数组格式为 [年, 月, 日, 时,分 ,秒毫秒] （不建议传数组）  注意 【必传年，月其他可不传】 且月份从0开始，即0代表1月，11代表12月
storage.setEncrypt('ee', [true, 0, '2', { a: 1 }], 1631241037000);//  2021年10月12日过期 支持时间戳   '1631241037000' 或 1631241037000 都可以 注意传0代表日期为：1970-1-1 8:0:0
storage.setEncrypt('ff', '任意基本类型数据或JSON数据都可以存储' , 'October 12, 2021 11:13:00');  // 其他可以被new Date()解析的字符串也是可以的


// 存入的是Array，Object取出的就是Array，Object 无需做 JSON.parse() 处理 ， 不存在或过期都返回null
storage.getEncrypt('aa'); // 得到的就是一个Object对象无需 JSON.parse() 处理
storage.getEncrypt('bb');
storage.getEncrypt('cc'); // 得到的就是一个Boolean对象无需其他处理
storage.getEncrypt('dd');
storage.getEncrypt('ee'); // 得到的就是一个Array对象无需 JSON.parse() 处理
storage.getEncrypt('ff');

```

## 设置或修改组名

```js

storage.setGroupName('user'); 

// 完整用法如下：
// const storage = new Localstorage();
// storage.setGroupName('user1'); 
// storage.set('cc', true);
// storage.get('cc');
// 这样就可以不在new Localstorage()时传入组名了

```

## 设置或修改加密的密匙

```js

storage.setSecretKey('_user_encrypt_'); 


// 完整用法如下：
// const storage = new Localstorage();
// storage.setSecretKey('_user1_encrypt_'); 
// storage.setEncrypt('cc', true, new Date());
// storage.getEncrypt('cc');
// 这样就可以不在new Localstorage()时传入加密的key了
 
```

## 删除某个localStorage

```js

/**
 * 删除某个localStorage
 * 【注意】只能删除由本组件创建的localStorage
 */
storage.del('aa'); 
 
```

## 删除某个分组下的所有localStorage

```js

/**
 * 删除某个分组下的所有localStorage
 * groupName 组名 可选不传就取 new LocalStorage() 或 setGroupName() 创建的分组，若都为空则不进行任何操作
 */
storage.delGroup('user'); 
 
```

## 删除本插件创建的所有localStorage

```js

/**
 * 删除本插件创建的所有localStorage
 * 【包含所有分组以及没分组的数据】
 */
storage.delMyAll(); 
 
```

## 删除全部的localStorage

```js

/**
 * 删除全部的localStorage 包括非本插件创建的localStorage
 */
storage.delAll(); 
 
```
