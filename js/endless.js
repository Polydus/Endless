_ = undefined;

WebFontConfig = {
    finishedLoading: false,
    active: function () {
        console.log('webfont active');
        this.finishedLoading = true;
    },
    google: {
        families: ['Droid Sans', 'Droid Serif']
    }
};

function rotateAroundPoint(point, origin, angle){
    return {
       x: math.add(math.subtract(math.multiply(math.cos(angle), math.subtract(point.x, origin.x)), math.multiply(math.sin(angle), math.subtract(point.y, origin.y))), origin.x),
       y: math.add(math.add(math.multiply(math.cos(angle), math.subtract(point.y, origin.y)), math.multiply(math.sin(angle), math.subtract(point.x, origin.x))), origin.y)
    };             
}

var Endless = Endless || {

    meta: {
        VERSION: 1,
        VERSION_LONGFORM: 'Alpha 0.0.1',        
        DEV: 'Polydus',
        NAME: 'Endless'
    },

    dimensions: {
        width: 800,
        height: 514,
        gameHeight: 450,
        ppm: 40
    },
    
    settings: {
        lockUpdates: true
    },
    
    fonts: {
        primaryTextLight: {
            font: "18px Droid Sans",
            fill: "#ffffff",
            align: "left"},

        primaryTextDark: {
            font: "18px Droid Sans",
            fill: "#000000",
            align: "left"},

        secondaryTextDark: {
            font: "14px Droid Sans",
            fill: "#000000",
            align: "left"},

        secondaryTextLight: {
            font: "14px Droid Sans",
            fill: "#ffffff",
            align: "left"}     
    }
    
};

Endless.init = function(context){
    this.root = context;
    this.phGame = new Phaser.Game(Endless.dimensions.width, Endless.dimensions.height, Phaser.AUTO, 'container', {
        preload: Endless.preload,
        create: Endless.create,
        update: Endless.update,
        render: Endless.render });
    this.updateTimerSeconds = 0;
    this.isDesktop = this.phGame.device.desktop;
};

Endless.preload = function(){
    Endless.phGame.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js');              
    Endless.phGame.load.image('motorcycle', 'assets/motorcycle.png');
    Endless.phGame.load.image('motorcycle_frame', 'assets/motorcycle_frame.png');
    Endless.phGame.load.image('motorcycle_wheel', 'assets/motorcycle_wheel.png');    
    Endless.phGame.load.image('ramp_15', 'assets/ramp_15.png');    
    Endless.phGame.load.image('ramp_17', 'assets/ramp_17.png');            
    Endless.phGame.load.image('sky', 'assets/sky.png');    
    Endless.phGame.load.image('girder', 'assets/girder.png'); 
    Endless.phGame.load.image('windmill', 'assets/windmill.png'); 
    Endless.phGame.load.image('windmill_base', 'assets/windmill_base.png');         
    Endless.phGame.load.image('building', 'assets/building.png');   
    Endless.phGame.load.image('building1', 'assets/building1.png');                
    Endless.phGame.load.image('topbar', 'assets/topbar.png');    
    Endless.phGame.load.image('menu_right', 'assets/menu_right.png'); 
    Endless.phGame.load.image('minimap_bg', 'assets/minimap_bg.png');    
    Endless.phGame.load.image('building_min', 'assets/building_min.png');
    Endless.phGame.load.image('ramp_15_min', 'assets/ramp_15_min.png');            
    Endless.phGame.load.spritesheet('button_settings', 'assets/button_settings.png', 64, 64);   
    Endless.phGame.load.spritesheet('button_close', 'assets/button_close.png', 64, 66);        
    Endless.phGame.load.physics('physics', 'assets/physics.json');    
    for(var i = 1; i < 6; i++){
        Endless.phGame.load.audio('wind' + i, 'assets/wind' + i + '.mp3');          
    }    
};

Endless.create = function(){
    if(!WebFontConfig.finishedLoading){
        Endless.phGame.time.events.add(Phaser.Timer.SECOND, function () {
            Endless.create();
        }, this);                
    } else {
        console.log('init Create ' + Endless.phGame.time.now);

        Endless.phGame.onPause.add(Endless.onPause);
        Endless.phGame.onResume.add(Endless.onResume);
        Endless.phGame.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        Endless.phGame.scale.setMinMax(Endless.dimensions.width, Endless.dimensions.height,
        Endless.dimensions.width, Endless.dimensions.height);
        Endless.phGame.scale.refresh();       
        
        Endless.phGame.forceSingleUpdate = false;        
        Endless.phGame.time.advancedTiming = true;

        Endless.input = new Endless.Input();
        Endless.renderer = new Endless.Renderer();
        Endless.ui = new Endless.UI();
        Endless.game = new Endless.Game();
        
        Endless.input.init();
        Endless.renderer.init();
        Endless.ui.init();
        Endless.game.init();
        
        Endless.game.start();
        Endless.settings.lockUpdates = false;
        console.log('finished Create ' + Endless.phGame.time.now);
    }            
};

Endless.render = function(){

};

Endless.update = function(){
    if(!Endless.settings.lockUpdates){
                
        Endless.input.update();
        Endless.game.update();
        Endless.ui.update();
        Endless.renderer.update(); 

        if (Endless.phGame.time.now > Endless.updateTimerSeconds + Phaser.Timer.SECOND) {
            
            Endless.updateTimerSeconds = Endless.phGame.time.now;
            console.log('update ' + Endless.phGame.time.now);
            Endless.ui.updateSecond();
            if(!Endless.game.paused){
                Endless.game.statistics.secondsPlayed++;                
            }
        }              
    }      
},
        
Endless.onPause = function(){
    console.log('onPause');
};

Endless.onResume = function(){
    console.log('onResume');
};

/*
 * INPUT
 */

Endless.Input = function(){

};

Endless.Input.prototype = {
    init: function(){
        this.cursors = Endless.phGame.input.keyboard.createCursorKeys();
        this.up = false;
        this.down = false;     
        this.left = false;
        this.right = false;
        this.T = false;
    },

    update: function(){
        this.up = (this.cursors.up.isDown || Endless.phGame.input.keyboard.isDown(Phaser.Keyboard.W));
        this.down = (this.cursors.down.isDown || Endless.phGame.input.keyboard.isDown(Phaser.Keyboard.S));
        this.left = (this.cursors.left.isDown || Endless.phGame.input.keyboard.isDown(Phaser.Keyboard.A));
        this.right = (this.cursors.right.isDown || Endless.phGame.input.keyboard.isDown(Phaser.Keyboard.D));
        this.T = Endless.phGame.input.keyboard.isDown(Phaser.Keyboard.T);
                
        if(Endless.phGame.input.keyboard.event !== null){
            //console.log(Endless.phGame.input.keyboard.event);
            if(Endless.phGame.input.keyboard.event.keyCode === Phaser.Keyboard.P 
                    && Endless.phGame.input.keyboard.event.type === 'keyup'){
                
                    if(!Endless.ui.settingsMenu.isVisible){
                        if(Endless.game.paused){
                            Endless.game.unPause();                                        
                        } else {
                            Endless.game.pause();                    
                        }                          
                    }                  
            }
            Endless.phGame.input.keyboard.event = null;            
        }
        
    }
};

/*
 * RENDERER 
 */

Endless.Renderer = function(){
    
};

Endless.Renderer.prototype = {
    
    BACKGROUND_GROUP: 0,
    GAME_OBJECT_GROUP: 1,
    UI_GROUP_SUB: 2,
    UI_GROUP: 3,
    
    init: function(){
        this.groups = [];
        for(var i = 0; i < 4; i++){
            this.groups.push(Endless.phGame.add.group());
        }
        console.log(Endless.phGame.renderer.renderSession);
    },
    
    update: function(){
    }    
};

/*
 * UI
 */


Endless.UI = function(){

};

Endless.UI.prototype = {
    
    init: function(){
        this.debugString = new Endless.Text(10, 514 - 128, 'Seconds played: ',
            Endless.fonts.secondaryTextLight,
            Endless.renderer.groups[Endless.renderer.UI_GROUP]);
            this.debugString.update = function(){

            this.setText(//'Seconds played: ' + Endless.game.statistics.secondsPlayed + 's\n'
                        //+ 'Speed: ' + Endless.game.world.getPlayerSpeed() + 'Km/h\n'
                'FPS: ' + Endless.phGame.time.fps + ' fps\n'
                + 'Mouse: [' + Endless.phGame.input.mousePointer.x + ', ' + Endless.phGame.input.mousePointer.y + ']\n'
                + 'Camera: [' + Endless.phGame.camera.x + ', ' + Endless.phGame.camera.y + ']\n'            
                + 'Frame: [' + Endless.game.world.player.vehicle.frame.element.body.x + ', ' + Endless.game.world.player.vehicle.frame.element.body.y + ']\n'
                //+ 'wheel1: [' + wheel1Location.x + ', ' + wheel1Location.y + ']\n'                    
                + 'actual wheel1: [' + Endless.game.world.player.vehicle.wheel1.element.body.x + ', ' + Endless.game.world.player.vehicle.wheel1.element.body.y + ']\n');
                //+ 'wheel1 delta: [' + (Endless.game.world.player.wheel1.body.x - (Endless.game.world.player.frame.body.x - 27)) + ', ' + (Endless.game.world.player.wheel1.body.y - (Endless.game.world.player.frame.body.y + 15)) + ']\n');
        };

        this.versionString = new Endless.Text(800 - 160, 514 - 25, Endless.VERSION_LONGFORM,
            Endless.fonts.primaryTextLight,
            Endless.renderer.groups[Endless.renderer.UI_GROUP]);
        this.versionString.element.alpha = 0.7;

        this.topbar = new Endless.TopBar();
        this.background = new Endless.Background();
        this.settingsMenu = new Endless.SettingsMenu();
    },
   
    
    update: function(){
        if(!Endless.game.paused){        
            this.background.update();
            this.topbar.update();
        }
    },
    
    updateSecond: function(){
        if(!Endless.game.paused){
            this.debugString.update();    
        }
    }
};


Endless.UiElement = function (x, y, width, height, group) {

    this.init(x, y, width, height, group);
};

Endless.UiElement.prototype = {
    init: function (x, y, width, height, group) {
        this.x = x;
        this.y = y;
        if (width !== _  && height !== _) {
            this.width = width;
            this.x1 = this.x + this.width;
            this.height = height;
            this.y1 = this.y + this.height;
            this.bounds = new Phaser.Rectangle(x, y, width, height);
        }
        this.group = group;
        this.element = _;
    },

    show: function () {
        this.onShow();
    },
    hide: function () {
        this.onHide();
    },
    onShow: function () {
        this.element.visible = true;
    },
    onHide: function () {
        this.element.visible = false;
    },
    setIndex: function (index) {
        this.index = index;
    },
    
    update: function(){
    }, 
    
    destroy: function(){
      this.element.destroy();  
    },
    
    setPosition: function(x, y, setbounds){
        this.x = x;
        this.y = y;
        if (setbounds) {
            this.x1 = this.x + this.width;
            this.y1 = this.y + this.height;
            this.bounds = new Phaser.Rectangle(x, y, width, height);
        }        
        if(this.element !== _){
            this.element.x = x;
            this.element.y = y;
        }
    },
    
    isVisible: function(){
        return this.element.visible;
    },
    
    setVisible: function(visible){
        if(this.element !== _){
            this.element.visible = visible;
        }        
    }

};

