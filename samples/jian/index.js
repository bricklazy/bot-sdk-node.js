/*
* 如果需要使用监控统计功能，请将PUBLIC KEY 复制到DuerOS DBP平台
* 文档参考：https://dueros.baidu.com/didp/doc/dueros-bot-platform/dbp-deploy/authentication_markdown

-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDTukl89XvIBcvbLLYiu3Ug7Ze5
gkcR2BVyCfJwyfyGQpgLGFnwcjWbS9w2NhiPinT//G7PQpzfaDMbCrOTPfU4lNJG
fQNoR6kaWdH1NS3hVqu/XOhUEpfybBOzWFta0C93KdUZ4Xs59QhntFJDZPAZXHK7
jqOZZ22pWQJA3cXCbwIDAQAB
-----END PUBLIC KEY-----

*/
/**
 * @file   index.js 此文件是函数入口文件，用于接收函数请求调用
 * @author dueros
 */
const Bot = require('bot-sdk');
const privateKey = require('./rsaKeys.js').privateKey;
const List1 = Bot.Directive.Display.Template.ListTemplate1;
const Item = Bot.Directive.Display.Template.ListTemplateItem;
const RenderTemplate = Bot.Directive.Display.RenderTemplate;
const Hint = Bot.Directive.Display.Hint;

/*列表显示提示信息*/
const hintJian = [
    '对我说选择第几个',
    '对我说帮助'
];

/*图画界面显示信息*/
const cueWords = [
    '对我说下一个',
    '对我说上一个',
    '对我说返回',
    '对我说帮助'
];

/*简笔画列表*/
const datas = [
    {'pos':1 , 'des': '小狗', 'pic': 'http://dbp-resource.gz.bcebos.com/217dd919-cd4f-3942-3594-11d05b9f5d1e/gou.png?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2019-01-14T03%3A30%3A38Z%2F-1%2F%2Fa2830cb8f4d2e71a5c7b9b6f86b68cb8206ec82a34c49f76e965d7201da0d61e'},
    {'pos':2 , 'des': '小臭鼬', 'pic': 'http://dbp-resource.gz.bcebos.com/217dd919-cd4f-3942-3594-11d05b9f5d1e/chouyou.png?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2019-01-14T03%3A30%3A38Z%2F-1%2F%2F3ba24af94d380035d7c7ad2aa9cd6246702eac53944695c765383aba03ee63d5'},
    {'pos':3 , 'des': '小飞机', 'pic': 'http://dbp-resource.gz.bcebos.com/217dd919-cd4f-3942-3594-11d05b9f5d1e/feiji.png?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2019-01-14T03%3A30%3A38Z%2F-1%2F%2F7e8b57490568a688ac3ff372cbe2ce2d3ae26398de68a5587d019dfe5c15ed64'},
    {'pos':4 , 'des': '小猴子', 'pic': 'http://dbp-resource.gz.bcebos.com/217dd919-cd4f-3942-3594-11d05b9f5d1e/houzi.png?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2019-01-14T03%3A30%3A38Z%2F-1%2F%2Fbb6571b5a863dcbad1f5ee4d058bf503ec6e4b102fa9c2d7416100f5fac8a646'},
    {'pos':5 , 'des': '小金鱼', 'pic': 'http://dbp-resource.gz.bcebos.com/217dd919-cd4f-3942-3594-11d05b9f5d1e/jinyu.png?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2019-01-14T03%3A30%3A38Z%2F-1%2F%2F51ec2f6465c5579476f5bb51edee92f89ec16f84f0224da0dca2a08908758548'},
    {'pos':6 , 'des': '小猫咪', 'pic': 'http://dbp-resource.gz.bcebos.com/217dd919-cd4f-3942-3594-11d05b9f5d1e/mao.png?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2019-01-14T03%3A30%3A38Z%2F-1%2F%2F746c01ab873439ba78e2b67a61cc58b96537c1ef94bcb5b1ec7e1214b82e16da'},
    {'pos':7 , 'des': '猫头鹰', 'pic': 'http://dbp-resource.gz.bcebos.com/217dd919-cd4f-3942-3594-11d05b9f5d1e/maotouying.png?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2019-01-14T03%3A30%3A38Z%2F-1%2F%2Fab546cb7f04a57b83664da26e70bf75b5efc094ef7da07a7ff81ac3ebee37ec0'},
    {'pos':8 , 'des': '小青蛙', 'pic': 'http://dbp-resource.gz.bcebos.com/217dd919-cd4f-3942-3594-11d05b9f5d1e/qingwa%27.png?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2019-01-14T03%3A30%3A38Z%2F-1%2F%2Fe4e49e25611c11219473103a6244c414a8e45ff259e72f2fc2bc1815479544a1'},
    {'pos':9 , 'des': '小兔子', 'pic': 'http://dbp-resource.gz.bcebos.com/217dd919-cd4f-3942-3594-11d05b9f5d1e/tuzi.png?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2019-01-14T03%3A30%3A38Z%2F-1%2F%2F4252b8422110445d354d530e894333c01352aecfeb7ff785a027c3060abc6b6e'},
    {'pos':10 , 'des': '小鱼儿', 'pic': 'http://dbp-resource.gz.bcebos.com/217dd919-cd4f-3942-3594-11d05b9f5d1e/yu.png?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2019-01-14T03%3A30%3A38Z%2F-1%2F%2F9427c86d055832c88b7aa32576383a095172d21a91891e0fe941844a131f2a55'},
    {'pos':11 , 'des': '小章鱼', 'pic': 'http://dbp-resource.gz.bcebos.com/217dd919-cd4f-3942-3594-11d05b9f5d1e/zhangyu.png?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2019-01-14T03%3A30%3A38Z%2F-1%2F%2F07f21dabf5b3b37b27b6e8af13a41de3dcd5f6b4d69cdfca4f404c7eec22dbd7'}
];

