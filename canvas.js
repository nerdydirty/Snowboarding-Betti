var Game = {
    canvas: false,
    context: false,
    running: true,
    score: 0,
    init: function(){
        Game.canvas = document.getElementById('canvas');
        Game.context = Game.canvas.getContext('2d');
        Game.resize();
        
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
        
       //Assets laden:
        Game.assets.addRessource('sprites/png/betti_1.png');
        Game.assets.addRessource('sprites/png/cassette_mini.png');
        Game.assets.addRessource('sprites/png/headphones.png');
        Game.assets.addRessource('sprites/png/rock2.png');
        Game.assets.addRessource('sprites/png/rock.png');
        Game.assets.addRessource('sprites/png/Donut_mini.png');
        //Game.assets.addRessource('sprites/png/musictape.png');
        //Game.assets.addRessource('sprites/png/betti_1_weich.png');
        Game.assets.addRessource('sprites/png/mountains_1.png');
        Game.assets.addRessource('sprites/png/mountains_0.png');
        //Game.assets.addRessource('sprites/png/loadingText_bigPic.jpg');
        Game.assets.addRessource('sprites/png/StartButton.png');
        //Bis hier hin wird das Bild zunächst auf eine Downloadliste gesetzt
        Game.assets.download();
       
        //Spiel starten:
        Game.loop();
    },
    //Funktionen:
    resize: function(){
        Game.canvas.width = window.innerWidth;
        Game.canvas.height = window.innerHeight;
    },
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
        }
    },
    loop: function(){
            Game.update();
        if (Game.running){
            
            Game.render();
            window.requestAnimationFrame(Game.loop);
        }
    },
    pause: function(){
        Game.running = false;
    },
    render: function(){
        
        if(Game.scenes.current == 'loading'){
            Game.scenes.loading.render();
        }
        if(Game.scenes.current == 'landingPage'){
            Game.scenes.landingPage.render();
        }
        if(Game.scenes.current == 'game'){
            Game.scenes.game.render();
        }
    },
    update: function(){
        //console.log("aktuelle szene:" + Game.scenes.current);
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
    },
    collision: function(a, b){
        //TODO: Kollisionsberechnung auf Pixelgenau umstellen. Vorerst BoundingBox Methode ausreichend
        //Grundlage: http://www.virtual-maxim.de/pixelgenaue-kollisionserkennung/
        console.log ('a: ' + a);
        console.log ('b: ' + b);
        
        if((a.x + a.width())<=b.x)
            return false;
        
        if((a.y + a.height())<=b.y)
            return false;
        
        if((b.x + b.width)<=a.x)
            return false;
        
        if((b.y + b.height)<=a.y)
            return false;
        
        return true;
    },
    restart: function(){
        Game.running = true;
    },

    //Asset Manager:
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
    //Szenen:
    scenes: {
        current: 'loading',
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
        landingPage: {
            render: function(){
                Game.draw.drawRect(0,0,Game.canvas.width, Game.canvas.height, '#429FDD');
                Game.draw.drawText('Snowboarding Betti',Game.canvas.width/2,Game.canvas.height/2-123,50,'#FFFFFF');
                Game.draw.drawImage(Game.assets.getAsset('sprites/png/StartButton.png'),(Game.canvas.width-123)/2, (Game.canvas.height-123)/2);
            },
            update: function(){
                if (Game.input.clicked == true){
                    var xLeft = Game.canvas.width/2-62;
                    var xRight = Game.canvas.width/2+62;
                    var yTop = Game.canvas.height/2-62;
                    var yBottom = Game.canvas.height/2+62;
                    console.log (xLeft + ", " + xRight + ", " + yTop + ", " + yBottom);
                    if(Game.input.x >= xLeft && Game.input.x <= xRight && Game.input.y >= yTop && Game.input.y <= yBottom){
                        Game.scenes.current = 'game';
                    }
                }
                Game.input.clicked = false;
            } 
        },
        game: {
            step: 3,
            render: function(){
                Game.draw.drawImage(Game.assets.getAsset('sprites/png/mountains_1.png'), 0, 0);
                
                Game.draw.drawText('Punkte: '+ Game.score,10,50,40,'#800000');
                Game.entities.forrest.render();
                Game.entities.betti.render();
                Game.entities.badElements.render();
                Game.entities.goodElements.render();
                
            },
            update: function(){
                Game.entities.forrest.update();
                Game.entities.betti.update();
                Game.entities.badElements.update();
                Game.entities.goodElements.update();
                //BadElements durchlaufen und auf Kollision überprüfen
                for (var i=0; i<Game.entities.badElements.list.length; i++){
                    if(Game.entities.betti.collisionWithElement(Game.entities.badElements.list[i])){
                        console.log('Kollision! mit Element ' + Game.entities.badElements.list[i]);
                        Game.entities.badElements.handleCollision(Game.entities.badElements.list[i]);
                        break;
                    }
                }
                for (var i=0; i<Game.entities.goodElements.list.length; i++){
                    if(Game.entities.betti.collisionWithElement(Game.entities.goodElements.list[i])){
                        console.log('Kollision! mit Goodi ' + Game.entities.goodElements.list[i]);
                        Game.entities.goodElements.handleCollision(Game.entities.goodElements.list[i]);
                                            
                    }
                }
            }
        }
    },
    //Enities
    entities: {
        // Anzahl der Durchläufe der update()-Schleife
        //ticks: 0,
        //entities: new Array(),
        maxOnScreen: 4,
        onScreen: 0,
        forrest:{
            x:0,
            render: function(){
                Game.draw.drawImage(Game.assets.getAsset('sprites/png/mountains_0.png'), this.x, 419);
                Game.draw.drawImage(Game.assets.getAsset('sprites/png/mountains_0.png'), this.x+1500, 419);
            },
            update: function(){
                this.x -= 2;
                if (this.x < -1500){
                    this.x = 0;
                }
            }
        },
        betti: {
            width: function(){
                return Game.assets.getAsset('sprites/png/betti_1.png').width;
            },
            height: function(){
                return Game.assets.getAsset('sprites/png/betti_1.png').height;
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
            jumpHeight: 60,
            jump: function(){
                if(this.landing == false){
                    Game.entities.betti.jumping = true;
                }
            },
            render: function(){
                
                Game.draw.drawRect(this.x, this.y, this.width(), this.height(), '#fff');
                Game.draw.drawImage(Game.assets.getAsset('sprites/png/betti_1.png'), Game.entities.betti.x, Game.entities.betti.y);
            },
            update: function(){
                if(this.x < Game.canvas.width-(Game.canvas.width/3*2)){
                    this.x += this.step;
                }
                //console.log(this.x + " " + this.y + " " + this.jumping + " " + this.landing);
                if (this.jumping == true){
                    if(this.jumpHeight >0){
                        this.y -= this.step;
                        this.jumpHeight--;
                    }
                    
                    if(this.jumpHeight == 0){
                        this.jumping = false;
                        this.landing = true;
                    }
                }
                
                if(this.y == this.startY){
                    this.landing = false;
                }
                
                if (this.landing == true){
                    
                    this.y += this.step;
                    this.jumpHeight++;
                }
            },
            collisionWithElement(element){
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
            }
        },
        badElements:{
            list: new Array(),
            maxBadElements: 2,
            step: 3,
            render: function(){
                //draw list und nicht nur ein element
                for (var i = 0; i<this.list.length; i++){
                    
                    Game.draw.drawRect(this.list[i].x, this.list[i].y, this.list[i].width, this.list[i].height, '#ff0000');
                    Game.draw.drawImage(Game.assets.getAsset(this.list[i].imgUrl),this.list[i].x, this.list[i].y);
                }
                
            },
            update: function(){
                //prüfen ob genug badElements in der Liste sind
                //wenn nicht, dann weiteres badElement hinzufügen
                if (this.list.length < this.maxBadElements){
                    this.addBadElement();   
                }
                
                //Element bewegen
                for(var i=0; i<this.list.length; i++){
                    this.list[i].x -= this.step;
                    //prüfen ob Element außerhalb der Canvas ist
                    //wenn ja, Element aus List entfernen
                    if(this.list[i].x+this.list[i].width <= 0){
                      this.list.splice(i, 1);  
                    }
                }
            },
            //Funktion: hinzufügen eines neuen badElements
            addBadElement: function(){
                var badElement = {};
                var typ = Math.floor((Math.random()*2)+1);
                if (typ == 1){
                  badElement.imgUrl = 'sprites/png/rock.png';  
                }
                if (typ == 2){
                  badElement.imgUrl = 'sprites/png/rock2.png';  
                }
                if (this.list.length == 0){
                    badElement.x = Game.canvas.width+10;
                }else{
                    var randomDistance = Math.random()*(1000 - 400)+ 400;
                    badElement.x = this.list[this.list.length-1].x+randomDistance;
                    if (badElement.x <= Game.canvas.width){
                        badElement.x = Game.canvas.width+10;
                    }
                }
                badElement.y = 600;
                badElement.width = Game.assets.getAsset(badElement.imgUrl).width;
                badElement.height = Game.assets.getAsset(badElement.imgUrl).height;
                
                this.list.push(badElement);
            },
            handleCollision: function(element){
                //Spielabbruch
                Game.pause();
                Game.draw.drawText("Game over", 650, 350, 130, '#ff0000');
                console.log("wo ist es hin?");
                //Game.scenes.current = 'landingPage';
                Game.draw.drawImage(Game.assets.getAsset('sprites/png/StartButton.png'),(Game.canvas.width-123)/2, (Game.canvas.height-123)/2);
                Game.restart;
                console.log ("geht es weiter?");
                if (Game.input.clicked == true){
                    var xLeft = Game.canvas.width/2-62;
                    var xRight = Game.canvas.width/2+62;
                    var yTop = Game.canvas.height/2-62;
                    var yBottom = Game.canvas.height/2+62;
                    console.log (xLeft + ", " + xRight + ", " + yTop + ", " + yBottom);
                    if(Game.input.x >= xLeft && Game.input.x <= xRight && Game.input.y >= yTop && Game.input.y <= yBottom){
                        Game.scenes.current = 'loading';
                    }
                }
                Game.input.clicked = false;
                
            },
        },
        goodElements:{
            list: new Array(),
            maxGoodElements: 10,
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
                    //prüfen ob Element außerhalb der Canvas ist
                    //wenn ja, Element aus List entfernen
                    if(this.list[i].x+this.list[i].width <= 0){
                      this.list.splice(i, 1);  
                    }
                }
            },
            //Funktion: hinzufügen eines neuen goodElements
            addGoodElement: function(){
                var goodElement = {};
                var typ = Math.floor((Math.random()*2)+1);
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
                this.removeGoodElement(element);  
            }
        }
    },
    //Mausklick + Tastatureingaben:
    input: {
        x: 0,
        y: 0,
        radius: 10,
        clicked: false,
        click: function(e){
            console.log("mousedown in " + e.x + ", " + e.y);
            e.preventDefault();
            Game.input.x = e.x;
            Game.input.y =e.y;
            Game.input.clicked = true;
        },
        keydown: function(e){
            //Werten erstmal nur einen Tastendruck auf einmal aus - nicht mehrer Tasten in Kombination TODO
            switch (e.keyCode){
                case 32://Leertaste
                    console.log("Leertaste gedrückt");
                    Game.entities.betti.jump();
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
window.addEventListener('resize', Game.resize, false);
window.addEventListener('mousedown', Game.input.click,false);
window.addEventListener('keydown', Game.input.keydown,false);