Endless.Button = function (x, y, width, height, key, group) {

    this.key = key;
    this.init(x, y, width, height, group);

    this.element = Endless.phGame.add.button(this.x, this.y, this.key, _, this, 0, 1, 2, _, this.group);
    this.element.forceOut = true;
    this.element.fixedToCamera = true;
    this.setButtonCallback = function (callback, context) {
       this.element.onInputUp.dispose();
        
       this.element.onInputUp.add(callback, context);
    };

    //workaround for button frame not being reset on mobile
    this.setButtonCallback(function () {
    }, this);

};

Endless.Button.prototype = Object.create(Endless.UiElement.prototype);

Endless.Sprite = function (x, y, width, height, key, group) {

    this.key = key;
    this.init(x, y, width, height, group);

    this.element = Endless.phGame.add.sprite(x, y, key, _, this.group);
    this.element.fixedToCamera = true;
    
    this.rotate = function(deg){
        this.element.angle += deg;
    };
    
    this.setRotation = function(deg){
        this.element.angle = deg;
        console.log(this.element);
    };
};

Endless.Sprite.prototype = Object.create(Endless.UiElement.prototype);

Endless.Text = function (x, y, string, style, group) {

    this.init(x, y, _, _, group);

    this.string = string;
    this.style = style;

    this.element = Endless.phGame.add.text(this.x, this.y, this.string, this.style, this.group);
    this.element.fixedToCamera = true;
    
    this.setText = function(text){
        this.element.text = text;
    };
};

Endless.Text.prototype = Object.create(Endless.UiElement.prototype);

Endless.TopBar = function(){
    
    this.init(0, 0, Endless.dimensions.width, 64);
    this.background = new Endless.Sprite(0, 0, Endless.dimensions.width, 64,
    'topbar', Endless.renderer.groups[Endless.renderer.UI_GROUP], false);
    
    this.string = new Endless.Text(10, 24, '',
        Endless.fonts.primaryTextLight,
        Endless.renderer.groups[Endless.renderer.UI_GROUP]);
        
    this.settingsButton = new Endless.Button(800 - 64, 0, 64, 64, 'button_settings', 
        Endless.renderer.groups[Endless.renderer.UI_GROUP]);
        
    this.settingsButton.setButtonCallback(function(){
        if(!Endless.ui.settingsMenu.isVisible){
            Endless.ui.settingsMenu.show();
        }
        //Endless.ui.settingsMenu.onShow();
        //if(Endless.game.paused){
        //    Endless.game.unPause();                                        
        //} else {
        //    Endless.game.pause();                    
        //}                    
    }, this);
    
    this.reset = function(){
        //this.minimap.reset();
        //this.minimap = new Endless.Minimap();                 
    };
    //this.minimap = new Endless.Minimap();                 
    
    //this.initMinimap = function(){
    //};
    
    this.update = function(){
        this.string.setText(Endless.game.statistics.getDistanceTravelledMeters() + 'm'
                + '    ' + Endless.game.world.getPlayerSpeed() + ' km/h');
        if(Endless.game.finishedInit){
            //this.minimap.update();
        }
    };
    
};

Endless.TopBar.prototype = Object.create(Endless.UiElement.prototype);

Endless.Minimap = function(){
    
    this.init(192, 8, 544, 48);
    
    this.background = new Endless.Sprite(192, 8, 544, 48,
    'minimap_bg', Endless.renderer.groups[Endless.renderer.UI_GROUP_SUB], false); 
    //bg group because minimap items need to be hidden behind top bar
    
    this.segments = []; 
    
    this.futureSegments = [];
    this.showFutureSegments = false;
    
    this.futureSegmentOffsetCounter = 0;    
    
    this.inConstructor = true;
    
    this.setSegments = function(){
        
        console.log(this);

        this.segments.push({
            building: new Endless.Sprite(192, 8 + 48 - Endless.game.world.terrain.segments[0].height / 10, 
        Endless.game.world.terrain.segments[0].width / 10,
        Endless.game.world.terrain.segments[0].height / 10,
        'building_min', Endless.renderer.groups[Endless.renderer.UI_GROUP_SUB], false)
        });
        this.segments[0].building.element.crop(new Phaser.Rectangle(0, 0,
            Endless.game.world.terrain.segments[0].width / 10, 
            Endless.game.world.terrain.segments[0].height / 10));             
        
        
        /*this.segments.push(new Endless.Sprite(129, 7 + 48 - Endless.game.world.terrain.segments[0].height / 10, 
        Endless.game.world.terrain.segments[0].width / 10,
        Endless.game.world.terrain.segments[0].height / 10,
        'building_min', Endless.renderer.groups[Endless.renderer.UI_GROUP_SUB], false));*/
        
        
        for(var i = 1; i < Endless.game.world.terrain.segments.length; i++){
            
            this.segments.push({
                building: new Endless.Sprite(
                    this.segments[i - 1].building.x + this.segments[i - 1].building.width + Endless.game.world.terrain.segments[i].gap / 10,
                    8 + 48 - Endless.game.world.terrain.segments[i].height / 10,
                    Endless.game.world.terrain.segments[i].width / 10,
                    Endless.game.world.terrain.segments[i].height / 10,
                    'building_min', Endless.renderer.groups[Endless.renderer.UI_GROUP_SUB], false)
            });
            if(Endless.game.world.terrain.segments[i].type === Endless.Segment.SINGLE_RAMP){
                console.log('ramp ' + i);
                this.segments[i].ramp = new Endless.Sprite(
                    this.segments[i - 1].building.x 
                        + this.segments[i - 1].building.width 
                        + Endless.game.world.terrain.segments[i].gap / 10
                        + this.segments[i].building.width
                        - Endless.game.world.terrain.segments[i].objects[1].width / 10, 
                    this.segments[i].building.y 
                        - Endless.game.world.terrain.segments[i].objects[1].height / 10,                   
                    Endless.game.world.terrain.segments[i].objects[1].width / 10,
                    Endless.game.world.terrain.segments[i].objects[1].height / 10,
                    'ramp_15_min', Endless.renderer.groups[Endless.renderer.UI_GROUP_SUB], false                
                );
            }
            
            this.segments[i].building.element.crop(new Phaser.Rectangle(0, 0,
                Endless.game.world.terrain.segments[i].width / 10, 
                Endless.game.world.terrain.segments[i].height / 10));            
            /*new Endless.Sprite(
                this.segments[i - 1].x + this.segments[i - 1].width + Endless.game.world.terrain.segments[i].gap / 10,
                7 + 48 - Endless.game.world.terrain.segments[i].height / 10,
                Endless.game.world.terrain.segments[i].width / 10,
                Endless.game.world.terrain.segments[i].height / 10,
                'building_min', Endless.renderer.groups[Endless.renderer.UI_GROUP_SUB], false));*/
                

        }
        for(var i = 0; i < this.segments.length; i++){
            //this.segments[i].element.cameraOffsetLast = this.segments[i].element.cameraOffset;
            console.log(this.segments[i].building.element.cameraOffset.x);
            //console.log();
        }
        
        if(this.inConstructor){ //bc camera is not set properly
            this.cameraOffset = 0;                           
            this.inConstructor = false;
        } else {
            this.cameraOffset = (Endless.phGame.camera.x - 800) / 10;               
        }
            console.log(Endless.phGame.camera.x);

        
        this.counter = 1;
        this.lastSegmentIndex = this.segments.length - 1;       
        
        console.log('minimap segments:');
        console.log(this.segments);

        //console.log('last segments x: ' 
        //        + this.segments[this.segments.length -1].building.element.cameraOffset.x);        
    };
    
    this.onLastSegmentReached = function(){
        //reset all the segments here
        
        for(var i = 0; i < this.segments.length; i++){
            this.segments[i].building.element.destroy();
            if(this.segments[i].ramp !== _){
                this.segments[i].ramp.element.destroy;
            }
        }
        
        for(var i = 0; i < this.futureSegments.length; i++){
            this.futureSegments[i].building.element.destroy();
            if(this.futureSegments[i].ramp !== _){
                this.futureSegments[i].ramp.element.destroy;
            }
        }     
        
        console.log(this);
        
        this.segments = [];
        this.futureSegments = [];
        
        this.setSegments();
        
        console.log(this);
        
        this.showFutureSegments = false;
        this.futureSegmentOffsetCounter = 0;
    };
    this.onMiddleSegmentReached = function(){
        
        //reset last segment too
        //this.segments[this.lastSegmentIndex].building.element.destroy();
        //this.segments[this.lastSegmentIndex].building = new Endless.Sprite(
                
         //       );
        //console.log(this.segments[this.lastSegmentIndex].building.element.y);
        console.log(this);
        
        this.segments[this.lastSegmentIndex].building.element.crop(
                 new Phaser.Rectangle(0, 0,
            Endless.game.world.terrain.segments[this.lastSegmentIndex].width / 10, 
            Endless.game.world.terrain.segments[this.lastSegmentIndex].height / 10));
            
        console.log(this);
        //this.segments[this.lastSegmentIndex].building.element.y = 
        //console.log(this.segments[this.lastSegmentIndex].building.element.y);

         //        this.segments.push({
 
       
        //show only middle ones
        
        this.futureSegments.push({
            building: new Endless.Sprite(
                this.segments[this.segments.length - 1].building.x 
                    + this.segments[this.segments.length - 1].building.width
                    + Endless.game.world.terrain.segments[this.segments.length - 1].gap / 10,
                8 + 48 - Endless.game.world.terrain.segments[1].nextDimensions.height / 10,
                Endless.game.world.terrain.segments[1].nextDimensions.width / 10,
                Endless.game.world.terrain.segments[1].nextDimensions.height / 10,
                'building_min', Endless.renderer.groups[Endless.renderer.UI_GROUP_SUB], false)
        });
        this.futureSegments[0].building.element.crop(new Phaser.Rectangle(0, 0,
            Endless.game.world.terrain.segments[1].nextDimensions.width / 10, 
            Endless.game.world.terrain.segments[1].nextDimensions.height / 10));    
        
            
        console.log(this);
        
        for(var i = 1; i < Endless.game.world.terrain.segments.length - 2; i++){
            this.futureSegments.push({
                building: new Endless.Sprite(
                    this.futureSegments[i - 1].building.x 
                        + this.futureSegments[i - 1].building.width
                        + Endless.game.world.terrain.segments[i + 1].nextDimensions.gap / 10,
                    8 + 48 - Endless.game.world.terrain.segments[i + 1].nextDimensions.height / 10,
                    Endless.game.world.terrain.segments[i + 1].nextDimensions.width / 10,
                    Endless.game.world.terrain.segments[i + 1].nextDimensions.height / 10,
                    'building_min', Endless.renderer.groups[Endless.renderer.UI_GROUP_SUB], false)
            }); 
            
            if(Endless.game.world.terrain.segments[i + 1].nextDimensions.type === Endless.Segment.SINGLE_RAMP){
                console.log('ramp ' + i);
                this.futureSegments[i].ramp = new Endless.Sprite(
                    this.futureSegments[i - 1].building.x 
                        + this.futureSegments[i - 1].building.width 
                        + Endless.game.world.terrain.segments[i].nextDimensions.gap / 10
                        + this.futureSegments[i].building.width
                        - 10, //ramp  width
                    this.futureSegments[i].building.y 
                        - 3, //ramp y
                    10, 3,
                    'ramp_15_min', Endless.renderer.groups[Endless.renderer.UI_GROUP_SUB], false                
                );
            }
            this.futureSegments[i].building.element.crop(new Phaser.Rectangle(0, 0,
                Endless.game.world.terrain.segments[i + 1].nextDimensions.width / 10, 
                Endless.game.world.terrain.segments[i + 1].nextDimensions.height / 10));                  
        }

         
       /*
        * this.segments.push({
                building: new Endless.Sprite(
                    this.segments[i - 1].building.x + this.segments[i - 1].building.width + Endless.game.world.terrain.segments[i].gap / 10,
                    8 + 48 - Endless.game.world.terrain.segments[i].height / 10,
                    Endless.game.world.terrain.segments[i].width / 10,
                    Endless.game.world.terrain.segments[i].height / 10,
                    'building_min', Endless.renderer.groups[Endless.renderer.UI_GROUP_SUB], false)
            });
            if(Endless.game.world.terrain.segments[i].type === Endless.Segment.SINGLE_RAMP){
                console.log('ramp ' + i);
                this.segments[i].ramp = new Endless.Sprite(
                    this.segments[i - 1].building.x 
                        + this.segments[i - 1].building.width 
                        + Endless.game.world.terrain.segments[i].gap / 10
                        + this.segments[i].building.width
                        - Endless.game.world.terrain.segments[i].objects[1].width / 10, 
                    this.segments[i].building.y 
                        - Endless.game.world.terrain.segments[i].objects[1].height / 10,                   
                    Endless.game.world.terrain.segments[i].objects[1].width / 10,
                    Endless.game.world.terrain.segments[i].objects[1].height / 10,
                    'ramp_15_min', Endless.renderer.groups[Endless.renderer.UI_GROUP_SUB], false                
                );
            }
        */
        
       
        
        for(var i = 0; i < this.segments.length; i++){
            //this.segments[i].element.cameraOffsetLast = this.segments[i].element.cameraOffset;
            console.log(this.segments[i].building.element.cameraOffset.x);
            //console.log();
        }        
        
        console.log('last segments x: ' 
                + this.segments[this.segments.length -1].building.element.cameraOffset.x);
        //if(this.showFutureSegments){
        console.log('first futureSegments x: ' 
                + this.futureSegments[0].building.element.cameraOffset.x);   
        
        for(var i = 0; i < this.futureSegments.length; i++){
            this.futureSegments[i].building.element.cameraOffset.x += this.futureSegmentOffsetCounter;  
            
            //this.segments[i].element.cameraOffsetLast = this.segments[i].element.cameraOffset;
            //console.log(this.futureSegments[i].building.element.cameraOffset.x);
            //console.log();
        }    
        this.futureSegmentOffsetCounter = 0;
        console.log('this.futureSegmentOffsetCounter: ' + this.futureSegmentOffsetCounter);
        
        //console.log(this.counterr);
        //
        //console.log(this);
        this.showFutureSegments = true;
    };
    
    this.reset = function(){
        for(var i = 0; i < this.segments.length; i++){
            this.segments[i].building.element.destroy();
            if(this.segments[i].ramp !== _){
                this.segments[i].ramp.element.destroy();
            }
        }
        for(var i = 0; i < this.futureSegments.length; i++){
            this.futureSegments[i].building.element.destroy();
            if(this.futureSegments[i].ramp !== _){
                this.futureSegments[i].ramp.element.destroy();
            }
        }
        this.segments = [];
        this.futureSegments = [];
    };
    
    //        Endless.ui.topbar.minimap.onLastSegmentReached();   
       // Endless.ui.topbar.minimap.onMiddleSegmentReached();     
    
    //console.log('asdf minimap');
    //console.log(Endless.game.world.terrain.segments);
    //console.log(Endless.game.world.player.x);
    
    this.update = function(){
        if(this.segments.length === 0){
            //this.setSegments();
        } else {
            //console.log(Endless.phGame.camera.x);
            
            if(math.abs(this.cameraOffset - (Endless.phGame.camera.x - 800) / 10) > 1){
                var diff = this.cameraOffset - (Endless.phGame.camera.x - 800) / 10;
                this.futureSegmentOffsetCounter += diff;
                console.log('this.futureSegmentOffsetCounter: ' + this.futureSegmentOffsetCounter);
                //console.log('diff > 1: ' + diff);
                //console.log(this.segments[0].building.element.cameraOffset.x);
                
                this.cameraOffset = (Endless.phGame.camera.x - 800) / 10;
                for(var i = 0; i < this.segments.length; i++){
                    this.segments[i].building.element.cameraOffset.x += diff;  
                    if(this.segments[i].ramp !== _){
                        this.segments[i].ramp.element.cameraOffset.x += diff;
                    }
                }
                for(var i = 0; i < this.futureSegments.length; i++){
                    this.futureSegments[i].building.element.cameraOffset.x += diff;  
                    if(this.futureSegments[i].ramp !== _){
                        this.futureSegments[i].ramp.element.cameraOffset.x += diff;
                    }
                }           
                
                
               // console.log('Endless.game.world.terrain.segments[0].x ' + Endless.game.world.terrain.segments[0].x);
                //console.log('this.segments[i].building.element.cameraOffset.x ' + this.segments[i].building.element.cameraOffset.x);
                //if(this.showFutureSegments){
                //console.log('last segments x: ' 
                      //  + this.segments[this.segments.length -1].building.element.cameraOffset.x);
                //if(this.showFutureSegments){
                //console.log('first futureSegments x: ' 
                //        + this.futureSegments[0].building.element.cameraOffset.x);                       
                //}
                 
               // }
                //if(this.showFutureSegments){
                    
                //}
            }
            
                //this.cameraOffset = (Endless.phGame.camera.x - 800) / 10;

                //console.log(this.cameraOffset);            
            
            //for(var i = 0; i < this.segments.length; i++){
                //this.cameraOffset = (Endless.phGame.camera.x - 800) / 10;
                //this.cameraOffset = -this.cameraOffset;
                //this.segments[i].element.cameraOffsetLast;
                //console.log('kkk');
                //console.log(this.cameraOffset);
                //this.segments[i].element.cameraOffset.x += this.cameraOffset;                
               // console.log(this.segments[i].element.cameraOffsetOriginal.x + this.cameraOffset);
                //var a = this.segments[i].element.cameraOffsetOriginal.x + this.cameraOffset;
                
                //this.segments[i].element.x = this.segments[i].element.cameraOffsetOriginal.x + this.cameraOffset;
                //console.log(this.segments[i].element.cameraOffset.x);
                //console.log(this.segments[i].element.cameraOffsetOriginal.x + this.cameraOffset);
                
                //this.segments[i].element.cameraOffset.x = this.segments[i].element.cameraOffsetOriginal.x + this.cameraOffset;
                        /*this.segments[i].element.cameraOffset.x -= this.counter;
                //console.log(this.segments[i].element.x);

                if(this.segments[i].element.cameraOffset.x < this.x - this.segments[i].element.width){
                    this.segments[i].element.cameraOffset.x = 
                            this.segments[this.lastSegmentIndex].element.cameraOffset.x
                            + this.segments[this.lastSegmentIndex].width + 10;
                    this.lastSegmentIndex = i;*/
                //}
            //}            
        }
    };
};

