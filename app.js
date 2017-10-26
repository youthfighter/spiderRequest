const spiderRequest = require("./index");
const spiderConfig = require("./configs/spiderConfig");
/*new spiderRequest(spiderConfig).getContent()
	.then(function(data){
		console.log(data.data);
		console.log(data.data.floorsInfo[0].goods4[1]);
	});*/


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