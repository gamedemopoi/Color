//
//  CharaSelectLayer.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var CharaSelectLayer = cc.Layer.extend({

    init:function (storage) {

        var bRet = false;
        if (this._super()) {

            changeLoadingImage();

            this.storage = storage;
            this.image          = null;
            this.charactorCode  = 0;
            this.isOpenDetail   = false;

            //ファイルの取得
            var jsonFile        = cc.FileUtils.getInstance().getStringFromFile(charactor_json);
            this.jsonData       = JSON.parse(jsonFile);
            this.charactorData  = this.jsonData["charactors"];

            //背景
            var back = cc.Sprite.create(loading_png);
            back.setAnchorPoint(0,0);
            this.addChild(back);

            //UI
            var ui = cc.Sprite.create(s_chara_select);
            ui.setAnchorPoint(0,0);
            this.addChild(ui);

            this.charactors = [];
            for (var i=1 ; i <= 3; i++){
                var row = Math.floor((i-1)/3);
                var col = Math.floor((i-1)%3) + 1;

                var selectButton = new ButtonItem("OK",50,30,this.openDetailWindow,this,i);
                selectButton.setAnchorPoint(0,0.5);
                selectButton.setPosition(75 * col,80 * row + 120 + 200);
                selectButton.setTag(i);
                this.addChild(selectButton);
            }



this.twitterButton = new ButtonItem("Twitterからキャラを生成",250,40,this.onTwitter,this);
this.twitterButton.setPosition(160,120);
this.addChild(this.twitterButton);


            //Back Menu
            var label = cc.LabelTTF.create("-戻る-", "Arial", 20);
            var back = cc.MenuItemLabel.create(label,onBackCallback);
            var menu = cc.Menu.create(back);
            menu.setPosition( 320 / 2, 40);
            this.addChild(menu);

            //詳細ウィンドウ ここから------------------------>
            this.detailWindow = cc.LayerColor.create(cc.c4b(255,255,255,255 * 0.3),280,250);
            this.detailWindow.setPosition(20,100);
            this.addChild(this.detailWindow);

            //キャラクターの表示
            this.charactor = new DisplayPlayer(
                this.charactorData[0]["image"],
                this.charactorData[0]["image_width"],
                this.charactorData[0]["image_height"]
            );
            this.charactor.setAnchorPoint(0.5,0.5);
            this.charactor.setPosition(140,140);
            this.charactor.setScale(3,3);
            this.detailWindow.addChild(this.charactor);

            //キャラクターの説明
            this.infoText = cc.LabelTTF.create("","Arial",13);
            this.infoText.setAnchorPoint(0,1);       
            this.infoText.setPosition(140,170);
            this.detailWindow.addChild(this.infoText);

            // ok
            this.okButton = new ButtonItem("OK",80,40,this.okTapped,this);
            this.okButton.setPosition(100,30);
            this.detailWindow.addChild(this.okButton);

            // ng
            this.ngButton = new ButtonItem("NG",80,40,this.closeDetailWindow,this);
            this.ngButton.setPosition(190,30);
            this.detailWindow.addChild(this.ngButton);

            bRet = true;
        }





        this.scheduleUpdate();

        return bRet;
    },

    update:function(dt){
        if(this.isOpenDetail == true){
            this.detailWindow.setVisible(true);
            //キャラクターのリストを表示しない
            for(var i=0;i<this.charactors.length;i++){
                this.charactors[i].setVisible(false);
            }
        }else{
            this.detailWindow.setVisible(false);
            //キャラクターのリストを表示する
            for(var i=0;i<this.charactors.length;i++){
                this.charactors[i].setVisible(true);
            }
        }
    },

    closeDetailWindow:function(){
        if(this.isOpenDetail == false) return;

        playSystemButton();
        this.isOpenDetail = false;
    },

    openDetailWindow:function(sender){
        if(this.isOpenDetail == true) return;

        //詳細画面を開く
        playSystemButton();
        this.isOpenDetail = true;

        //キャラクターコードを元に詳細画面に画像とテキストを表示する
        this.charactorCode = sender.getTag();
        this.charactor.changeImage(
            this.charactorData[this.charactorCode]["image"],
            this.charactorData[this.charactorCode]["image_width"],
            this.charactorData[this.charactorCode]["image_height"]
        );
        this.infoText.setString(
            this.charactorData[this.charactorCode]["detail"]
        );
    },

    okTapped:function(sender){
        if(this.isOpenDetail == false) return;

        playSystemButton();
        this.onNewGame(this.image,this.charactorCode);
    },

    onNewGame:function (img,charactorCode) {
        cc.LoaderScene.preload(g_resources, function () {            
            var scene = cc.Scene.create();

            //選択したキャラクターから、プレイヤーパラメータを取得する
            storage = getCharactorDataFromJson(this.storage,charactorCode);

            scene.addChild(GameLayer.create(this.storage));
            cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
        },this);
    },


    onTwitter:function (stageNum) {
        playSystemButton();

        cc.LoaderScene.preload(g_chara_select_resources, function () {
            var scene = cc.Scene.create();
            scene.addChild(TwitterLayer.create());
            cc.Director.getInstance().replaceScene(cc.TransitionSlideInR.create(1.2, scene));
        }, this);
    },

});

CharaSelectLayer.create = function (storage) {
    var sg = new CharaSelectLayer();
    if (sg && sg.init(storage)) {
        return sg;
    }
    return null;
};