Endless.Minimap.prototype = Object.create(Endless.UiElement.prototype);

Endless.SettingsMenu = function(){
    
    this.background = new Endless.Sprite(289, 64 + 18, 222, 414,
        'menu_right', Endless.renderer.groups[Endless.renderer.UI_GROUP], false);  
        
    this.settingsButton = new Endless.Button(this.background.x + 222 - 64 - 15, this.background.y + 15, 64, 66, 'button_close', 
        Endless.renderer.groups[Endless.renderer.UI_GROUP]);    
    
    this.settingsButton.setButtonCallback(function(){
        this.hide();
    }, this);
    
    this.show = function(){
        this.isVisible = true;  
        Endless.game.pause();
        this.background.show();
        this.settingsButton.show();
    };
    
    this.hide = function(){
        this.isVisible = false;   
        Endless.game.unPause();   
        this.background.hide();
        this.settingsButton.hide();
    };

    this.hide();
};

Endless.SettingsMenu.prototype = Object.create(Endless.UiElement.prototype);

Endless.Background = function(){
    
    this.sprite0 = Endless.phGame.add.sprite(
            0, 0, 'sky', _,
    Endless.renderer.groups[Endless.renderer.GAME_OBJECT_GROUP]);
    this.sprite1 = Endless.phGame.add.sprite(
            Endless.dimensions.width, 0, 'sky', _,
    Endless.renderer.groups[Endless.renderer.GAME_OBJECT_GROUP]);
    
    
    //this.sprite0.fixedToCamera = true;
    //this.sprite1.fixedToCamera = true;
    
    this.counter = 0;
    
    //this.background1 = new Endless.Sprite(-Endless.dimensions.width, 64, Endless.dimensions.width, Endless.dimensions.height - 64,
    //'sky', Endless.renderer.groups[Endless.renderer.BACKGROUND_GROUP], false);    
    
    this.update = function(){
        this.counter += 5;
        this.sprite0.x = Endless.phGame.camera.x - this.counter;
        this.sprite1.x = Endless.phGame.camera.x - this.counter + 800;
        this.sprite0.y = Endless.phGame.camera.y;
        this.sprite1.y = Endless.phGame.camera.y;        
        //console.log(this.sprite0.x);
        if(this.counter === 800){
            this.counter = 0;
        }
        //if(this.sprite0.x <= -Endless.dimensions.width){
        //    this.sprite0.x = 0;
        //    this.sprite1.x = Endless.dimensions.width;   
            
        //}
    };  
};

Endless.Background.prototype = Object.create(Endless.UiElement.prototype);

/*
 * Game Objects
 */


Endless.Game = function(){
    
    //this.prototype = Object.create(Endless.GamePrototype.prototype);
};

Endless.Game.prototype = {
    
    init: function(){
        this.paused = false;
        this.finishedInit = false;
    },
    
    start: function(){
        this.statistics = new Endless.Statistics();
        this.statistics.init();
        
        this.audioManager = new Endless.AudioManager();
        
        Endless.phGame.world.width = 20000;   
        Endless.phGame.world.height = 2000;
        Endless.phGame.camera.setBoundsToWorld();
        Endless.phGame.camera.setPosition(800 + 80, Endless.dimensions.height / 2);        
        console.log(Endless.phGame.camera);
        
        this.world = new Endless.World(this);
        this.world.init();

        this.paused = false;
        this.finishedInit = true;
    },
    
    pause: function(){
        this.paused = true;
        if( Endless.phGame.physics.p2 !== null &&  Endless.phGame.physics.p2 !== _){
            Endless.phGame.physics.p2.pause();            
        }    
    },
    
    unPause: function(){
        this.paused = false;   
        if( Endless.phGame.physics.p2 !== null &&  Endless.phGame.physics.p2 !== _){
            Endless.phGame.physics.p2.resume();                    
        }
        console.log('unpausing');
    },
    
    restart: function(){
        this.world.player.destroy();
        this.world.terrain.destroy();    
        console.log(this.world);
        console.log('resetting');
        //this.audioManager.stopAmbient();
        try{
            Endless.ui.topbar.reset();
        } catch(e){
            console.log('minimap did not reset properly');
        }
        
        this.world.init();
        
        this.unPause();
        //this.start();
    },
    
    update: function(){
        if(!this.paused){
            this.world.update();
            this.audioManager.update();
        }
    }
};

