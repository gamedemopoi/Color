//
//  Stage.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var Stage = cc.Class.extend({

    ctor:function (game) {
        this.game             = game;
        this.storage          = this.game.storage;
        this.enemyTargetChip  = null;
        this.chips            = [];
        this.trees            = [];
        this.isColored        = false;

/*
cc.log(storage.stageDatas.length);
cc.log(storage.stageDatas[0].type);
*/
        var excludeNums = [];
        var items = [];
        for(var i=0;i<game.storage.stageItems.length;i++){            
            var type  = game.storage.stageItems[i]["type"];
            var count = game.storage.stageItems[i]["count"];
            for(var j=0;j<count;j++){
                var num = getRandNumberFromRangeAndExcludeNumbers(1,25,excludeNums);
                var obj = {"type":type,"count":count,"chipNum":num};
                items.push(obj);
                excludeNums.push(num);
            }
        }

        //床のマップチップを張る
        var chipNum = 1;
        var stageBaseNum = 0;
        for (var j=0 ; j< 9 ; j++){
            for(var i=0 ; i < 9 ; i++){
                if(CONFIG.STAGE_BASE[stageBaseNum] == 1){
                    var type = "normal";
                    for(var k=0;k<items.length;k++){
                        if(chipNum == items[k]["chipNum"]){
                            type = items[k]["type"];
                        }
                    }

                    //奇数行と偶数行で列の位置をずらす
                    if(Math.floor(j%2)==0){
                        var posX = 200 * i;
                        var posY = (105/2) * j;
                    }else{
                        var posX = 100 + Math.floor(200 * i);
                        var posY = (105/2) * j;  
                    }

                    this.chipSprite = new Chip(posX,posY,this.game,type,chipNum);
                    this.game.mapNode.addChild(this.chipSprite);
                    this.chips.push(this.chipSprite);

                    this.tree = new Tower(posX,posY,this.game);
                    this.game.mapNode.addChild(this.tree,1000 - posY);
                    this.trees.push(this.tree);
                    //this.tree.setVisible(false);

                    chipNum++;
                }
                stageBaseNum++;
            }
        }

        //コインを作成する
        var coinCnt = this.storage.itemCoinCnt;
        for (var i=0 ; i < coinCnt ; i++){
            var coinX = getRandNumberFromRange(0,CONFIG.MAP_WIDHT);
            var coinY = getRandNumberFromRange(0,CONFIG.MAP_WIDHT);
            this.addCoin(coinX,coinY);
        }

        for(var i=0;i<this.chips.length;i++){
            //zソートする
            this.game.mapNode.reorderChild(
                this.chips[i],
                Math.floor(0 - this.chips[i].getPosition().y)
            );
        }
/*
        for(var i=0;i<this.trees.length;i++){
            //zソートする
            this.game.mapNode.reorderChild(
                this.trees[i],
                Math.floor(0 - this.trees[i].getPosition().y)
            );
        }
*/
    },

    getChipPosition:function(id){
        for(var i=0;i<this.chips.length;i++){
            if(this.chips[i].id == id){
                return [
                    this.chips[i].getPosition().x,
                    this.chips[i].getPosition().y
                ];
            }
        }
        return [0,0];
    },

    //敵が目標とするターゲットを取得する
    getEnemyTargetChip:function(){
        for(var i=0;i<this.chips.length;i++){
            if(this.chips[i].isOccupied == true && this.chips[i].type == "normal"){
                this.enemyTargetChip  = this.chips[i];
                break;
            }
        }
    },

    getTerritoryCnt:function(){
        var cnt = 0;
        for(var i=0;i<this.chips.length;i++){
            if(this.chips[i].isOccupied == true){
                cnt++;
            }
        }
        return cnt;
    },

    getMaxTerritoryCnt:function(){
        return CONFIG.MAX_X_CNT * CONFIG.MAX_Y_CNT;
    },

    update:function(){

        for(var i=0;i<this.chips.length;i++){
            //zソートする
            this.game.mapNode.reorderChild(
                this.chips[i],
                Math.floor(0 - this.chips[i].getPosition().y)
            );
        }


        //世界が色づく
        var cnt = this.getTerritoryCnt();
        if(cnt >= 2){
            //敵が増殖
            if(this.isColored == false){
                this.isColored = true;



                //コインを作成する
                /*
                for (var i=0 ; i < 6 ; i++){
                    var data = this.getCirclePos(i * 60);
                    this.game.stage.addCoin(data[0],data[1]);
                }*/


                //Enemies 死亡時の処理、Zソート
                for(var i=0;i<this.game.enemies.length;i++){
                    this.game.enemies[i].eyeSight = 500;
                    this.game.enemies[i].walkSpeed = 2;
                }

                for(var i=0;i<this.chips.length;i++){
                    var pos = this.chips[i].getPosition();
                    this.game.stage.addCoin(pos.x,pos.y);

                    this.chips[i].isOccupied = false;
                    if(this.chips[i].colorAlpha == 0){
                        this.chips[i].colorAlpha=1;
                    }
                }
                //仲間が姿を消す
                for(var i=0;i<this.game.colleagues.length;i++){
                    this.game.colleagues[i].hp = 0;
                }



            }


        }

        if(this.enemyTargetChip == null){
            this.getEnemyTargetChip();
        }

        for(var i=0;i<this.chips.length;i++){

            this.chips[i].update();

            if(this.chips[i].type == "normal"){
                //占領した場合は木を表示する
                if(this.chips[i].isOccupied == true){
                    this.trees[i].setVisible(true);
                }else{
                    this.trees[i].setVisible(false);
                }
                
                //木がプレイヤーが画面で重なっている場合は透過する
                if(this.trees[i].getPosition().x - 100 <= this.game.player.getPosition().x 
                    && this.game.player.getPosition().x <= this.trees[i].getPosition().x + 100
                    && this.trees[i].getPosition().y <= this.game.player.getPosition().y
                ){
                    this.trees[i].setAlpha(255*0.3);
                }else{
                    this.trees[i].setAlpha(255*1);
                }
            }else{
                this.trees[i].setVisible(false);
            }
        }
    },

    addCoin:function(x,y){
        var coin = new Coin();
        this.game.mapNode.addChild(coin,999);
        coin.set_position(x,y);
        this.game.coins.push(coin);
    },
});

