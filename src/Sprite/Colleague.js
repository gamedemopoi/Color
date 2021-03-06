//
//  Colleague.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var Colleague = cc.Node.extend({
    ctor:function (game,type) {
        this._super();
        this.game              = game;
        this.storage           = this.game.storage;
        this.player            = this.game.player;
        this.flashCnt          = 0;
        this.isCharaVisible    = true;
        this.damageCnt         = 0;
        this.isDamageOn        = false;
        this.actionType        = "none";
        this.randId            = getRandNumberFromRange(1,10);
        //status
        this.lv                = this.storage.lv;
        this.hp                = this.storage.hp;
        this.maxHp             = this.storage.maxHp;
        this.attack            = this.storage.attack;
        this.defence           = this.storage.defence;
        this.eyeSightRange     = 20;
        this.walkSpeed         = this.storage.walkSpeed;
        this.createCot         = this.storage.createCot;
        //image
        this.charactorCode     = this.storage.charactorCode;

if(type == 1){
        this.image             = this.storage.image;
        this.imgWidth          = this.storage.imgWidth; 
        this.imgHeight         = this.storage.imgHeight;
}else{
        this.image             = "sprite/chara005.png";
        this.imgWidth          = 20; 
        this.imgHeight         = 26;
        this.hp                = 200;
        this.maxHp             = 200;
}
        //init
        this.direction         = "front";
        this.initSprite();
        this.damangeTexts      = new Array();
        this.isDamaged         = false;
        this.isStop            = false;
        this.directionCnt      = 0;
        this.beforeX           = this.getPosition().x;
        this.beforeY           = this.getPosition().y;
        this.isWait            = false;
        this.bulletLncTime     = 0;
        this.jumpY             = 0;
        this.jumpYDirect       = "up";
    },
    
    remove:function() {
        this.removeChild(this.sprite);
        //this.removeChild(this.gauge);
        //damage text
        for(var i=0;i<this.damangeTexts.length;i++){
            this.removeChild(this.damangeTexts[i]);
        }
    },

    addFlashCnt:function(){
        this.flashCnt++;
        if(this.flashCnt>=3){
            this.flashCnt=0;
            if(this.isCharaVisible == true){
                this.isCharaVisible = false;
                this.sprite.setOpacity(255*0.2);
            }else{
                this.isCharaVisible = true;
                this.sprite.setOpacity(255*1);
            }
        }
    },

    doBullet:function(){
        if(this.bulletLncTime == 0){
            this.bulletLncTime=1;
            this.game.addColleagueBullet(this);
            return true;
        }
        return false;
    },

    update:function() {

        this.sprite.setPosition(0,this.jumpY);

        if(this.bulletLncTime>=1){
            this.iconVoice.setOpacity(255*0);
            this.bulletLncTime++;
            if(this.bulletLncTime>=30*8){
                this.bulletLncTime = 0;
            }
        }else{
           this.iconVoice.setOpacity(255*1);
        }

        if(this.isDamageOn == true){
            this.addFlashCnt();
            this.damageCnt++;
            if(this.damageCnt>=50){
                this.damageCnt = 0;
                this.isDamageOn = false;
                this.sprite.setOpacity(255*1);
            }
        }

        if(this.hp == 0){
            this.remove();
            return false;
        }

        //damage text
        for(var i=0;i<this.damangeTexts.length;i++){
            if(this.damangeTexts[i].update() == false){
                this.removeChild(this.damangeTexts[i]);
                this.damangeTexts.splice(i, 1);
            }
        }

        if(this.game.player.targetType == "ENEMY"){
            this.actionType = "ENEMY";
            if(this.player.tE == null) return;
            this.moveToPositions(
                this.player.tE.getPosition().x + this.player.tE.motionTrack[this.randId].rollingCube.getPosition().x,
                this.player.tE.getPosition().y + this.player.tE.motionTrack[this.randId].rollingCube.getPosition().y,
                1
            );
        }else if(this.game.player.targetType == "CHIP"){
            this.actionType = "CHIP";
            if(this.player.targetChip == null){}else{
                this.moveToPositions(
                    this.player.targetChip.getPosition().x + this.player.targetChip.motionTrack[this.randId].rollingCube.getPosition().x,
                    this.player.targetChip.getPosition().y + this.player.targetChip.motionTrack[this.randId].rollingCube.getPosition().y,
                    0
                );
            }
        }else{
            this.actionType = "FOLLOW";
            this.moveTo(this.player);
        }

        //向きの制御
        this.directionCnt++;
        if(this.directionCnt >= 5){
            this.directionCnt = 0;
            this.setDirection(this.beforeX,this.beforeY);
            this.beforeX = this.getPosition().x;
            this.beforeY = this.getPosition().y;
        }

        return true;
    },

    damage:function(damagePoint) {
        playSE(s_se_attack);
        this.hp = this.hp - damagePoint;
        if(this.hp < 0){
            this.hp = 0;
        }
        /*
        var damageText = new DamageText();
        this.addChild(damageText,5);
        this.damangeTexts.push(damageText);
        */
        this.isDamageOn = true;
    },

    getDirection:function(){
        return this.direction;
    },

    initSprite:function(){
        //足下の影
        this.shadow = cc.Sprite.create(s_shadow);
        this.shadow.setPosition(0,-8);
        this.shadow.setOpacity(255*0.4);
        this.addChild(this.shadow);

        var frameSeq = [];
        for (var i = 0; i < 3; i++) {
            //96/3,194/4
            var frame = cc.SpriteFrame.create(this.image,cc.rect(this.imgWidth*i,this.imgHeight*0,this.imgWidth,this.imgHeight));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq,0.2);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.sprite = cc.Sprite.create(this.image,cc.rect(0,0,this.imgWidth,this.imgHeight));
        this.sprite.runAction(this.ra);
        this.addChild(this.sprite);

        this.iconVoice = cc.Sprite.create(s_critical_message);
        this.iconVoice.setPosition(10,25);
        this.sprite.addChild(this.iconVoice);

        //デバッグ
        if(CONFIG.DEBUG_FLAG==1){
            this.sigh = cc.LayerColor.create(cc.c4b(255,0,0,255),3,3);
            this.sigh.setPosition(0,0);
            this.addChild(this.sigh);
        }
    },

    moveTo:function(player) {
        this.jumpY=0;
        this.jumpYDirect = "up";

        if(this.isStop) return;
        var dX = this.game.player.getPosition().x - this.getPosition().x;
        var dY = this.game.player.getPosition().y - this.getPosition().y;
        var rad = Math.atan2(dX,dY);
        var speedX = this.walkSpeed * Math.sin(rad);
        var speedY = this.walkSpeed * Math.cos(rad);
        this.setPosition(
            this.getPosition().x + speedX,
            this.getPosition().y + speedY
        );
    },

    moveToPositions:function(posX,posY,jumpType) {
        if(jumpType==1){
            if(this.jumpYDirect=="up"){
                this.jumpY+=5;
                if(this.jumpY >= 120){
                    this.jumpY = 120;
                    this.jumpYDirect="down";
                }
            }else if(this.jumpYDirect=="down"){
                this.jumpY-=15;
                if(this.jumpY <= 0){
                    this.jumpY = 0;
                    this.jumpYDirect="up";
                }
            }

        }
        var dX = posX - this.getPosition().x;
        var dY = posY - this.getPosition().y;
        var rad = Math.atan2(dX,dY);
        var speedX = this.walkSpeed * Math.sin(rad);
        var speedY = this.walkSpeed * Math.cos(rad);
        this.setPosition(
            this.getPosition().x + speedX,
            this.getPosition().y + speedY
        );
    },

    setDirection:function(DX,DY){
        //横の距離が大きいとき
        var diffX = Math.floor(this.getPosition().x - DX);
        var diffY = Math.floor(this.getPosition().y - DY);
        if(diffX > 0 && diffY > 0){
            this.walkRightUp();
        }
        if(diffX > 0 && diffY < 0){
            this.walkRightDown();
        }
        if(diffX < 0 && diffY > 0){
            this.walkLeftUp();
        }
        if(diffX < 0 && diffY < 0){
            this.walkLeftDown();
        }
    },

    walkLeftDown:function(){
        if(this.direction != "front"){
            this.direction = "front";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < 3; i++) {
                var frame = cc.SpriteFrame.create(this.image,cc.rect(this.imgWidth*i,this.imgHeight*0,this.imgWidth,this.imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq,0.2);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },

    walkRightDown:function(){
        if(this.direction != "left"){
            this.direction = "left";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < 3; i++) {
                var frame = cc.SpriteFrame.create(this.image,cc.rect(this.imgWidth*i,this.imgHeight*1,this.imgWidth,this.imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq,0.2);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },

    walkLeftUp:function(){
        if(this.direction != "right"){
            this.direction = "right";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < 3; i++) {
                var frame = cc.SpriteFrame.create(this.image,cc.rect(this.imgWidth*i,this.imgHeight*2,this.imgWidth,this.imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq,0.2);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },

    walkRightUp:function(){
        if(this.direction != "back"){
            this.direction = "back";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < 3; i++) {
                var frame = cc.SpriteFrame.create(this.image,cc.rect(this.imgWidth*i,this.imgHeight*3,this.imgWidth,this.imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq,0.2);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },

});