Endless.AudioManager = function(){
    
    this.finishedDecoding = false;
    this.ambientPlaying = false;
    
    this.ambientVolume = 1;
    
    this.ambientPlayingIndex = _;
    
    this.wind = [];
    
    for(var i = 1; i < 6; i++){
        this.wind.push(Endless.phGame.add.audio('wind' + i));
    }
    Endless.phGame.sound.setDecodedCallback(this.wind, this.onFinishDecoding, this);   
};

Endless.AudioManager.prototype = {
    
    
    playAmbient: function(){
        if(this.finishedDecoding){
            this.ambientPlayingIndex = math.randomInt(5);
            this.wind[this.ambientPlayingIndex].play();
        }
    },
    
    stopAmbient: function(){
        if(this.finishedDecoding){
            this.wind[this.ambientPlayingIndex].stop();
        }        
    },
    
    update: function(){
        if(this.finishedDecoding){
            this.ambientVolume = Endless.game.world.getPlayerSpeed() / 100;
            if(this.ambientVolume > 1){
                this.ambientVolume = 1;
            }
            this.wind[this.ambientPlayingIndex].volume = this.ambientVolume;
            if(!this.wind[this.ambientPlayingIndex].isPlaying){
                this.stopAmbient();
                this.playAmbient();
                console.log('switched wind index');
            }            
        }          
    },
    
    onFinishDecoding: function(){
        console.log('finished decoding');
        this.finishedDecoding = true;
        this.playAmbient();
    },
};

Endless.GameObject = function(x, y, key){
    this.init(x, y, key);
};

Endless.GameObject.prototype = {
    
    init: function(x, y, key){
        this.element = Endless.phGame.add.sprite(x, y, key, _, Endless.renderer.groups[Endless.renderer.GAME_OBJECT_GROUP]);
    },
    
    setPolygon: function(mass, angularDamping, collideWorld, cGroup){
        this.element.body.clearShapes();
        this.element.body.loadPolygon('physics', this.element.key);//
        this.set(mass, angularDamping, collideWorld, cGroup);
    },
    
    setCircle: function(radius, mass, angularDamping, collideWorld, cGroup, offsetX, offsetY){
        this.element.body.setCircle(radius, offsetX, offsetY);
        this.set(mass, angularDamping, collideWorld, cGroup);
    },
    
    setRectangle: function(w, h, mass, angularDamping, collideWorld, cGroup){
        this.element.body.setRectangle(w, h);
        this.set(mass, angularDamping, collideWorld, cGroup);        
    },
    
    setDebug: function(debug){
        if(debug === _){
            this.element.body.debug = !this.element.body.debug;
        } else {
            this.element.body.debug = debug;            
        }
    },
    
    //private
    set: function(mass, angularDamping, collideWorld, cGroup){
        this.element.body.mass = mass;
        this.element.body.angularDamping = angularDamping;        
        this.element.body.collideWorldBounds = collideWorld;         
        this.element.body.setCollisionGroup(cGroup);        
    },
    
    update: function(){

    },
    
    destroy: function(){
        this.element.destroy();
    },
};

Endless.MotorCycle = function(){


};

Endless.MotorCycle.prototype = {
    
    init: function(context, x, y){
        this.world = context;        
        this.frame = new Endless.GameObject(x + this.world.cameraOffsetX + 80, y, 'motorcycle_frame');
        this.wheel0 = new Endless.GameObject(x + 50 + this.world.cameraOffsetX + 80, y + 30, 'motorcycle_wheel');//Endless.phGame.add.sprite(370 + this.world.cameraOffsetX, 230, 'motorcycle_wheel', _, Endless.renderer.groups[Endless.renderer.GAME_OBJECT_GROUP]);
        this.wheel1 = new Endless.GameObject(x - 50 + this.world.cameraOffsetX + 80, y + 30, 'motorcycle_wheel');//Endless.phGame.add.sprite(270 + this.world.cameraOffsetX, 230, 'motorcycle_wheel', _, Endless.renderer.groups[Endless.renderer.GAME_OBJECT_GROUP]);
        
        this.cGroup = Endless.phGame.physics.p2.createCollisionGroup();
        
        Endless.phGame.physics.p2.enable([this.frame.element, this.wheel0.element, this.wheel1.element]);        

        this.frame.setPolygon(2, 0.8, false, this.cGroup);
        this.wheel0.setCircle(13, 2, 0.8, false, this.cGroup);
        this.wheel1.setCircle(13, 2, 0.8, false, this.cGroup);
        
        this.spring0 = Endless.phGame.physics.p2.createSpring(this.frame.element,
            this.wheel0.element, 50, 100, 50, null, null, [27, 14], null);
        this.spring1 = Endless.phGame.physics.p2.createSpring(this.frame.element,
            this.wheel1.element, 50, 100, 50, null, null, [-27, 14], null);  
            
        console.log(this.spring0);
        this.constraint0 = Endless.phGame.physics.p2.createPrismaticConstraint(
                this.frame.element, this.wheel0.element, false, [27, 14], [0, 0], [0, 0.1]);
        
        this.constraint0.lowerLimitEnabled = this.constraint0.upperLimitEnabled = true;
        this.constraint0.upperLimit = -1;
        this.constraint0.lowerLimit = -2;    
    
        this.constraint1 = Endless.phGame.physics.p2.createPrismaticConstraint(
                this.frame.element, this.wheel1.element, false, [-27, 14], [0, 0], [0, 0.1]);
        
        this.constraint1.lowerLimitEnabled = this.constraint1.upperLimitEnabled = true;
        this.constraint1.upperLimit = -1;
        this.constraint1.lowerLimit = -2;         

        this.wheel0Location = new Phaser.Point(this.frame.element.body.x - 27, this.frame.element.body.y + 14);        
        this.wheel1Location = new Phaser.Point(this.frame.element.body.x + 27, this.frame.element.body.y + 14);
        this.frameLocation = new Phaser.Point(this.frame.element.body.x, this.frame.element.body.y);
        this.wheel1LocationHinge = new Phaser.Point(this.frame.element.body.x - 27, this.frame.element.body.y + 14);
        this.wheel0LocationHinge = new Phaser.Point(this.frame.element.body.x + 27, this.frame.element.body.y + 14);
        
        Endless.phGame.physics.p2.updateBoundsCollisionGroup();        
    },
    
    setDebug: function(debug){     
        this.frame.setDebug(debug);
        this.wheel0.setDebug(debug);
        this.wheel1.setDebug(debug);        
    },
    
    move: function(x, y){
        this.frame.element.body.x += x;
        this.frame.element.body.y += y;
        this.wheel0.element.body.x += x;
        this.wheel0.element.body.y += y;
        this.wheel1.element.body.x += x;
        this.wheel1.element.body.y += y;            
    },
    
    setCollides: function(){
        this.frame.element.body.collides(this.world.terrain.cGroup, function(){
            console.log('frame collision');
            this.isWheelOutOfBounds();            
        }, this);
    
        this.wheel0.element.body.collides(this.world.terrain.cGroup);
        this.wheel1.element.body.collides(this.world.terrain.cGroup);
        this.world.terrain.collides(this.cGroup);     
    },  
    
    isWheelOutOfBounds: function(){
        this.frameLocation.set(this.frame.element.body.x, this.frame.element.body.y);
        this.wheel1LocationHinge.set(this.frame.element.body.x - 27, this.frame.element.body.y + 15);
        this.wheel0LocationHinge.set(this.frame.element.body.x + 27, this.frame.element.body.y + 15);
        
        this.wheel1Location = rotateAroundPoint(
            this.wheel1LocationHinge, this.frameLocation, this.frame.element.body.rotation);
        
        this.wheel0Location = rotateAroundPoint(
            this.wheel0LocationHinge, this.frameLocation, this.frame.element.body.rotation);

        if((Math.abs(this.wheel1Location.x - this.wheel1.element.body.x) + 
           Math.abs(this.wheel1Location.y - this.wheel1.element.body.y)) > 10){
            console.log('Wheel1 oob!');
            console.log(this.wheel1.element.body.angularVelocity);
            console.log(this.spring1);
            if(this.wheel0.element.body.angularVelocity > 0){
                this.wheel0.element.body.angularVelocity = -60;
                this.wheel1.element.body.angularVelocity = -60;                 
            } else {
                this.wheel0.element.body.angularVelocity -= 10;                
            }
            

            this.frame.element.body.angularVelocity = 10;                        
            //this.lockDown = true;
            
        }
        if((Math.abs(this.wheel0Location.x - this.wheel0.element.body.x) + 
           Math.abs(this.wheel0Location.y - this.wheel0.element.body.y)) > 10){
            console.log('Wheel0 oob!');
            if(this.wheel0.element.body.angularVelocity < 0){
                this.wheel0.element.body.angularVelocity =  60;
                this.wheel1.element.body.angularVelocity =  60;                 
            } else {
                this.wheel0.element.body.angularVelocity += 10;                
            }
            this.frame.element.body.angularVelocity = -10;                        
            //this.lockUp = true;
        }        

    }, 

    destroy: function(){
        this.frame.destroy();
        this.wheel0.destroy();
        this.wheel1.destroy();        
    },    
    
    update: function(){

    }
};

Endless.Windmill = function(context){
    this.parent = context;
};

Endless.Windmill.prototype = {
    
    init: function(x, y){
        this.x = x;
        this.y = y;
        this.mill = new Endless.GameObject(this.x, this.y, 'windmill');
        Endless.phGame.physics.p2.enable(this.mill.element);          
        this.mill.setPolygon(_, _, false, this.parent.world.terrain.cGroup);    
        this.mill.element.body.static = true;     
        
        
        this.width = this.mill.element.width;
        this.height = this.mill.element.height;        
     /*
      * 
      * @returns {undefined}    //this.objects[0].element.body.addPhaserPolygon('physics', this.objects[0].element.key);
                    
                this.objects[0].setPolygon(_, _, false, this.world.terrain.cGroup);                    
                    console.log(this.objects[0].element.body);
                    //is.objects[0].element.body.offset.y -= 20;               
                    this.objects[0].element.body.rotateRight(30);  
                    //this.objects[0].element.body.addRectangle(20, 100, 0, 50);
                //}                
            } else {
                this.objects[0].element.body.setRectangleFromSprite();
                this.objects[0].set(_, _, false, this.world.terrain.cGroup); 
                this.objects[0].element.anchor = new Phaser.Point(0.34728, 0.50368);
                //this.objects[0].element.body.rotateLeft(10);
                this.objects[0].element.body.angle = -50;                
            }         
            
            
            this.objects[0].element.body.x = this.x
                    + this.width / 2 - this.objects[0].element.width / 2;
            this.objects[0].element.body.y = this.y - this.building.element.height / 2 + 1 - this.objects[0].element.height / 2;
            
            if(this.type === Endless.Segment.WINDMILL){
                this.objects[0].element.body.x += 100;                    
                this.objects[0].element.body.y += 100;    
                //this.objects[0].element.body.offset.y -= 20;                
            }
            
            this.objects[0].element.body.static = true;     
      */   
    },
    
    setPos: function(x, y){
        this.mill.element.body.x = x;
        this.mill.element.body.y = y;
    },
    
    move: function(x, y){
        this.mill.element.body.x += x;
        this.mill.element.body.y += y;       
    },    
    
    rotateLeft: function(degs){
        this.mill.element.body.rotateLeft(degs);
    },
    
    rotateRight: function(degs){
        this.mill.element.body.rotateRight(degs);        
    },
    
    setDebug: function(debug){     
        this.mill.setDebug(debug);
    },
    collides: function(cGroup){
        this.mill.element.body.collides(cGroup);        
    },    
    
    /*setCollides: function(){
        this.frame.element.body.collides(this.world.terrain.cGroup, function(){
            console.log('frame collision');
            this.isWheelOutOfBounds();            
        }, this);
    
        this.wheel0.element.body.collides(this.world.terrain.cGroup);
        this.wheel1.element.body.collides(this.world.terrain.cGroup);
        this.world.terrain.collides(this.cGroup);     
    },  */

    destroy: function(){
        this.mill.destroy();    
    },        
};