/*帮助信息*/

/* let factArr = datas;
             let factIndex = Math.floor(Math.random() * factArr.length);
             let randomFact = factArr[factIndex];
             let card = new Bot.Card.TextCard(randomFact);*/
class JianBot extends Bot {
    constructor(postData) {
        super(postData);

        /**
         * 进入程序
         */
        this.addLaunchHandler(this.launchJian);

        /**
         * 帮助
         */
        this.addIntentHandler('help',  this.help);

        /**
         * 返回
         */
        this.addIntentHandler('back',  this.back);

        /**
         * 开始
         */
        this.addIntentHandler('start', this.selectDef);

        /**
         * 下一个
         */
        this.addIntentHandler('next', this.next);

        /**
         * 上一个
         */
        this.addIntentHandler("previous", this.previous);

        /**
         * 选择
         */
        this.addIntentHandler('select',  this.select);

        //  事件1：屏幕点击事件
        this.addEventListener('Display.ElementSelected', this.ScreenClickedEvent);

        //  兜底
        this.addIntentHandler('ai.dueros.common.default_intent', this.defaultEvent);

        // 退出
        this.addSessionEndedHandler(() => {
            this.endSession();
            return {
                outputSpeech: '谢谢使用!'
            };
        });
    }

    /**
     * 默认事件
     */
    defaultEvent() {
        this.waitAnswer();
        return {
            outputSpeech: '暂时还没有收录'
        };
    }

    //是否正整数
    isInteger(number){
        return number > 0 && String(number).split('.')[1] == undefined
    }

    launchJian(){
        this.waitAnswer();
        let speechOutput = '欢迎使用简笔画，请试着说选择第一个';
        let reprompt = `没有听懂，可以直接对我想要使用的服务，例如 第一个`;
        let renderTemplate = this.getListTemplate();
        let hint = new Hint(hintJian);
        return {
            directives: [renderTemplate, hint],
            outputSpeech: speechOutput,
            reprompt:reprompt
        };
    }

    help(){
        this.waitAnswer();
        let help = "\t帮助信息\n列表选择:对我说选择第几个。\n上一个：对我说上一个。\n下一个：对我说下一个。\n返回：对我返回。";
        let card = new Bot.Card.TextCard(help);
        return {
            card: card
        };
    }

    back(){
        this.waitAnswer();
        this.setSessionAttribute("index", 0, 0);

        let renderTemplate = this.getListTemplate();
        let hint = new Hint(hintJian);
        return {
            directives: [renderTemplate, hint]
        };
    }

    next(){
        this.waitAnswer();
        let index = this.getSessionAttribute("index", 0) + 1;
        if(index >= datas.length){
            return {
                outputSpeech: '已经是最后一个了'
            };
        }

        this.setSessionAttribute("index", index, 0);

        let factArr = datas;
        let speechOutput = factArr[index]["des"];
        let src = factArr[index]["pic"];
        let card = new Bot.Card.ImageCard();
        card.addCueWords(cueWords)
        card.addItem(src);
        return {
            card: card,
            outputSpeech: speechOutput
        };
    }

