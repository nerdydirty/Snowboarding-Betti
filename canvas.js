/*--------------------------------------------------
--------------->> Snowboarding Betti <<-------------
--------------------------------------------------*/
//Hauptobjekt:
var Game = {
    canvas: false,
    context: false,
    requestId: 0,
    running: false,
    score: 0,
    backgroundGamesound:{},
    /*-----------------------------------------------------
    ---------------------->> init() <<--------------------
    -------------------------------------------------------*/
    init: function(){
        /*--------------------------------------------------
                --------------->> ?? <<-------------
        --------------------------------------------------*/
        var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
        var open = indexedDB.open("snowboarding-DB",1);
        open.onupgradeneeded = function(){
            var db = open.result;
            db.createObjectStore("players",{keyPath:"id", autoIncrement: true});
        };
        open.onsuccess = function(){
            var db = open.result;
            var tx = db.transaction("players","readwrite");
            var store = tx.objectStore("players");
            var allPlayers = store.getAll();
            allPlayers.onsuccess = function(){
                for (var i = 0; i<allPlayers.result.length; i++){
                    var player = allPlayers.result[i];
                    Game.scenes.highscore.list.push(player);
                }
                Game.scenes.highscore.list.sort(function(a,b) {
                    if (a.score > b.score) {
                        return -1;
                    }
                    if (b.score > a.score) {
                        return 1;
                    }
                    return 0;
                });
            }
            tx.oncomplete = function(){
                db.close();
            }
        };
        //Context auf dem gemalt wird:
        Game.canvas = document.getElementById('canvas');
        Game.context = Game.canvas.getContext('2d');
        
        //Vorbereitung für die Game-Loop:
        window.requestAnimationFrame = (function(){
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback){
                    window.setTimeout(callback, 1000 / 60);
                };
        })();
        window.cancelAnimationFrame = ( function(){
            return window.cancelAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                clearTimeout
        })();
        /*--------------------------------------------------
        -------------------->> Audio <<---------------------
        --------------------------------------------------*/
        //Audio laden:
        Game.backgroundGamesound = new Audio('audio/background.mp3');
        Game.backgroundCavesound = new Audio('audio/cavernsound.mp3');
        Game.backgroundGamesound.loop = true;
        Game.backgroundCavesound.loop = true;
        //Game.backgroundGamesound.play(); --> ICH MERKE KEINEN UNTERSCHIED EGAL OB DRIN ODER NICHT...
        Game.entities.betti.jumpSound = new Audio('audio/Jump-SoundBible.com-1007297584.mp3');
        Game.entities.betti.jumpSound.loop = false;
        Game.entities.betti.cassetteSound = new Audio('audio/bavarianFinestWoodis.mp3');
        Game.entities.betti.cassetteSound.loop = false;
        Game.entities.betti.donutSound = new Audio('audio/Smack-Lips-SoundBible.com-411304180.mp3');
        Game.entities.betti.donutSound.playbackRate = 3.0;
        Game.entities.betti.crashSound = new Audio('audio/Female-Sigh-SoundBible.com-675137452.mp3');
        Game.entities.betti.crashSound.loop = false;
        
        /*--------------------------------------------------
        -------------------->> Assets <<---------------------
        --------------------------------------------------*/
       //Assets laden:
        Game.assets.addRessource('sprites/png/betti_1.png');
        Game.assets.addRessource('sprites/png/betti_2.png');
        Game.assets.addRessource('sprites/png/betti_4.png');
        Game.assets.addRessource('sprites/png/snowGround1.png'); 
        Game.assets.addRessource('sprites/png/snowGround2.png'); 
        Game.assets.addRessource('sprites/png/1.png');
        Game.assets.addRessource('sprites/png/2.png');
        Game.assets.addRessource('sprites/png/3.png');
        Game.assets.addRessource('sprites/png/4.png');
        Game.assets.addRessource('sprites/png/5.png');
        Game.assets.addRessource('sprites/png/6.png');
        Game.assets.addRessource('sprites/png/7.png');
        Game.assets.addRessource('sprites/png/8.png');
        Game.assets.addRessource('sprites/png/9.png');
        Game.assets.addRessource('sprites/png/10.png');
        Game.assets.addRessource('sprites/png/11.png');
        Game.assets.addRessource('sprites/png/12.png');
        Game.assets.addRessource('sprites/png/13.png');
        Game.assets.addRessource('sprites/png/14.png');
        Game.assets.addRessource('sprites/png/15.png');
        Game.assets.addRessource('sprites/png/16.png');
        Game.assets.addRessource('sprites/png/cassette_mini.png');
        Game.assets.addRessource('sprites/png/headphones.png');
        Game.assets.addRessource('sprites/png/tree-stump.png');
        Game.assets.addRessource('sprites/png/tree.png');
        Game.assets.addRessource('sprites/png/rock2.png');
        Game.assets.addRessource('sprites/png/rock3.png');
        Game.assets.addRessource('sprites/png/rock4.png');
        Game.assets.addRessource('sprites/png/rock5.png');
        Game.assets.addRessource('sprites/png/rock6.png');
        Game.assets.addRessource('sprites/png/rock.png');
        Game.assets.addRessource('sprites/png/gold1.png');
        Game.assets.addRessource('sprites/png/Donut_mini.png');
        //Game.assets.addRessource('sprites/png/musictape.png');
        //Game.assets.addRessource('sprites/png/betti_1_weich.png');
        Game.assets.addRessource('sprites/png/mountains_0.png');
        Game.assets.addRessource('sprites/png/monument-valley-background.png');
        Game.assets.addRessource('sprites/png/mountains_1.png');
        Game.assets.addRessource('sprites/png/forrest.png');
        Game.assets.addRessource('sprites/png/caveBG.png');
        Game.assets.addRessource('sprites/png/caveBGfront.png');
        Game.assets.addRessource('sprites/png/caveBGback.png');
        //Game.assets.addRessource('sprites/png/loadingText_bigPic.jpg');
        Game.assets.addRessource('sprites/png/StartButton.png');
        Game.assets.addRessource('sprites/png/trophy.png');
        Game.assets.addRessource('sprites/png/landingPageButton.png');
        //Bis hier hin wird das Bild zunächst auf eine Downloadliste gesetzt
        Game.assets.download();
       
        //Spiel starten:
        Game.loop();
    },
    /*--------------------------------------------------
    ------------>> Render-Methode v. Game <<------------
    --------------------------------------------------*/
    render: function(){
        if(Game.scenes.current == 'highscore'){
            Game.scenes.highscore.render();
            Game.backgroundGamesound.pause();
            Game.backgroundCavesound.pause();
        }
        if(Game.scenes.current == 'loading'){
            Game.scenes.loading.render();
            Game.backgroundGamesound.pause();
            Game.backgroundCavesound.pause()
        }
        if(Game.scenes.current == 'landingPage'){
            Game.scenes.landingPage.render();
            Game.backgroundGamesound.pause();
            Game.backgroundCavesound.pause()
        }
        if(Game.scenes.current == 'game'){
            Game.scenes.game.render();
            Game.backgroundCavesound.pause()
        }
        if(Game.scenes.current == 'nextLevel'){
            Game.scenes.nextLevel.render();
            Game.backgroundGamesound.pause();
        }
        if(Game.scenes.current == 'levelCrossing'){
            Game.scenes.levelCrossing.render();
        }
    },
    /*--------------------------------------------------
    ------------>> Update-Methode v. Game <<------------
    --------------------------------------------------*/
    update: function(){
        if(Game.scenes.current == 'highscore'){
            Game.scenes.highscore.update();
        }
        if(Game.scenes.current == 'loading'){
            Game.scenes.loading.update();
        }
        if(Game.scenes.current == 'landingPage'){
            Game.scenes.landingPage.update();
        }
        if(Game.scenes.current == 'game'){
            Game.scenes.game.update();
            //Game.entities.ticks +=1;
        }
        if(Game.scenes.current == 'nextLevel'){
            Game.scenes.nextLevel.update();
        }
        if(Game.scenes.current == 'levelCrossing'){
            Game.scenes.levelCrossing.update();
        }
    },
    /*--------------------------------------------------
    --------------->> Rendering-Loop <<-----------------
    --------------------------------------------------*/
    //Rendering-Loop, die wiederholt den Canvas zeichnet (Doku:Rekursiver Aufruf, FPS vom Browser bestimmt)
    loop: function(){
        Game.requestId = window.requestAnimationFrame(Game.loop);
        Game.running = true;
        Game.render();
        Game.update();
        console.log("Frame is running: "+ Game.requestId);
        console.log("running: "+ Game.running);
    },
    pause: function(){
        console.log("Frame stops: "+ Game.requestId);
        cancelAnimationFrame(Game.requestId);
        Game.running = false;
        Game.entities.betti.cassetteSound.pause();
    },
    restart: function(){
        Game.scenes.current = 'landingPage';
        Game.entities.badElements.list = new Array();
        Game.entities.goodElements.list = new Array();
        Game.score = 0;
        Game.scenes.game.switchNextLevel = false;
        Game.entities.betti.init();
        Game.loop();
    },
    /*--------------------------------------------------
    --------------->> Hilfsfunktionen <<----------------
    --------------------------------------------------*/
    //Malfunktionen:
    draw: {
        drawImage: function(img,x,y){
            Game.context.drawImage(img, x, y);
        },
        drawText: function(text, x, y, size, color){
            Game.context.fillStyle = color;
            Game.context.font = size + 'px Dosis';
            Game.context.fillText(text, x, y);
        },
        drawRect: function(x,y,width,height,color){
            Game.context.fillStyle = color || '#EEEEEE';
            Game.context.fillRect(x,y,width,height);
        },
        drawCircle: function(x,y,radius,startAngle,endAngle,color){
            Game.context.beginPath();
            Game.context.fillStyle = color;
            Game.context.arc(x,y,radius,startAngle,endAngle);
            Game.context.fill();
        },
        drawLine: function(x1, y1, x2, y2, color){
            Game.context.strokeStyle = color;
            Game.context.beginPath();
            Game.context.moveTo(x1, y1);
            Game.context.lineTo(x2, y2);
            Game.context.closePath();
            Game.context.stroke();
        }
    },
    /*--------------------------------------------------
    ---------------->> Asset Manager <<----------------
    --------------------------------------------------*/
    assets: {
        list: new Array(),
        cache: new Array(),
        done: 0,
        addRessource: function(url) {
            Game.assets.list.push(url);
        },
        download: function(){
            for(var i=0; i<=Game.assets.list.length-1; i++){
                var img = new Image();
                img.addEventListener('load', function(){
                    Game.assets.done++;
                }, false);
                var url = Game.assets.list[i];
                img.src = url;
                Game.assets.cache[url] = img;
            }
        },
        isDone: function(){
            if(Game.assets.done == Game.assets.list.length){
                return true;
            }
            return false;
        },
        getAsset: function(url){
            return Game.assets.cache[url];
        }
    },
    /*--------------------------------------------------
    -------------------->> Szenen <<--------------------
    --------------------------------------------------*/
    scenes: {
        current: 'loading',
        /*--------------------------------------------------
        ------------------>> Lade-Screen <<-----------------
        --------------------------------------------------*/
        loading: {
            render: function(){
                Game.draw.drawImage(document.getElementById('lade'),(Game.canvas.width-250)/2, (Game.canvas.height-250)/2);
            },
            update: function(){
                if(Game.assets.isDone() == true){
                    console.log('Alle Bilder geladen');
                    Game.scenes.current = 'landingPage';
                }
            }
        },
        /*----------------------Szene-----------------------
        ------------------->> Landingpage <<----------------
        --------------------------------------------------*/
        landingPage: {
            render: function(){
                Game.draw.drawRect(0,0,Game.canvas.width, Game.canvas.height, '#429FDD');
                //Game.draw.drawRect(0, 650, 1278, 650, '#0E8A3A');
                //Game.draw.drawImage(Game.assets.getAsset('sprites/png/monument-valley-background.png'), 0,0);
                Game.draw.drawLine(0, 300, 1278, 300, '#FFF');
                Game.draw.drawImage(Game.assets.getAsset('sprites/png/betti_1.png'), Game.entities.betti.x, 255);
                Game.draw.drawImage(Game.assets.getAsset('sprites/png/betti_2.png'), Game.entities.betti.x+70,200);
                Game.draw.drawImage(Game.assets.getAsset('sprites/png/betti_4.png'), Game.entities.betti.x+200,210);
                Game.draw.drawImage(Game.assets.getAsset('sprites/png/betti_1.png'), 400, 255);
                Game.draw.drawText('Collect as much goodies as you can, but beware of evil things!',50,+160,20,'#FFFFFF');
                Game.draw.drawText('Press SPACE to jump',190,Game.canvas.height/2-68,20,'#FFFFFF');
                Game.draw.drawText('Snowboarding Betti',Game.canvas.width/2+50,Game.canvas.height/2-120,50,'#FFFFFF');
                this.highscoreButton();
                this.startButton();
                this.inputField();
                Game.draw.drawImage(Game.assets.getAsset('sprites/png/mountains_0.png'), 0,434);
                Game.draw.drawText('Credits',10,Game.canvas.height-75,15,'#CDD3CF');
                Game.draw.drawText('Created by Beate Ullmann  ⋯  beate.ullmann@stud.fh-luebeck.de',10,Game.canvas.height-55,15,'#CDD3CF');
                Game.draw.drawText('Sprites: Powerpuff Girls Snowboarding (www.spriters-resource.com)  ⋯  all other sprites from pixabay.com',10,Game.canvas.height-40,15,'#CDD3CF');
                Game.draw.drawText('Sounds: Die Woodys - Fichtls Lied  ⋯  Haindling - Pfeif drauf  ⋯  all other sound effects from SoundBible.com',10,Game.canvas.height-25,15,'##FFF'); 
                Game.pause();
            },
            update: function(){     
            },
            startButton: function (){
                var button = Game.assets.getAsset('sprites/png/StartButton.png');
                button.id = 'startButton';
                button.style.position = 'absolute';
                button.style.left = (Game.canvas.width-180)+'px';
                button.style.top = (Game.canvas.height/2-215)+'px';
                button.addEventListener('click',this.startPlay, false);
                document.getElementById('container').appendChild(button);
            },
            startPlay: function(event){
                var name = document.getElementById('playersName').value;
                console.log(document.getElementById('playersName').value);
                console.log ("button wurde geklickt");
                localStorage.setItem('player', name);
                Game.scenes.current = 'game';//Demo-Wechsel mit 'nextLevel' oder 'levelCrossing'
                document.getElementById('container').removeChild(document.getElementById('startButton'));
                document.getElementById('container').removeChild(document.getElementById('trophy'));
                document.getElementById('container').removeChild(document.getElementById('playersName'));
                Game.loop();
            },
            inputField: function (){
                var input = document.createElement('input');
                input.id = 'playersName';
                input.type = 'text';
                input.style.position = 'absolute';
                input.style.width = '300px';
                input.style.height = '40px';
                input.style.fontSize = '20px';
                input.style.left = (Game.canvas.width/2+80)+'px';
                input.style.top = (Game.canvas.height-380)+'px';
                input.placeholder = 'Enter your name';
                
                if (!document.getElementById('playersName')){
                    document.getElementById('container').appendChild(input);
                }
            },
            highscoreButton: function (){
                var button = Game.assets.getAsset('sprites/png/trophy.png');
                button.id = 'trophy';
                button.style.position = 'absolute';
                button.style.left = (Game.canvas.width-180)+'px';
                button.style.top = (Game.canvas.height-410)+'px';
                button.addEventListener('click',this.showHighscore, false);
                document.getElementById('container').appendChild(button); 
            },
            showHighscore: function (){
                Game.scenes.current = 'highscore';
                document.getElementById('container').removeChild(document.getElementById('trophy'));
                document.getElementById('container').removeChild(document.getElementById('startButton'));
                document.getElementById('container').removeChild(document.getElementById('playersName'));
                Game.loop();
            }
        },
        /*--------------------Szene-------------------------
        -------------->> Spielwelt (1. Level) <<------------
        --------------------------------------------------*/
        game: {
            step: 3,
            switchNextLevel: false,
            render: function(){
                Game.draw.drawImage(Game.assets.getAsset('sprites/png/mountains_1.png'), 0, 0);
                Game.draw.drawText('Punkte: '+ Game.score,10,50,40,'#800000');
                Game.entities.forrest.render();
                Game.entities.snowGround.render();
                //Game.draw.drawLine(0, 650, 1278, 650, '#FFF');
                Game.entities.betti.render();
                Game.entities.badElements.render();
                Game.entities.goodElements.render();
                //Sicherstellen, dass Musik läuft:
                if (Game.entities.betti.cassetteSound.paused){
                    Game.backgroundGamesound.play();
                }
            },
            update: function(){
                Game.entities.forrest.update();
                Game.entities.snowGround.update();
                Game.entities.betti.update();
                Game.entities.badElements.update();
                Game.entities.goodElements.update();
                //BadElements durchlaufen und auf Kollision überprüfen
                for (var i=0; i<Game.entities.badElements.list.length; i++){
                    if(Game.entities.betti.collisionWithBadElement(Game.entities.badElements.list[i])){
                        console.log('Kollision! mit BadFoo ' + Game.entities.badElements.list[i]);
                        Game.entities.badElements.handleCollision(Game.entities.badElements.list[i]);
                        break;
                    }
                }
                for (var i=0; i<Game.entities.goodElements.list.length; i++){
                    if(Game.entities.betti.collisionWithElement(Game.entities.goodElements.list[i])){
                        console.log('Kollision! mit GoodFoo ' + Game.entities.goodElements.list[i]);
                        Game.entities.goodElements.handleCollision(Game.entities.goodElements.list[i]);
                                            
                    }
                }
                //Prüfen ob Punktestand erreicht für Level Switch (Demo)
                if(Game.score > 1){//Demo: Punkteziel für nächstes Level anpassen
                    Game.scenes.game.switchNextLevel = true;
                }
            }
        },
        /*---------------------Szene------------------------
        ------------------->> Übergang <<-------------------
        --------------------------------------------------*/
        levelCrossing:{
            backgroundY: 0,
            scrollSpeed: 7,
            scrolling: false,
            numberOfUpdates: 0,
            triggerShowSnowEnd: 1,
            render: function(){
                Game.draw.drawImage(Game.assets.getAsset('sprites/png/caveBGback.png'), 0, this.backgroundY+Game.canvas.height);
                Game.draw.drawImage(Game.assets.getAsset('sprites/png/mountains_1.png'), 0, this.backgroundY);
                Game.draw.drawText('Punkte: '+ Game.score,10,50,40,'#800000');
                Game.entities.forrest.render();
                
                if (this.numberOfUpdates >= this.triggerShowSnowEnd){
                    Game.entities.snowEnd.render();
                    Game.entities.badElements.maxBadElements = 0;
                    Game.entities.goodElements.maxGoodElements = 0;
                }
                else {
                    Game.entities.snowGround.render();
                }
                Game.entities.betti.render();
                //Sicherstellen, dass Musik läuft:
                if (Game.entities.betti.cassetteSound.paused){
                    Game.backgroundGamesound.play();
                }
                if (this.scrolling){
                    Game.draw.drawText("Hurray! Level 2", 180, 350, 100, 'rgb(214,242,255)');
                }
                else{
                    Game.entities.badElements.render();//-->durch andere badElements ersetzen (in die Entities ist schlecht)
                    Game.entities.goodElements.render();
                }
            },
            update: function(){
                if(Game.entities.betti.collisionWithElement(Game.entities.snowEnd.canyon)){
                    console.log ("Achtung Schlucht");
                    this.scrolling = true;
                }
                //Berechnung für das Scrolling up
                if(this.scrolling && this.backgroundY>Game.canvas.height * -1){
                    this.backgroundY = this.backgroundY - this.scrollSpeed;
                    Game.entities.forrest.y = Game.entities.forrest.y - this.scrollSpeed;
                    Game.entities.snowEnd.y = Game.entities.snowEnd.y - this.scrollSpeed;
                    
                }
                if (this.backgroundY <= Game.canvas.height * -1){
                    this.scrolling = false;
                    Game.scenes.current = 'nextLevel';
                    Game.entities.betti.step = 5;
                    Game.entities.snowGround.step = 5;
                }
                Game.entities.forrest.update();
                Game.entities.snowGround.update();
                Game.entities.snowEnd.update();
                Game.entities.betti.update();
                Game.entities.badElements.update();//-->durch andere badElements ersetzen
                Game.entities.goodElements.update();
                //BadElements durchlaufen und auf Kollision überprüfen
                for (var i=0; i<Game.entities.badElements.list.length; i++){
                    if(Game.entities.betti.collisionWithBadElement(Game.entities.badElements.list[i])){//kann bleiben weil allgem. Function
                        console.log('Kollision! mit BadFoo ' + Game.entities.badElements.list[i]);
                        Game.entities.badElements.handleCollision(Game.entities.badElements.list[i]);
                        break;
                    }
                }
                for (var i=0; i<Game.entities.goodElements.list.length; i++){
                    if(Game.entities.betti.collisionWithElement(Game.entities.goodElements.list[i])){
                        console.log('Kollision! mit GoodFoo ' + Game.entities.goodElements.list[i]);
                        Game.entities.goodElements.handleCollision(Game.entities.goodElements.list[i]);
                                            
                    }
                }
                if (this.numberOfUpdates < this.triggerShowSnowEnd){
                    this.numberOfUpdates++;
                }
                console.log(this.numberOfUpdates);
            } 
        },
        /*---------------------Szene------------------------
        -------------->> Spielwelt (2. Level) <<------------
        --------------------------------------------------*/
        nextLevel:{
            step: 10, //muss noch verwendet werden um die badRocks zu beschleunigen
            opacity:1.0,
            render: function(){
                Game.draw.drawImage(Game.assets.getAsset('sprites/png/caveBGback.png'), 0, 0);
                Game.draw.drawText('Punkte: '+ Game.score,10,50,40,'#FFF');
                Game.entities.caveBGfront.render();
                Game.entities.snowGround.render();//-->Ausblick:ersetzen mit eisGround NEW suchen
                Game.entities.betti.render();
                Game.entities.badRocks.render();
                Game.entities.goodElements.render();
                /*Game.draw.drawRect(0,0,Game.canvas.width, Game.canvas.height, 'rgba(9,41,43,'+this.opacity+')');
                if (this.opacity>0.2){
                    Game.draw.drawText("Hurray! Level 2", 80, 350, 100, 'rgb(214,242,255)');
                }*/
                //Sicherstellen, dass Musik läuft:
                if (Game.entities.betti.cassetteSound.paused){
                    Game.backgroundCavesound.play();
                }
            },
            update: function(){
                if(this.opacity>0){
                    this.opacity -=0.01;
                }
                Game.entities.caveBGfront.update();
                Game.entities.snowGround.update();
                Game.entities.betti.update();
                Game.entities.badRocks.maxBadRocks = 10;
                Game.entities.goodElements.maxGoodElements = 10;
                Game.entities.badRocks.update();
                Game.entities.goodElements.update();
                //badRocks durchlaufen und auf Kollision überprüfen
                for (var i=0; i<Game.entities.badRocks.list.length; i++){
                    if(Game.entities.betti.collisionWithBadElement(Game.entities.badRocks.list[i])){//kann bleiben weil allgem. Function
                        console.log('Kollision! mit BadFoo ' + Game.entities.badRocks.list[i]);
                        Game.entities.badRocks.handleCollision(Game.entities.badRocks.list[i]);
                        break;
                    }
                }
                for (var i=0; i<Game.entities.goodElements.list.length; i++){
                    if(Game.entities.betti.collisionWithElement(Game.entities.goodElements.list[i])){
                        console.log('Kollision! mit GoodFoo ' + Game.entities.goodElements.list[i]);
                        Game.entities.goodElements.handleCollision(Game.entities.goodElements.list[i]);
                                            
                    }
                }
            }
        },
        /*----------------------Szene-----------------------
        ----------------->> Highscoreliste <<---------------
        --------------------------------------------------*/
        highscore:{
            list: new Array(),
            render: function(){
                this.landingPageButton();
                Game.draw.drawRect(0,0,Game.canvas.width, Game.canvas.height, '#455E7F');
                Game.draw.drawText('Top 10 Highscore',100,100,80,'#FFFFFF');
                Game.draw.drawText('Rank',100,200,50,'#FFFFFF');
                Game.draw.drawText('Points',300,200,50,'#FFFFFF');
                Game.draw.drawText('Name',500,200,50,'#FFFFFF');
                for (var i = 0; i<this.list.length; i++){
                    var player = this.list[i];
                    Game.draw.drawText(i+1,100,250+i*50,30,'#FFFFFF');
                    Game.draw.drawText(player.score,300,250+i*50,30,'#FFFFFF');
                    Game.draw.drawText(player.name,500,250+i*50,30,'#FFFFFF');
                    if (i >=9){
                        break;
                    }
                }
                Game.pause();
            },
            update: function(){
            },
            storePlayer: function(player){
                var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
                var open = indexedDB.open("snowboarding-DB",1);
                open.onsuccess = function(){
                    var db = open.result;
                    var tx = db.transaction("players","readwrite");
                    var store = tx.objectStore("players");
                    //Speicherung in die IndexedDB
                    store.put(player);
                    tx.oncomplete = function(){
                        db.close();
                    };
                    //Push in die Highscoreliste
                    Game.scenes.highscore.list.push(player);
                    Game.scenes.highscore.list.sort(function(a,b) {
                        if (a.score > b.score) {
                            return -1;
                        }
                        if (b.score > a.score) {
                            return 1;
                        }
                        return 0;
                    });
                }
            },
            landingPageButton: function (){
                var button = Game.assets.getAsset('sprites/png/landingPageButton.png');
                button.id = 'landingPageButton';
                button.style.position = 'absolute';
                button.style.left = 1136+'px';
                button.style.top = 20+'px';
                button.addEventListener('click',this.jumpToLandingPage, false);
                document.getElementById('container').appendChild(button); 
            },
            jumpToLandingPage: function (){
                Game.scenes.current = 'landingPage';
                console.log('click');
                document.getElementById('container').removeChild(document.getElementById('landingPageButton'));
                Game.loop();
            }
        }
    },
    /*------------------------------------------------------
    ---------------------->> Enities <<---------------------
    -------------------------------------------------------*/
    entities: {
        // Anzahl der Durchläufe der update()-Schleife
        //ticks: 0,
        //entities: new Array(),
        maxOnScreen: 4,
        onScreen: 0,
        /*--------------------------------------------------
        ------------------->>  Wald 1. Level <<-------------
        --------------------------------------------------*/
        forrest:{
            x:0,
            y:419,
            render: function(){
                Game.draw.drawImage(Game.assets.getAsset('sprites/png/mountains_0.png'), this.x, this.y);
                Game.draw.drawImage(Game.assets.getAsset('sprites/png/mountains_0.png'), this.x+1500, this.y);
            },
            update: function(){
                this.x -= 0.5;
                if (this.x < -1500){
                    this.x = 0;
                }
            }
        },
        /*--------------------------------------------------
        ---------------->> Schneepiste 1. Level <<----------
        --------------------------------------------------*/
        snowGround:{
            x:0,
            y:650,
            step:3,
            render: function(){
                /*for (var i=0; i<1406; i+=128){
                    Game.draw.drawImage(Game.assets.getAsset('sprites/png/2.png'), this.x+i, 650);
                }*/ //vielleicht die for schleife löschen
                Game.draw.drawImage(Game.assets.getAsset('sprites/png/snowGround1.png'), this.x, this.y);
                Game.draw.drawImage(Game.assets.getAsset('sprites/png/snowGround1.png'), this.x+1278, this.y);
            },
            update: function(){
                this.x -= this.step;
                if (this.x < -1279){
                    this.x = 0;
                    if(Game.scenes.game.switchNextLevel){
                        Game.scenes.current = 'levelCrossing';
                    }
                }
            }
        },
        /*--------------------------------------------------
        --------------->> Schneepisten-Ende <<--------------
        --------------------------------------------------*/
        snowEnd:{
            x:0,
            y:650,
            
            //Schlucht:
            canyon:{
                x:2570,
                y:650,
                width:400,
                height:300
            },
            render: function(){
                Game.draw.drawImage(Game.assets.getAsset('sprites/png/snowGround1.png'), this.x, this.y);
                Game.draw.drawImage(Game.assets.getAsset('sprites/png/snowGround2.png'), this.x+1278, this.y);
                //Zur Demo einkommentieren
                //Game.draw.drawRect(this.canyon.x, this.canyon.y, this.canyon.width, this.canyon.height, 'red');
            },
            update: function(){
                this.x -= 3;
                this.canyon.x -= 3;
            }
        },
        /*--------------------------------------------------
        ---------------->> Höhle v. 2. Level <<-------------
        --------------------------------------------------*/
        caveBGfront:{
            x:0,
            render: function(){
                Game.draw.drawImage(Game.assets.getAsset('sprites/png/caveBGfront.png'), this.x,434);
                Game.draw.drawImage(Game.assets.getAsset('sprites/png/caveBGfront.png'), this.x+1459,434);
            },
            update:function(){
                this.x -= 0.5;
                if (this.x < -1459){
                    this.x = 0;
                }
            }
        },
        betti:{
            width: function(){
                return Game.assets.getAsset('sprites/png/betti_1.png').width;
            },
            height: function(){
                return Game.assets.getAsset('sprites/png/betti_1.png').height;
            },
            init: function(){
                this.step = 3;
                this.x = 100;
                this.y = 610;
                this.startY = 610;
                this.jumping = false;
                this.landing = false;
                this.jumpHeight = 180;
            },
            step: 3,
            x: 100,
            y: 610,
            startY: 610,
            //gravity: .1, // Schwerkraft
            //angle: 90,
            //vy: this.step * Math.sin(this.angle * Math.PI / 180),
            jumping: false,
            landing: false,
            jumpHeight: 180,
            jump: function(){
                if(this.landing == false){
                    Game.entities.betti.jumping = true;
                    Game.entities.betti.jumpSound.play();
                }
            },
            render: function(){
                //Game.draw.drawRect(Game.entities.betti.x, Game.entities.betti.y, this.width(), this.height(), '#fff');
                
                if (this.jumping){
                    Game.draw.drawImage(Game.assets.getAsset('sprites/png/betti_2.png'), Game.entities.betti.x, Game.entities.betti.y);
                }else if(this.landing){
                    Game.draw.drawImage(Game.assets.getAsset('sprites/png/betti_4.png'), Game.entities.betti.x, Game.entities.betti.y);
                }else {
                    Game.draw.drawImage(Game.assets.getAsset('sprites/png/betti_1.png'), Game.entities.betti.x, Game.entities.betti.y);
                }
                //Game.draw.drawCircle(Game.entities.betti.x+23, Game.entities.betti.y+23,23,0,2*Math.PI,'#67D30F');
            },
            update: function(){
                if(this.x < Game.canvas.width-(Game.canvas.width/3*2)){
                    this.x += this.step;
                }
                //Berechnug für das Hochspringen
                //console.log(this.x + " " + this.y + " " + this.jumping + " " + this.landing);
                if (this.jumping == true){
                    if(this.jumpHeight > 0){
                        this.y -= this.step;
                        this.jumpHeight-= this.step;
                    }
                    
                    if(this.jumpHeight <= 0){
                        this.jumping = false;
                        this.landing = true;
                    }
                }
                //Berechnug für das Wiederrunterkommen
                if (this.landing == true){
                    
                    this.y += this.step;
                    this.jumpHeight+= this.step;
                }
                //Berechung Landung auf dem Boden
                if(this.y == this.startY){
                    this.landing = false;
                }
            },
            collisionWithElement: function(element){
                //TODO: Kollisionsberechnung auf Pixelgenau umstellen. Vorerst BoundingBox Methode ausreichend
                //Grundlage: http://www.virtual-maxim.de/pixelgenaue-kollisionserkennung/

                if((this.x + this.width())<=element.x)
                    return false;
                if((this.y + this.height())<=element.y)
                    return false;
                if((element.x + element.width)<=this.x)
                    return false;
                if((element.y + element.height)<=this.y)
                    return false;
                return true;
            },
            collisionWithBadElement: function(element){
                //Bei Kreis-Kollision Pytagoras - Schnelle Version: https://www.spieleprogrammierer.de/wiki/2D-Kollisionserkennung#Kollision_zwischen_zwei_Kreisen
                var circleBetti = {
                    x: this.x+23,
                    y: this.y+23,
                    r: 23
                };
                var circleBadElement = {
                    x: element.x+element.width/2,
                    y: element.y+element.height/2,
                    r: element.width/2-15
                };
                var dx = circleBetti.x - circleBadElement.x;
                var dy = circleBetti.y - circleBadElement.y;
                var distance = Math.sqrt (dx*dx + dy*dy);
                
                if(distance < circleBetti.r + circleBadElement.r){
                    return true;
                }
                return false;
            }
        },
        badElements:{
            list: new Array(),
            maxBadElements: 2,
            step: 3,
            render: function(){
                //draw list und nicht nur ein element
                for (var i = 0; i<this.list.length; i++){
                    
                    //Game.draw.drawRect(this.list[i].x, this.list[i].y, this.list[i].width, this.list[i].height, '#ff0000');
                    //Zugriff auf ein Arrayelement mit Index i und malen:
                    Game.draw.drawImage(Game.assets.getAsset(this.list[i].imgUrl),this.list[i].x, this.list[i].y);
                    //Game.draw.drawCircle(this.list[i].x+this.list[i].width/2, this.list[i].y+this.list[i].height/2, this.list[i].width/2-15, 0,2*Math.PI,'#E99B0C');
                }
                
            },
            update: function(){
                //prüfen ob genug badElements in der Liste sind
                //wenn nicht, dann weiteres badElement hinzufügen
                if (this.list.length < this.maxBadElements){
                    this.addBadElement();   
                }
                
                //Berechnung der neuen Position aller badElements
                for(var i=0; i<this.list.length; i++){
                    this.list[i].x -= this.step;
                }
                //prüfen ob Element außerhalb der Canvas ist, nachdem Position berechnet wurde (ohne 2. for-Schleife ruckelt es) und entfernen des nicht mehr sichtbaren Elements aus dem Array
                for(var i=0; i<this.list.length; i++){
                    if(this.list[i].x+this.list[i].width <= 0){
                      this.list.splice(i, 1);  
                    }
                }
            },
            //Funktion: hinzufügen eines neuen badElements
            addBadElement: function(){
                var badElement = {};
                var typ = Math.floor((Math.random()*4)+1);
                badElement.typ = typ;
                if (typ == 1){
                  badElement.imgUrl = 'sprites/png/rock3.png';  
                }
                if (typ == 2){
                  badElement.imgUrl = 'sprites/png/rock2.png';  
                }
                if (typ == 3){
                    badElement.imgUrl = 'sprites/png/tree-stump.png'
                }
                if (typ == 4){
                    badElement.imgUrl = 'sprites/png/tree.png'
                }
                if (this.list.length == 0){
                    badElement.x = Game.canvas.width+10;
                }else{
                    var randomDistance = Math.random()*(600)+ 400;
                    badElement.x = this.list[this.list.length-1].x+randomDistance;
                    if (badElement.x <= Game.canvas.width){
                        badElement.x = Game.canvas.width+10;
                    }
                }
                
                badElement.width = Game.assets.getAsset(badElement.imgUrl).width;
                badElement.height = Game.assets.getAsset(badElement.imgUrl).height;
                badElement.y = 663-badElement.height;
                this.list.push(badElement);
            },
            handleCollision: function(element){
                //Crash Sound abspielen
                Game.entities.betti.crashSound.play();
                //Spielstand speichern
                var player = {
                    name: localStorage.getItem('player'),
                    score: Game.score
                };
                Game.scenes.highscore.storePlayer(player);
                //Spielabbruch
                Game.pause();
                Game.draw.drawText("Game over", Game.canvas.width/3, 150, 100, '#ff0000');
                Game.draw.drawText("Press Return for Restart", 180, 250, 100, '#ff0000');
                
            },
        },
        badRocks:{
            list: new Array(),
            maxBadRocks: 2,
            step: 5,
            render: function(){
                //draw list und nicht nur ein element
                for (var i = 0; i<this.list.length; i++){
                    
                    //Game.draw.drawRect(this.list[i].x, this.list[i].y, this.list[i].width, this.list[i].height, '#ff0000');
                    //Zugriff auf ein Arrayelement mit Index i und malen:
                    Game.draw.drawImage(Game.assets.getAsset(this.list[i].imgUrl),this.list[i].x, this.list[i].y);
                    //Game.draw.drawCircle(this.list[i].x+this.list[i].width/2, this.list[i].y+this.list[i].height/2, this.list[i].width/2-15, 0,2*Math.PI,'#E99B0C');
                }
                
            },
            update: function(){
                //prüfen ob genug badElements in der Liste sind
                //wenn nicht, dann weiteres badElement hinzufügen
                if (this.list.length < this.maxBadRocks){
                    this.addBadElement();   
                }
                
                //Berechnung der neuen Position aller badElements
                for(var i=0; i<this.list.length; i++){
                    this.list[i].x -= this.step;
                }
                //prüfen ob Element außerhalb der Canvas ist, nachdem Position berechnet wurde (ohne 2. for-Schleife ruckelt es) und entfernen des nicht mehr sichtbaren Elements aus dem Array
                for(var i=0; i<this.list.length; i++){
                    if(this.list[i].x+this.list[i].width <= 0){
                      this.list.splice(i, 1);  
                    }
                }
            },
            //Funktion: hinzufügen eines neuen badElements
            addBadElement: function(){
                var badElement = {};
                var typ = Math.floor((Math.random()*5)+1);
                badElement.typ = typ;
                if (typ == 1){
                  badElement.imgUrl = 'sprites/png/rock.png';  
                }
                if (typ == 2){
                  badElement.imgUrl = 'sprites/png/rock4.png';  
                }
                if (typ == 3){
                    badElement.imgUrl = 'sprites/png/rock5.png';  
                }
                if (typ == 4){
                    badElement.imgUrl = 'sprites/png/rock6.png';  
                }
                if (typ == 5){
                    badElement.imgUrl = 'sprites/png/gold1.png';  
                }
                if (this.list.length == 0){
                    badElement.x = Game.canvas.width+10;
                }else{
                    var randomDistance = Math.random()*(700)+ 500;
                    badElement.x = this.list[this.list.length-1].x+randomDistance;
                    if (badElement.x <= Game.canvas.width){
                        badElement.x = Game.canvas.width+10;
                    }
                }
                
                badElement.width = Game.assets.getAsset(badElement.imgUrl).width;
                badElement.height = Game.assets.getAsset(badElement.imgUrl).height;
                badElement.y = 663-badElement.height;
                this.list.push(badElement);
            },
            handleCollision: function(element){
                //Crash Sound abspielen
                Game.entities.betti.crashSound.play();
                //Spielstand speichern
                var player = {
                    name: localStorage.getItem('player'),
                    score: Game.score
                };
                Game.scenes.highscore.storePlayer(player);
                //Spielabbruch
                Game.pause();
                Game.draw.drawText("Game over", Game.canvas.width/3, 150, 100, '#ff0000');
                Game.draw.drawText("Press Return for Restart", 180, 250, 100, '#ff0000');
                
            },
        },
        goodElements:{
            list: new Array(),
            maxGoodElements: 3,
            step: 4,
            render: function(){
                //draw list und nicht nur ein element
                for (var i = 0; i<this.list.length; i++){
                    Game.draw.drawImage(Game.assets.getAsset(this.list[i].imgUrl),this.list[i].x, this.list[i].y);
                    //Game.draw.drawRect(this.list[i].x, this.list[i].y, this.list[i].width, this.list[i].height, '#ff0000');
                }
                
            },
            update: function(){
                //prüfen ob genug goodElements in der Liste sind
                //wenn nicht, dann weiteres goodElement hinzufügen
                if (this.list.length < this.maxGoodElements){
                    this.addGoodElement();   
                }
                
                //Element bewegen
                for(var i=0; i<this.list.length; i++){
                    this.list[i].x -= this.step;
                }
                    //prüfen ob Element außerhalb der Canvas ist
                    //wenn ja, Element aus List entfernen
                for(var i=0; i<this.list.length; i++){
                    if(this.list[i].x+this.list[i].width <= 0){
                        this.list.splice(i, 1);  
                    }
                }
            },
            //Funktion: hinzufügen eines neuen goodElements
            addGoodElement: function(){
                var goodElement = {};
                var typ = Math.floor((Math.random()*2)+1);
                goodElement.typ = typ;
                if (typ == 1){
                  goodElement.imgUrl = 'sprites/png/Donut_mini.png';  
                }
                if (typ == 2){
                  goodElement.imgUrl = 'sprites/png/cassette_mini.png';  
                }
                if (this.list.length == 0){
                    goodElement.x = Game.canvas.width+10;
                }else{
                    var randomDistance = Math.random()*(1000 - 400)+ 400;
                    goodElement.x = this.list[this.list.length-1].x+randomDistance;
                    if (goodElement.x <= Game.canvas.width){
                        goodElement.x = Game.canvas.width+10;
                    }
                }
                goodElement.y = 540;
                goodElement.width = Game.assets.getAsset(goodElement.imgUrl).width;
                goodElement.height = Game.assets.getAsset(goodElement.imgUrl).height;
                
                this.list.push(goodElement);
            },
            removeGoodElement: function(element){
                var index = this.list.indexOf(element);
                if (index > -1){
                    this.list.splice(index,1); 
                }
            },
            handleCollision: function(element){
                //Punkte hochzählen
                Game.score += 1;
                if (element.typ == 1){
                    Game.entities.betti.donutSound.play();
                }
                if (element.typ ==2){
                    Game.backgroundGamesound.pause();
                    Game.backgroundCavesound.pause();//später raus, wenn andere goodElements drin sind, sonst doppel
                    Game.entities.betti.cassetteSound.play();
                }
                this.removeGoodElement(element);
            }
        }
    },
    //Mausklick + Tastatureingaben:
    input: {
        /* Verarbeitung von Click auf der Canvas - wird aktuell nicht benötigt
        x: 0,
        y: 0,
        clicked: false,
        click: function(e){
            console.log("mousedown in " + e.x + ", " + e.y);
            e.preventDefault();
            Game.input.x = e.x;
            Game.input.y = e.y;
            Game.input.clicked = true;
        },*/
        keydown: function(e){
            //Werten erstmal nur einen Tastendruck auf einmal aus - nicht mehrer Tasten in Kombination TODO
            console.log (e.keyCode);
            switch (e.keyCode){
                case 32://Leertaste
                    console.log("Leertaste gedrückt");
                    Game.entities.betti.jump();
                    break;
                case 13://Return
                    if (!Game.running){
                      Game.restart();
                    }
                    break;
                case 37: //Pfeil links
                    console.log("Pfeiltaste links gedrückt");
                    break;
                case 39://Pfeil rechts
                    console.log("Pfeiltaste rechts gedrückt");
                    break;
                case 38://Pfeil oben
                    console.log("Pfeiltaste oben gedrückt");
                    break;
                case 40://Pfeil unten
                    console.log("Pfeiltaste unten gedrückt");
                    break; 
            }
        }
    },
};

window.addEventListener('load', Game.init, false);
window.addEventListener('keydown', Game.input.keydown,false);