Endless.Ramp = function(context){
    this.parent = context;
    Endless.Ramp.TYPE_15 = 'ramp_15';
    Endless.Ramp.TYPE_17 = 'ramp_17';    
};

Endless.Ramp.prototype = {
     
    init: function(x, y, type){
        this.x = x;
        this.y = y;
        this.type = type;
        this.ramp = new Endless.GameObject(this.x, this.y, type);
        
        this.width = this.ramp.element.width;
        this.height = this.ramp.element.height;
        
        Endless.phGame.physics.p2.enable(this.ramp.element);  
        this.ramp.setPolygon(_, _, false, this.parent.world.terrain.cGroup);    
        this.ramp.element.body.static = true;     

    },
    
    setDebug: function(debug){     
        this.ramp.setDebug(debug);
    },
    
    collides: function(cGroup){
        this.ramp.element.body.collides(cGroup);        
    },
    
    setPos: function(x, y){
        this.ramp.element.body.x = x;
        this.ramp.element.body.y = y;
    },    
    
    move: function(x, y){
        this.ramp.element.body.x += x;
        this.ramp.element.body.y += y;       
    },        
    
    getElement: function(){
        return this.ramp;
    },
    
    /*setCollides: function(){
        this.frame.element.body.collides(this.world.terrain.cGroup, function(){
            console.log('frame collision');
            this.isWheelOutOfBounds();            
        }, this);
    
        this.wheel0.element.body.collides(this.world.terrain.cGroup);
        this.wheel1.element.body.collides(this.world.terrain.cGroup);
        this.world.terrain.collides(this.cGroup);     
    },  */

    destroy: function(){
        this.ramp.destroy();    
    },        
};

Endless.Building = function(context){
    this.parent = context;
};

Endless.Building.prototype = {
    
    init: function(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width; 
        this.height = height;
        
        this.building = new Endless.GameObject(this.x, this.y, 'building');
        this.buildingSideX0 = new Endless.GameObject(0, 0, 'building');
        this.buildingCenter = new Endless.GameObject(0, 0, 'building');
        this.buildingSideX1 = new Endless.GameObject(0, 0, 'building');        
                
        Endless.phGame.physics.p2.enable(this.building.element);   
        
        this.resize(this.width, this.height, true);
        this.setPos(this.x, this.y);
                
        this.building.element.body.static = true;
        this.building.element.visible = false;
        this.building.element.renderable = false;        
       
    },
    
    setDebug: function(debug){     
        this.building.setDebug(debug);
    },
    
    collides: function(cGroup){
        this.building.element.body.collides(cGroup);        
    },
    
    setPos: function(x, y){
        this.x = x;
        this.y = y;
          
        this.building.element.body.x = this.x;
        this.building.element.body.y = this.y;
        
        this.buildingSideX0.element.x = this.x - this.width / 2;
        this.buildingSideX0.element.y = this.y - this.height / 2;    
        
        this.buildingCenter.element.x = this.x 
                - this.width / 2 + this.buildingSideX0.element.width;
        this.buildingCenter.element.y = this.y - this.height / 2;             
                   
        this.buildingSideX1.element.x = this.x 
                + this.width / 2 - this.buildingSideX1.element.width;
        this.buildingSideX1.element.y = this.y - this.height / 2;   
        
        console.log('setpos in building');
        console.log(this);
    },    
    
    move: function(x, y){
        if(x !== _){
            this.x += x;            
        }
        if(y !== _){
            this.y += y;            
        }     
        this.setPos(this.x, this.y);       
    },   
    
    resize: function(width, height, force){
        var canDoThisThing = true;
        if(!(width === this.width && this.height === height)){
            canDoThisThing = false;
        } 
        if(force){
            canDoThisThing = true;
        } 

        if(canDoThisThing){
            this.width = width;
            this.height = height;

            this.building.element.crop(new Phaser.Rectangle(0, 0, this.width, this.height));
            this.building.element.body.setRectangleFromSprite();
            this.building.element.body.setCollisionGroup(this.parent.world.terrain.cGroup);   

            this.buildingSideX0.element.crop(new Phaser.Rectangle(0, 0, 14, this.height));            

            this.buildingCenter.element.crop(new Phaser.Rectangle(14, 0, this.width - 28, this.height));    

            this.buildingSideX1.element.crop(new Phaser.Rectangle(
                    1000 - 14, 0, 14, this.height));                 
        }       
    },
    
    getElement: function(){
        return this.building;
    },    
    
    destroy: function(){
        this.building.destroy();  
        this.buildingSideX0.destroy();    
        this.buildingCenter.destroy();    
        this.buildingSideX1.destroy();            
    },        
};

Endless.Segment = function(){
    
    Endless.Segment.SEGMENT_SWITCHER = 0;
    
    Endless.Segment.SINGLE_RAMP = 1;
    //Endless.Segment.SINGLE_RAMP = 2;
    Endless.Segment.SINGLE_FLAT = 2;    
    
    Endless.Segment.MILL_SINGLE = 3;
    Endless.Segment.MILL_DOUBLE = 4;    
     
    this.type = _;//Endless.Segment.FLAT_RAMP_15;
    //console.log(this);
};