    previous(){
        this.waitAnswer();
        let index = this.getSessionAttribute("index", 0) - 1;
        if(index<0){
            return {
                outputSpeech: '前面没有了'
            };
        }

        this.setSessionAttribute("index", index, 0);

        let factArr = datas;
        let speechOutput = factArr[index]["des"];
        let src = factArr[index]["pic"];
        let card = new Bot.Card.ImageCard();
        card.addCueWords(cueWords)
        card.addItem(src);

        return {
            card: card,
            outputSpeech: speechOutput
        };
    }

    selectDef(){
        this.waitAnswer();
        let index = this.getSessionAttribute("index", 0) ;
        let factArr = datas;
        let speechOutput = factArr[index]["des"];
        let src = factArr[index]["pic"];
        let card = new Bot.Card.ImageCard();
        card.addCueWords(cueWords)
        card.addItem(src);

        return {
            card: card,
            outputSpeech: speechOutput
        };
    }

    select(){
        this.waitAnswer();

        let option = this.getSlot('option');

        let index = this.getSlot('sys.number') -1;
        this.setSessionAttribute("option", option);
        this.setSessionAttribute("sys.number", index);
        if(option!=null){
            index = this.getItem(option)
        }

        if(index<0 || index> datas.length){
            return {
                outputSpeech: '暂时只收录了'+datas.length+'幅画呦'
            };
        }

        this.setSessionAttribute("index", index, 0);
        let factArr = datas;
        let speechOutput = factArr[index]["des"];
        let src = factArr[index]["pic"];
        let card = new Bot.Card.ImageCard();
        card.addCueWords(cueWords)
        card.addItem(src);

        return {
            card: card,
            outputSpeech: speechOutput
        };
    }

    getItem(option){
        let index = -1;
        datas.forEach(function (data) {
            if(option === data['des']){
                index = data['pos']-1;
                return index;
            }
        });
        this.setSessionAttribute("option-index", index);
        return index;
    }

    /**
     * 用于生成列表方便使用
     * @returns {RenderTemplate|*}
     */
    getListTemplate() {
        // 创建列表
        let list = new List1();
        //设置token
        list.setToken('list');
        // 设置背景图片
        list.setBackGroundImage('http://dbp-resource.gz.bcebos.com/4f2a4119-ebe2-1d85-8cb1-63c9ab94e88c/b8bffcfcf7c7f3c042b60c87b6beabb5.jpg?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2019-04-02T12%3A14%3A52Z%2F-1%2F%2F24d8f7836a5e4aead676ee8bf52255040b4810b9db48d9de83ce04b9c5947e39')
        datas.forEach(function (data) {
            let item = new Item();
            /*token一定为字符串否则自动生成，不能正常使用token*/
            item.setToken(String(data['pos']));
            item.setPlainPrimaryText(data['des']);
            item.setImage(data['pic']);
            list.addItem(item);
        });
        let renderTemplate = new RenderTemplate(list);
        return renderTemplate;
    }

    /**
     * 屏幕点击事件
     *
     * @return {(Object|null)}
     */
    ScreenClickedEvent() {
        this.waitAnswer();
        let data = this.request.getData();
        let token = data.request.token ? data.request.token : '';
        if (!token) {
            this.setExpectSpeech(false);
          /*  let card = new Bot.Card.TextCard('!token'+String(data));
            return {
                card: card,
                outputSpeech: 'token空'
            };*/
          return ;
        }

        if(this.isInteger(token)){
            if(token<0 || token> datas.length){
                return {
                    outputSpeech: '暂时只收录了'+datas.length+'幅画呦'
                };
            }
            let index = token;

            if(index>0){
                index = index - 1;
            }

            this.setSessionAttribute("index", index, 0);
            let factArr = datas;
            let speechOutput = factArr[index]["des"];
            let src = factArr[index]["pic"];
            let card = new Bot.Card.ImageCard();
            card.addCueWords(cueWords)
            card.addItem(src);
            return {
                card: card,
                outputSpeech: speechOutput
            };
        }else{
            let card = new Bot.Card.TextCard('出错了'+String(data));
            return {
                card: card,
                outputSpeech: '出错了'
            };
        }

    }
}

exports.handler = function (event, context, callback) {
    try {
        let b = new JianBot(event);
        // 0: debug  1: online
        b.botMonitor.setEnvironmentInfo(privateKey, 0);
        b.run().then(function (result) {
            callback(null, result);
        }).catch(callback);
    }
    catch (e) {
        callback(e);
    }
};
