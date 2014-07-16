//
//  Chip.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var Chip = cc.Node.extend({

    ctor:function (posX,posY,game,type,id) {
        this._super();
        this.game              = game;
        this.type              = type;
        this.isOccupied        = false;
        this.id                = id;

        this.enemyCollisionCnt = 0;
        this.enemyCollisionFlg = false;
        this.hp                = 100;
        this.maxHp             = 100;
        this.colleagueCnt      = 0;
        this.posX              = posX;
        this.posY              = posY;

        this.coloredCnt        = 0;
        this.colorAlpha        = 0;
        this.isSetColor        = false;

        this.enemyDepMaxTime   = 30 * 5;
        this.enemyDepTime      = 0;

        this.coloredTime       = 1;

        this.setColoredTime();

        //デバッグ用の中心を表示するサインマーカー
        if(CONFIG.DEBUG_FLAG==1){
            this.sigh = cc.LayerColor.create(cc.c4b(255,0,0,255),3,3);
            this.sigh.setPosition(posX,posY);
            this.addChild(this.sigh,-9995);
        }


/*
cc.log(storage.stageDatas.length);
cc.log(storage.stageDatas[0].type);
for()
*/

        //軌跡（クラゲ型)
        this.trackJellyFishes = new Array();
        for (var i=0 ; i < 18 ; i++){
            this.cube = new Cube(i,30,65);
            this.trackJellyFishes.push(this.cube);
            this.addChild(this.cube,999);
        }


        if(this.id == 1){
            this.type  = "poi";
            this.hp    = 10;
            this.maxHp = 10;
            this.chipSprite = cc.Sprite.create(s_chip_003);
        }else if(this.id == 10){
            this.enemyDepMaxTime = 30 * 30;
            this.type = "boss";
            this.chipSprite = cc.Sprite.create(s_chip_002);
        }else if(this.id == 11 || this.id == 25){
            this.type = "azito";
            if(this.id == 11){
                this.enemyDepTime    = 30 * 4;
                this.enemyDepMaxTime = 30 * 5;
            }
            if(this.id == 25){
                this.enemyDepTime    = 30 * 0;
                this.enemyDepMaxTime = 30 * 8;
            }
            this.chipSprite = cc.Sprite.create(s_chip_001);
        }else if(this.id == 23 || this.id == 22){
            this.type  = "tree";
            this.hp    = 50;
            this.maxHp = 50;
            this.chipSprite = cc.Sprite.create(s_chip_004);
        }else if(this.id == 16 || this.id == 19){
            this.type  = "twitter";
            this.hp    = 15;
            this.maxHp = 15;
            this.chipSprite = cc.Sprite.create(s_chip_005);
        }else{
            this.type = "normal";
            this.chipSprite = cc.Sprite.create(s_mapchip_001);
            this.hp = 0;
        }

        //マップ配置
        this.addChild(this.chipSprite);
        this.chipSprite.setPosition(0,0);
        this.chipSprite.setAnchorPoint(0.5,0.5);
        this.setPosition(posX,posY);

        //ゲージ配置s_mapchip_black
        this.rectBase = cc.Sprite.create(s_mapchip_black);
        this.rectBase.setOpacity(255*0.7);
        this.rectBase.setPosition(0,0);
        this.rectBase.setAnchorPoint(0.5,0.5);
        this.addChild(this.rectBase);

        if(this.type == "normal"){
            this.rectBase.setOpacity(255*0);
        }
    
        this.colored = cc.Sprite.create(s_mapchip_001_colored);
        this.colored.setOpacity(255*0);
        this.colored.setPosition(0,0);
        this.colored.setAnchorPoint(0.5,0.5);
        this.addChild(this.colored);

if(this.type == "poi"){
        this.temple = cc.Sprite.create(s_temple);
        this.temple.setPosition(0,40);
        this.temple.setAnchorPoint(0.5,0.5);
        this.addChild(this.temple);
}
/*
        //mapNumber
        this.missionLabel = cc.LabelTTF.create(this.id,"Arial",14);
        this.addChild(this.missionLabel);
*/
        //timeNumber
        this.timeLabel = cc.LabelTTF.create("","Arial",35);
        this.addChild(this.timeLabel);
    },

    getCirclePos:function(cubeAngle){
        if(cubeAngle>=360){
            cubeAngle = 0;
        }
        var cubeRad = cubeAngle * Math.PI / 180;
        var cubeX = 50 * Math.cos(cubeRad) + this.posX;
        var cubeY = 50 * Math.sin(cubeRad) + this.posY;
        return [cubeX,cubeY];
    },


    setColoredTime:function(){
        if(this.id == 13){
            this.coloredTime       = 1;
        }
        if(this.id == 18){
            this.coloredTime       = 2;
        }
        if(this.id == 14){
            this.coloredTime       = 3;
        }
        if(this.id == 9){
            this.coloredTime       = 4;
        }
        if(this.id == 5){
            this.coloredTime       = 5;
        }
        if(this.id == 8){
            this.coloredTime       = 6;
        }
        if(this.id == 12){
            this.coloredTime       = 7;
        }
        if(this.id == 7){
            this.coloredTime       = 8;
        }
        if(this.id == 21){
            this.coloredTime       = 9;
        }
        if(this.id == 24){
            this.coloredTime       = 10;
        }
        if(this.id == 22){
            this.coloredTime       = 11;
        }
        if(this.id == 19){
            this.coloredTime       = 12;
        }
        if(this.id == 15){
            this.coloredTime       = 13;
        }
        if(this.id == 10){
            this.coloredTime       = 14;
        }
        if(this.id == 6){
            this.coloredTime       = 15;
        }
        if(this.id == 3){
            this.coloredTime       = 16;
        }
        if(this.id == 1){
            this.coloredTime       = 17;
        }
        if(this.id == 2){
            this.coloredTime       = 18;
        }
        if(this.id == 4){
            this.coloredTime       = 19;
        }
        if(this.id == 7){
            this.coloredTime       = 20;
        }
        if(this.id == 11){
            this.coloredTime       = 21;
        }
        if(this.id == 16){
            this.coloredTime       = 22;
        }
        if(this.id == 20){
            this.coloredTime       = 23;
        }
        if(this.id == 23){
            this.coloredTime       = 24;
        }
        if(this.id == 25){
            this.coloredTime       = 25;
        }
    },

    update:function() {

        //cubes
        for(var i=0;i<this.trackJellyFishes.length;i++){
            this.trackJellyFishes[i].update();
        }

        if(this.game.player.targetChip.id == this.id){
            if(this.type == "poi"){
                if(this.game.scrollXCnt==5){
                    this.game.addColleagues(1,1);
                }
            }
            if(this.type == "twitter"){
                if(this.game.scrollXCnt==5){
                    this.game.addColleagues(1,2);
                }
            }
        }

        if(this.colorAlpha >= 1){
            this.coloredCnt++;
            if(this.coloredCnt>=2*this.coloredTime){
                if(this.isSetColor==false){
                    this.isSetColor=true;

                    //this.game.addEnemyByPos(this.game.storage.enemyCode,this.getPosition().x,this.getPosition().y);

                    //木を生やす
                    var frameSeq = [];
                    for (var y = 0; y <= 3; y++) {
                        for (var x = 0; x <= 4; x++) {
                            var frame = cc.SpriteFrame.create(s_effect_pipo113,cc.rect(192*x,192*y,192,192));
                            frameSeq.push(frame);
                        }
                    }
                    var wa = cc.Animation.create(frameSeq,0.1);
                    this.energyRep = cc.Repeat.create(cc.Animate.create(wa),1);
                    this.energyRep.retain();
                    this.energySprite = cc.Sprite.create(s_enargy,cc.rect(0,0,48,96));
                    this.energySprite.retain();
                    this.energySprite.setPosition(0,70);
                    this.energySprite.runAction(this.energyRep);
                    this.addChild(this.energySprite);
/*
                this.colorAlpha++;
                if(this.colorAlpha>=100){
                    this.colorAlpha = 100;
                }
*/
                this.colored.setOpacity(255*100/100);
                }

            }
        }


if(this.id == 11 || this.id == 25 || this.id == 10){

        var depEnemyCnt = 0;
        for(var i=0;i<this.game.enemies.length;i++){
            if(this.game.enemies[i].depChipId == this.id){
                depEnemyCnt++;
            }
        }


        //if(depEnemyCnt == 0){
            this.enemyDepTime++;
        //}

        var nokori = Math.floor((this.enemyDepMaxTime-this.enemyDepTime)/30);
        this.timeLabel.setString("" + nokori);
        if(this.enemyDepTime >= this.enemyDepMaxTime){
            //this.timeLabel.setString("OPEN");
            if(this.id == 11){
                this.enemyDepTime = 0;
                this.routes = [11,16,20,17,12,7];
                this.game.addEnemyByPos(1,this.routes);
            }else if(this.id == 25){
                this.enemyDepTime = 0;
                this.routes = [25,24,22,18,21,23];
                this.game.addEnemyByPos(4,this.routes);
            }else if(this.id == 10){
                this.enemyDepTime = -9999;
                this.timeLabel.setString("OPEN");
                this.routes = [10,15,19,14,9,5,3,6];
                this.game.addEnemyByPos(8,this.routes);
            }
        }
}



        if(this.enemyCollisionCnt == 1){
            this.enemyCollisionFlg = true;
            this.enemyCollisionCnt++;
            if(this.enemyCollisionCnt>=10){
                this.enemyCollisionCnt = 0;
                this.enemyCollisionFlg = false;
            }
        }

        //プレイヤーが占領する
        if(this.isOccupied == false && this.hp <= 0){
            /*
            if(this.type == "tree"){
                this.isOccupied = true;
                this.game.storage.occupiedCnt++;
            }*/
            //SE
            playSE(s_se_occupied);
            if(this.type == "tree"){  
                this.isOccupied = true;
                this.game.storage.occupiedCnt++;
                this.game.setTerritoryCnt();
                //占領ミッションの場合はカットインを表示する
                if(this.game.storage.missionGenre == "occupy"){
                    this.game.cutIn.set_text(
                        "占領した!.[" + this.game.territoryCnt + "/2]"
                    );
                }
            }
        }

/*
        //敵が占領する
        if(this.isOccupied == true && this.hp >= 100){
            this.isOccupied = false;
            this.game.storage.occupiedCnt--;
            //SE
            playSE(s_se_enemyOccupied);
            //ターゲットを削除する
            this.game.stage.enemyTargetChip = null;
            //新しいターゲットを選択
            this.game.stage.getEnemyTargetChip();
            //CutIN
            this.game.setTerritoryCnt();
            this.game.cutIn.set_text("敵に占領された.[" + this.game.territoryCnt + "/" + this.game.missionMaxCnt + "]");
        }
*/


        
if(this.type == "poi"){
        //HPの最大と最小
        if(this.hp <= 0){
            this.hp = this.maxHp;
            //this.game.addColleagues(1,1);
        }
        if(this.hp >= this.maxHp) this.hp = this.maxHp;


}else if(this.type == "twitter"){
        //HPの最大と最小
        if(this.hp <= 0){
            this.hp = this.maxHp;
            //this.game.addColleagues(1,2);
        }
        if(this.hp >= this.maxHp) this.hp = this.maxHp;
}else{
        //HPの最大と最小
        if(this.hp <= 0)   this.hp = 0;
        if(this.hp >= this.maxHp) this.hp = this.maxHp;
}  

        var rate = this.hp / this.maxHp;
        this.rectBase.setScale(rate);
    },
});
