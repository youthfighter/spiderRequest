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
    getValue($ele,type='',attrName='',trimType){
        let self = this;
        switch(type.toLowerCase()){
            case 'text': return self.trimValue($ele.text(),trimType);
            case 'html': return self.trimValue($ele.html(),trimType);
            case 'attr': return self.trimValue($ele.attr(attrName),trimType);
            case 'data': return self.trimValue($ele.data(attrName),trimType);
            default: return '';
        }
    }
    trimValue(value,trimType){
        if(!trimType || typeof value !== 'string') return value;
        switch(trimType.toLowerCase()){
            case "left" : return value.trimLeft();
            case "right" : return value.trimRight();
            case "all" : return value.trim();
            default : return value
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
        console.log(selector,$newEle.length);
        return $newEle;
    }
    getNodeData($ele,settings){
        let self = this,
            ret,
            name = settings.name,
            value = settings.value?settings.value:[],
            trimType = settings.trim,
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
                ret.push(self.getValue($myEle, value[0], value[1],trimType));
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