Endless.Segment.prototype = {
    
    init: function(context, type, previousSegment, x, y, width, height){
        this.world = context;
        this.type = type;
        this.setDimensions(previousSegment, x, y, width, height);
        
        this.objects = [];
                
        this.initSegmentByType();
        
        //console.log(this.x);
        //console.log(this);
    },
    
    setBuilding: function(){
        
    },
    
    changeType: function(type, previousSegment){
        if(type !== _ && type !== this.type){
            this.onTypeChange(type, previousSegment);
        } else {
            console.log('segment type not changed');
        }
    },
    
    onTypeChange: function(type, previousSegment){
        //var setCollides = false;
        console.log('pre type change: ');
        console.log(this.type);
        console.log(this.objects.length);
        for(var i = 0; i < this.objects.length; i++){
            this.objects[i].destroy();
        }   
        this.objects = [];
        console.log('changed from type ' + this.type + ' to type ' + type);
        this.type = type;
        //this.initSegmentByType();
        //this.world.updateCollides();
        console.log('post type change: ');
        console.log(this.type);
        console.log(this.objects.length);
        this.setDimensions(previousSegment);  
        this.initSegmentByType();        

        
        
        /*if(this.type === Endless.Segment.MILL_SINGLE || this.type === Endless.Segment.MILL_DOUBLE){
            for(var i = 0; i < this.objects.length; i++){
                this.objects[i].destroy();
                setCollides = true;                
            }              

        } else {
            if(type === Endless.Segment.MILL_SINGLE || type === Endless.Segment.MILL_DOUBLE){
                for(var i = 0; i < this.objects.length; i++){
                    this.objects[i].destroy();
                    setCollides = true;                
                }                   
            }
        }
        
        
        
        
        
        
        
        
        
        
        if(this.type !== Endless.Segment.BUILDING_15){
            for(var i = 0; i < this.objects.length; i++){
                this.objects[i].destroy();
                setCollides = true;                
            }    
            this.objects = [];
        } 
        
        //if(this.type === Endless.Segment.FLAT_RAMP_15 || this.type === Endless.Segment.FLAT_RAMP_17){
        //    this.object0.destroy();
        //} 

        
        /*if(this.type !== Endless.Segment.BUILDING_15){

            if(this.type === Endless.Segment.FLAT_RAMP_15){
                console.log('changed to ramp 15');
                this.objects.push(new Endless.Ramp(this));
                this.objects[0].init(0, 0, Endless.Ramp.TYPE_15);
            } else if(this.type === Endless.Segment.FLAT_RAMP_17){
                console.log('changed to ramp 17');                
                this.objects.push(new Endless.Ramp(this));
                this.objects[0].init(0, 0, Endless.Ramp.TYPE_17);
            } else if(this.type === Endless.Segment.GIRDER){
               // this.objects.push(new Endless.Ramp(this);
            } else if(this.type === Endless.Segment.WINDMILL){
                this.objects.push(new Endless.Windmill(this));
                this.objects[0].init(0, 0);                
            }     
            this.objects[0].setPos(this.x + this.width / 2 - this.objects[0].width / 2,
                this.y - this.building.element.height / 2 + 1 - this.objects[0].height / 2);
                
             if(this.type === Endless.Segment.WINDMILL){
                this.objects[0].rotateRight(10);    
                this.objects[0].move(200, 200);
            }     
            console.log(this.objects);
            setCollides = true;            
        }        
        
        
        /*if(this.type === Endless.Segment.FLAT_RAMP_15 || this.type === Endless.Segment.FLAT_RAMP_17){
            var key;
            if(this.type === Endless.Segment.FLAT_RAMP_15){
                key = 'ramp_15';
            } else {
                key = 'ramp_17';
            }
            this.object0 = new Endless.GameObject(this.x, this.y, key);
            Endless.phGame.physics.p2.enable(this.object0.element);          

            this.object0.setPolygon(_, _, false, this.world.terrain.cGroup);
            this.object0.element.body.x = this.x
                    + this.width / 2 - this.object0.element.width / 2;
            this.object0.element.body.y = this.y - this.building.element.height / 2 + 1 - this.object0.element.height / 2;
            this.object0.element.body.static = true;     
            setCollides = true;
        }     */
        //if(setCollides){
        //}
    },
    
    initSegmentByType: function(){
        this.objects = [];
                
        if(this.type === Endless.Segment.SEGMENT_SWITCHER){
            this.objects.push(new Endless.Building(this));      
            this.objects[0].init(this.x, this.y, this.width, this.height);            
        } else if (this.type === Endless.Segment.SINGLE_RAMP){
            this.objects.push(new Endless.Building(this));      
            this.objects[0].init(this.x, this.y, this.width, this.height); 
            this.objects.push(new Endless.Ramp(this));
            this.objects[1].init(0, 0, Endless.Ramp.TYPE_15);   
            this.objects[1].setPos(this.x + this.width / 2 - this.objects[1].width / 2,
                this.y - this.objects[1].height / 2 + 1 - this.objects[0].height / 2);            
        } else if (this.type === Endless.Segment.SINGLE_FLAT){
            this.objects.push(new Endless.Building(this));      
            this.objects[0].init(this.x, this.y, this.width, this.height);          
        } else if (this.type === Endless.Segment.MILL_SINGLE){
            this.objects.push(new Endless.Windmill(this));
            this.objects[0].init(0, 0);              
            this.objects[0].setPos(this.x + this.width / 2 - this.objects[1].width / 2,
                this.y - this.objects[1].height / 2 + 1 - this.objects[0].height / 2);
            this.objects[0].rotateRight(10);    
                //this.objects[0].move(200, 200);                
        } else if (this.type === Endless.Segment.MILL_DOUBLE){
            this.objects.push(new Endless.Windmill(this));
            this.objects.push(new Endless.Windmill(this));            
            this.objects[0].init(0, 0);              
            this.objects[0].setPos(this.x, this.y);
            this.objects[0].rotateRight(10);       
            this.objects[1].init(0, 0);              
            this.objects[1].setPos(this.objects[0].x + this.objects[0].width * 1.5,
                this.y);
            this.objects[1].rotateRight(10);               
        }        
    },
    
    changeSegment: function(previousSegment, x, y, width, height){
        this.setDimensions(previousSegment);  
        this.move();

        
        //this.initSegmentByType();
        //this.objects[0].setPos(this.x, this.y);
        
        //if(this.type !== Endless.Segment.MILL_SINGLE && 
        //        this.type !== Endless.Segment.MILL_DOUBLE){
            //this.objects[0].setPos(this.x, this.y);
        //    this.objects[0].resize(this.width, this.height);
        //} else if(this.type !== Endless.Segment.MILL_DOUBLE){
        //    this.objects[1].setPos(this.x, this.y);            
        //}
        
        
        /*if(this.type === Endless.Segment.SEGMENT_SWITCHER){
          
        } else if (this.type === Endless.Segment.SINGLE_RAMP){
         
        } else if (this.type === Endless.Segment.SINGLE_FLAT){
         
        } else if (this.type === Endless.Segment.MILL_SINGLE){
            
        } else if (this.type === Endless.Segment.MILL_DOUBLE){
             
        }          */   
        
        /*for(var i = 0; i < this.objects.length; i++){
            this.objects[i].setPos(this.x, this.y);
            try {
                this.objects[i].resize(this.width, this.height);
            } catch (e){
                //kk
            }
        
        }*/
        
        /*this.building.element.crop(new Phaser.Rectangle(0, 0, this.width, this.height));
        this.building.element.body.setRectangleFromSprite();
        this.building.element.body.setCollisionGroup(this.world.terrain.cGroup);   
        this.building.element.body.x = this.x;
        this.building.element.body.y = this.y;
        
        this.buildingSideX0.element.crop(new Phaser.Rectangle(0, 0, 14, this.height));            
        this.buildingSideX0.element.x = this.x - this.width / 2;
        this.buildingSideX0.element.y = this.y - this.height / 2;    
        
        this.buildingCenter.element.crop(new Phaser.Rectangle(14, 0, this.width - 28, this.height));    
        this.buildingCenter.element.x = this.x 
                - this.width / 2 + this.buildingSideX0.element.width;
        this.buildingCenter.element.y = this.y - this.height / 2;             
         
        this.buildingSideX1.element.crop(new Phaser.Rectangle(
                1000 - 14, 0, 14, this.height));            
        this.buildingSideX1.element.x = this.x 
                + this.width / 2 - this.buildingSideX1.element.width;
        this.buildingSideX1.element.y = this.y - this.height / 2;  
        
        if(this.type !== Endless.Segment.BUILDING_15){

            this.objects[0].setPos(this.x + this.width / 2 - this.objects[0].width / 2,
                this.y - this.building.element.height / 2 + 1 - this.objects[0].height / 2);
           if(this.type === Endless.Segment.WINDMILL){
                this.objects[0].rotateRight(10);    
                this.objects[0].move(200, 200);
            }                 
                
        }
        
        console.log(this);
        //console.log(height);*/
        
       /* if(math.randomInt(0, 2) === 0){
            var oldKey = this.object0.element.key;
            this.object0.element.destroy();
                    // this.object0.element.body.key
            if(oldKey === 'ramp_15'){
                this.object0.init(0, 0, 'ramp_17');
            } else {
                this.object0.init(0, 0, 'ramp_15');                
            }
            Endless.phGame.physics.p2.enable(this.object0.element);                   
            this.object0.setPolygon(_, _, false, this.world.terrain.cGroup);  
            this.object0.element.body.x = this.x + this.width / 2 - this.object0.element.width / 2;
            this.object0.element.body.y = this.y - this.building.element.height / 2 + 2 - this.object0.element.height / 2;               
            this.object0.element.body.static = true;            
            this.world.updateCollides();
        } else {
            this.object0.element.body.x = this.x + this.width / 2 - this.object0.element.width / 2;
            this.object0.element.body.y = this.y - this.building.element.height / 2 + 2 - this.object0.element.height / 2;
        }   
*/
        
    },
    
    move: function(x, y){ //delta
        if(x !== _){
            this.x += x;            
        }
        if(y !== _){
            this.y += y;            
        }   

        if(this.type === Endless.Segment.SEGMENT_SWITCHER){
            this.objects[0].resize(this.width, this.height, true);            
            this.objects[0].setPos(this.x, this.y);     
        } else if (this.type === Endless.Segment.SINGLE_RAMP){
            this.objects[0].resize(this.width, this.height, true);            
            this.objects[0].setPos(this.x, this.y);            
            this.objects[1].setPos(this.x + this.width / 2 - this.objects[1].width / 2,
                this.y - this.objects[1].height / 2 + 1 - this.objects[0].height / 2);            
        } else if (this.type === Endless.Segment.SINGLE_FLAT){
            this.objects[0].resize(this.width, this.height, true);                        
            this.objects[0].setPos(this.x, this.y);            
        } else if (this.type === Endless.Segment.MILL_SINGLE){
            this.objects[0].setPos(this.x + this.width / 2 - this.objects[1].width / 2,
                this.y - this.objects[1].height / 2 + 1 - this.objects[0].height / 2);
            this.objects[0].rotateRight(10);    
                //this.objects[0].move(200, 200);                
        } else if (this.type === Endless.Segment.MILL_DOUBLE){
            this.objects[0].setPos(this.x, this.y);
            this.objects[0].rotateRight(10);       
            this.objects[1].setPos(this.objects[0].x + this.objects[0].width * 1.5,
                this.y);
            this.objects[1].rotateRight(10);               
        }         

        /*if(this.type !== Endless.Segment.BUILDING_15){
            this.objects[0].setPos(this.x + this.width / 2 - this.objects[0].width / 2,
                this.y - this.building.building.element.height / 2 + 1 - this.objects[0].height / 2);
            if(this.type === Endless.Segment.WINDMILL){
                this.objects[0].rotateRight(10);    
                
            }                 
        }        */
        
    },
    
    setDimensions: function(previousSegment, x, y, width, height){
        
        if(this.hasNextDimensions){
            
            this.x = this.nextDimensions.x;
            this.y = this.nextDimensions.y;
            this.width = this.nextDimensions.width;
            this.height = this.nextDimensions.height;
            this.gap = this.nextDimensions.gap;
            
            
            console.log('set according to nextDimensions');
            this.hasNextDimensions = false;
        } else {
            if(x !== _ && y !== _ && width !== _ && height !== _){
            //if(x !== _){
                this.x = x;            
            //}
            //if(y !== _){
                this.y = y;            
            //}

                width -= 28;//14 + 13 + 14;
                width /= 24;
                width = math.round(width);
                width *= 24;
                width = math.round(width);
                width += 28 + 12; //12 is offset
                if(width > 1000){
                    width = 1000;
                }   

                this.width = width;
                this.height = height;   
                this.gap = 100;
            } else {

                this.y = previousSegment.y;
                this.height = previousSegment.height;
                this.gap = 100;
                //this.width = width;
                //this.height = 100;

                if(this.type === Endless.Segment.SEGMENT_SWITCHER){
                    this.width = 1000;
                    //this.height = 200;
                } else if (this.type === Endless.Segment.SINGLE_RAMP){
                    var width = math.randomInt(600, 801);
                    width -= 28;//14 + 13 + 14;
                    width /= 24;
                    width = math.round(width);
                    width *= 24;
                    width = math.round(width);
                    width += 28 + 12; //12 is offset
                    if(width > 1000){
                        width = 1000;
                    }                       
                    this.width = width;
                    
                } else if (this.type === Endless.Segment.SINGLE_FLAT){
                    var width = math.randomInt(600, 801);
                    width -= 28;//14 + 13 + 14;
                    width /= 24;
                    width = math.round(width);
                    width *= 24;
                    width = math.round(width);
                    width += 28 + 12; //12 is offset
                    if(width > 1000){
                        width = 1000;
                    }                       
                    this.width = width;
                    // this.height = 
                } else if (this.type === Endless.Segment.MILLS){     
                    this.width = 800;
                } 

                if(previousSegment.type === Endless.Segment.SEGMENT_SWITCHER){
                    this.height = previousSegment.height - 10;
                    if(this.height > 450){
                        this.height -= 90;
                    }
                } else if (previousSegment.type === Endless.Segment.SINGLE_RAMP){
                    console.log('previous segment had a ramp');
                    this.height = previousSegment.height + 25;
                    this.gap = 200;
                } else if (previousSegment.type === Endless.Segment.SINGLE_FLAT){
                    this.height = previousSegment.height - 10;
                    if(this.height > 450){
                        this.height -= 90;
                    }                    
                } else if (previousSegment.type === Endless.Segment.MILLS){    
                    this.height = previousSegment.height - 25;
                }              

                /*if(this.type !== Endless.Segment.SEGMENT_SWITCHER){
                    console.log('kk');
                    if(previousSegment.type === Endless.Segment.SEGMENT_SWITCHER){
                        this.height = previousSegment.height - 10;
                    } else if (previousSegment.type === Endless.Segment.SINGLE_RAMP){
                        console.log('previous segment had a ramp');
                        this.height = previousSegment.height + 25;
                        this.gap = 200;
                    } else if (previousSegment.type === Endless.Segment.SINGLE_FLAT){
                        this.height = previousSegment.height - 25;
                    } else if (previousSegment.type === Endless.Segment.MILLS){    
                        this.height = previousSegment.height - 25;
                    }                 
                } else {
                    //if its a SS
                    //this.y = 1925;
                    this.height = 100;
                    if (previousSegment.type === Endless.Segment.SINGLE_RAMP){
                        console.log('previous segment had a ramp');                    
                        this.gap = 200;
                    }if (previousSegment.type === Endless.Segment.SINGLE_FLAT){
                        //this.height = previousSegment.height - 25;
                    }
                    //hardcoded y.. yay
                }*/
                if(this.height > 1000){
                    this.height = 1000;
                }
                if(this.height < 100){
                    this.height = 100;
                }
                this.y = Endless.phGame.world.height - this.height / 2;
               //this.gap = 100;
                //console.log('x before: ' + this.x);
                this.x = previousSegment.x 
                            + previousSegment.width / 2 //old x1
                            + this.gap // gap
                            + this.width / 2;  
                    //console.log();


                //console.log();
            //console.log(previousSegment.x);
           // console.log(this.x);     
            //console.log('gap is: ' + this.gap);
            //console.log('becu');
            }
               // console.log('this.type: ' + this.type);


            //console.log(this);
            //console.log(this.width);                    
        }
        
        
        /*
         * this.gap = 200;//math.randomInt();   
            width = 1000;
            height = 150;
            type = Endless.Segment.FLAT_RAMP_15;
            if(i === 0){
                x = width / 2 + this.world.cameraOffsetX; 
                y = Endless.phGame.world.height - height / 2;                                
                //height = 100;
            } else {
                if (i === this.segmentsAmount - 1){
                    //height = 100;
                } else {
                    width = math.randomInt(600, 800 + 1);  
                    y = this.segments[i - 1].y - 20;
                    //height = this.segments[i - 1].height + 10;
                }
                x = this.segments[i - 1].x 
                        + this.segments[i - 1].width / 2 //old x1
                        + this.gap // gap
                        + width / 2;                
            }
            this.segments[i].init(
                    this.world, x, y, 
                    width, height, type);
            
            this.segments[i].setDebug(this.debug);            

         */
        
    },    
    
    setNextDimensions: function(previousSegment, type){
        
        if(previousSegment.nextDimensions === _){
            previousSegment.nextDimensions = {
                x: previousSegment.x, 
                y: previousSegment.y,
                type: previousSegment.type,
                gap: previousSegment.gap,
                width: previousSegment.width,
                height: previousSegment.height                
            };
        }
        
        this.nextDimensions = {
            x: 0, 
            y: 0,
            type: 0,
            gap: 0,
            width: 0,
            height: 0
        };
        
        this.nextDimensions.type = type;
        this.nextDimensions.y = previousSegment.nextDimensions.y;
        this.nextDimensions.height = previousSegment.nextDimensions.height;        
        this.nextDimensions.gap = 100;

        if(this.nextDimensions.type === Endless.Segment.SEGMENT_SWITCHER){
            this.nextDimensions.width = 1000;
            //this.height = 200;
        } else if (this.nextDimensions.type === Endless.Segment.SINGLE_RAMP){
            var width = math.randomInt(600, 801);
            width -= 28;//14 + 13 + 14;
            width /= 24;
            width = math.round(width);
            width *= 24;
            width = math.round(width);
            width += 28 + 12; //12 is offset
            if(width > 1000){
                width = 1000;
            }                       
            this.nextDimensions.width = width;
        } else if (this.nextDimensions.type === Endless.Segment.SINGLE_FLAT){
            var width = math.randomInt(600, 801);
            width -= 28;//14 + 13 + 14;
            width /= 24;
            width = math.round(width);
            width *= 24;
            width = math.round(width);
            width += 28 + 12; //12 is offset
            if(width > 1000){
                width = 1000;
            }            
            this.nextDimensions.width = width;           // this.height = 
        } else if (this.nextDimensions.type === Endless.Segment.MILLS){     
            this.nextDimensions.width = 800;
        } 

        if(previousSegment.nextDimensions.type === Endless.Segment.SEGMENT_SWITCHER){
            this.nextDimensions.height = previousSegment.nextDimensions.height - 10;
            if(this.nextDimensions.height > 450){
                this.nextDimensions.height -= 90;
            }            
        } else if (previousSegment.nextDimensions.type === Endless.Segment.SINGLE_RAMP){
            console.log('previous segment had a ramp');
            this.nextDimensions.height = previousSegment.nextDimensions.height + 25;
            this.nextDimensions.gap = 200;
        } else if (previousSegment.nextDimensions.type === Endless.Segment.SINGLE_FLAT){
            this.nextDimensions.height = previousSegment.nextDimensions.height - 10;
            if(this.nextDimensions.height > 450){
                this.nextDimensions.height -= 90;
            }            
        } else if (previousSegment.nextDimensions.type === Endless.Segment.MILLS){    
            this.nextDimensions.height = previousSegment.nextDimensions.height - 25;
        }              

        if(this.nextDimensions.height > 1000){
            this.nextDimensions.height = 1000;
        }
        if(this.nextDimensions.height < 100){
            this.nextDimensions.height = 100;
        }
        this.nextDimensions.y = Endless.phGame.world.height - this.nextDimensions.height / 2;

        this.nextDimensions.x = previousSegment.nextDimensions.x 
                    + previousSegment.nextDimensions.width / 2 //old x1
                    + this.nextDimensions.gap // gap
                    + this.nextDimensions.width / 2;  
            
        this.hasNextDimensions = true;
        
        console.log('nextDimensions: ');
        console.log(this.nextDimensions);
    },
    
    setDebug: function(debug){     
        //this.building.setDebug(debug);   
        
        for(var i = 0; i < this.objects.length; i++){
            this.objects[i].setDebug(debug);
        }
        //if(this.type === Endless.Segment.FLAT_RAMP_15 || this.type === Endless.Segment.FLAT_RAMP_17){
        //    this.object0.setDebug(debug);                                           
        //}
    },    
    
    collides: function(cGroup){
        //this.building.collides(cGroup);
        //console.log(this.objects);
        for(var i = 0; i < this.objects.length; i++){
            this.objects[i].collides(cGroup);
        }        
       // if(this.type === Endless.Segment.FLAT_RAMP_15 || this.type === Endless.Segment.FLAT_RAMP_17){
       //     this.object0.element.body.collides(cGroup);
       // }               
    },
    
    destroy: function(){
        //this.building.destroy();  
        
        for(var i = 0; i < this.objects.length; i++){
            this.objects[i].destroy();
        }           
        
       // if(this.type === Endless.Segment.FLAT_RAMP_15 || this.type === Endless.Segment.FLAT_RAMP_17){
       //     this.object0.destroy();                
       // }                                 
    }
   
};

