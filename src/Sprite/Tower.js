//
//  Tower.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var Tower = cc.Node.extend({
    ctor:function (posX,posY,game,type) {
        this._super();
        this.game     = game;
        this.storage  = this.game.storage;
        this.posX     = posX;
        this.posY     = posY;
        this.type     = type;
        this.setPosition(posX,posY);

        if(this.type==1){
            this.tree     = cc.Sprite.create(s_initSprite);
            this.tree.setPosition(0,50);
            this.addChild(this.tree);
        }else if(this.type==2){
            this.tree     = cc.Sprite.create(s_temple);
            this.tree.setPosition(0,40);
            this.addChild(this.tree);        
        }else if(this.type==3){
            this.tree     = cc.Sprite.create(s_temple2);
            this.tree.setPosition(0,40);
            this.addChild(this.tree);       
        }
    },

    update:function(){
        if(this.game.stage.isColored == true){
            this.setAlpha(255*0);
            return;
        }

        if(this.type == 2 || this.type == 3) return;
        //木がプレイヤーが画面で重なっている場合は透過する
        if(this.getPosition().x - 100 <= this.game.player.getPosition().x 
            && this.game.player.getPosition().x <= this.getPosition().x + 100
            && this.getPosition().y <= this.game.player.getPosition().y
        ){
            this.setAlpha(255*0.3);
        }else{
            this.setAlpha(255*1);
        }
    },

    setAlpha:function(alpha){
    	this.tree.setOpacity(alpha);
    }
});