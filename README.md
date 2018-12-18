# megalo-router
配合网易小程序框架megalo使用的router,尽量保持与vue-router一致的开发体验，减少技术成本，方便项目从web迁移到小程序

微信小程序、百度小程序、支付宝小程序通用语法，无需做适配

优化megalo的分包页面的跳转写法

megalo默认的分包页面之间的跳转比较麻烦，需要写相对路径，例如
例如从 home/index 跳转的到 packgeA/pages/a/index，相对路径为 ../../packgeA/pages/a/index。

使用megaloRouter则没有这种烦恼，直接
```js
    $router.push('/packgeA/pages/a/index')
```

## 版本记录
- 1.0.1
    
    feat: 增加back() 方法

- 1.0.2

    fix: 修复APP.vue的onLaunch里面调用报错的问题
    
- 1.0.3

    feat: 增加$router.ready方法          
    feat: 增加router模式配置          
    feat: 增加$router.app 获取全局对象         

## 安装

``` bash
npm i megalo-router --save
```

## 使用

``` js
// app.js
import megaloRouter  from 'megalo-router'

Vue.use(megaloRouter, {
    mode: 'strict' // strict or loose 可配置项，不配置的话默认为strict
    tabBars: [ // 必须配置项
        '/pages/hello',
        '/pages/my/index'
    ]
})
```
Vue.use的option接受一个tabBars变量, 参数为小程序的tabBar路径列表

Vue.use的option接受一个mode变量, 表示路由的模式，有两种模式可选，strict 或者 loose，默认是严格模式

- strict 严格模式，如果使用push 或者 replace携带参数跳转到tab页面，将使用switchTab进行跳转，此时tab页面是无法接收到参数的，这是小程序自身的限制，switchTab无法传参
- loose 宽松模式，如果使用push 或者 replace携带参数跳转到tab页面，将使用reLaunch进行跳转，此时tab页面可以接收到参数的，但是这意味着小程序将重新载入

注意：该路径必须以 '/' 开头

## API

> 支持以下列出的方法及属性

### Router 实例

#### 属性

*$router.app

获取全局的app,相当于getApp()

注意：在App.vue中使用的话需要结合$router.ready(()；在普通的page页面使用则无限制

在普通页面使用
```page.vue

mounted () {
    console.log(this.$router.app)
}
```
在App.vue使用

```App.vue
    onLaunch () {
        this.$router.ready(() => { 
            console.log(this.$router.app) // 成功 
        })
    }

```

* $router.currentRoute & $route

包含如下信息：
```js
{
    query: {} // 页面路由参数
    path: '' // 不带参数的基本路径
    fullPath: '' // 完整路径，带参数
}
```
在page页面内通过$route获取参数(在APP.vue里面使用$route的话需要结合$router.ready)

在普通页面使用
```page.vue

mounted () {
    console.log(this.$route.query)
    console.log(this.$route.path)
    console.log(this.$route.fullPath)
}
```
在App.vue使用

```App.vue
    onLaunch () {
        this.$router.ready(() => {
            console.log(this.$route) // 成功 
            console.log(this.$router.currentRoute) // 成功 
        })
    }

```

#### 方法

*$router.ready()

接收一个回调函数作为参数

在App.vue中药获取$router.app 或者 $route对象 或者 $router.currentRoute，需要调用$router.ready

```App.vue
    onLaunch () {
        this.$router.ready(() => {
            console.log(this.$router.app) // 成功
            console.log(this.$route) // 成功
        
        })
    }

```
如果在App.vue中不使用ready方法直接获取 $router.app或者$route的话会导致失败，因为此时router并未初始化完成

* $router.push()

打开一个新页面，如果是打开tabBar页面，实际是使用switchTab, 否则使用navigateTo

**如果是跳转到tabBar页面，是无法进行传参的，如果真的要传参到tabBar页面，请使用reLaunch 或者路由模式配置为宽松模式（loose）**
```js
    // 使用参数和路径进行跳转
    $router.push({query: {id: 1}, path: '/pages/hello/index'})
    // 或者直接传递一个路径
    $router.push('/pages/hello/index?id=1')
```
* $router.replace()

在当前页面打开新页面进行替换，如果是打开tabBar页面，实际是使用switchTab, 否则使用redirectTo

**如果是跳转到tabBar页面，是无法进行传参的，如果真的要传参到tabBar页面，请使用reLaunch 或者路由模式配置为宽松模式（loose）**
```js
    // 使用参数和路径进行跳转
    $router.replace({query: {id: 1}, path: '/pages/hello/index'})
    // 或者直接传递一个路径
    $router.replace('/pages/hello/index?id=1')
```
* $router.go()

回退页面
```js
    $router.go(-1) // 后退一页
    $router.go(0) // 重新载入当前页面 相当于reLaunch当前页面
```
* $router.back()

回到上一页，同$router.go(-1)

* $router.reLaunch()

重新载入小程序
```js
    // 使用参数和路径进行跳转
    $router.reLaunch({query: {id: 1}, path: '/pages/hello/index'})
    // 或者直接传递一个路径
    $router.reLaunch('/pages/hello/index?id=1')
```
* $router.getPlatform()

获取当前所在平台对象，返回值为一个Promise

使用方法
```page.vue
async mounted () {
    const platform = await this.$router.getPlatform()
    console.log(platform)
    // 微信小程序里面得到的是wx对象
    // 百度小程序里面得到的是swan对象
    // 支付宝小程序里面得到的是my对象
}
```

* $router.platform.ready()

接收一个回调，回调的参数为当前所在平台对象，作用跟getPlatform一样，是基于getPlatform的封装

使用方法
```page.vue
async mounted () {
    this.$router.platform.ready(platform => {
        console.log(platform)
        // 微信小程序里面得到的是wx对象
        // 百度小程序里面得到的是swan对象
        // 支付宝小程序里面得到的是my对象
    })
}
```

## 提示
- 传参问题
    
    tabBar页面接收参数的话应该使用reLaunch(小程序自身的限制)
    
    如果query传参中带有路径或者网址作为参数，请使用encodeURIComponent 和 decodeURIComponent进行编码解码传递，否则可能发生未知错误或者丢参
    
- 跳转路径问题

    所有跳转的路径都是使用'/'开头的
    
- 路由跳转回调问题

    如果需要对跳转的成功或者失败进行回调处理，可以在跳转时候传入回调
    ```js
    $router.replace({
      query: {id: 1},
      path: '/pages/hello/index',
      success: (res) => {console.log('跳转成功', res)},  
      fail: (err) => {console.log('跳转失败', err)},
      complete: (res) => {console.log('跳转结束', res)}
    }
  )
    ```

## 微信群交流

欢迎入群交流(请打开微信二维码扫描)

![img](code.jpg)    
    