Endless.Player = function(){
    
};

Endless.Player.prototype = {
    
    init: function(context){
        this.world = context;
        
        this.vehicle = new Endless.MotorCycle();
        this.vehicle.init(this.world, 320, Endless.phGame.world.height - 250);

        this.debug = false;
        this.vehicle.setDebug(this.debug);
        
        //this.highestY = 800 + 320;
        this.vehicle.minimumX = 800 + 320 + 80 - 800;
        this.vehicle.maximumX = 800 + 320 + 80;
        this.vehicle.lockBackwardsVelocity = false;
        
        this.vehicle.turboActive = false;
        this.vehicle.turboLimit = 100;
        this.vehicle.turbo = 100;
        this.vehicle.wheelAccelerationNormal = 4;        
        this.vehicle.wheelAccelerationTurbo = 8;  
        this.vehicle.wheelAcceleration = this.vehicle.wheelAccelerationNormal;        
        
        this.vehicle.frameAcceleration = 0.5;
        
        this.vehicle.update = function(){
            //console.log(this.wheel0.element.body.angularVelocity);
            //console.log('------------------------');
            //console.log(Endless.game.statistics.distanceTravelled);
            //console.log(this.minimumX);
            //console.log(this.maximumX);            
            if(this.frame.element.x > this.minimumX + Endless.dimensions.width){
                this.minimumX = this.frame.element.x - Endless.dimensions.width;
                Endless.game.statistics.distanceTravelled += this.frame.element.x - this.maximumX;                
                this.maximumX = this.frame.element.x;
            } else if (this.frame.element.x > this.minimumX){
                this.lockBackwardsVelocity = false;
            }else if (this.frame.element.x < this.minimumX){
                this.lockBackwardsVelocity = true;
            }
            
            if(Endless.input.T){
                this.wheelAcceleration = this.wheelAccelerationTurbo;
            } else {
                this.wheelAcceleration = this.wheelAccelerationNormal;                
            }
            
            if(Endless.input.down && !this.lockBackwardsVelocity){
                this.wheel0.element.body.angularVelocity -= this.wheelAcceleration;
                this.wheel1.element.body.angularVelocity -= this.wheelAcceleration;   
            }
            if(Endless.input.up){
                this.wheel0.element.body.angularVelocity += this.wheelAcceleration;
                this.wheel1.element.body.angularVelocity += this.wheelAcceleration; 
            } 
            if(Endless.input.left){
                this.frame.element.body.angularVelocity -= this.frameAcceleration;

            }
            if(Endless.input.right){
                this.frame.element.body.angularVelocity += this.frameAcceleration;    
            }
            //console.log(this.frame.element.body.angularVelocity);

            if(!Endless.input.up && !Endless.input.down && !Endless.input.left && !Endless.input.right){
                if(Math.abs(this.frame.element.body.velocity.x - this.frame.element.body.velocity.y) < 2){
                    this.frame.element.body.setZeroVelocity();
                }
            }


            Endless.phGame.camera.x = this.frame.element.x - 400;   
            Endless.phGame.camera.y = this.frame.element.y - 342;               
            //cono
            
        };  
    },
    
    move: function(x, y){
        this.vehicle.move(x, y);
        //console.log(this.vehicle.frame.element.x);
        this.vehicle.minimumX = this.vehicle.frame.element.body.x - Endless.dimensions.width;
        this.vehicle.maximumX = this.vehicle.frame.element.body.x;  
                //console.log('');
    },
    
    update: function(){
        this.vehicle.update();
    },
    
    destroy: function(){
        this.vehicle.destroy();     
    },

};

Endless.Terrain = function(){
    
    this.ASCEND_SIMPLE = 0;
    this.ASCEND_MEDIUM = 1;
    
    this.mode = this.ASCEND_SIMPLE;
    
};

