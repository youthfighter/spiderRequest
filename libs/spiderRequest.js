/**
 * Created by Administrator on 2017/8/12 0012.
 */
const request = require('request');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

class spiderRequest{
    constructor({
        url='',
        encode='utf8',
        content={},
        retryNum=5,
        timeout=5000,
    }){
        if(this.url===''){
            return new Error('Argument URL is required');
        }
        this.url=url;
        this.encode=encode;
        this.content=content;
        this.retryNum=retryNum;
        this.timeout=timeout;
        this.result={};
    }
    getValue($ele,type='',attrName='',machining){
        let self = this;
        let result;
        switch(type.toLowerCase()){
            case 'text': result = $ele.text();break;
            case 'html': result = $ele.html();break;
            case 'attr': result = $ele.attr(attrName);break;
            case 'data': result = $ele.data(attrName);break;
            default: result = '';break;
        }
        if(machining && typeof machining === 'function'){
            return machining(result,self.url);
        }else{
            return result;
        }
    }
    getEle($ele,selector,eq){
        let $newEle = $ele;
        if(selector){
            $newEle = $ele.find(selector);
        }
        if(!isNaN(eq)){
            $newEle = $newEle.eq(eq);
        }
        return $newEle;
    }
    getNodeData($ele,settings){
        let self = this,
            ret,
            name = settings.name,
            value = settings.value?settings.value:[],
            machining = settings.machining,
            $curEle = self.getEle($ele,settings.selector,settings.eq);
        if(value.length<1 || !$curEle) return ret;
        ret = [];
        for(let i=0;i<$curEle.length;i++){
            let $myEle = $curEle.eq(i);
            if(typeof value[0] === "object"){
                let o ={};
                value.forEach((obj,index)=>{
                    let oname = obj.name;
                    o[oname] = self.getNodeData($myEle,obj)[oname];
                });
                ret.push(o);
            }else if(typeof value[0] === "string") {
                ret.push(self.getValue($myEle, value[0], value[1],machining));
            }
        }
        return {[name]:ret.length>1?ret:ret[0]};
    }
    getContent(){
        let self = this;
        let ret ;
        return new Promise((resolve,reject)=>{
            self.request()
                .then(function(res){
                    let body = iconv.decode(res.body, self.encode);
                    let $ = cheerio.load(body,{decodeEntities: false});
                    ret = self.getNodeData($('html'),self.content);
                    ret?ret['location']= self.url:{'location':self.url};
                    resolve(ret);
                })
                .catch((err)=>{
                    reject(err);
                });
        });
    }
    request(){
        let self = this;
        return new Promise((resolve,reject)=>{
            (function doRequest(num = 1){
                self._request()
                    .then((res)=>{
                        resolve(res)
                    })
                    .catch((err)=>{
                        if(num>=self.retryNum){
                            reject(err);
                        }else{
                            doRequest(++num);
                        }
                    })
            })();
        });
    }
    _request(){
        let self = this;
        return new Promise(function(resolve,reject){
            request({
                'method':'get',
                'url': self.url,
                'encoding':null,
                'timeout':self.timeout
            },function(err,res){
                if(!err&&(res.statusCode===200||res.statusCode===304)){
                    resolve(res);
                }else{
                    reject(err);
                }
            });
        });
    }
}

module.exports = spiderRequest;
