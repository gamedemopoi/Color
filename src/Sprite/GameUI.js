//
//  GameUI.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var GameUI = cc.Node.extend({
    ctor:function (game) {
        this._super();
        this.game    = game;
        this.storage = this.game.storage;

        //header
        this.uiHeader = cc.LayerColor.create(cc.c4b(0,255,255,255 * 0),320,200);
        this.uiHeader.setPosition(0,430);
        this.uiHeader.setAnchorPoint(0,0);
        this.addChild(this.uiHeader);

        //footer
        this.uiFooter = cc.LayerColor.create(cc.c4b(0,255,255,255 * 0),320,80);
        this.uiFooter.setPosition(0,0);
        this.uiFooter.setAnchorPoint(0,0);
        this.addChild(this.uiFooter);

        //s_header
        this.imgHeader = cc.Sprite.create(s_header);
        this.imgHeader.setPosition(0,-30);
        this.imgHeader.setAnchorPoint(0,0);
        this.uiHeader.addChild(this.imgHeader);

        //s_footer
        this.imgFooter = cc.Sprite.create(s_input_device);
        this.imgFooter.setPosition(0,0);
        this.imgFooter.setAnchorPoint(0,0);
        this.uiFooter.addChild(this.imgFooter);

        this.imgFooter2 = cc.Sprite.create(s_input_device2);
        this.imgFooter2.setPosition(0,0);
        this.imgFooter2.setAnchorPoint(0,0);
        this.uiFooter.addChild(this.imgFooter2);

        //ミッション文字
        this.missionLabel = cc.LabelTTF.create("","Arial",14);        
        this.missionLabel.setPosition(90,420);
        this.missionLabel.setAnchorPoint(0,0);
        this.addChild(this.missionLabel);

        //プレイヤーキャラクターの表示
        this.charactor = new DisplayPlayer(
            game.player.image,game.player.imgWidth,game.player.imgHeight
        );
        this.charactor.setAnchorPoint(0.5,0.5);
        this.charactor.setPosition(40,20);
        this.charactor.setScale(1.5,1.5);
        this.uiHeader.addChild(this.charactor);

        //Territory
        this.territoryNumLable = cc.LabelTTF.create("","Arial",25);        
        this.territoryNumLable.setPosition(20,-25);
        this.territoryNumLable.setAnchorPoint(0,0);
        this.territoryNumLable.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.uiHeader.addChild(this.territoryNumLable);

        //タイムリミット
        this.timeLabel = cc.LabelTTF.create("","Arial",20);
        this.timeLabel.setPosition(320/2,15);
        this.timeLabel.setAnchorPoint(0.5,0);
        this.uiHeader.addChild(this.timeLabel);

        //ホームボタン
        var homeButton = cc.MenuItemImage.create(
            s_home_button,
            s_home_button_on,
            onBackCallback,
            this
        );
        homeButton.setAnchorPoint(0,0);
        homeButton.setPosition(260,-15);

        //set header
        this.headerMenu = cc.Menu.create(
            homeButton
        );
        this.uiHeader.addChild(this.headerMenu,33);
        this.headerMenu.setPosition(0,0);

        this.comboLabel = createLabel("000Combo",40,320/2-80,480/2);
        this.comboLabel.setFontFillColor(cc.c4b(255,0,0,255));
        this.addChild(this.comboLabel);
        //this.comboLabel.setOpacity(255*0.4);

        this.rectBarL = cc.LayerColor.create(cc.c4b(0,255,0,255),10,400);
        this.rectBarL.setPosition(0,0);
        this.rectBarL.setAnchorPoint(0,0);
        this.rectBarL.setOpacity(255*0.4);
        this.addChild(this.rectBarL);

        this.rectBarR = cc.LayerColor.create(cc.c4b(0,255,0,255),10,400);
        this.rectBarR.setPosition(310,0);
        this.rectBarR.setAnchorPoint(0,0);
        this.rectBarR.setOpacity(255*0.4);
        this.addChild(this.rectBarR);
    },

    //UIのテキストをupdateする
    update:function() {

        var rate = this.game.scrollYPower / 100;
        this.rectBarL.setScale(1,rate);
        this.rectBarR.setScale(1,rate);

        if(this.game.player.targetType == "ENEMY"){
            this.imgFooter.setVisible(true);
            this.imgFooter2.setVisible(false);
        }else if(this.game.player.targetType == "CHIP"){
            this.imgFooter.setVisible(false);
            this.imgFooter2.setVisible(true);
        }else{
            this.imgFooter.setVisible(false);
            this.imgFooter2.setVisible(false);
        }

        if(this.game.comboCnt >= 1){
            this.comboLabel.setOpacity(255*1);
            this.comboLabel.setString("+" + this.game.comboCnt + "combo!");
        }else{
            this.comboLabel.setOpacity(0);
        }
    
        //ミッションの表示
        this.missionLabel.setString(
            "" + this.game.missionLabel + "[" + this.game.missionCnt + "/" + this.game.missionMaxCnt+"]"
        );

        //ミッション時間の表示
        var time = getZeroPaddingNumber(Math.floor((this.game.missionTimeLimit - this.game.timeCnt)/30),3);
        this.timeLabel.setString(
            "" + time + "秒"
        );
        this.territoryNumLable.setString(
            "×"+ getZeroPaddingNumber(Math.floor(this.game.colleagueCnt + 1),2) + ""
        );
    },

});