Endless.Terrain.prototype = {
    
    init: function(context){
        this.world = context;
        
        this.debug = false;
        this.segments = [];
        this.segmentsAmount = 10;
        this.middleSegmentIndex = math.round(this.segmentsAmount / 2) - 1;
        this.lastSegmentIndex = this.segmentsAmount - 1;        
        this.cGroup = Endless.phGame.physics.p2.createCollisionGroup();   
        this.gap = 150;
        console.log(this.middleSegmentIndex);

        //console.log(0 / 0);
        
       
        for(var i = 0; i < this.segmentsAmount; i++){
            this.segments.push(new Endless.Segment());            
        }
        this.segments[0].init(this.world, Endless.Segment.SEGMENT_SWITCHER, _,
        1000 / 2 + this.world.cameraOffsetX, Endless.phGame.world.height - 200 / 2, 1000, 200); 
        
        var type;
        for(var i = 1; i < this.segmentsAmount - 1; i++){
            type = math.randomInt(1, 3);
            this.segments[i].init(this.world, type, this.segments[i - 1]); 
        }    
        
        this.segments[this.lastSegmentIndex].init(this.world, 
        Endless.Segment.SEGMENT_SWITCHER, this.segments[this.lastSegmentIndex - 1]);
        //1000 / 2 + this.world.cameraOffsetX, Endless.phGame.world.height - 150 / 2, 1000, 150);         
        
        console.log(this.segments);
        
        for(var i = 0; i < this.segmentsAmount; i++){
            this.segments[i].setDebug(this.debug);            
        }        
        
        this.segmentsQueue = [];
        this.segmentsQueue.push({
            type: Endless.Segment.SEGMENT_SWITCHER
        });
        for(var i = 1; i < this.segmentsAmount - 1; i++){
            this.segmentsQueue.push({
                type: math.randomInt(1, 3)              
            });
            //this.segments.push(new Endless.Segment());            
        }
        this.segmentsQueue.push({
            type: Endless.Segment.SEGMENT_SWITCHER
        });  
        
        //Endless.ui.topbar.minimap.setSegments();
        //this.setSegments();
        //this.setEdgeSegments();
        //this.segments[0].setNextDimensions();
        
        //for(var i = 1; i < this.segmentsAmount - 1; i++){
        //    this.segments[i].setNextDimensions(this.segments[i - 1], this.segmentsQueue[i].type);
        //}            
        
        
        
        //this.nextSegmentsTypes = [];
        //for(var i = 0; i < this.segmentsAmount; i++){
        //    this.nextSegmentsTypes[i].push();          
        //}              
        
        
        /*
        for(var i = 0; i < this.segmentsAmount; i++){
            this.segments.push(new Endless.Segment());
            var x, y, width, height, type;
            //if(math.randomInt(0, 2) === 0){
            //    this.gap = 0;
            //} else {
            this.gap = 200;//math.randomInt();   
            width = 1000;
            height = 150;
            type = Endless.Segment.FLAT_RAMP_15;
            if(i === 0){
                x = width / 2 + this.world.cameraOffsetX; 
                y = Endless.phGame.world.height - height / 2;                                
                //height = 100;
            } else {
                if (i === this.segmentsAmount - 1){
                    //height = 100;
                } else {
                    width = math.randomInt(600, 800 + 1);  
                    y = this.segments[i - 1].y - 20;
                    //height = this.segments[i - 1].height + 10;
                }
                x = this.segments[i - 1].x 
                        + this.segments[i - 1].width / 2 //old x1
                        + this.gap // gap
                        + width / 2;                
            }
            this.segments[i].init(
                    this.world, x, y, 
                    width, height, type);
            
            this.segments[i].setDebug(this.debug);            

        }*/
        
        Endless.phGame.physics.p2.updateBoundsCollisionGroup();               
        this.reachedMiddle = false;
        this.initY = this.segments[0].y;
    },
    
    onSetMode: function(){
         if(this.mode === this.ASCEND_SIMPLE){
            this.segments[1].changeType(Endless.Segment.FLAT_RAMP_15);    
            this.segments[2].changeType(Endless.Segment.FLAT_RAMP_15);           
        } else {
            this.segments[1].changeType(Endless.Segment.FLAT_RAMP_17);    
            this.segments[2].changeType(Endless.Segment.BUILDING_15);                        
        }
    },
    
    onLastSegmentReached: function(){
        console.log('on last segment reached');
        console.log(this.segments);
        var delta = Endless.phGame.camera.x - this.world.cameraOffsetX;
        Endless.phGame.camera.x -= delta;
        var diff = 0;
        /*if(this.segments[0].y < 1000){
            diff = this.initY - this.segments[0].y;
            console.log('setting Y by: ' + diff);
            for(var i = 0; i < this.segmentsAmount; i++){
                this.segments[i].move(0, diff);
                
                //this.
                //this.segments[i].changeSegment(x, y, width, height);                
            }
        }*/
        
        
        
        
        this.world.player.move(-delta, diff);
        
        
        
        //if(math.randomInt(0, 2) === 0){
        var mode = math.randomInt(0, 2);
        console.log('asdf');
        if(mode !== this.mode){
            this.mode = mode;
            //this.onSetMode();
        }
        
        this.setMiddleSegments();
        
       //Endless.ui.topbar.minimap.onLastSegmentReached();   
        
        //Endless.phGame.physics.p2.updateBoundsCollisionGroup();
        this.reachedMiddle = false;
    },
    
    onMiddleSegmentReached: function(){
        this.reachedMiddle = true;
        this.setEdgeSegments();
        
        //Endless.ui.topbar.minimap.onMiddleSegmentReached();
        //var x, width, height;
        //var height = math.randomInt(100, 150 + 1);
                //console.log(this.segments[this.lastSegmentIndex]);
       // console.log(this.segments[this.lastSegmentIndex]);  
    },
    
    setMiddleSegments: function(){
        console.log('set middle segments');
        console.log(this.segments);        
        //var x, y, width, height;
        //var type;
        //console.log(this.segments);
        for(var i = 1; i < this.segmentsAmount - 1; i++){
            
           // if(){
                
            //}
            
            //type = math.randomInt(1, 3);
            if(this.segments[i].type !== this.segments[i].nextDimensions.type){
                this.segments[i].changeType(this.segments[i].nextDimensions.type, this.segments[i - 1]);   
                //this.segments[i].changeSegment(this.segments[i - 1]);                                
            } else {
                this.segments[i].changeSegment(this.segments[i - 1]);                
            }
            
            
            this.segmentsQueue[i].type = math.randomInt(1, 3);
        }
      


        this.world.updateCollides();
        console.log('after everything');
        console.log(this.segments);
        //console.log(this.segments);
        
        /*if(this.mode === this.ASCEND_SIMPLE){
            for(var i = 1; i < this.segmentsAmount - 1; i++){
                this.gap = 100;//math.randomInt(100, 201);       
                width = math.randomInt(600, 800 + 1);
                height = 150;
                y = this.segments[i - 1].y - 20;                
                x = this.segments[i - 1].x 
                        + this.segments[i - 1].width / 2 //old x1
                        + this.gap // gap
                        + width / 2;      
                this.segments[i].changeSegment(x, y, width, height);
            }            
        } else {
            for(var i = 1; i < this.segmentsAmount - 1; i++){
                this.gap = 100;//math.randomInt(100, 201);       
                width = math.randomInt(600, 800 + 1);
                height = 150;
                y = this.segments[i - 1].y - 20;                     
                /*if(i === 1){
                    this.segments[i].changeType(Endless.Segment.FLAT_RAMP_17);
                } else*/ /*if (i === 2){
                    //this.segments[i].changeType(Endless.Segment.BUILDING_15);
                    this.gap = 200;
                    y = this.segments[i - 1].y - 150;                                    
                } else if (i === 3){
                    y = this.segments[i - 1].y + 100;                                    
                }
           
                x = this.segments[i - 1].x 
                        + this.segments[i - 1].width / 2 //old x1
                        + this.gap // gap
                        + width / 2;                      
                this.segments[i].changeSegment(x, y, width, height);
            }            
        }*/
        

    },
    
    setEdgeSegments: function(){
        console.log('set edge segments');
        this.segments[this.lastSegmentIndex].changeSegment(this.segments[this.lastSegmentIndex - 1]); 
        
        
        if(this.segments[0].height !== this.segments[this.lastSegmentIndex].height){
            this.segments[0].height = this.segments[this.lastSegmentIndex].height;
            this.segments[0].y = this.segments[this.lastSegmentIndex].y;
            this.segments[0].move();
            //this.segments[0]
            console.log('edge segment 0 changed');
            console.log(this.segments);
            console.log(this.segments[0].objects[0].building.element.body.y);
            console.log(this.segments[this.lastSegmentIndex].objects[0].building.element.body.y);            
        } else {
            console.log('edge segment 0 not changed');
            console.log(this.segments);
        }
        for(var i = 1; i < this.segmentsAmount - 1; i++){
            this.segments[i].setNextDimensions(this.segments[i - 1], this.segmentsQueue[i].type);
        }           
       // console.log();
        
        
        /*
        
        
        var x, y, height;
       //height = this.segments[this.lastSegmentIndex].height + 10;
        height = 150;
        y = this.segments[this.lastSegmentIndex -1].y - 20;        
        //height = this.segments[this.lastSegmentIndex - 1].height + 10;
        //if(height > 200){
        //    height = 200;
        //} 
        //y = Endless.phGame.world.height - height / 2;        

        x = this.segments[this.lastSegmentIndex - 1].x 
                + this.segments[this.lastSegmentIndex - 1].width / 2 //old x1
                + this.gap // gap
                + this.segments[this.lastSegmentIndex].width / 2;                   
        
        this.segments[this.lastSegmentIndex].changeSegment(x, y, 1000, height);        
        this.segments[0].changeSegment(this.segments[0].x, y,  1000, height);
                    
        console.log(this.segments[this.lastSegmentIndex]);              */
    },
    
    update: function(){
        
        if(Endless.phGame.camera.x + this.world.cameraOffsetX > 
                this.segments[this.lastSegmentIndex].objects[0].getElement().element.body.x + 300){
            this.onLastSegmentReached();
        }
        if(!this.reachedMiddle && Endless.phGame.camera.x + this.world.cameraOffsetX / 2 > 
                this.segments[this.middleSegmentIndex].objects[0].getElement().element.body.x){
            this.onMiddleSegmentReached();
        }        
    },
    
    collides: function(cGroup){
        for(var i = 0; i < this.segments.length; i++){
            this.segments[i].collides(cGroup);
        }        
    },
    
    collidesWithTerrain: function(circle){
        return 0;//circle.y - circle.radius < this.groundY;
    },
    
    destroy: function(){
        for(var i = 0; i < this.segments.length; i++){
            this.segments[i].destroy();
        }        
    },
    
    
};


//Endless.Player.prototype.update = function(){
    
//};

Endless.World = function(game){
    this.game = game;
};

Endless.World.prototype = {
    
    init: function(){
        
        //http://www.inkfood.com/create-a-car-with-phaser/
        //
        //this.player1 = Endless.phGame.add.sprite(0, 0, 'motorcycle');
        //this.player1.position.set(800 / 2 - 0 / 2, 514 / 2 + 0 / 2);
        //console.log(this.player1.anchor);
        Endless.phGame.physics = new Phaser.Physics(Endless.phGame, {
            gravity: [0, -20], 
            broadphase: new p2.SAPBroadphase()
        });
        
        Endless.phGame.physics.startSystem(Phaser.Physics.P2JS); 
        //Endless.phGame.physics.p2.gravity.y = 200;
        Endless.phGame.physics.p2.setImpactEvents(true);
        Endless.phGame.physics.p2.friction = 20; //higher == less friction
        Endless.phGame.physics.p2.restitution = 0.4;
        
        console.log(Endless.phGame.physics.config);
        
        this.cameraOffsetX = 800;
        this.cameraOffsetY = Endless.phGame.world.height - Endless.dimensions.height;        
        //console.log(Endless.phGame.world.height);
        this.player = new Endless.Player();
        this.terrain = new Endless.Terrain();
        
        this.terrain.init(this);
        this.player.init(this);
        
        this.updateCollides();
    },
    
    updateCollides: function(){
        this.player.vehicle.setCollides();
        Endless.phGame.physics.p2.updateBoundsCollisionGroup();        
    },
    
    update: function(){
        
        this.player.update();
        this.terrain.update();
        
        if(this.player.vehicle.frame.element.y >  100 + Endless.phGame.world.height && 
           this.player.vehicle.wheel0.element.y > 100 + Endless.phGame.world.height && 
           this.player.vehicle.wheel1.element.y > 100 + Endless.phGame.world.height){
            this.game.restart();            
        }
         //* 
         //* @returns {Number}this.player.update();
        //this.terrain.update();
        //this.player.bounds.pos.sub(this.scrollSpeed);

        //if(!this.worldBounds.containsRectangle(this.player.bounds) ||
        //        this.terrain.collidesWithTerrain(this.player.headWorld)){
        
        /*if(!this.player.frame.inCamera && 
                !this.player.wheel0.inCamera  && 
                !this.player.wheel1.inCamera){
            console.log(this);
            console.log('restart');
            this.player.destroy();
            this.ground.destroy();
            this.game.start();
        }*/
         
    },
    
    getPlayerSpeed: function(){
        return math.abs(math.round(
                (this.player.vehicle.frame.element.body.velocity.x / Endless.dimensions.ppm)
                * 3.6));
        
//return Math.abs(math.round(math.multiply(this.player.frame.body.velocity.x, 0.36)));
        //return Math.round((this.scrollSpeed.x + this.player.speedDelta.x) * 7.2);
    },
};

/*
 * Statistics
 */

Endless.Statistics = function(){
    
};

Endless.Statistics.prototype = {
    
    init: function(){
        this.secondsPlayed = 0;
        this.distanceTravelled = 0;
    },
    
    getDistanceTravelledMeters: function(){
        return math.round(this.distanceTravelled / Endless.dimensions.ppm);
    },
};

/*
 * Inits game
 */

Endless.init(this);
