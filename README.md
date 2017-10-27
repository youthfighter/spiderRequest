
spiderRequest
=======

通过简单的设置配置文件，获取扒取网页信息，返回数据。

## Get Started
下面看一个简单的例子，只需设置几个简单的属性，就可以得到想要的到的数据。
```javascript
//引用spiderRequest
const spiderRequest = require("spiderrequest");

//定义一个要扒取的网页网页信息，以百度首页为例，获取‘百度一下’按钮的值
let config = {
	url: 'https://www.baidu.com/',
	encode: 'utf8',
	content: {
		'name':'btn',
		'selector': '#su',
		'value':['attr','value']
	}
};
new spiderRequest(config).getContent()
    .then((data)=>{
    	console.log(data);
    });
//输出{ btn: '百度一下', location: 'https://www.baidu.com/' }
```
## options
1. name:扒取数据最终以json的形式返回，那么是value获取值对应的key。
2. selector:获取对应的dom节点，遵守[cheerio](https://www.npmjs.com/package/cheerio)的语法，与jquery获取dom节点类似。需要注意的是，其实在上级dom节点的基础上找子节点。
3. eq:如果通过selector获取的dom节点有多个,通过设置eq的值确定获取那个dom节点。
4. value:数组形式，如果selector获取的节点有要获取的值，则通过以下配置直接获取值。
    - `['text']`:对节点执行`text()`
    - `['html']`:对节点执行`html()`
    - `['attr','value']`:对节点执行`attr('value')`
    - `['data','name']`:对节点执行`data('name')`
    也可以传入对象数组，用于查找其子节点的值。子节点的参数定义与`options`一致。
5. machining:定义一个函数，用于对该节点取值进行加工，例如两端去除空格，截取字符串等操作。函数接受两个参数，分别是当前节点的值和当前页面路径。需要注意的是，函数必须有返回值，并且该节点必须为值，而不能为子节点。
```javascript
'machining':(value,location)=>{
	return 'test:'+value; 
}
```