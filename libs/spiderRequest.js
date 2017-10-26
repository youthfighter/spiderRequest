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
    getValue($ele,type='',attrName=''){
        switch(type.toLowerCase()){
            case 'text': return $ele.text();
            case 'html': return $ele.html();
            case 'attr': return $ele.attr(attrName);
            case 'data': return $ele.data(attrName);
            default: return '';
        }
    }
    getValues($ele,valueConfigs){
        let self = this;
        let ret = {};
        if(Array.isArray(valueConfigs)){
            return self.getValue($ele,valueConfigs[0],valueConfigs[1]);
        }else if(typeof valueConfigs === 'object'){
            for(let [k,v] of Object.entries(valueConfigs)){
                ret[k] = self.getValue($ele,v[0],v[1]);
            }
            return ret;
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
    getResult($ele,settings){
        let self = this;
        let curVal=[],childVal = [];
        let $curEle = self.getEle($ele,settings.selector,settings.eq);
        if($curEle.length===1){
            if(settings.value){
                curVal.push(self.getValues($curEle,settings.value));
            }
            if(settings.children){
                let o = {};
                for(let [key,value] of Object.entries(settings.children)){
                    o[key] = self.getResult($curEle,value)
                }
                childVal.push(o);
            }
        }else if($curEle.length>1){
            for(let i=0;i<$curEle.length;i++){
                if(settings.value){
                    curVal.push(self.getValues($curEle.eq(i),settings.value));
                }
                if(settings.children){
                    let o ={};
                    for(let [key,value] of Object.entries(settings.children)){
                        o[key] = self.getResult($curEle.eq(i),value);
                    }
                    childVal.push(o);
                }
            }
        }

        if(childVal.length===1){
            if(curVal.length===0){
                return childVal[0];
            }else if(curVal.length===1){
                return [curVal[0],childVal[0]];
            }else if(curVal.length>1){
                return [curVal,childVal[0]];
            }
        }else if(childVal.length>1){
            if(curVal.length===0){
                return childVal;
            }else if(curVal.length===1){
                return [curVal[0],childVal];
            }else if(curVal.length>1){
                return [curVal,childVal];
            }
        }else{
            if(curVal.length===1){
                return curVal[0];
            }else if(curVal.length>1){
                return curVal;
            }

        }
    }
    getContent(){
        let self = this;
        let ret ;
        return new Promise((resolve,reject)=>{
            self.request()
                .then(function(res){
                    let body = iconv.decode(res.body, self.encode);
                    let $ = cheerio.load(body,{decodeEntities: false});
                    ret = self.getResult($('body'),self.content);
                    ret?ret['url']= self.url:{'url':self.url};
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
