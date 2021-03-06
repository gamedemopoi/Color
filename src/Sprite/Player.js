//
//  Player.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var Player = cc.Node.extend({

    ctor:function (game) {
        this._super();
        this.game              = game;
        this.storage           = this.game.storage;

        //status
        this.lv               = this.storage.lv;
        this.hp               = 200;
        this.maxHp            = 200;
        this.attack           = this.storage.attack;
        this.defence          = this.storage.defence;
        this.eyeSightRange    = this.storage.eyeSightRange;
        this.walkSpeed        = this.storage.walkSpeed;

        //image
        this.charactorCode     = this.storage.charactorCode;
        this.image             = this.storage.image;
        this.imgWidth          = this.storage.imgWidth; 
        this.imgHeight         = this.storage.imgHeight;

        //init
        this.battleInterval    = 0;
        this.targetEnemy       = null;
        this.direction         = "front";
        this.bulletSpeed       = CONFIG.BULLET_SPEED;

        this.targetType        = "none";
        this.targetId          = 0;
        this.tE                = null;
        this.nE                = null;

        this.targetChip        = null;
        this.damangeTexts      = new Array();
        this.isDamaged         = false;
        this.isStop            = false;

this.depX = 0;
this.depY = 0;

        //HPゲージ
        //this.gauge             = new Gauge(30,4,'blue');
        //this.gauge.setPosition(-20,20);
        //this.addChild(this.gauge,100);


/*
//軌跡（ヘビ型)
this.trackSnakeInterval = 0;
this.trackSnakes = [];
for(var i=0;i<5;i++){
    var track = new Track(i,this,this.game);
    this.game.mapNode.addChild(track);
    this.trackSnakes.push(track);
}
*/
        //initialize Animation
        this.initializeWalkAnimation();



this.update();
    },
    
    init:function () {
    },

    update:function() {


//自身が通った座標の履歴
this.trackSnakeInterval++;
if(this.trackSnakeInterval >= 20){
    this.trackSnakeInterval=0;
    //add
    var track = new Track(1,this,this.game);
    this.game.mapNode.addChild(track);
    track.setPosition(
        this.getPosition().x,
        this.getPosition().y
    );
    /*
    this.trackSnakes.push(track);
    this.game.mapNode.removeChild(this.trackSnakes[0]);
    this.trackSnakes.splice(0,1);
    */
}

        //damage text
        for(var i=0;i<this.damangeTexts.length;i++){
            if(this.damangeTexts[i].update() == false){
                this.removeChild(this.damangeTexts[i]);
                this.damangeTexts.splice(i, 1);
            }
        }
    },

    remove:function() {
        this.removeChild(this.sprite);
//this.removeChild(this.gauge);
        //damage text
        for(var i=0;i<this.damangeTexts.length;i++){
            this.removeChild(this.damangeTexts[i]);
        }
    },
    
    damage:function(damagePoint) {
        playSE(s_se_attack);
        
        this.hp = this.hp - damagePoint;
        if(this.hp < 0){
            this.hp = 0;
        }
        this.storage.playerHp = this.hp;

        var damageText = new DamageText();
        this.addChild(damageText,5);
        this.damangeTexts.push(damageText);
    },

    getDirection:function(){
        return this.direction;
    },

    initializeWalkAnimation:function(){
        //足下の陰
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

        //デバッグ
        if(CONFIG.DEBUG_FLAG==1){
            this.sigh = cc.LayerColor.create(cc.c4b(255,0,0,255),3,3);
            this.sigh.setPosition(0,0);
            this.addChild(this.sigh);
        }

        this.nearistEnemy;
    },

    walkLeftDown:function(){
        //左下
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
        //右下
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
        //左上
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
        //右上
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

    moveToTargetMarker:function(targetSprite) {
        if(this.isStop) return;
        if(targetSprite == null) return;

        if(this.getPosition().x < targetSprite.getPosition().x){
            if(Math.abs(this.getPosition().x - targetSprite.getPosition().x) > this.walkSpeed){
                this.setPosition(
                    this.getPosition().x + this.walkSpeed,
                    this.getPosition().y
                );
            }else{
                this.setPosition(
                    targetSprite.getPosition().x,
                    this.getPosition().y
                );
            }
        }
        if(this.getPosition().x > targetSprite.getPosition().x){
            if(Math.abs(this.getPosition().x - targetSprite.getPosition().x) > this.walkSpeed){
                this.setPosition(
                    this.getPosition().x - this.walkSpeed,
                    this.getPosition().y
                );
            }else{
                this.setPosition(
                    targetSprite.getPosition().x,
                    this.getPosition().y
                );
            }
        }
        if(this.getPosition().y < targetSprite.getPosition().y){
            if(Math.abs(this.getPosition().y - targetSprite.getPosition().y) > this.walkSpeed){
                this.setPosition(
                    this.getPosition().x,
                    this.getPosition().y + this.walkSpeed
                );
            }else{
                this.setPosition(
                    this.getPosition().x,
                    targetSprite.getPosition().y
                );
            }
        }
        if(this.getPosition().y > targetSprite.getPosition().y){
            if(Math.abs(this.getPosition().y - targetSprite.getPosition().y) > this.walkSpeed){
                this.setPosition(
                    this.getPosition().x,
                    this.getPosition().y - this.walkSpeed
                );
            }else{
                this.setPosition(
                    this.getPosition().x,
                    targetSprite.getPosition().y
                );
            }
        }
    },

    moveToNearistEnemy:function() {
        if(this.isStop) return;
        var min = 9999;
        for(var i=0;i<this.game.enemies.length;i++){
            var distance = cc.pDistance(this.getPosition(),this.game.enemies[i].getPosition());
            if(min > distance && distance > 50){
                min = distance;
                //this.player.nE = this.enemies[i];
                this.nearistEnemy   = this.game.enemies[i];
                this.targetType = "ENEMY";
                this.targetId   = this.game.enemies[i].id;
                this.tE         = this.game.enemies[i];
            }
        }

        if(this.nearistEnemy == null) return;

        if(this.getPosition().x < this.nearistEnemy.getPosition().x){
            if(Math.abs(this.getPosition().x - this.nearistEnemy.getPosition().x) > this.walkSpeed){
                this.setPosition(
                    this.getPosition().x + this.walkSpeed,
                    this.getPosition().y
                );
            }else{
                this.setPosition(
                    this.nearistEnemy.getPosition().x,
                    this.getPosition().y
                );
            }
        }
        if(this.getPosition().x > this.nearistEnemy.getPosition().x){
            if(Math.abs(this.getPosition().x - this.nearistEnemy.getPosition().x) > this.walkSpeed){
                this.setPosition(
                    this.getPosition().x - this.walkSpeed,
                    this.getPosition().y
                );
            }else{
                this.setPosition(
                    this.nearistEnemy.getPosition().x,
                    this.getPosition().y
                );
            }
        }
        if(this.getPosition().y < this.nearistEnemy.getPosition().y){
            if(Math.abs(this.getPosition().y - this.nearistEnemy.getPosition().y) > this.walkSpeed){
                this.setPosition(
                    this.getPosition().x,
                    this.getPosition().y + this.walkSpeed
                );
            }else{
                this.setPosition(
                    this.getPosition().x,
                    this.nearistEnemy.getPosition().y
                );
            }
        }
        if(this.getPosition().y > this.nearistEnemy.getPosition().y){
            if(Math.abs(this.getPosition().y - this.nearistEnemy.getPosition().y) > this.walkSpeed){
                this.setPosition(
                    this.getPosition().x,
                    this.getPosition().y - this.walkSpeed
                );
            }else{
                this.setPosition(
                    this.getPosition().x,
                    this.nearistEnemy.getPosition().y
                );
            }
        }
    },

    playerDirectionManage:function(targetSprite){
        //横の距離が大きいとき
        var diffX = Math.floor(targetSprite.getPosition().x - this.getPosition().x);
        var diffY = Math.floor(targetSprite.getPosition().y - this.getPosition().y);
        
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

});