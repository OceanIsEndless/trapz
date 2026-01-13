/// <reference path="./libs/phaser.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseGame;
(function (BaseGame) {
    var AppearText = (function (_super) {
        __extends(AppearText, _super);
        function AppearText(game, x, y) {
            var _this = _super.call(this, game, x, y, 'text') || this;
            var style = { font: 'Pixel Cyr', fill: 'FFffff', align: 'center', wordWrap: true, wordWrapWidth: 400 };
            _this.setStyle(style);
            //this = this.game.add.text(this.game.world.centerX, 30, "1", style);
            _this.anchor.setTo(0.5, 0);
            // this.mainText.font = 'Concert One';
            _this.fontSize = 22;
            _this.lineSpacing = -5;
            _this.align = 'center';
            _this.stroke = "#000";
            _this.strokeThickness = 16;
            _this.colors = ['#F7DF3C'];
            _this.stroke = '#000';
            _this.strokeThickness = 2;
            _this.timeAlive = 2500;
            return _this;
        }
        AppearText.prototype.launch = function () {
            this.scale.set(0.8);
            this.alpha = 1;
            var scaleTween = this.game.add.tween(this.scale).to({ x: 1, y: 1 }, 300, Phaser.Easing.Linear.None, true, 0);
            scaleTween.onComplete.add(function () { this.hide(); }, this); //
        };
        AppearText.prototype.hide = function () {
            var scaleTween = this.game.add.tween(this).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 2500);
            scaleTween.onComplete.add(function () { this.destroy(); }, this); //
        };
        AppearText.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            if (typeof this.playerBoundSpr !== 'undefined' && this.playerBoundSpr != null) {
                this.playerBoundSpr.appearText = null;
            }
        };
        return AppearText;
    }(Phaser.Text));
    BaseGame.AppearText = AppearText;
})(BaseGame || (BaseGame = {}));
/// <reference path="./libs/phaser.d.ts" />
var BaseGame;
(function (BaseGame) {
    var BarOrient;
    (function (BarOrient) {
        BarOrient[BarOrient["VERTICAL"] = 0] = "VERTICAL";
        BarOrient[BarOrient["HORIZONTAL"] = 1] = "HORIZONTAL";
    })(BarOrient = BaseGame.BarOrient || (BaseGame.BarOrient = {}));
    var BarSpr = (function (_super) {
        __extends(BarSpr, _super);
        function BarSpr(_game, _x, _y, imgFullKey, imgEmptKey) {
            var _this = _super.call(this, _game) || this;
            _this.spriteFull = _this.game.add.sprite(_x, _y, imgFullKey);
            _this.spriteEmpt = _this.game.add.sprite(_x, _y, imgEmptKey);
            _this.spriteEmpt.anchor.set(0, 0.5);
            _this.spriteFull.anchor.set(0, 0.5);
            _this.useCropRect = new Phaser.Rectangle(0, 0, _this.spriteFull.width * 0.5, _this.spriteFull.height);
            _this.spriteFull.crop(_this.useCropRect, false);
            _this.add(_this.spriteEmpt);
            _this.add(_this.spriteFull);
            _this.originalWidth = _this.spriteEmpt.width;
            //  console.log("created inside bar");
            _this.updateProgress(1);
            return _this;
        }
        BarSpr.prototype.setAngle = function (_angle) {
            this.spriteEmpt.angle = this.spriteFull.angle = _angle;
        };
        BarSpr.prototype.setXY = function (_x, _y) {
            this.spriteFull.x = this.spriteEmpt.x = _x;
            this.spriteFull.y = this.spriteEmpt.y = _y;
        };
        BarSpr.prototype.updateValues = function (_curAm, _maxAm) {
            if (_maxAm === void 0) { _maxAm = -1; }
            if (_maxAm != -1) {
                this.fullAm = _maxAm;
            }
            this.curAm = _curAm;
            this.updateProgress(this.curAm / this.fullAm);
        };
        BarSpr.prototype.updateProgress = function (_progress) {
            var _progressVal = Phaser.Math.clamp(_progress, 0, 1);
            _progressVal = Phaser.Math.clamp(_progressVal, 0.00001, 0.99999);
            this.useCropRect.width = this.originalWidth * _progress;
            this.spriteFull.updateCrop();
            // this.spriteFull.width = this.originalWidth * _progress;
            this.progress = _progress;
        };
        return BarSpr;
    }(Phaser.Group));
    BaseGame.BarSpr = BarSpr;
})(BaseGame || (BaseGame = {}));
/// <reference path="./libs/phaser.d.ts" />
/// <reference path="./libs/phaser-input.d.ts" />
var BaseGame;
(function (BaseGame) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Boot.prototype.preload = function () {
            var clientStr = '.';
            // clientStr = 'client';
            this.game.add.plugin(new PhaserInput.Plugin(this.game, this.game.plugins)); //PhaserInput.Plugin);
            this.load.image('preloadBar', clientStr + '/assets/barFull.png');
            this.load.image('preloadBarEmpt', clientStr + '/assets/barEmpt.png');
            this.game.time.desiredFps = 60;
        };
        Boot.prototype.create = function () {
            this.firstRunLandscape = this.game.scale.isGameLandscape;
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;
            if (this.game.device.desktop) {
                this.scale.pageAlignHorizontally = true;
                this.scale.scaleMode = Phaser.ScaleManager.RESIZE; // Phaser.ScaleManager.RESIZE;//SHOW_ALL; normally use show_all on pc, resize is made to fill the page also need to implement turn screen for it
                this.scale.refresh();
            }
            else {
                // Mobile settings
                this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
                this.scale.minWidth = 990 * 0.5;
                this.scale.minHeight = 630 * 0.5;
                this.scale.maxWidth = 990;
                this.scale.maxHeight = 630;
                this.scale.forceLandscape = true;
                this.scale.pageAlignHorizontally = true;
                this.scale.refresh();
            }
            this.game.scale.forceOrientation(true, false);
            this.game.scale.enterIncorrectOrientation.add(this.handleIncorrect);
            this.game.scale.leaveIncorrectOrientation.add(this.handleCorrect);
            console.log("this.game.device.desktop " + this.game.device.desktop);
            this.game.state.start('Preloader', true, false);
            this.game.add.text(0, 0, "hack", { font: "Pixel Cyr", fill: "#FFFFFF" });
            window.game.onFocus.add(function () { window.game.input.enabled = true; this.game.input.keyboard.start(); }, this);
            window.game.onBlur.add(function () { window.game.input.enabled = false; this.game.input.keyboard.stop(); this.game.input.keyboard.reset(); }, this);
        };
        Boot.prototype.handleIncorrect = function () {
            if (this.game == null) {
                console.log("no game");
                return;
            }
            // if (!this.game.device.desktop) {
            console.log("show incorrect");
            document.getElementById("turn").style.display = "block";
            //}
        };
        Boot.prototype.handleCorrect = function () {
            if (this.game == null)
                return;
            console.log("show correct");
            //   if (!this.game.device.desktop) {
            if (this.firstRunLandscape) {
                this.gameRatio = window.innerWidth / window.innerHeight;
                this.game.width = Math.ceil(990 * this.gameRatio);
                this.game.height = 990;
                this.game.renderer.resize(this.game.width, this.game.height);
                //this.game.state.start("Play");
                if (Constants.MAIN_STATE != null) {
                    Constants.MAIN_STATE.resize();
                }
            }
            document.getElementById("turn").style.display = "none";
            //   }
        };
        Boot.prototype.resize = function () {
            console.log("resize boot");
        };
        return Boot;
    }(Phaser.State));
    BaseGame.Boot = Boot;
})(BaseGame || (BaseGame = {}));
/// <reference path="./libs/phaser.d.ts" />
var BaseGame;
(function (BaseGame) {
    var Collectable = (function (_super) {
        __extends(Collectable, _super);
        function Collectable(game, x, y) {
            var _this = _super.call(this, game, x, y, 'coin', 0) || this;
            //this.anchor.setTo(0.5);
            // this.typeCollide = CollideSpr.SPIKE;
            game.add.existing(_this);
            //  Enable Arcade Physics for the sprite
            //game.physics.p2.enable(this);//, Phaser.Physics.ARCADE
            //game.physics.enable(this);
            _this.outOfBoundsKill = false;
            // this.body.checkCollision.up = true;
            // this.body.checkCollision.down = true;
            _this.resetValues();
            return _this;
            //  Make static
            //this.body.static = true;
        }
        Collectable.prototype.resetValues = function () {
            this.collectedStarted = false;
            this.revive();
            this.scale.set(1, 1);
            /*
            this.body.allowGravity = false;
            this.body.moves = false;
            this.body.immovable = true;
            this.body.setZeroVelocity(); */
            /*  this.body.velocity.setTo(0, 0);
              */
            //this.body.
            //  console.log('reset time ' + this.game.time.now);
        };
        Collectable.prototype.resize = function () {
            // console.log("resize x " + this.x + ". Y " + this.y + ". scaleX " + this.scale.x);
        };
        Collectable.prototype.animateTween = function () {
            //var scaleTween = this.game.add.tween(this.scale).to({ x: this.scale.x * -1, y: 1 }, 300, Phaser.Easing.Linear.None, true, 0, true, true);
        };
        Collectable.prototype.update = function () {
        };
        return Collectable;
    }(Phaser.Sprite));
    BaseGame.Collectable = Collectable;
})(BaseGame || (BaseGame = {}));
/// <reference path="./libs/phaser.d.ts" />
var BaseGame;
(function (BaseGame) {
    var CollideBlock = (function (_super) {
        __extends(CollideBlock, _super);
        function CollideBlock(game, x, y) {
            var _this = _super.call(this, game, x, y, 'bigBlock', 0) || this;
            //this.anchor.setTo(0.5);
            // this.typeCollide = CollideSpr.SPIKE;
            game.add.existing(_this);
            //  Enable Arcade Physics for the sprite
            game.physics.p2.enable(_this); //, Phaser.Physics.ARCADE
            //game.physics.enable(this);
            _this.outOfBoundsKill = false;
            // this.body.checkCollision.up = true;
            // this.body.checkCollision.down = true;
            _this.resetValues();
            //  Make static
            _this.body.static = true;
            return _this;
        }
        CollideBlock.prototype.resetValues = function () {
            this.collectedStarted = false;
            this.revive();
            this.scale.set(1, 1);
            this.body.allowGravity = false;
            this.body.moves = false;
            this.body.immovable = true;
            this.body.setZeroVelocity();
            /*  this.body.velocity.setTo(0, 0);
              */
            //this.body.
            //  console.log('reset time ' + this.game.time.now);
        };
        CollideBlock.prototype.resize = function () {
            // console.log("resize x " + this.x + ". Y " + this.y + ". scaleX " + this.scale.x);
        };
        CollideBlock.prototype.getHit = function () {
            if (this.typeName == BaseGame.CollideHitSpr.SPIKE) {
                Constants.MAIN_STATE.loseLife();
            }
        };
        CollideBlock.prototype.update = function () {
        };
        return CollideBlock;
    }(Phaser.Sprite));
    BaseGame.CollideBlock = CollideBlock;
})(BaseGame || (BaseGame = {}));
/// <reference path="./libs/phaser.d.ts" />
var BaseGame;
(function (BaseGame) {
    var CollideSpikes = (function (_super) {
        __extends(CollideSpikes, _super);
        function CollideSpikes(game, x, y) {
            var _this = _super.call(this, game, x, y, 'doubleSpikes', 0) || this;
            //this.anchor.setTo(0.5);
            // this.typeCollide = CollideSpr.SPIKE;
            game.add.existing(_this);
            //  Enable Arcade Physics for the sprite
            game.physics.p2.enable(_this); //, Phaser.Physics.P2JS
            //game.physics.enable(this);
            _this.outOfBoundsKill = false;
            /* this.body.checkCollision.up = true;
             this.body.checkCollision.down = true;*/
            //  Make static
            _this.body.static = true;
            _this.origPos = new Phaser.Point();
            _this.resetValues();
            return _this;
        }
        CollideSpikes.prototype.resetPos = function () {
            this.x = this.origPos.x;
            this.y = this.origPos.y;
        };
        CollideSpikes.prototype.resetValues = function () {
            this.body.setZeroVelocity();
            this.collectedStarted = false;
            this.revive();
            this.scale.set(1, 1);
            //this.body.kinematic = true;
            /* this.body.velocity.setTo(0, 0);
             this.body.allowGravity = false;
             this.body.moves = false;
             this.body.immovable = true;*/
            //this.body.
            //  console.log('reset time ' + this.game.time.now);
        };
        CollideSpikes.prototype.resize = function () {
            // console.log("resize x " + this.x + ". Y " + this.y + ". scaleX " + this.scale.x);
        };
        CollideSpikes.prototype.getHit = function () {
            if (this.typeName == BaseGame.CollideHitSpr.SPIKE) {
                Constants.MAIN_STATE.loseLife();
            }
        };
        CollideSpikes.prototype.update = function () {
        };
        return CollideSpikes;
    }(Phaser.Sprite));
    CollideSpikes.SPIKE = 'heart';
    CollideSpikes.PLATFORM = 'pumpkins';
    BaseGame.CollideSpikes = CollideSpikes;
})(BaseGame || (BaseGame = {}));
/// <reference path="./libs/phaser.d.ts" />
var BaseGame;
(function (BaseGame) {
    var CollideHitSpr = (function (_super) {
        __extends(CollideHitSpr, _super);
        function CollideHitSpr(game, x, y) {
            var _this = _super.call(this, game, x, y, 'tile', 0) || this;
            _this.anchor.setTo(0.5);
            // this.typeCollide = CollideSpr.SPIKE;
            game.add.existing(_this);
            //  Enable Arcade Physics for the sprite
            game.physics.p2.enable(_this); //, Phaser.Physics.ARCADE
            //game.physics.enable(this);
            _this.outOfBoundsKill = false;
            /* this.body.checkCollision.up = true;
             this.body.checkCollision.down = true;*/
            _this.resetValues();
            _this.origPos = new Phaser.Point();
            //  Make static
            _this.body.static = true;
            return _this;
        }
        CollideHitSpr.prototype.rememberPos = function () {
            var _x = this.x;
            var _y = this.y;
            this.origPos.x = _x;
            this.origPos.y = _y;
        };
        CollideHitSpr.prototype.resetPos = function () {
            this.x = this.origPos.x;
            this.y = this.origPos.y;
        };
        CollideHitSpr.prototype.resetValues = function () {
            this.isActivated = false;
            this.isSet = true;
            this.collectedStarted = false;
            this.revive();
            this.pivot.set(0, 0);
            this.scale.set(1, 1);
            this.body.setZeroVelocity();
            this.body.allowGravity = false;
            this.body.moves = false;
            /*  this.body.velocity.setTo(0, 0);
            
              this.body.rotation = 0;
              this.angle = 0;
              this.rotation = 0;
              this.body.immovable = true;
              this.body.maxVelocity.y = 0;
              this.body.acceleration.y = 0;
              this.body.velocity.y = 0; */
            //this.body.
            //  console.log('reset time ' + this.game.time.now);
        };
        CollideHitSpr.prototype.fall = function () {
            /*
            this.body.moves = true;
            this.body.immovable = false;
            this.isSet = false;
            this.body.maxVelocity.y = 1150;
            this.body.acceleration.y = 1350; */
        };
        CollideHitSpr.prototype.resize = function () {
            // console.log("resize x " + this.x + ". Y " + this.y + ". scaleX " + this.scale.x);
        };
        CollideHitSpr.prototype.getHit = function () {
            if (this.typeName == CollideHitSpr.SPIKE) {
                Constants.MAIN_STATE.loseLife();
            }
        };
        CollideHitSpr.prototype.rotateFront = function () {
            if (Constants.MAIN_STATE.curLvlCntrl.platform2.angle <= 180 && (Constants.MAIN_STATE.curLvlCntrl.platform2.angle > 0 || Constants.MAIN_STATE.curLvlCntrl.platform2.angle <= -160))
                Constants.MAIN_STATE.curLvlCntrl.platform2.angle -= 2.7;
        };
        CollideHitSpr.prototype.rotateBack = function () {
            // console.log('no ovrlp in plarform Angle' + Constants.MAIN_STATE.platform2.angle);
            if (Constants.MAIN_STATE.curLvlCntrl.platform2.angle < 180 && (Constants.MAIN_STATE.curLvlCntrl.platform2.angle >= 0 || Constants.MAIN_STATE.curLvlCntrl.platform2.angle > -5))
                Constants.MAIN_STATE.curLvlCntrl.platform2.angle += 1.8;
        };
        CollideHitSpr.prototype.update = function () {
            if (this.isActivated && this == Constants.MAIN_STATE.curLvlCntrl.platform1 && Constants.MAIN_STATE.curLvl == 2) {
                if (Constants.MAIN_STATE.player.spr.x + this.width * 0.3 > this.x + this.width) {
                    Constants.MAIN_STATE.player.overlappingPlatform = false;
                }
                if (Constants.MAIN_STATE.player.overlappingPlatform) {
                    this.rotateFront();
                }
                else {
                    this.rotateBack();
                }
                if (this.overlap(Constants.MAIN_STATE.player.spr)) {
                }
                else {
                }
            }
        };
        return CollideHitSpr;
    }(Phaser.Sprite));
    CollideHitSpr.SPIKE = 'heart';
    CollideHitSpr.PLATFORM = 'pumpkins';
    BaseGame.CollideHitSpr = CollideHitSpr;
})(BaseGame || (BaseGame = {}));
/// <reference path="./libs/phaser.d.ts" />
/// <reference path="CollideHitSpr.ts" />
/// <reference path="CollideBlock.ts" />
/// <reference path="CollideSpikes.ts" />
var BaseGame;
(function (BaseGame) {
    var LevelBase = (function () {
        function LevelBase(game, state) {
            this.trapsActivated = 0;
            this.didVisit2Platform = false;
            this.bigBlockMoved = false;
            this.game = game;
            this.state = state;
        }
        LevelBase.prototype.create = function () {
        };
        LevelBase.prototype.init = function () {
        };
        LevelBase.prototype.addGroupsToState = function () {
        };
        LevelBase.prototype.resetLvl = function () {
        };
        LevelBase.prototype.destroyLvl = function () {
            this.spikesGroup.forEach(function (item) {
                item.visible = false;
                item.destroy();
            }, this, false);
            this.hiddenSpikesGroup.forEach(function (item) {
                item.visible = false;
                item.destroy();
            }, this, false);
            this.platformSpikesGroup.forEach(function (item) {
                item.visible = false;
                item.destroy();
            }, this, false);
            this.exitGr.forEach(function (item) {
                item.destroy();
            }, this, false);
            //this.spikesOnPlatform = null;
            this.spikesGroup.removeAll(true);
            this.platformGroup.removeAll(true);
            this.platformSpikesGroup.removeAll(true);
            this.hiddenSpikesGroup.removeAll(true);
            console.log("length this.platformGroup" + this.platformGroup.length);
            this.platformGroup.forEach(function (item) {
                item.visible = false;
                item.destroy();
            }, this, false);
            this.bigBlock.destroy();
        };
        LevelBase.prototype.trapsControl = function () {
        };
        LevelBase.prototype.resize = function () {
            /*this.bigBlock.body.height = this.bigBlock.height * this.state.scaleGroup.scale.y;
            this.bigBlock.body.width = this.bigBlock.width * this.state.scaleGroup.scale.x;
              this.bigBlock.body.updateBounds();
            
            // this.bigBlock.anchor.setTo(0.5);
            // this.player.scale.set(ScaleControl.scaleXUse, ScaleControl.scaleYUse);
          
            if (this.endZone != null) {
                this.endZone.body.height = this.endZone.height * this.state.scaleGroup.scale.y;
                this.endZone.body.width = this.endZone.width * this.state.scaleGroup.scale.x;
                this.endZone.body.updateBounds();
            }
            if (this.startZone != null) {
                this.startZone.body.height = this.startZone.height * this.state.scaleGroup.scale.y;
                this.startZone.body.width = this.startZone.width * this.state.scaleGroup.scale.x;
                this.startZone.body.updateBounds();
            }

            this.platformGroup.forEach((item) => {
                //item.scale.set(ScaleControl.scaleXUse, ScaleControl.scaleYUse);
                item.body.height = item.height * this.state.scaleGroup.scale.y;
                item.body.width = item.width * this.state.scaleGroup.scale.x;
                item.body.updateBounds();
            }, this, false);
            */
        };
        LevelBase.prototype.update = function () {
        };
        return LevelBase;
    }());
    BaseGame.LevelBase = LevelBase;
})(BaseGame || (BaseGame = {}));
/// <reference path="./libs/phaser.d.ts" />
/// <reference path="LevelBase.ts" />
var BaseGame;
(function (BaseGame) {
    var Level0 = (function (_super) {
        __extends(Level0, _super);
        function Level0(game, state) {
            var _this = _super.call(this, game, state) || this;
            _this.create();
            _this.addGroupsToState();
            return _this;
        }
        Level0.prototype.create = function () {
            this.platformGroup = this.game.add.group();
            this.spikesGroup = this.game.add.group();
            this.bigBlockGr = this.game.add.group();
            this.hiddenSpikesGroup = this.game.add.group();
            this.platformSpikesGroup = this.game.add.group();
            this.exitGr = this.game.add.group();
        };
        Level0.prototype.addGroupsToState = function () {
            this.state.scaleGroup.add(this.platformGroup);
            this.state.scaleGroup.add(this.spikesGroup);
            this.state.scaleGroup.add(this.bigBlockGr);
            //this.bigBlockGr.visible = false;
            this.state.scaleGroup.add(this.hiddenSpikesGroup);
            this.state.scaleGroup.add(this.platformSpikesGroup);
            this.state.scaleGroup.add(this.exitGr);
        };
        Level0.prototype.init = function () {
            var spikesGID = 3;
            var platformGID = 4;
            var exitGID = 6;
            var bigBlockGID = 5;
            this.spikesHidden = this.hiddenSpikesGroup.getFirstAlive();
            this.spikesHidden.origPos.x = this.spikesHidden.x;
            this.spikesHidden.origPos.y = this.spikesHidden.y;
            this.spikesOnPlatform = this.platformSpikesGroup.getFirstAlive();
            this.spikesOnPlatform.origPos.x = this.spikesOnPlatform.x;
            this.spikesOnPlatform.origPos.y = this.spikesOnPlatform.y;
            for (var _i = 0; _i < this.platformGroup.length; _i++) {
                var platform = this.platformGroup.getAt(_i);
                if (_i == 0) {
                    this.platform1 = platform;
                    this.platform1.addChild(this.spikesOnPlatform);
                    this.spikesOnPlatform.x = -this.spikesOnPlatform.width * 0.5;
                    this.spikesOnPlatform.y = -this.spikesOnPlatform.height * 1.5;
                }
                else if (_i == 1) {
                    this.platform2 = platform;
                }
                else if (_i == 2) {
                    this.platform3 = platform;
                }
                platform.rememberPos();
            }
            var zoneGr = this.game.add.group();
            this.state.map.createFromObjects('ovrlpZone', 4, 'tileEmpt', 0, true, false, zoneGr, Phaser.Sprite);
            for (var _i = 0; _i < zoneGr.length; _i++) {
                var zone = zoneGr.getAt(_i);
                if (_i == 0) {
                    this.endZone = zone;
                }
                else if (_i == 1) {
                    this.startZone = zone;
                }
                this.game.physics.enable(zoneGr);
            }
            this.state.scaleGroup.add(this.endZone);
            this.state.scaleGroup.add(this.startZone);
            this.bigBlock = this.bigBlockGr.getFirstAlive();
            this.originalBigBlockPos = new Phaser.Point();
            this.originalBigBlockPos.x = this.bigBlock.x;
            this.originalBigBlockPos.y = this.bigBlock.y;
            this.bigBlock.scale.set(1, 1);
            this.bigBlock.anchor.set(0, 0);
            this.bigBlock.rotation = 0;
            this.changeVisibleHiddenSpikes(false);
            this.changeVisiblePlarformSpikes(false);
            this.game.physics.enable(this.platformGroup);
            this.game.physics.enable(this.bigBlockGr);
            this.state.scaleGroup.add(this.platformGroup);
        };
        Level0.prototype.resetLvl = function () {
            if (this.thirdStepTimer != null) {
                this.thirdStepTimer.stop();
                this.thirdStepTimer = null;
            }
            this.bigBlockMoved = false;
            this.bigBlock.x = this.originalBigBlockPos.x;
            this.bigBlock.y = this.originalBigBlockPos.y;
            /* this.bigBlock.loadTexture("sideBlock");
             this.bigBlock.scale.set(1, 1);
             this.bigBlock.anchor.set(0, 1);*/
            this.bigBlock.rotation = 0;
            this.bigBlock.body.velocity.y = 0;
            if (this.spikesOnPlatform != null && this.spikesOnPlatform.body != null)
                this.spikesOnPlatform.body.velocity.y = 0;
            if (this.spikesHidden != null && this.spikesHidden.body != null) {
                this.spikesHidden.body.velocity.y = 0;
                this.spikesHidden.resetPos();
            }
            this.changeVisibleHiddenSpikes(false);
            this.changeVisiblePlarformSpikes(false);
            this.platformGroup.forEach(function (item) {
                //item.scale.set(ScaleControl.scaleXUse, ScaleControl.scaleYUse);
                item.resetPos();
                item.resetValues();
            }, this, false);
        };
        Level0.prototype.destroyLvl = function () {
            _super.prototype.destroyLvl.call(this);
            this.startZone.destroy();
            this.endZone.destroy();
        };
        Level0.prototype.hiddenSpikesFollowPlayer = function () {
            if (this.spikesHidden != null) {
                if ((this.state.player.spr.x > this.endZone.x + this.endZone.width - 30) && (this.state.player.spr.x < this.game.width * 0.91))
                    this.spikesHidden.x = this.state.player.spr.x;
            }
        };
        Level0.prototype.changeVisiblePlarformSpikes = function (on) {
            if (this.spikesOnPlatform != null)
                this.spikesOnPlatform.visible = on;
        };
        Level0.prototype.changeVisibleHiddenSpikes = function (on) {
            this.hiddenSpikesGroup.forEach(function (item) {
                item.visible = on;
            }, this, false);
        };
        Level0.prototype.bigBlockFall = function () {
            var block = this.bigBlockGr.getFirstAlive();
            block.body.moves = true;
            block.body.velocity.y = 700;
        };
        Level0.prototype.resetPlatfromTween = function () {
            if (typeof this.platform2 !== 'undefined' && typeof this.platform2.tween !== 'undefined' && this.platform2.tween != null)
                this.platform2.tween = null;
        };
        Level0.prototype.launch1PlatformTo2 = function () {
            if (!this.platform1.isSet)
                return;
            //this.game.physics.arcade.accelerateToObject(this.platform3, this.platform2, 200);
            this.platform1.isSet = false;
            // this.platform1.rotation = this.game.physics.arcade.angleBetween(this.platform1, this.platform2);
            this.platform1.body.moves = true;
            this.platform1.body.immovable = false;
            this.platform1.body.velocity.y = -300;
            this.platform1.body.velocity.x = -300;
            this.platform1.body.allowGravity = true;
            this.platform1.body.maxVelocity.y = 1500;
            this.platform1.body.acceleration.y = 1500;
            // var scaleTween = this.game.add.tween(this.platform1).to({x: this.platform2.x, y:this.platform2.y }, 300, Phaser.Easing.Linear.None, true, 500);
            //var scaleTween = this.game.add.tween(this.platform1.scale).to({x: 1.05 }, 500, Phaser.Easing.Linear.None, true, 200);
            var resetTimer = this.game.time.create(true);
            //  Set a TimerEvent to occur after 2 seconds
            resetTimer.repeat(700, 1, function () { this.platform2.fall(); this.launch1PlatformTo3(); }, this);
            //  Start the timer running - this is important!
            //  It won't start automatically, allowing you to hook it to button events and the like.
            resetTimer.start();
            // scaleTween.onComplete.add(function () { this.platform2.fall(); this.launch1PlatformTo3(); }, this);
        };
        Level0.prototype.launch1PlatformTo3 = function () {
            //this.game.physics.arcade.accelerateToObject(this.platform3, this.platform2, 200);
            this.platform1.body.moves = true;
            this.platform1.body.immovable = false;
            this.platform1.body.velocity.y = -300;
            this.platform1.body.velocity.x = -300;
            this.platform1.body.allowGravity = true;
            this.platform1.body.maxVelocity.y = 1500;
            this.platform1.body.acceleration.y = 1500;
            // var scaleTween = this.game.add.tween(this.platform1).to({x: this.platform2.x, y:this.platform2.y }, 300, Phaser.Easing.Linear.None, true, 500);
            //var scaleTween = this.game.add.tween(this.platform1.scale).to({x: 1.05 }, 500, Phaser.Easing.Linear.None, true, 200);
            this.thirdStepTimer = this.game.time.create(true);
            //  Set a TimerEvent to occur after 2 seconds
            this.thirdStepTimer.repeat(700, 1, function () { this.platform3.fall(); }, this);
            //  Start the timer running - this is important!
            //  It won't start automatically, allowing you to hook it to button events and the like.
            this.thirdStepTimer.start();
            // this.thirdTween = this.game.add.tween(this.platform1).to({ x: this.platform3.x, y: this.platform3.y }, 300, Phaser.Easing.Linear.None, true, 500);
            //  this.thirdTween.onComplete.add(function () { this.platform3.fall(); }, this);
        };
        Level0.prototype.trapsControl = function () {
            if (this.state.player.spr.body.x > this.endZone.body.x - 30) {
                this.changeVisibleHiddenSpikes(true);
            }
            if (this.didVisit2Platform && this.state.player.spr.body.x < this.startZone.body.x && this.state.player.spr.body.y < this.endZone.body.y + 500) {
                this.bigBlockFall();
            }
            if ((this.state.player.spr.body.x > this.platform1.body.x && this.state.player.spr.body.x < this.platform1.body.x + this.platform1.body.width)) {
                this.changeVisiblePlarformSpikes(true);
            }
            if (this.spikesHidden.visible) {
                if (this.state.player.spr.body.x > this.endZone.body.x - 30) {
                    this.hiddenSpikesFollowPlayer();
                }
            }
        };
        Level0.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        Level0.prototype.update = function () {
            // this.trapsControl();
        };
        return Level0;
    }(BaseGame.LevelBase));
    BaseGame.Level0 = Level0;
})(BaseGame || (BaseGame = {}));
/// <reference path="./libs/phaser.d.ts" />
/// <reference path="Level0.ts" />
var BaseGame;
(function (BaseGame) {
    var PlayerCtrl = (function (_super) {
        __extends(PlayerCtrl, _super);
        function PlayerCtrl(game) {
            var _this = _super.call(this, game) || this;
            _this.game = game;
            _this.hasCrown = false;
            // this.body.collideWorldBounds = true;
            //this.body.acceleration.y = 700;
            //game.add.existing(this);
            /* this.body.checkCollision.up = true;
             this.body.checkCollision.down = true;
             this.body.setSize(19, 35, 20, 0);
             this.renewUsualPhysics();*/
            _this.setNoMoveTimer();
            _this.needFramesPass = 0;
            _this.lastCoords = new Phaser.Point();
            _this.sentSpeedZero = false;
            _this.lastSentPt = new Phaser.Point();
            _this.lastSentPt.x = -999;
            _this.lastSentPt.y = -999;
            _this.counter = 0;
            _this.score = 0;
            _this.damage = 10;
            _this.killScore = 0;
            _this.decreaseSideSpeed = 1.5;
            _this.btnsHeld = false;
            _this.direction = 1;
            _this.moveValue = 320;
            _this.isShowingDeathAnim = false;
            _this.killerNameID = '';
            _this.savedSkin = 'default';
            _this.animatedSprType = '';
            return _this;
            /*
            this.fillDarkSpr = this.game.add.graphics(0, 0);
            // set a fill and line style
            this.fillDarkSpr.beginFill(0x00aaff);
            this.fillDarkSpr.drawCircle(0, 0, 4);
            this.fillDarkSpr.endFill();*/
        }
        PlayerCtrl.prototype.makeSprsForAttack = function () {
            this.swordSpr = this.game.add.sprite(0, 0, 'sword', 0);
            // ship.smoothed = false;
            this.swordSpr.anchor.setTo(0.1, 0.5);
            this.swordSpr.rotation = 0;
            this.hitLineOuterSpr = this.game.add.sprite(0, 0, 'hitLineOuter', 0);
            // ship.smoothed = false;
            this.hitLineOuterSpr.anchor.setTo(0.5);
            this.hitLineOuterSpr.rotation = 0;
            this.swordSpr.visible = this.hitLineOuterSpr.visible = false;
            this.add(this.hitLineOuterSpr);
            this.add(this.swordSpr);
        };
        PlayerCtrl.prototype.makeAnimatedSpr = function (type) {
            console.log('make animated spr ' + type);
            if (this.animatedSpr != null) {
                this.animatedSpr.loadTexture(type);
                this.animatedSpr.visible = true;
            }
            else {
                this.animatedSpr = this.game.add.sprite(0, 0, type, 0);
            }
            // ship.smoothed = false;
            this.animatedSpr.anchor.setTo(0.6, 0.6);
            this.animatedSpr.rotation = 0;
            this.animatedSprType = type;
            if (type == 'rainbow')
                this.animatedSpr.animations.add('go', [0, 1, 2, 3, 4, 5, 6], 7, true);
            else if (type == 'burn')
                this.animatedSpr.animations.add('go', [0, 1, 2, 3, 4], 7, true);
            this.animatedSpr.play('go');
            this.add(this.animatedSpr);
            this.updateBarAndText();
        };
        PlayerCtrl.prototype.checkIfCanJump = function () {
            var yAxis = p2.vec2.fromValues(0, 1);
            var result = false;
            for (var i = 0; i < this.game.physics.p2.world.narrowphase.contactEquations.length; i++) {
                var c = this.game.physics.p2.world.narrowphase.contactEquations[i];
                if (c.bodyA === this.spr.body.data || c.bodyB === this.spr.body.data) {
                    var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
                    if (c.bodyA === this.spr.body.data)
                        d *= -1;
                    if (d > 0.5)
                        result = true;
                }
            }
            return result;
        };
        PlayerCtrl.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            if (typeof this.spr !== 'undefined')
                this.spr.destroy();
            if (typeof this.barSpr !== 'undefined')
                this.barSpr.destroy();
            if (typeof this.nameTextSpr !== 'undefined')
                this.nameTextSpr.destroy();
        };
        PlayerCtrl.prototype.stop = function () {
            /* this.body.acceleration.y = this.body.velocity.y = 0;
             this.body.acceleration.x = this.body.velocity.x = 0;*/
        };
        PlayerCtrl.prototype.renewUsualPhysics = function () {
            if ((typeof this.spr != 'undefined' && this.spr != null) && (typeof this.spr.body != 'undefined' && this.spr.body != null)) {
                this.spr.physicsEnabled = true;
                this.spr.body.fixedRotation = true;
                this.spr.body.rotation = 0;
                this.spr.rotation = 0;
            }
            /*
            this.body.checkCollision.down = this.body.checkCollision.up = this.body.checkCollision.right = this.body.checkCollision.left = true;
            this.rotation = 0;
            this.body.maxVelocity.y = 850; //* ScaleControl.scaleYUse;
            this.body.acceleration.y = 1050; //* ScaleControl.scaleYUse;
            */
        };
        PlayerCtrl.prototype.addSprs = function (spr, bar, text) {
            this.add(spr);
            this.makeSprsForAttack();
            this.add(bar);
            this.add(text);
            this.spr = spr;
            this.barSpr = bar;
            this.nameTextSpr = text;
            // this.add(this.fillDarkSpr);
            //this.spr.body.checkCollision.down = this.spr.body.checkCollision.up = this.spr.body.checkCollision.right = this.spr.body.checkCollision.left = true;
            this.barSpr.setXY(spr.x, spr.y - 20);
        };
        PlayerCtrl.prototype.flySideTween = function () {
            this.stop();
            this.isDead = true;
            console.log("fly side");
            this.fall();
            //this.firstSet = false;
            // this.body.acceleration.y = 200;
            var scaleTween = this.game.add.tween(this).to({ rotation: -10, y: this.spr.y - 100, x: this.spr.x - 100 }, 400, Phaser.Easing.Linear.None, true, 0);
            scaleTween.onComplete.add(function () { console.log("ended scale"); Constants.MAIN_STATE.resetPlayerPos(); this.stop(); this.renewUsualPhysics(); this.firstSet = false; }, this);
        };
        PlayerCtrl.prototype.moveLeft = function () {
            if (this.game.time.now > this.noMoveSideTimer && typeof Constants.MAIN_STATE.player != 'undefined' && typeof Constants.MAIN_STATE.player.spr.body != 'undefined' && typeof Constants.MAIN_STATE != 'undefined') {
                Constants.MAIN_STATE.player.spr.body.moveLeft(this.moveValue);
                //Constants.MAIN_STATE.player.spr.body.rotat
                //this.spr.body.
                //Constants.MAIN_STATE.player.spr.body.velocity.x = -240;
                Constants.MAIN_STATE.player.renewUsualPhysics();
                Constants.MAIN_STATE.player.spr.animations.play('walk');
                if (Constants.MAIN_STATE.player.spr.scale.x > 0) {
                    Constants.MAIN_STATE.player.spr.scale.x = -1;
                    Constants.MAIN_STATE.player.direction = -1;
                }
            }
            else {
                console.log('smth wrong while going left');
            }
        };
        PlayerCtrl.prototype.moveRight = function () {
            if (this.game.time.now > this.noMoveSideTimer && typeof Constants.MAIN_STATE.player != 'undefined' && typeof Constants.MAIN_STATE.player.spr.body != 'undefined'
                && typeof Constants.MAIN_STATE != 'undefined') {
                Constants.MAIN_STATE.player.spr.body.moveRight(this.moveValue);
                //Constants.MAIN_STATE.player.spr.body.velocity.x = 240;
                Constants.MAIN_STATE.player.renewUsualPhysics();
                Constants.MAIN_STATE.player.spr.animations.play('walk');
                if (Constants.MAIN_STATE.player.spr.scale.x < 0) {
                    Constants.MAIN_STATE.player.spr.scale.x = 1;
                    Constants.MAIN_STATE.player.direction = 1;
                }
            }
            else {
            }
        };
        PlayerCtrl.prototype.jump = function () {
            if (this.spr.body != 'undefined' && this.checkIfCanJump() /*Constants.MAIN_STATE.player.body.velocity.y == 0*/
                && typeof Constants.MAIN_STATE != 'undefined' && this.game.time.now > Constants.MAIN_STATE.jumpTimer) {
                if (Constants.MUSIC_ON)
                    Constants.MAIN_STATE.jumpSnd.play();
                Constants.MAIN_STATE.player.spr.body.velocity.y = -480; // * ScaleControl.scaleYUse;
                Constants.MAIN_STATE.player.renewUsualPhysics();
                Constants.MAIN_STATE.jumpTimer = Constants.MAIN_STATE.player.game.time.now + 750;
                Constants.MAIN_STATE.player.spr.animations.play('jump');
                if (this.overlappingPlatform) {
                    this.stopCurrentOverlap();
                    this.overlappingPlatform = false;
                }
                this.emitPos();
            }
        };
        PlayerCtrl.prototype.setNoMoveTimer = function () {
            this.noMoveSideTimer = this.game.time.now + 550;
        };
        PlayerCtrl.prototype.stopCurrentOverlap = function () {
            if (Constants.MAIN_STATE.curLvl == 2) {
            }
        };
        PlayerCtrl.prototype.fall = function () {
            //this.spr.body.x = this.game.world.width * 0.3;//* ScaleControl.scaleXUse;
            //this.spr.body.y = this.game.world.height - 200;//* ScaleControl.scaleYUse;
            this.spr.animations.frame = 0;
            this.spr.body.velocity.y = 200;
            this.spr.body.velocity.x = 0;
            this.setNoMoveTimer();
            this.stopMove();
        };
        PlayerCtrl.prototype.emitPos = function () {
            var direction = 1; //1 - is right, -1 is left 
            if (this.spr.scale.x < 0) {
                direction = -1;
            }
            //Send a new position data to the server 
            // (<any>window).game.socket.emit('move player', { x: this.spr.x, y: this.spr.y, direction: direction, angle: this.spr.angle });
        };
        PlayerCtrl.prototype.stopMove = function () {
            this.spr.body.velocity.x = 0;
            // console.log('stop x');
        };
        PlayerCtrl.prototype.controlMove = function () {
            this.stopMove(); //comment for gradual
            if (this.isShowingDeathAnim)
                return;
            if (this.holdRight) {
                // console.log('hold right');
                this.moveRight();
                this.btnsHeld = true;
            }
            else if (this.holdLeft) {
                //console.log('hold Left');
                this.moveLeft();
                this.btnsHeld = true;
            }
            else {
                this.btnsHeld = false;
            }
            if (this.holdUp) {
                //console.log('hold up');
                this.jump();
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
                Constants.MAIN_STATE.tryAttack();
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP) || this.game.input.keyboard.isDown(Phaser.Keyboard.W) || this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                //this.holdUp = true;
                this.jump();
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
                this.moveLeft();
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
                this.moveRight();
            }
            else {
                this.gradualStopX();
                if (!this.holdRight && !this.holdLeft && !this.holdUp) {
                    if (this.spr.body.velocity.y < 0 && !this.checkIfCanJump()) {
                        this.spr.animations.frame = 4;
                    }
                    else
                        this.spr.animations.frame = 0;
                }
            }
            if (this.spr.body.velocity.x == 0) {
                if (!this.sentSpeedZero) {
                    this.postPosition();
                    this.sentSpeedZero = true;
                }
            }
            else {
                this.sentSpeedZero = false;
            }
        };
        PlayerCtrl.prototype.getMoved = function (speedX, speedY) {
            console.log('get moved');
            this.spr.body.velocity.x = speedX;
            this.spr.body.velocity.y = speedY;
        };
        PlayerCtrl.prototype.doPost = function () {
            this.counter = 0;
            this.lastSentPt.x = this.spr.body.x;
            this.lastSentPt.y = this.spr.body.y;
            var direction = 1; //1 - is right, -1 is left 
            if (this.spr.scale.x < 0) {
                direction = -1;
            }
            var tileSize = 45;
            var xInTiles = Math.floor(this.spr.body.x / tileSize);
            var yInTiles = Math.floor(this.spr.body.y / tileSize);
            //console.log("x in tiles " + xInTiles + "y in tiles " + yInTiles);
            // console.log('send pos X: ' + this.spr.x + "Y: " + this.spr.y);
            window.socket.emit('move', /*JSON.stringify(*/ {
                auth: Constants.MAIN_STATE.authInfo,
                coords: {
                    x: xInTiles, y: yInTiles, xabs: Math.floor(this.spr.body.x), yabs: Math.floor(this.spr.body.y)
                },
                direction: direction,
                speed: { x: this.spr.body.velocity.x }
            });
        };
        PlayerCtrl.prototype.postPosition = function () {
            // console.log('last sent X: ' + this.lastSentPt.x + "Y: " + this.lastSentPt.y);
            if (Math.abs(this.lastSentPt.x - this.spr.body.x) > 1 || Math.abs(this.lastSentPt.y - this.spr.body.y) > 1) {
                if (this.counter > this.needFramesPass && this.game.time.physicsElapsed > 0.016) {
                    this.doPost();
                }
                else {
                    this.counter++;
                }
            }
            else {
            }
        };
        PlayerCtrl.prototype.gradualStopX = function () {
            if (Math.abs(this.spr.body.velocity.x) > 10) {
                if (this.spr.body.velocity.x > 0)
                    this.spr.body.velocity.x -= this.decreaseSideSpeed;
                else
                    this.spr.body.velocity.x += this.decreaseSideSpeed;
            }
            else {
                this.spr.body.velocity.x = 0;
            }
        };
        PlayerCtrl.prototype.resetAtStart = function () {
            this.health = 10;
            console.log('reset and set hp in client');
        };
        PlayerCtrl.prototype.showDeath = function () {
            if ((typeof this.spr != 'undefined' && this.spr != null) && (typeof this.spr.body != 'undefined' && this.spr.body != null)) {
                this.health = 0;
                console.log("show death " + this.name);
                this.barSpr.updateValues(0, this.healthMax);
                this.spr.body.rotation = 0;
                var scaleTween = this.game.add.tween(this.spr.body).to({ rotation: -10, y: this.spr.body.y - 100, x: this.spr.body.x - 100 }, 400, Phaser.Easing.Linear.None, true, 0);
                scaleTween.onComplete.add(function () { this.stop(); this.renewUsualPhysics(); this.isShowingDeathAnim = false; if (this == Constants.MAIN_STATE.player) {
                    Constants.MAIN_STATE.endGame();
                }
                else {
                    this.destroy();
                } }, this);
                this.spr.physicsEnabled = false;
                this.spr.body.fixedRotation = false;
                this.isShowingDeathAnim = true;
            }
        };
        PlayerCtrl.prototype.showAttack = function () {
            if (this.isAttacking)
                return;
            if (this.game == null)
                return;
            if (Constants.MUSIC_ON) {
                Constants.MAIN_STATE.swooshSnd.play();
            }
            console.log("Attacking. Name: " + this.nameID);
            this.isAttacking = true;
            this.swordSpr.visible = this.hitLineOuterSpr.visible = true;
            this.hitLineOuterSpr.alpha = 0;
            this.swordSpr.angle = 0;
            var outerTween = this.game.add.tween(this.hitLineOuterSpr).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true, 0);
            if (this.direction == 1) {
                this.swordSpr.angle = -120;
                var swordTween = this.game.add.tween(this.swordSpr).to({ angle: 120 }, 500, Phaser.Easing.Linear.None, true, 0);
            }
            else {
                this.swordSpr.angle = 0;
                var swordTween = this.game.add.tween(this.swordSpr).to({ angle: -240 }, 500, Phaser.Easing.Linear.None, true, 0);
            }
            var scaleTween = this.game.add.tween(this.spr.scale).to({ x: this.direction * 1.02, y: 1.02 }, 300, Phaser.Easing.Linear.None, true, 0);
            scaleTween.onComplete.add(function () { this.scaleBack(); }, this); //
        };
        PlayerCtrl.prototype.showHurt = function () {
            this.spr.alpha = 0;
            var scaleTween = this.game.add.tween(this.spr).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true, 0, 5, true);
            scaleTween.onComplete.add(function () { this.spr.alpha = 1; }, this);
        };
        PlayerCtrl.prototype.scaleBack = function () {
            if (this.game == null)
                return;
            var scaleTween = this.game.add.tween(this.spr.scale).to({ x: this.direction * 1, y: 1 }, 300, Phaser.Easing.Linear.None, true, 0);
            var outerTween = this.game.add.tween(this.hitLineOuterSpr).to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true, 200);
            scaleTween.onComplete.add(function () { this.swordSpr.visible = false; this.isAttacking = false; }, this);
        };
        PlayerCtrl.prototype.updateBarAndText = function () {
            if (typeof this.spr == 'undefined' || this.spr == null || typeof this.spr.body == 'undefined' || this.spr.body == null
                || typeof this.barSpr == 'undefined' || typeof this.nameTextSpr == 'undefined') {
                //console.log("can't update bar due to undefined. Name: " + this.nameID);
                return;
            }
            /*
            this.fillDarkSpr.x = this.spr.body.x;
            this.fillDarkSpr.y = this.spr.body.y;
            */
            this.barSpr.setXY(this.spr.body.x - this.barSpr.width * 0.5, this.spr.body.y - this.spr.height);
            this.nameTextSpr.x = this.spr.body.x;
            this.nameTextSpr.y = this.spr.body.y - this.spr.height - 30;
            if (this.hasCrown) {
                Constants.MAIN_STATE.crownSpr.x = this.spr.body.x;
                Constants.MAIN_STATE.crownSpr.y = this.spr.body.y - this.spr.height - 50;
            }
            this.nameTextSpr.text = '' + this.nameID; //+ "|" + this.score;
            this.barSpr.updateValues(this.health, this.healthMax);
            if (typeof this.appearText !== 'undefined' && this.appearText != null) {
                this.appearText.x = this.spr.body.x;
                this.appearText.y = this.spr.body.y - this.spr.height - 90;
            }
            if (typeof this.animatedSpr !== 'undefined' && this.animatedSpr != null && this.animatedSpr.visible) {
                switch (this.animatedSprType) {
                    case 'rainbow':
                        this.animatedSpr.y = this.spr.body.y - this.spr.height * 0.5 + 18;
                        if (this.direction == 1)
                            this.animatedSpr.x = this.spr.body.x;
                        else {
                            this.animatedSpr.x = this.spr.body.x;
                        }
                        break;
                    case 'burn':
                        this.animatedSpr.y = this.spr.body.y - this.spr.height * 0.5 + 12;
                        if (this.direction == 1)
                            this.animatedSpr.x = this.spr.body.x + 7;
                        else {
                            this.animatedSpr.x = this.spr.body.x - 7;
                        }
                        break;
                }
                this.animatedSpr.scale.set(this.spr.scale.x, 1);
                this.animatedSpr.alpha = this.spr.alpha;
            }
            if (this.swordSpr.visible) {
                if (this.direction == 1)
                    this.swordSpr.x = this.spr.body.x + 20;
                else {
                    this.swordSpr.x = this.spr.body.x - 20;
                }
                this.swordSpr.y = this.spr.body.y - this.spr.height * 0.5 + 20;
                this.hitLineOuterSpr.x = this.spr.body.x;
                this.hitLineOuterSpr.y = this.spr.body.y;
            }
        };
        PlayerCtrl.prototype.preUpdate = function () {
            _super.prototype.preUpdate.call(this);
            this.updateBarAndText();
        };
        PlayerCtrl.prototype.postUpdate = function () {
            _super.prototype.postUpdate.call(this);
            this.updateBarAndText();
        };
        PlayerCtrl.prototype.update = function () {
            /*
            if (this.body.y > Constants.GAME_HEIGHT * ScaleControl.scaleYUse * 0.3)
            {
                if (this.body.onFloor() || this.body.y > Constants.GAME_HEIGHT * ScaleControl.scaleYUse * 0.6)
                this.firstSet = true;
            }
*/
            var _this = this;
            _super.prototype.update.call(this);
            if (typeof this.spr == 'undefined' || this.spr == null || typeof this.spr.body == 'undefined' || this.spr.body == null) {
                return;
            }
            if (this.spr.x < 0) {
                this.spr.x = 0;
            }
            this.updateBarAndText();
            //typeof myVar != 'undefined'
            if (typeof Constants.MAIN_STATE != 'undefined' && typeof Constants.MAIN_STATE.curLvlCntrl != 'undefined') {
                if (Constants.MAIN_STATE.loseScreenSpr.visible) {
                    return;
                }
                if (this == Constants.MAIN_STATE.player) {
                    if (typeof Constants.MAIN_STATE.curLvlCntrl.spikesGroup != 'undefined') {
                        Constants.MAIN_STATE.curLvlCntrl.spikesGroup.forEach(function (item) {
                            // if (this.spr.overlap(item)) {
                            if (Utils.overlapsRects(_this.spr.body.x, _this.spr.body.y, _this.spr.width * _this.spr.scale.x, _this.spr.height * _this.spr.scale.y, item.x, item.y, item.width * item.scale.x, item.height * item.scale.y, 2)) {
                                Constants.MAIN_STATE.loseLife();
                            }
                        }, this, false);
                    }
                    if (typeof Constants.MAIN_STATE.coinGroup != 'undefined') {
                        Constants.MAIN_STATE.coinGroup.forEach(function (item) {
                            if (Utils.overlapsRects(_this.spr.body.x, _this.spr.body.y, _this.spr.width * _this.spr.scale.x, _this.spr.height * _this.spr.scale.y, item.x, item.y, item.width * item.scale.x, item.height * item.scale.y)
                                && !_this.isShowingDeathAnim) {
                                if (item.visible == true) {
                                    if (Constants.MUSIC_ON) {
                                        Constants.MAIN_STATE.collectSnd.play();
                                    }
                                    item.visible = false;
                                    console.log("ovrlp coin");
                                }
                            }
                        }, this, false);
                    }
                    if (typeof Constants.MAIN_STATE.walletGroup != 'undefined') {
                        Constants.MAIN_STATE.walletGroup.forEach(function (item) {
                            if ((_this.spr.overlap(item)) && !_this.isShowingDeathAnim && _this.health > 0) {
                                if (item.visible == true) {
                                    if (Constants.MUSIC_ON) {
                                        Constants.MAIN_STATE.collectSnd.play();
                                    }
                                    item.visible = false;
                                    console.log("ovrlp wallet");
                                }
                            }
                        }, this, false);
                    }
                    if (typeof Constants.MAIN_STATE.coinGroup != 'undefined') {
                        Constants.MAIN_STATE.heartGroup.forEach(function (item) {
                            if ((Utils.overlapsRects(_this.spr.body.x, _this.spr.body.y, _this.spr.width * _this.spr.scale.x, _this.spr.height * _this.spr.scale.y, item.x, item.y, item.width * item.scale.x, item.height * item.scale.y))
                                && !_this.isShowingDeathAnim) {
                                if (item.visible == true && _this.health < _this.healthMax) {
                                    if (Constants.MUSIC_ON) {
                                        // console.log("COIN COLLECT music on? " + Constants.MUSIC_ON);
                                        Constants.MAIN_STATE.collectSnd.play(); //might be a bad idead as it just can update a lot of coins at once but I dont wanna write a client side collect function
                                    }
                                    item.visible = false;
                                    console.log("ovrlp heart");
                                }
                            }
                        }, this, false);
                    }
                }
                if (this == Constants.MAIN_STATE.player) {
                    this.controlMove();
                    /*if (this.spr.body.velocity.x != 0 || this.spr.body.velocity.y != 0)
                    {*/
                    if (Constants.MAIN_STATE.needToResetInfoFromServer == false) {
                        this.postPosition();
                    }
                }
                else {
                    //decrease velocity x - make pushes possible with auto stop
                    /* if (this.lastCoords.x == this.spr.body.x && this.lastCoords.y == this.spr.body.y)
                     {
                         this.spr.animations.frame = 0;
                     }
                     else
                     {
                         this.spr.animations.play('walk');
                     }
                     this.lastCoords.x = this.spr.body.x;
                     this.lastCoords.y = this.spr.body.y;*/
                    this.gradualStopX();
                }
            }
            else {
            }
            this.updateBarAndText();
        };
        return PlayerCtrl;
    }(Phaser.Group));
    BaseGame.PlayerCtrl = PlayerCtrl;
})(BaseGame || (BaseGame = {}));
var ScaleControl;
(function (ScaleControl) {
    function showTurn() {
        this.turnOn = true;
        // document.getElementById("turn").style.display = "block";
        // document.getElementById("turn").style.backgroundSize = window.innerWidth + 'px ' + window.innerHeight + 'px';
        // document.getElementById("turn").style.height = window.innerHeight + 'px';
    }
    ScaleControl.showTurn = showTurn;
    function renew(_game) {
        ScaleControl.scaleX = _game.width / Constants.GAME_WIDTH;
        ScaleControl.scaleY = _game.height / Constants.GAME_HEIGHT;
        ScaleControl.scaleMin = Math.min(ScaleControl.scaleX, ScaleControl.scaleY);
        /* if (_game.device.desktop) {
             ScaleControl.scaleXUse = ScaleControl.scaleMin;
             ScaleControl.scaleYUse = ScaleControl.scaleMin;
         }
         else
         {*/
        ScaleControl.scaleXUse = ScaleControl.scaleX;
        ScaleControl.scaleYUse = ScaleControl.scaleY;
        //}
        window.scaleXUse = ScaleControl.scaleXUse;
        window.scaleYUse = ScaleControl.scaleYUse;
    }
    ScaleControl.renew = renew;
    function hideTurn() {
        this.turnOn = false;
        //document.getElementById("turn").style.display = "none";
    }
    ScaleControl.hideTurn = hideTurn;
})(ScaleControl || (ScaleControl = {}));
/// <reference path="./libs/phaser.d.ts" />
/// <reference path="LevelBase.ts" />
var BaseGame;
(function (BaseGame) {
    var Level1 = (function (_super) {
        __extends(Level1, _super);
        function Level1(game, state) {
            var _this = _super.call(this, game, state) || this;
            _this.create();
            _this.addGroupsToState();
            return _this;
        }
        Level1.prototype.create = function () {
            this.platformGroup = this.game.add.group();
            this.spikesGroup = this.game.add.group();
            this.bigBlockGr = this.game.add.group();
            this.hiddenSpikesGroup = this.game.add.group();
            this.platformSpikesGroup = this.game.add.group();
            this.exitGr = this.game.add.group();
        };
        Level1.prototype.init = function () {
            console.log('call init lvl 1');
            var bigBlockGID = 7;
            var platformGID = 4;
            var exitGID = 3;
            this.spikesGroup.forEach(function (item) {
                item.destroy();
            }, this, false);
            this.spikesGroup.removeAll(true);
            this.spikesGroup.forEach(function (item) {
                console.log('there is a spike');
                item.destroy();
            }, this, false);
        };
        Level1.prototype.resetLvl = function () {
        };
        Level1.prototype.destroyLvl = function () {
            //super.destroyLvl();
            this.spikesGroup.forEach(function (item) {
                item.visible = false;
                item.destroy();
            }, this, false);
            this.spikesGroup.removeAll(true);
            this.spikesGroup.destroy();
            this.platformGroup.destroy();
            this.bigBlockGr.destroy();
            this.hiddenSpikesGroup.destroy();
            this.platformSpikesGroup.destroy();
            this.exitGr.destroy();
        };
        Level1.prototype.addGroupsToState = function () {
            this.state.scaleGroup.add(this.spikesGroup);
        };
        Level1.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        Level1.prototype.update = function () {
        };
        return Level1;
    }(BaseGame.LevelBase));
    BaseGame.Level1 = Level1;
})(BaseGame || (BaseGame = {}));
/// <reference path="./libs/phaser.d.ts" />
/// <reference path="PlayerCtrl.ts" />
/// <reference path="ScaleControl.ts" />
/// <reference path="Level1.ts" />
/// <reference path="BarSpr.ts" />
/// <reference path="Constants.ts" />
/*
import * as PlayerModule from "./Player";
import Player = PlayerModule.BaseGame.Player;
*/
var BaseGame;
(function (BaseGame) {
    var PlayState = (function (_super) {
        __extends(PlayState, _super);
        function PlayState() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.jumpTimer = 0;
            _this.livesLeft = 10;
            _this.livesMax = 1;
            _this.noHitTimer = 0;
            _this.curLvl = 0;
            _this.maxLvls = 3;
            _this.tileSize = 45;
            _this.attackAllowedTimer = 0;
            _this.lastSkin = 0;
            return _this;
        }
        PlayState.prototype.create = function () {
            this.killedKing = false;
            this.givenLoginID = '';
            this.allFps = 0;
            this.countedFrames = 0;
            this.skinNamesObj = {
                "": "simon",
                "undefined": "simon",
                "default": "simon",
                "redHat": "avaRedHat",
                "zombie": "avaZombie",
                "choo": "avaChoo",
                "bender": "avaBender",
                "panda": "avaPanda",
                "batman": "batmanAva",
                'spiderman': "spidermanAva",
                'whiteHair': "whiteHairAva",
                'mario': 'marioAva',
                'skeleton': 'skeletonAva',
                'unicorn': 'unicornAva',
                'knightBurn': 'avaBurnKnight'
            };
            Constants.MAIN_STATE = this;
            window.continueAfterDeath = function () { Constants.MAIN_STATE.continueAfterDeath(); };
            // ScaleControl.renew(this.game);
            this.physics.startSystem(Phaser.Physics.P2JS);
            this.physics.p2.restitution = 0.8;
            this.background = this.add.sprite(0, 0, 'back');
            // this.exitSpr = this.add.sprite(0, 0, 'exit');
            this.music = this.add.audio('music', 1, false);
            // this.music.play();
            // this.player = new Player(this.game, 130, 232);
            this.player = new BaseGame.PlayerCtrl(this.game);
            /* this.game.physics.p2.enable(this.player, true);
             this.player.body.fixedRotation = true;
 
             this.player.body.setCircle(18);*/
            //  this.musicBtn = this.game.add.button(this.game.world.width - 95, 50, 'pauseBtn', this.musicSwitch, this, 2, 1, 0);
            // this.player.body.gravity.y = 700;
            // this.player.body.maxVelocity.y = 600;
            // this.game.physics.arcade.gravity.y = 1150;
            //Add the tilemap and tileset image. The first parameter in addTilesetImage
            //is the name you gave the tilesheet when importing it into Tiled, the second
            //is the key to the asset in Phaser
            this.jumpSnd = this.game.add.audio('jumpSnd');
            this.hitSnd = this.game.add.audio('hurtSnd');
            this.collectSnd = this.game.add.audio('pickupSnd');
            this.swooshSnd = this.game.add.audio('swooshSnd');
            this.underMapScale = this.game.add.group();
            this.backGroup = this.game.add.group();
            this.scaleGroup = this.game.add.group();
            this.hudGroup = this.game.add.group();
            this.enemiesGroup = this.game.add.group();
            this.heartGroup = this.game.add.group();
            this.coinGroup = this.game.add.group();
            this.walletGroup = this.game.add.group();
            /*this.livesBar = new BarSpr(this.game, 10, 30, 'fullBar', 'emptBar');
            this.game.add.existing(this.livesBar);
            this.livesBar.updateValues(100, 100);
            this.hudGroup.add(this.livesBar);*/
            //this.hudGroup.fixedToCamera = true;
            // this.livesBar.visible = false;
            //  this.platformLayer = this.map.createLayer('1');
            //  And now we convert all of the Tiled objects with an ID of 34 into sprites within the coins group
            var style = { font: 'Pixel Cyr', fill: 'FFffff', align: 'center', wordWrap: true, wordWrapWidth: 450 };
            this.gameOverText = this.game.add.text(this.game.world.centerX, 30, "1", style);
            this.gameOverText.anchor.setTo(0.5, 0);
            // this.mainText.font = 'Concert One';
            this.gameOverText.fontSize = 60;
            //  this.mainText.align = 'center';
            this.gameOverText.stroke = "#000";
            this.gameOverText.strokeThickness = 16;
            this.gameOverText.colors = ['#FFffff'];
            this.gameOverText.stroke = '#000';
            this.gameOverText.strokeThickness = 2;
            // this.mainText.width = 850 * ScaleControl.scaleMin;
            this.gameOverText.x = this.game.world.width * 0.5;
            this.gameOverText.y = this.game.world.height * 0.6;
            this.gameOverText.text = 'You was killed by';
            this.gameOverText.visible = false;
            this.game.time.advancedTiming = true;
            // this.scaleGroup.add(this.map);
            //Before you can use the collide function you need to set what tiles can collide
            this.scaleGroup.add(this.enemiesGroup);
            this.scaleGroup.add(this.heartGroup);
            this.scaleGroup.add(this.coinGroup);
            this.scaleGroup.add(this.walletGroup);
            this.scaleGroup.add(this.player);
            this.crownSpr = this.add.sprite(0, 0, 'crown');
            this.crownSpr.anchor.set(0.5);
            this.hudGroup.add(this.crownSpr);
            this.leaderBoard = new BaseGame.LeaderBoardGr(this.game);
            this.game.add.existing(this.leaderBoard);
            this.hudGroup.add(this.leaderBoard);
            this.game.physics.p2.setImpactEvents(true);
            //Change the world size to match the size of this layer
            // this.groundLayer.resizeWorld();
            this.game.input.addPointer();
            this.game.input.maxPointers = 3;
            window.loadedFirst = true;
            this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
            this.upKey2 = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
            this.game.input.keyboard.onUpCallback = function (e) {
                //console.log('on up ' + e.keyCode);
                if (e.keyCode == Phaser.Keyboard.LEFT || e.keyCode == Phaser.Keyboard.RIGHT || e.keyCode == Phaser.Keyboard.D || e.keyCode == Phaser.Keyboard.A) {
                    if (Constants.MAIN_STATE.player != null && Constants.MAIN_STATE.player.spr != null) {
                        Constants.MAIN_STATE.player.stopMove();
                    }
                }
            };
            //this.makePlayer({ id: 0, startx: 0, starty: 0 });
            // send the server our initial position and tell it we are connected
            // (<any>window).game.socket.emit('new player', {x: 0, y: 0, direction: 1, angle: 0});//ask for new player
            //socket.emit('new player', { x: player.x, y: player.y, direction: player.direction, angle: player.angle })
            // this.loadLvl(0);
            this.fpsText = new Phaser.Text(this.game, 5, this.game.height - 30, 'FPS: ', { fill: '#EEEEEE', align: 'left' });
            this.fpsText.fontSize = 20;
            this.hudGroup.add(this.fpsText);
            this.fpsText.fixedToCamera = true;
            ScaleControl.renew(this.game);
            this.game.input.onDown.add(this.checkReleased, this);
            Constants.MAIN_STATE = this;
            /*
            //listen for main player creation
            (<any>window).game.socket.on("new player", this.makePlayer);

            //listen to new enemy connections
            (<any>window).game.socket.on("new enemy player", this.makeEnemyPlayer);

            //listen to enemy movement
            (<any>window).game.socket.on("move player", this.onEnemyMove);

            //when received remove_player, remove the player passed;
            (<any>window).game.socket.on('remove player', this.onRemoveEnemyPlayer);
           */
            window.$.ajaxSetup({
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                }
            });
            if (Constants.PLAYER_NAME == '' || Constants.PLAYER_NAME.length == 0) {
            }
            // (<any>window).socket = (<any>window).io('https://ws.trapz.io', { transports: ['websocket'] });///ca1 - final //ws - dev
            Constants.PLAYER_NAME = window.inputName;
            window.socket.emit('login', Constants.PLAYER_NAME);
            window.$("#loading").show();
            // (<any>window).socket.start()
            //authorize server
            /*  (<any>window).$.post("https://api.trapz.io/v1/user/login", JSON.stringify({
                  name: Constants.PLAYER_NAME
              }), function (data) {*/
            this.doLogin();
            /*
            (<any>window).axios.post("https://api.trapz.io/v1/user/login", (<any>window).JSON.stringify({
                name: Constants.PLAYER_NAME
              }))
              .then(function (response) {
                  console.log(response);

                  var obj = (<any>window).jQuery.parseJSON(response);

                  if (typeof obj.user.name !== 'undefined' && obj.user.name != null && obj.user.name != Constants.PLAYER_NAME)
                  {
                      Constants.PLAYER_NAME = response.user.name;
                  }
                  this.makePlayer({ name: Constants.PLAYER_NAME, startx: obj.coords.x, starty: obj.coords.y });
                // make player using info
                  //show loading screen or smth?
                  this.load.tilemap('lvlLoad', null, obj.levelMap, Phaser.Tilemap.TILED_JSON).onLoadComplete.addOnce(function () { Constants.MAIN_STATE.loadLvl(); });
                  Constants.MAIN_STATE.updateEnemiesArray(obj.players);
              })
              .catch(function (error) {
                console.log(error);
              });*/
            // var data = 
            //temp start
            // Constants.MAIN_STATE.loadLvl();
            // this.makeEnemyPlayer(null, true);
            //temp end
            this.loseScreenSpr = this.add.sprite(0, 0, 'gameOver');
            this.loseScreenSpr.visible = false;
            this.loseScreenSpr.fixedToCamera = true;
            this.gameOverText.fixedToCamera = true;
            this.playAgainBtn = this.game.add.button(this.game.width * 0.5, this.game.height * 0.8, 'tile', function () { }, this, 2, 1, 0);
            this.playAgainBtn.anchor.set(0.5, 0.5);
            this.playAgainBtn.fixedToCamera = true;
            this.musicBtn = this.game.add.button(this.game.width - 50, 50, 'onMusicBtn', function () { this.switchMusic(); }, this, 2, 1, 0);
            this.musicBtn.anchor.set(0.5, 0.5);
            this.musicBtn.fixedToCamera = true;
            // this.game.add.existing(this.musicBtn);
            this.playAgainBtn.events.onInputUp.add(function (_) {
            }, this);
            //  this.add.tween(this.playAgainBtn.scale).to({ y: 1.1, x: 1.1 }, 500, Phaser.Easing.Elastic.Out, true, 0, -1, true);
            this.playAgainBtn.visible = false;
            this.gameOverText.visible = false;
            this.loseScreenSpr.visible = false;
            this.tileSize = 45;
            this.curPlayTime = 0;
            //this.hudGroup.add(this.musicBtn);
            //  this.hudGroup.add(this.loseScreenSpr);
            //   this.hudGroup.add(this.playAgainBtn);
        };
        PlayState.prototype.doLogin = function () {
            window.socket.on('login', function (data) {
                Constants.MAIN_STATE.player.killScore = 0;
                Constants.MAIN_STATE.player.score = 0;
                // data = (<any>window).jQuery.parseJSON(data);
                console.log('data given in login: ' + data);
                window.$("#loading").hide();
                Constants.MAIN_STATE.authInfo = data.user.auth;
                var cookie = window.getCookie('id');
                if (Constants.MAIN_STATE.givenLoginID == null || typeof Constants.MAIN_STATE.givenLoginID === 'undefined' || Constants.MAIN_STATE.givenLoginID.length == 0) {
                    //do once because than the variable Constants.MAIN_STATE.givenLoginID is already set
                    Constants.MAIN_STATE.upgrGr = new BaseGame.UpgradeGroup(Constants.MAIN_STATE.game);
                    Constants.MAIN_STATE.game.add.existing(Constants.MAIN_STATE.upgrGr);
                    Constants.MAIN_STATE.hudGroup.add(Constants.MAIN_STATE.upgrGr);
                    Constants.MAIN_STATE.callOnceCreate();
                    Constants.MAIN_STATE.checkNeedResetUnlocks();
                    if (cookie == 'undefined') {
                        // save cookie
                        if (typeof window.genId != 'undefined')
                            Constants.MAIN_STATE.givenLoginID = window.genId;
                        else {
                            var id = window.uuidv1();
                            Constants.MAIN_STATE.givenLoginID = id;
                        }
                        // Constants.MAIN_STATE.givenLoginID = data.user.id;
                        console.log('NEW ID set from server ' + Constants.MAIN_STATE.givenLoginID);
                        window.document.cookie = "id=" + Constants.MAIN_STATE.givenLoginID + "; expires=Fri, 31 Dec 2024 23:59:59 GMT"; //"auth=" + data.auth + "; domain = trapz.io";
                    }
                    else {
                        Constants.MAIN_STATE.givenLoginID = cookie;
                        console.log('NEW ID set from old cookie ' + Constants.MAIN_STATE.givenLoginID);
                    }
                    window.genId = Constants.MAIN_STATE.givenLoginID;
                    window.socket.on('update', function (msg) {
                        // console.log('update: ' + msg);
                        Constants.MAIN_STATE.parseServerData(msg);
                    });
                    if (typeof window.endTimePing != 'undefined') {
                        var time = window.endTimePing.getTime() - window.startTimePing.getTime();
                        window.socket.emit('stats', {
                            id: Constants.MAIN_STATE.givenLoginID, connecttime: time
                        });
                    }
                    else {
                        console.log('no connect event');
                    }
                    window.socket.on('wallet', function (data) {
                        /*
                        {
                            walletUser: чей был сундук
                            user: кто взял сундук
                            scoreGrabbed: количество монет
    
                            }
                        */
                        if (data.user == Constants.MAIN_STATE.player.nameID) {
                            console.log('found wallet! ');
                            if (data.walletUser == Constants.MAIN_STATE.player.nameID) {
                                Constants.MAIN_STATE.addText(Constants.MAIN_STATE.player.spr.body.x, Constants.MAIN_STATE.player.spr.body.y - Constants.MAIN_STATE.player.spr.height - 120, // coords doesn't work if append to player
                                "You've recovered your money: " + data.scoreGrabbed + " gold!", Constants.MAIN_STATE.player, false, 3500);
                            }
                            else {
                                Constants.MAIN_STATE.addText(Constants.MAIN_STATE.player.spr.body.x, Constants.MAIN_STATE.player.spr.body.y - Constants.MAIN_STATE.player.spr.height - 120, "You've got " + data.walletUser + "'s money: " + data.scoreGrabbed + " gold!", Constants.MAIN_STATE.player, false, 3500);
                            }
                        }
                        else {
                            if (data.walletUser == Constants.MAIN_STATE.player.nameID) {
                                Constants.MAIN_STATE.addText(Constants.MAIN_STATE.player.spr.body.x, Constants.MAIN_STATE.player.spr.body.y - Constants.MAIN_STATE.player.spr.height - 120, data.user + " has found your lost purse:" + data.scoreGrabbed + " gold!", Constants.MAIN_STATE.player, false, 3500);
                            }
                        }
                        //  console.log('Wallet info: User: ' + data.walletUser + ". Collected by: " + data.user);
                    });
                    //end wallet
                    window.socket.on('death', function (data) {
                        // console.log("DEATH data " + data);
                        if (data instanceof Array) {
                            //var dataCopy = data.slice(0, data.length);
                            for (var i = 0; i < data.length; i++) {
                                // console.log("DEATH data killedUser: " + data[i].killedUser);
                                if (data[i].by == 'user') {
                                    if (typeof data[i].killedUser !== 'undefined' && data[i].killedUser != null) {
                                        if (data[i].killedUser == Constants.MAIN_STATE.player.nameID) {
                                            Constants.MAIN_STATE.player.killerNameID = data[i].user;
                                            if (!Constants.MAIN_STATE.player.isShowingDeathAnim) {
                                                Constants.MAIN_STATE.player.showDeath();
                                            }
                                        }
                                        else if (data[i].user == Constants.MAIN_STATE.player.nameID) {
                                            if (typeof Constants.MAIN_STATE.player.appearText === 'undefined' || Constants.MAIN_STATE.player.appearText == null) {
                                                //check if it was a king - give unlock
                                                var unit = Constants.MAIN_STATE.findplayerbyid(data[i].killedUser);
                                                if (unit != null && unit.hasCrown) {
                                                    Constants.MAIN_STATE.killedKing = true;
                                                    console.log('killed king');
                                                }
                                                if (data[i].scoreGrabbed != 0) {
                                                    Constants.MAIN_STATE.addText(Constants.MAIN_STATE.player.spr.body.x, Constants.MAIN_STATE.player.spr.body.y - Constants.MAIN_STATE.player.spr.height - 130, 'Killed ' + data[i].killedUser + ' and got ' + data[i].scoreGrabbed + " gold", Constants.MAIN_STATE.player);
                                                }
                                                else {
                                                    Constants.MAIN_STATE.addText(Constants.MAIN_STATE.player.spr.body.x, Constants.MAIN_STATE.player.spr.body.y - Constants.MAIN_STATE.player.spr.height - 130, 'Killed ' + data[i].killedUser, Constants.MAIN_STATE.player);
                                                }
                                                Constants.MAIN_STATE.player.killScore++;
                                            }
                                        }
                                        if (data[i].killedUser == Constants.MAIN_STATE.player.nameID) {
                                        }
                                        else {
                                            var user = Constants.MAIN_STATE.findplayerbyid(data[i].killedUser);
                                            if (typeof user !== 'undefined' && user != null)
                                                user.showDeath();
                                        }
                                    }
                                }
                                else if (data[i].by == 'spike') {
                                    if (data[i].killedUser == Constants.MAIN_STATE.player.nameID) {
                                        Constants.MAIN_STATE.player.killerNameID = '';
                                        window.killUser = '';
                                        if (!Constants.MAIN_STATE.player.isShowingDeathAnim) {
                                            Constants.MAIN_STATE.player.showDeath();
                                        }
                                    }
                                    else {
                                        var user = Constants.MAIN_STATE.findplayerbyid(data[i].killedUser);
                                        if (typeof user !== 'undefined' && user != null)
                                            user.showDeath();
                                    }
                                }
                            }
                        }
                        //console.log('death ' + data[i].killedUser);
                    });
                }
                //end do once
                if (typeof window.shop.chosenSkin == 'undefined' || window.shop.chosenSkin == null) {
                    window.shop.chosenSkin = 'default';
                }
                Constants.MAIN_STATE.changeSkin(window.shop.chosenSkin);
                /*let hashSkin = (<any>window).md5((<any>window).shop.chosenSkin, Constants.MAIN_STATE.givenLoginID);*/
                window.document.cookie = "skin=" + window.shop.chosenSkin + "; expires=Fri, 31 Dec 2024 23:59:59 GMT";
                var map = JSON.stringify(data.levelMap);
                console.log("COOKIE: " + window.document.cookie);
                //if the name was passed - save it instead
                if ((typeof Constants.PLAYER_NAME == 'undefined' || Constants.PLAYER_NAME == '' || Constants.PLAYER_NAME.length == 0) || (typeof data.user.name !== 'undefined' && data.user.name != null && data.user.name != Constants.PLAYER_NAME)) {
                    Constants.PLAYER_NAME = data.user.name;
                }
                window.socket.on('disconnect', function (data) {
                    console.log("on disconnect");
                    // (<any>window).game.socket.emit('reconnect', { auth: Constants.MAIN_STATE.authInfo });
                });
                window.socket.on('reconnected', function (data) {
                    console.log('reconnected');
                });
                window.socket.on('login_required', function (data) {
                    console.log('login_required');
                    //Constants.MAIN_STATE.player.killerNameID = '';
                    if (!Constants.MAIN_STATE.player.isShowingDeathAnim)
                        Constants.MAIN_STATE.endGame();
                });
                //show loading screen or smth?
                Constants.MAIN_STATE.load.tilemap('lvlLoad', null, map, Phaser.Tilemap.TILED_JSON).onLoadComplete.addOnce(function () { console.log('NEW MAP completed loading'); Constants.MAIN_STATE.loadLvl(); });
                Constants.MAIN_STATE.loadLvl();
                Constants.MAIN_STATE.resize();
                Constants.MAIN_STATE.resizeBtns();
                // make player using info
                Constants.MAIN_STATE.makeEnemyPlayer(data, true);
                Constants.MAIN_STATE.needToResetInfoFromServer = true;
                Constants.MAIN_STATE.player.doPost();
                //might be overwriting?
                // Constants.MAIN_STATE.player.spr.body.collides(Constants.MAIN_STATE.enemyCollisionGr, Constants.MAIN_STATE.hitEnemy, this);//after set level because collision groups are created inside
                Constants.MAIN_STATE.updateEnemiesArray(data.players);
                Constants.MAIN_STATE.updateHeartsArray(data.hearts);
                Constants.MAIN_STATE.updateCoinsArray(data.coins);
                if (typeof data.wallets != 'undefined')
                    Constants.MAIN_STATE.updateWalletsArray(data.wallets);
                if (typeof data.leaderboard != 'undefined' && data.leaderboard != null) {
                    Constants.MAIN_STATE.leaderBoard.renewText(data.leaderboard);
                    Constants.MAIN_STATE.checkCrownOwner(data.leaderboard);
                    Constants.MAIN_STATE.lastLeaderboard = data.leaderboard;
                }
                window.game.input.onDown.add(Constants.MAIN_STATE.checkReleased, Constants.MAIN_STATE);
                console.log('ONLINE players: ' + data.players.length);
                Constants.MAIN_STATE.upgrGr.renewInfoText();
                Constants.MAIN_STATE.upgrGr.updateBtnTexts();
                Constants.MAIN_STATE.upgrGr.checkVisibility();
                //Constants.MAIN_STATE.startGame();
                /*
                // set connection
                let opt = {
                    subscriber: 'websocket',
                }
                var sub = new (<any>window).NchanSubscriber('https://ca1.trapz.io/v1/sub', opt);//ca1//ws

                // reacts to events everytime - just the default one, will give arrays that are updated
                sub.on("message", this.parseServerData);

                // start connection
                sub.start();
                */
                /*
                var socket = new WebSocket("wss://ws.trapz.io/v1/sub");
               // socket.onopen = this.parseServerData;

                socket.onopen = function () {
                    console.log('open socket');
                };

                socket.onerror = function (error) {
                    console.log("Ошибка " + error.message);
                };

                socket.onmessage = function (event) {
                    Constants.MAIN_STATE.parseServerData(event.data);
                   // alert("Получены данные " + event.data);
                };*/
                Constants.MUSIC_ON = Utils.loadSave('music');
                Constants.MAIN_STATE.checkMusicBtn();
            });
        };
        PlayState.prototype.callOnceCreate = function () {
            console.log('create once called');
            Constants.MAIN_STATE.upgrGr.createTexts();
            Constants.MAIN_STATE.upgrGr.renewInfoText();
            Constants.MAIN_STATE.upgrGr.updateBtnTexts();
            Constants.MAIN_STATE.upgrGr.checkVisibility();
            Constants.MAIN_STATE.leaderBoard.createTexts();
        };
        PlayState.prototype.checkMusicBtn = function () {
            if (Constants.MUSIC_ON) {
                this.musicBtn.loadTexture('onMusicBtn');
            }
            else {
                this.musicBtn.loadTexture('offMusicBtn');
            }
        };
        PlayState.prototype.checkNeedResetUnlocks = function () {
            if (Utils.loadSave(window.shop.btnsData[1].check) == -1) {
                this.resetSavedUnlocks();
            }
        };
        PlayState.prototype.checkDidUnlock = function () {
            //(<any>window).goldStat = this.player.score;
            //(<any>window).killStat = this.player.killScore;
            //(<any>window).timeStat = Utils.formatTime(this.curPlayTime / 1000);
            for (var i = 0; i < window.shop.btnsData.length; i++) {
                switch (window.shop.btnsData[i].check) {
                    case 'gold100':
                        if (this.player.score >= 100) {
                            Utils.save(window.shop.btnsData[i].check, true);
                            window.shop.btnsData[i].status = 'open';
                        }
                        break;
                    case 'killKing':
                        if (this.killedKing == true) {
                            Utils.save(window.shop.btnsData[i].check, true);
                            window.shop.btnsData[i].status = 'open';
                        }
                        break;
                    case 'gold1500':
                        if (this.player.score >= 1500) {
                            Utils.save(window.shop.btnsData[i].check, true);
                            window.shop.btnsData[i].status = 'open';
                        }
                        break;
                    case "kill50":
                        if (this.player.killScore >= 50) {
                            Utils.save(window.shop.btnsData[i].check, true);
                            window.shop.btnsData[i].status = 'open';
                        }
                        break;
                    case "kill150":
                        if (this.player.killScore >= 150) {
                            Utils.save(window.shop.btnsData[i].check, true);
                            window.shop.btnsData[i].status = 'open';
                        }
                        break;
                    case 'alive20min':
                        if ((this.curPlayTime / 1000) >= (60 * 20)) {
                            Utils.save(window.shop.btnsData[i].check, true);
                            window.shop.btnsData[i].status = 'open';
                        }
                        break;
                }
            }
        };
        PlayState.prototype.resetSavedUnlocks = function () {
            for (var i = 0; i < window.shop.btnsData.length; i++) {
                if (typeof window.shop.btnsData[i].check != 'undefined') {
                    Utils.save(window.shop.btnsData[i].check, false);
                    window.shop.btnsData[i].status = 'locked';
                }
            }
        };
        PlayState.prototype.switchMusic = function () {
            Constants.MUSIC_ON = !Constants.MUSIC_ON;
            this.checkMusicBtn();
            Utils.save('music', Constants.MUSIC_ON);
        };
        PlayState.prototype.findEnemyWithThisBody = function (body) {
            for (var i = 0; i < window.game.enemies.length; i++) {
                if (window.game.enemies[i].spr.body === body) {
                    return window.game.enemies[i];
                }
            }
        };
        PlayState.prototype.objsHitProcess = function (player, tile) {
            console.log('hit obj');
            if ((player.sprite != null && tile.sprite != null) && (player.sprite.name == 'player' && tile.sprite.name == 'enemy')) {
                // console.log('hit enemy');
                //doesn't work if collides on the right of player for some reason
                //
                console.log('angle  player tile' + Utils.angleBetweenSprs(player, tile));
                console.log('angle tile player ' + Utils.angleBetweenSprs(tile, player));
                var velocityPt = Utils.moveTowardsObject(tile, player, 250);
                // console.log('velocity x ' + velocityPt.x);
                // console.log('velocity y ' + velocityPt.y);
                //pass it to the enemy client thru server
                var enemy = this.findEnemyWithThisBody(tile);
                this.player.getMoved(velocityPt.x, velocityPt.y); //temp
                /* tile.velocity.x = velocityPt.x;
                 tile.velocity.y = velocityPt.y;*/
                return false;
            }
            /* if ((player.sprite != null && tile.sprite != null) && (player.sprite.name == 'enemy' || tile.sprite.name == 'enemy')) {
                 return false;
             }*/
            return true;
        };
        PlayState.prototype.hitEnemy = function (player, enemy) {
            //  body1 is the player (as it's the body that owns the callback)
            //  body2 is the body it impacted with, in this case our enemy
            //  As body2 is a Phaser.Physics.P2.Body object, you access its own (the sprite) via the sprite property:
            //console.log('hit enemy');
            //  console.log('angle player enemy: ' + Utils.angleBetweenSprs(player, enemy));
            /* var enemy = this.findEnemyWithThisBody(enemy);
             let velocityPt = Utils.moveTowardsObject(enemy, player, 250);
             this.player.getMoved(velocityPt.x, velocityPt.y);*/ //temp 
            // body1.sprite.alpha = 0.6;
        };
        PlayState.prototype.seeServerInfo = function () {
            // console.log('asked for reset');
            /*
            (<any>window).$.post("https://api.trapz.io/v1/game", function (data) {
                console.log('show server info ' + data);
                let obj = (<any>window).jQuery.parseJSON(data);
                Constants.MAIN_STATE.updateEnemiesArray(obj.players);
                console.log('players online: ' + obj.players.length);
            });*/
        };
        PlayState.prototype.showEnemiesInfo = function () {
            for (var i = 0; i < window.game.enemies.length; i++) {
                var playerUnit = window.game.enemies[i];
                console.log("POS x: " + playerUnit.spr.body.x + ". Y: " + playerUnit.spr.body.y);
            }
        };
        PlayState.prototype.resetGame = function () {
            console.log('asked for reset');
            /* (<any>window).$.post("https://api.trapz.io/v1/dev/reset", function (data) {
                 console.log('did reset');
             });*/
            //(<any>window).game.socket.emit('reset-smcLWjio3t');
        };
        PlayState.prototype.hideGameOver = function () {
            this.loseScreenSpr.visible = false;
            this.playAgainBtn.visible = false;
            this.gameOverText.visible = false;
        };
        PlayState.prototype.continueAfterDeath = function () {
            console.log('continue after death');
            this.hideGameOver();
            window.hideGameOver();
            this.player.destroy();
            this.destroLvl();
            window.$("#loading").show();
            console.log('ask for login');
            Constants.MAIN_STATE.curPlayTime = 0;
            Constants.PLAYER_NAME = window.inputName;
            window.socket.emit('login', Constants.PLAYER_NAME);
            /*
            (<any>window).game.socket.emit('continue',
                { auth: Constants.MAIN_STATE.authInfo });*/
            //this.startGame();
            this.needToResetInfoFromServer = true; //uncomment to update from server
        };
        PlayState.prototype.checkReleased = function () {
            this.resizeBtns();
            //console.log("this.pos player X: " + this.player.spr.x + ", Y: " + this.player.spr.y);
            //this.updateHUDresize();
            //console.log("checkGameOverScreenOn() " + (<any>window).checkGameOverScreenOn());
            if (this.loseScreenSpr.visible && window.checkGameOverScreenOn() == false) {
            }
            else {
                if (this.musicBtn.getBounds().contains(this.game.input.x, this.game.input.y) == false
                    && ((this.upgrGr.heartBtn.visible == false || this.upgrGr.heartBtn.getBounds().contains(this.game.input.x, this.game.input.y) == false)
                        && ((this.upgrGr.swordBtn.visible == false || this.upgrGr.swordBtn.getBounds().contains(this.game.input.x, this.game.input.y) == false)))) {
                    this.tryAttack();
                }
            }
        };
        PlayState.prototype.tryAttack = function () {
            if (this.game.time.now > this.attackAllowedTimer) {
                // console.log("do attack from client, Name: " + this.player.nameID);
                this.attackAllowedTimer = this.game.time.now + 2000;
                window.socket.emit('attack', { type: 'sword', auth: Constants.MAIN_STATE.authInfo });
                this.player.showAttack();
            }
            else {
                return;
            }
        };
        PlayState.prototype.updateWalletsArray = function (data) {
            var tileSize = 45;
            if (data instanceof Array) {
                var dataCopy = data.slice(0, data.length);
                //   console.log('coins length ' + data.length);
                var toRemove = [];
                for (var i = 0; i < window.game.wallets.length; i++) {
                    var wallet = window.game.wallets[i];
                    var found = false;
                    //console.log("heart name " + (<any>window).game.coins[i].name);
                    for (var e = 0; e < data.length; e++) {
                        if (wallet.name == data[e].name) {
                            var dataUnit = data[e];
                            // console.log("found in a new array name " + dataUnit.name + " updating pos. X: " + dataUnit.coords.x + " Y: " + dataUnit.coords.y);
                            //update its pos
                            if (wallet != null) {
                                wallet.x = dataUnit.coords.x * Constants.MAIN_STATE.tileSize + Constants.MAIN_STATE.tileSize * 0.5;
                                wallet.y = dataUnit.coords.y * Constants.MAIN_STATE.tileSize + Constants.MAIN_STATE.tileSize;
                            }
                            found = true;
                            dataCopy.splice(dataCopy.indexOf(dataUnit), 1);
                        }
                    }
                    if (!found) {
                        //  console.log("haven't found in a new array name " + wallet.name + ". Kill it");
                        //kill it as its not in the new data
                        wallet.destroy();
                        toRemove.push(wallet);
                    }
                }
                for (var i = 0; i < toRemove.length; i++) {
                    var index = window.game.wallets.indexOf(toRemove[i]);
                    window.game.wallets.splice(index, 1);
                }
                for (var i = 0; i < dataCopy.length; i++) {
                    //dataCopy[i]
                    //{ name: "heart1", x: 53, y: 6, show: true }
                    var walletNew = window.game.add.sprite(dataCopy[i].coords.x, dataCopy[i].coords.y, 'gold', 0, this.walletGroup);
                    // ship.smoothed = false;
                    this.walletGroup.add(walletNew); //dunno if it's good - owner ctrl is in there as well
                    walletNew.anchor.setTo(0.5, 1);
                    walletNew.x = dataCopy[i].coords.x * Constants.MAIN_STATE.tileSize + Constants.MAIN_STATE.tileSize * 0.5;
                    walletNew.y = dataCopy[i].coords.y * Constants.MAIN_STATE.tileSize + Constants.MAIN_STATE.tileSize;
                    walletNew.name = dataCopy[i].name;
                    //console.log("create a new wallet: " + walletNew.name+ "X: " + walletNew.x + " Y: " + walletNew.y + "data: X: " + dataCopy[i].coords.x + " Y: " + dataCopy[i].coords.y);
                    window.game.wallets.push(walletNew);
                }
                dataCopy = [];
            }
        };
        PlayState.prototype.updateHeartsArray = function (data) {
            /*
            var spike = this.game.add.sprite(200, 200, 'heartSpr');
            spike.x = tile.x * tileSize;
            spike.y = tile.y * tileSize;
            this.scaleGroup.add(spike);*/
            // console.log('update hearts');
            var tileSize = 45;
            if (data instanceof Array) {
                var dataCopy = data.slice(0, data.length);
                for (var i = 0; i < window.game.hearts.length; i++) {
                    var heart = window.game.hearts[i];
                    var found = false;
                    // console.log("heart name " + (<any>window).game.hearts[i].name);
                    for (var e = 0; e < data.length; e++) {
                        if (heart.name == data[e].name) {
                            var dataUnit = data[e];
                            //console.log("found in a new array name " + heart.name + " updating pos. X: " + dataUnit.x + " Y: " + dataUnit.y);
                            //update its pos
                            if (heart != null) {
                                heart.x = dataUnit.x * tileSize + this.tileSize * 0.5;
                                heart.y = dataUnit.y * tileSize + this.tileSize * 0.5;
                            }
                            if (dataUnit.show === false) {
                                if (heart.visible) {
                                }
                                heart.visible = false;
                            }
                            else {
                                heart.visible = true;
                            }
                            found = true;
                            dataCopy.splice(dataCopy.indexOf(dataUnit), 1);
                        }
                    }
                    if (!found) {
                        console.log("haven't found in a new array name " + heart.name + ". Kill it");
                        //kill it as its not in the new data
                        heart.destroy();
                    }
                }
                for (var i = 0; i < dataCopy.length; i++) {
                    //dataCopy[i]
                    //{ name: "heart1", x: 53, y: 6, show: true }
                    var spike = this.game.add.sprite(dataCopy[i].x * tileSize + this.tileSize * 0.5, dataCopy[i].y * tileSize + this.tileSize * 0.5, 'heartSpr');
                    spike.anchor.set(0.5);
                    spike.name = dataCopy[i].name;
                    window.game.hearts.push(spike);
                    this.heartGroup.add(spike);
                    // this.scaleGroup.add(spike);
                    if (dataCopy[i].show === false) {
                        spike.visible = false;
                    }
                    else {
                        spike.visible = true;
                    }
                }
                dataCopy = [];
            }
        };
        PlayState.prototype.updateCoinsArray = function (data) {
            /*
            var spike = this.game.add.sprite(200, 200, 'heartSpr');
            spike.x = tile.x * tileSize;
            spike.y = tile.y * tileSize;
            this.scaleGroup.add(spike);*/
            // console.log('update coins');
            if (data instanceof Array) {
                var dataCopy = data.slice(0, data.length);
                //   console.log('coins length ' + data.length);
                for (var i = 0; i < window.game.coins.length; i++) {
                    var coin = window.game.coins[i];
                    var found = false;
                    //console.log("heart name " + (<any>window).game.coins[i].name);
                    for (var e = 0; e < data.length; e++) {
                        if (coin.name == data[e].name) {
                            var dataUnit = data[e];
                            //console.log("found in a new array name " + coin.name + " updating pos. X: " + dataUnit.x + " Y: " + dataUnit.y);
                            //update its pos
                            if (coin != null) {
                                coin.x = dataUnit.x * this.tileSize + this.tileSize * 0.5;
                                coin.y = dataUnit.y * this.tileSize + this.tileSize * 0.5;
                            }
                            found = true;
                            dataCopy.splice(dataCopy.indexOf(dataUnit), 1);
                        }
                    }
                    if (!found) {
                        // console.log("haven't found in a new array name " + coin.name + ". Kill it");
                        //kill it as its not in the new data
                        coin.destroy();
                    }
                }
                for (var i = 0; i < dataCopy.length; i++) {
                    //dataCopy[i]
                    //{ name: "heart1", x: 53, y: 6, show: true }
                    //console.log("create a new coin");
                    var spike = this.game.add.sprite(dataCopy[i].x * this.tileSize, dataCopy[i].y * this.tileSize, 'coin');
                    spike.x = dataCopy[i].x * this.tileSize + this.tileSize * 0.5;
                    spike.y = dataCopy[i].y * this.tileSize + this.tileSize * 0.5;
                    spike.name = dataCopy[i].name;
                    spike.anchor.set(0.5);
                    var scaleTween = this.game.add.tween(spike.scale).to({ x: spike.scale.x * -1, y: 1 }, Phaser.Math.random(1300, 2200), Phaser.Easing.Linear.None, true, Phaser.Math.random(500, 2500), -1, true);
                    window.game.coins.push(spike);
                    this.coinGroup.add(spike);
                }
                dataCopy = [];
            }
        };
        PlayState.prototype.updateEnemiesArray = function (data) {
            //go through all the members in the given array and compare them to the one we have?
            //or delete all and read??
            //check all existing in game - are they in a new array?
            if (typeof data === 'undefined' || data == null) {
                console.log("no data passed! for enemies creation");
                return;
            }
            // console.log('data in json: ' + JSON.stringify(data));
            // console.log('data: ' + data);
            // console.log('data type ' + (typeof data));
            if (data instanceof Array) {
                var dataCopy = data.slice(0, data.length);
                // console.log('data copy in json: ' + JSON.stringify(dataCopy));
                var indxToRemove = [];
                for (var i = 0; i < window.game.enemies.length; i++) {
                    var playerUnit = window.game.enemies[i];
                    var found = false;
                    var ignore = false;
                    if (playerUnit == null) {
                        ignore = true;
                        break;
                    }
                    for (var e = 0; e < data.length; e++) {
                        if (playerUnit.nameID == data[e].user.name && playerUnit.sessionID == data[e].user.session) {
                            var dataUnit = data[e];
                            //console.log("found in a new array name " + playerUnit.nameID + " updating pos. X: " + dataUnit.character.coords.xabs + " Y: " + dataUnit.character.coords.yabs);
                            //update its pos
                            if (playerUnit.spr != null && playerUnit.spr.body != null && !playerUnit.isShowingDeathAnim) {
                                if (typeof dataUnit.character.coords.xabs === 'undefined') {
                                    playerUnit.spr.body.x = dataUnit.character.coords.x * this.tileSize + this.tileSize * 0.5;
                                    playerUnit.spr.body.y = dataUnit.character.coords.y * this.tileSize + this.tileSize * 0.5;
                                }
                                else {
                                    playerUnit.spr.body.x = dataUnit.character.coords.xabs;
                                    playerUnit.spr.body.y = dataUnit.character.coords.yabs;
                                }
                            }
                            if (playerUnit.savedSkin != dataUnit.character.skin) {
                                playerUnit.spr.loadTexture(Constants.MAIN_STATE.skinNamesObj[dataUnit.character.skin]);
                                playerUnit.savedSkin = dataUnit.character.skin;
                                if (playerUnit.savedSkin == 'unicorn') {
                                    playerUnit.makeAnimatedSpr('rainbow');
                                }
                                else if (playerUnit.savedSkin == 'knightBurn') {
                                    playerUnit.makeAnimatedSpr('burn');
                                }
                                else {
                                    if (playerUnit.animatedSpr != null)
                                        playerUnit.animatedSpr.visible = false;
                                }
                                playerUnit.spr.anchor.setTo(0.5);
                                playerUnit.spr.animations.add('walk', [0, 1, 2, 1, 0, 3], 10, true);
                                playerUnit.spr.animations.add('jump', [4], 4, true);
                                playerUnit.spr.animations.add('idle', [0], 4, true);
                                playerUnit.spr.animations.add('fall', [0], 4, true);
                                playerUnit.spr.play('walk');
                            }
                            playerUnit.health = dataUnit.character.health;
                            playerUnit.healthMax = 100; //dataUnit.health;
                            playerUnit.score = dataUnit.user.score; //dataUnit.health;
                            playerUnit.updateBarAndText();
                            Constants.MAIN_STATE.upgrGr.updateBtnTexts();
                            if (typeof dataUnit.character.swordColor != 'undefined') {
                                switch (dataUnit.character.swordColor) {
                                    case "white":
                                        playerUnit.swordSpr.tint = 0xffffff;
                                        playerUnit.hitLineOuterSpr.tint = 0xffffff;
                                        break;
                                    case "green":
                                        playerUnit.swordSpr.tint = 0x00ff00;
                                        playerUnit.hitLineOuterSpr.tint = 0x00ff00;
                                        break;
                                    case "blue":
                                        playerUnit.swordSpr.tint = 0x0000ff;
                                        playerUnit.hitLineOuterSpr.tint = 0x0000ff;
                                        break;
                                    case "red":
                                        playerUnit.swordSpr.tint = 0xff0000;
                                        playerUnit.hitLineOuterSpr.tint = 0xff0000;
                                        break;
                                }
                            }
                            if (dataUnit.character.speed.x == 0) {
                                // console.log('speed sent is 0, name: ' + dataUnit.user.name);
                                playerUnit.spr.animations.frame = 0;
                                playerUnit.spr.animations.stop('walk');
                            }
                            else {
                                playerUnit.spr.animations.play('walk');
                            }
                            if (dataUnit.character.isAttacking == true) {
                                playerUnit.showAttack();
                            }
                            // TODO: set direction as well
                            //var direction = 1;//1 - is right, -1 is left 
                            playerUnit.spr.scale.x = dataUnit.character.direction;
                            if (dataUnit.character.health == 0) {
                                playerUnit.showDeath();
                            }
                            found = true;
                            var indx = dataCopy.indexOf(dataUnit);
                            if (indx != -1) {
                                dataCopy.splice(indx, 1);
                            }
                        }
                    }
                    //end data loop
                    if (!found) {
                        //kill it as its not in the new data
                        if (!playerUnit.isShowingDeathAnim) {
                            playerUnit.destroy();
                            console.log("haven't found in a new array name " + playerUnit.nameID + ". Kill it");
                            window.game.enemies[i] = null;
                        }
                        else {
                        }
                    }
                }
                //end enemy array loop
                //clean enemy array from null?
                var r = 0;
                while (r < window.game.enemies.length) {
                    if (window.game.enemies[r] != null) {
                        r++;
                    }
                    else {
                        window.game.enemies.splice(r, 1);
                    }
                }
                for (var i = 0; i < dataCopy.length; i++) {
                    //console.log("make a n " + playerUnit.name + ". Kill it");
                    if (dataCopy[i].user.name != Constants.MAIN_STATE.player.nameID) {
                        this.makeEnemyPlayer(dataCopy[i], false);
                    }
                    else {
                        //renew stuff for self
                        // console.log('renew info for self: ' + dataCopy[i].character.health);
                        this.player.health = dataCopy[i].character.health;
                        if (typeof dataCopy[i].user.attack !== 'undefined')
                            this.player.damage = dataCopy[i].user.attack;
                        if (typeof dataCopy[i].user.maxhealth !== 'undefined')
                            this.player.healthMax = dataCopy[i].user.maxhealth; //dataUnit.health;
                        else
                            this.player.healthMax = 100;
                        this.player.sessionID = dataCopy[i].user.session;
                        this.player.score = dataCopy[i].user.score; //dataUnit.health;
                        Constants.MAIN_STATE.upgrGr.renewInfoText();
                        Constants.MAIN_STATE.upgrGr.checkVisibility();
                        this.player.updateBarAndText();
                        if (typeof dataCopy[i].character.swordColor != 'undefined') {
                            switch (dataCopy[i].character.swordColor) {
                                case "white":
                                    this.player.swordSpr.tint = 0xffffff;
                                    this.player.hitLineOuterSpr.tint = 0xffffff;
                                    break;
                                case "green":
                                    this.player.swordSpr.tint = 0x00ff00;
                                    this.player.hitLineOuterSpr.tint = 0x00ff00;
                                    break;
                                case "blue":
                                    this.player.swordSpr.tint = 0x0000ff;
                                    this.player.hitLineOuterSpr.tint = 0x0000ff;
                                    break;
                                case "red":
                                    this.player.swordSpr.tint = 0xff0000;
                                    this.player.hitLineOuterSpr.tint = 0xff0000;
                                    break;
                            }
                        }
                        if (this.player.savedSkin != dataCopy[i].character.skin) {
                            this.player.spr.loadTexture(Constants.MAIN_STATE.skinNamesObj[dataCopy[i].character.skin]);
                            this.player.savedSkin = dataCopy[i].character.skin;
                            if (this.player.savedSkin == 'unicorn') {
                                this.player.makeAnimatedSpr('rainbow');
                            }
                            else if (this.player.savedSkin == 'knightBurn') {
                                this.player.makeAnimatedSpr('burn');
                            }
                            else {
                                if (this.player.animatedSpr != null)
                                    this.player.animatedSpr.visible = false;
                            }
                            this.player.spr.anchor.setTo(0.5);
                            this.player.spr.animations.add('walk', [0, 1, 2, 1, 0, 3], 10, true);
                            this.player.spr.animations.add('jump', [4], 4, true);
                            this.player.spr.animations.add('idle', [0], 4, true);
                            this.player.spr.animations.add('fall', [0], 4, true);
                            this.player.spr.play('walk');
                        }
                        /* if (this.player.health <= 0)
                         {
                             this.endGame();
                         }*/
                        if (this.needToResetInfoFromServer) {
                            this.setSelfCoordsFromServerInfo(dataCopy);
                            this.needToResetInfoFromServer = false;
                        }
                    }
                }
                dataCopy = [];
            }
        };
        PlayState.prototype.setSelfCoordsFromServerInfo = function (data) {
            if (this.player.spr == null || this.player.spr.body == null)
                return;
            console.log('BEFORE set coords to player from server X: ' + (this.player.spr.body.x));
            for (var i = 0; i < data.length; i++) {
                //console.log("make a n " + playerUnit.name + ". Kill it");
                if (data[i].user.name == Constants.MAIN_STATE.player.nameID) {
                    this.player.spr.body.x = data[i].character.coords.x * this.tileSize + this.tileSize * 0.5;
                    this.player.spr.body.y = data[i].character.coords.y * this.tileSize + this.tileSize * 0.5;
                    this.player.direction = data[i].character.direction;
                    this.player.health = data[i].character.health;
                    this.player.updateBarAndText();
                    console.log('set coords to player from server X: ' + (data[i].character.coords.x * this.tileSize));
                }
            }
        };
        PlayState.prototype.parseServerData = function (message) {
            //console.log("message from server ");
            // console.log("message from server "+ message);
            //  var obj = (<any>window).jQuery.parseJSON(message);
            var objStr = JSON.stringify(message);
            var obj = window.jQuery.parseJSON(objStr);
            //  console.log("objStr " + objStr);
            //  console.log("obj " + obj);
            if (typeof obj.players != 'undefined' && obj.players != null) {
                Constants.MAIN_STATE.updateEnemiesArray(obj.players);
            }
            if (typeof obj.hearts != 'undefined' && obj.hearts != null) {
                Constants.MAIN_STATE.updateHeartsArray(obj.hearts);
            }
            if (typeof obj.coins != 'undefined' && obj.coins != null) {
                Constants.MAIN_STATE.updateCoinsArray(obj.coins);
            }
            if (typeof obj.wallets != 'undefined' && obj.wallets != null) {
                Constants.MAIN_STATE.updateWalletsArray(obj.wallets);
            }
            if (typeof obj.leaderboard != 'undefined' && obj.leaderboard != null) {
                Constants.MAIN_STATE.lastLeaderboard = obj.leaderboard;
                Constants.MAIN_STATE.leaderBoard.renewText(obj.leaderboard);
                Constants.MAIN_STATE.checkCrownOwner(obj.leaderboard);
            }
        };
        PlayState.prototype.checkCrownOwner = function (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].place == 1) {
                    if (data[i].name == Constants.MAIN_STATE.player.nameID) {
                        if (Constants.MAIN_STATE.player.spr != null && typeof Constants.MAIN_STATE.player.spr != 'undefined' && typeof Constants.MAIN_STATE.player.spr.body != 'undefined' && Constants.MAIN_STATE.player.spr.body != null) {
                            this.crownSpr.x = Constants.MAIN_STATE.player.spr.body.x;
                            this.crownSpr.y = Constants.MAIN_STATE.player.spr.body.y - 70;
                            Constants.MAIN_STATE.player.hasCrown = true;
                            this.crownSpr.visible = true;
                        }
                        else {
                            this.crownSpr.visible = false;
                        }
                    }
                    else {
                        var unit = this.findplayerbyid(data[i].name);
                        if (typeof unit != 'undefined' && unit != null && typeof unit.spr.body != 'undefined' && unit.spr.body != null) {
                            this.crownSpr.x = unit.spr.body.x;
                            this.crownSpr.y = unit.spr.body.y - 70;
                            this.crownSpr.visible = true;
                        }
                        else {
                            this.crownSpr.visible = false;
                        }
                        unit.hasCrown = true;
                    }
                }
                else {
                    if (data[i].name == Constants.MAIN_STATE.player.nameID) {
                        Constants.MAIN_STATE.player.hasCrown = false;
                    }
                    else {
                        var unit = this.findplayerbyid(data[i].name);
                        if (typeof unit != 'undefined' && unit != null && typeof unit.spr != 'undefined' && typeof unit.spr.body != 'undefined') {
                            unit.hasCrown = false;
                        }
                    }
                }
            }
        };
        // When the server notifies us of client disconnection, we find the disconnected
        // enemy and remove from our game
        PlayState.prototype.onRemoveEnemyPlayer = function (data) {
            var removePlayer = this.findplayerbyid(data.id);
            // Player not found
            if (!removePlayer) {
                console.log('Player not found: ', data.id);
                return;
            }
            removePlayer.destroy();
            window.game.enemies.splice(window.game.enemies.indexOf(removePlayer), 1);
        };
        PlayState.prototype.makeSpr = function (withPhysics, sprName) {
            if (withPhysics === void 0) { withPhysics = false; }
            if (sprName === void 0) { sprName = 'default'; }
            //this.game.add.sprite(200, 200, 'simon', );
            var spr = window.game.add.sprite(200, 200, 'simon', 0, this.scaleGroup);
            // ship.smoothed = false;
            /*switch (sprName)
            {
                case 'default':
                    spr.loadTexture('simon');
                break;
                case 'zombie':
                    spr.loadTexture('avaZombie');
                break;
                case 'choo':
                    spr.loadTexture('avaChoo');
                break;
                case 'bender':
                    spr.loadTexture('avaBender');
                break;

            }*/
            spr.loadTexture(Constants.MAIN_STATE.skinNamesObj[sprName]);
            this.scaleGroup.add(spr); //dunno if it's good - owner ctrl is in there as well
            spr.anchor.setTo(0.5);
            spr.animations.add('walk', [0, 1, 2, 1, 0, 3], 10, true);
            spr.animations.add('jump', [4], 4, true);
            spr.animations.add('idle', [0], 4, true);
            spr.animations.add('fall', [0], 4, true);
            spr.play('walk');
            //  Create our physics body. The 'true' parameter enables visual debugging.
            window.game.physics.p2.enable(spr);
            spr.body.rotation = -90;
            spr.body.fixedRotation = true;
            spr.body.setCircle(18);
            if (!withPhysics) {
                spr.body.mass = 100;
                spr.body.static = true;
            }
            else {
                spr.body.mass = 10;
            }
            return spr;
        };
        PlayState.prototype.getNameText = function () {
            var style = { font: 'Pixel Cyr', fill: 'FFffff', align: 'center', wordWrap: true, wordWrapWidth: 180 };
            var nameText = this.game.add.text(this.game.world.centerX, 30, "1", style);
            nameText.anchor.setTo(0.5, 0);
            // this.mainText.font = 'Concert One';
            nameText.fontSize = 17; //20
            nameText.lineSpacing = 5;
            //  this.mainText.align = 'center';
            nameText.stroke = "#000";
            nameText.strokeThickness = 16;
            nameText.colors = ['#FFffff'];
            nameText.stroke = '#000';
            nameText.strokeThickness = 2;
            // this.mainText.width = 850 * ScaleControl.scaleMin;
            nameText.x = this.game.world.width * 0.9;
            nameText.y = this.game.world.height * 0.05;
            nameText.text = 'User';
            return nameText;
        };
        PlayState.prototype.makeEnemyPlayer = function (data, thisPlayer) {
            if (thisPlayer === void 0) { thisPlayer = false; }
            if (typeof data == 'undefined' || data == null) {
                console.log('created data instead of empty');
                data = {
                    user: {
                        name: "Ivan",
                        score: 0
                    },
                    character: {
                        coords: {
                            "xabs": 4,
                            "yabs": 57
                        },
                        direction: -1,
                        health: 10
                    }
                };
                if (thisPlayer) {
                    data.user.name = Constants.PLAYER_NAME;
                }
            }
            /*
             if (typeof data == 'undefined' || data.id == null) {
                 data.id = 0;
             }
             console.log('data.id ' + data.id);
             var existPlayer = this.findplayerbyid(data.id);
             if (existPlayer != null)
                 return;*/
            //id, startx, starty
            var char = data.character.skin;
            if (typeof char == 'undefined') {
                char = 'default';
            }
            var spr = Constants.MAIN_STATE.makeSpr(thisPlayer, char);
            var enemyCtrl = new BaseGame.PlayerCtrl(window.game);
            enemyCtrl.spr = spr;
            enemyCtrl.savedSkin = char;
            if (enemyCtrl.savedSkin == 'unicorn') {
                enemyCtrl.makeAnimatedSpr('rainbow');
            }
            else if (enemyCtrl.savedSkin == 'knightBurn') {
                enemyCtrl.makeAnimatedSpr('burn');
            }
            else {
                if (enemyCtrl.animatedSpr != null)
                    enemyCtrl.animatedSpr.visible = false;
            }
            if (data.character != null && data.character.coords != null) {
                //console.log("data.Character.coords:  " + data.character.coords);
                // console.log('make player. Name: ' + data.user.name + ". X: " + data.character.coords.xabs + ", Y: " + data.character.coords.yabs);
                console.log('make player. Name: ' + data.user.name + ". X tile: " + data.character.coords.x + ", Y tile: " + data.character.coords.y);
                if (typeof data.character.coords.x !== 'undefined') {
                    spr.body.x = data.character.coords.x * this.tileSize + this.tileSize * 0.5;
                    spr.body.y = data.character.coords.y * this.tileSize + this.tileSize * 0.5;
                }
                else {
                    spr.body.x = 0;
                    spr.body.y = 0;
                }
            }
            else {
                console.log("no info about coords");
                spr.body.x = 0;
                spr.body.y = 0;
            }
            if (data.user.name == null)
                data.user.name = 'User_0';
            enemyCtrl.nameID = data.user.name;
            enemyCtrl.health = data.character.health;
            enemyCtrl.score = data.user.score;
            enemyCtrl.sessionID = data.user.session;
            var bar = new BaseGame.BarSpr(this.game, 10, 30, 'fullBar', 'emptBar');
            //this.game.add.existing(bar);
            bar.updateValues(100, 100);
            enemyCtrl.addSprs(spr, bar, this.getNameText());
            enemyCtrl.nameTextSpr.text = enemyCtrl.nameID;
            enemyCtrl.updateBarAndText();
            //  this.game.
            if (thisPlayer) {
                enemyCtrl.spr.name = 'player';
                Constants.MAIN_STATE.player = enemyCtrl;
                window.game.camera.follow(Constants.MAIN_STATE.player.spr);
                enemyCtrl.spr.body.setCollisionGroup(this.playerCollisionGr); //doesnt work
                enemyCtrl.spr.body.collides([this.tilesCollisionGr, this.enemyCollisionGr]); //, Constants.MAIN_STATE.hitTilemap, this
                enemyCtrl.spr.body.createGroupCallback(this.enemyCollisionGr, Constants.MAIN_STATE.hitEnemy, this);
                //Constants.MAIN_STATE.player.spr.body.collides([Constants.MAIN_STATE.tilesCollisionGr, Constants.MAIN_STATE.enemyCollisionGr], Constants.MAIN_STATE.hitEnemy, this);
                //this.game.physics.p2.setPostBroadphaseCallback(this.objsHitProcess, this);
                Constants.MAIN_STATE.startGame();
            }
            else {
                window.game.enemies.push(enemyCtrl);
                this.enemiesGroup.add(enemyCtrl);
                enemyCtrl.spr.name = 'enemy';
                enemyCtrl.spr.body.setCollisionGroup(this.enemyCollisionGr);
                enemyCtrl.spr.body.collides([Constants.MAIN_STATE.playerCollisionGr]); //, Constants.MAIN_STATE.hitEnemy, this);//, this.tilesCollisionGr
                if (data.character.speed.x == 0) {
                    //console.log('speed sent is 0, name: ' + data.user.name);
                    enemyCtrl.spr.animations.frame = 0;
                    enemyCtrl.spr.animations.stop('walk');
                }
                else {
                    enemyCtrl.spr.animations.play('walk');
                }
            }
            if (typeof data.character.swordColor != 'undefined') {
                switch (data.character.swordColor) {
                    case "white":
                        enemyCtrl.swordSpr.tint = 0xffffff;
                        enemyCtrl.hitLineOuterSpr.tint = 0xffffff;
                        break;
                    case "green":
                        enemyCtrl.swordSpr.tint = 0x00ff00;
                        enemyCtrl.hitLineOuterSpr.tint = 0x00ff00;
                        break;
                    case "blue":
                        enemyCtrl.swordSpr.tint = 0x0000ff;
                        enemyCtrl.hitLineOuterSpr.tint = 0x0000ff;
                        break;
                    case "red":
                        enemyCtrl.swordSpr.tint = 0xff0000;
                        enemyCtrl.hitLineOuterSpr.tint = 0xff0000;
                        break;
                }
            }
            this.loseScreenSpr.bringToTop();
            this.playAgainBtn.bringToTop();
            this.gameOverText.bringToTop();
        };
        PlayState.prototype.loadLvl = function () {
            var spikesGID = 3;
            var platformGID = 3;
            var exitGID = 6;
            var bigBlockGID = 5;
            this.curLvl = 0;
            this.curLvlCntrl = new BaseGame.Level1(this.game, this);
            if (typeof this.map != 'undefined' && this.map != null) {
                this.map.destroy();
            }
            this.map = this.game.add.tilemap('lvlLoad');
            //this.map.setTileIndexCallback([3, 4, 6, 7], this.hitSpike, this, '1');//not working with p2
            //  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
            //  This call returns an array of body objects which you can perform addition actions on if
            //  required. There is also a parameter to control optimising the map build.
            this.map.setCollisionBetween(1, 100, true, '1');
            /*
            this.map.createFromObjects('spikesTop', 4, 'doubleSpikes', 1, true, false, this.curLvlCntrl.spikesGroup);
            this.map.createFromObjects('spikesDown', 8, 'doubleSpikes', 1, true, false, this.curLvlCntrl.spikesGroup);
            this.map.createFromObjects('spikesRight', 7, 'doubleSpikes', 1, true, false, this.curLvlCntrl.spikesGroup);
            this.map.createFromObjects('spikesLeft', 5, 'doubleSpikes', 1, true, false, this.curLvlCntrl.spikesGroup);

            var tilesCollisionGroup = this.physics.p2.createCollisionGroup();
            var playerCollisionGroup = this.physics.p2.createCollisionGroup();
            for (var i = 0; i < tileObjects.length; i++) {
                var tileBody = tileObjects[i];
                tileBody.setCollisionGroup(tilesCollisionGroup);
                tileBody.collides(playerCollisionGroup);
            }

            var ship = this.add.sprite(200, 200, 'ship');
            this.physics.p2.enable(ship, false);
            ship.body.setCollisionGroup(playerCollisionGroup);
            ship.body.collides(tilesCollisionGroup);
           

            var spriteMaterial = this.game.physics.p2.createMaterial('spriteMaterial', this.player.spr.body);
            var worldMaterial = this.game.physics.p2.createMaterial('worldMaterial');
            var sideMaterial = this.game.physics.p2.createMaterial('sideMaterial');
             //contactMaterial.friction = 0.0;     // Friction to use in the contact of these two materials.

            //  Here is the contact material. It's a combination of 2 materials, so whenever shapes with
            //  those 2 materials collide it uses the following settings.

            var groundPlayerCM = this.game.physics.p2.createContactMaterial(spriteMaterial, sideMaterial);
            groundPlayerCM.friction = 0;
            groundPlayerCM.stiffness = 1e3;
            groundPlayerCM.relaxation = 0;
            groundPlayerCM.surfaceVelocity = -10.0;

            //  4 trues = the 4 faces of the world in left, right, top, bottom order
            this.game.physics.p2.setWorldMaterial(worldMaterial, false, false, true, true);
            this.game.physics.p2.setWorldMaterial(sideMaterial, true, true, false, false); */
            this.curLvlCntrl.init();
            this.map.addTilesetImage('traptiles', 'tileset', 45, 45, 0, 0, 1);
            // this.map.addTilesetImage('traptiles', 'tileset', 45, 45, 0, 0, 1);
            this.groundLayer = this.map.createLayer('1');
            this.backGroup.add(this.groundLayer);
            this.groundLayer.resizeWorld();
            var saveToChangeDownAr = [];
            var saveToChangeTopAr = [];
            var saveToChangeLeftAr = [];
            var saveToChangeRightAr = [];
            this.spawnPtsAr = [];
            var tileSize = 45;
            for (var y = 0; y < this.map.height; ++y) {
                for (var x = 0; x < this.map.width; ++x) {
                    var tile = this.map.getTile(x, y);
                    if (tile != null) {
                        //set to empty?
                        if (tile.index == 3 + 1 || tile.index == 7 + 1 || tile.index == 6 + 1 || tile.index == 4 + 1 || tile.index == 2 + 1 || tile.index == 5 + 1) {
                            this.map.removeTile(x, y, this.groundLayer);
                        }
                        switch (tile.index) {
                            case 4:
                                saveToChangeTopAr.push(tile);
                                break;
                            case 8:
                                saveToChangeDownAr.push(tile);
                                break;
                            case 7:
                                saveToChangeRightAr.push(tile);
                                break;
                            case 5:
                                saveToChangeLeftAr.push(tile);
                                break;
                            case 3:
                                /* var spike = this.game.add.sprite(200, 200, 'heartSpr');
                                 spike.x = tile.x * tileSize;
                                 spike.y = tile.y * tileSize;
                                 this.scaleGroup.add(spike);*/
                                break;
                            case 6:
                                // this.spawnPtsAr.push(tile);
                                break;
                            case 9:
                                break;
                        }
                    }
                }
            }
            for (var e = 0; e < saveToChangeTopAr.length; ++e) {
                var spike = this.game.add.sprite(200, 200, 'doubleSpikes');
                spike.anchor.set(0.5);
                spike.x = saveToChangeTopAr[e].x * tileSize + tileSize * 0.5;
                spike.y = saveToChangeTopAr[e].y * tileSize + tileSize * 0.5;
                this.curLvlCntrl.spikesGroup.add(spike);
            }
            for (var e = 0; e < saveToChangeDownAr.length; ++e) {
                var spike = this.game.add.sprite(200, 200, 'doubleSpikesDown');
                spike.anchor.set(0.5);
                spike.x = saveToChangeDownAr[e].x * tileSize + tileSize * 0.5;
                spike.y = saveToChangeDownAr[e].y * tileSize + tileSize * 0.5;
                this.curLvlCntrl.spikesGroup.add(spike);
            }
            for (var e = 0; e < saveToChangeRightAr.length; ++e) {
                var spike = this.game.add.sprite(200, 200, 'doubleSpikesRight');
                spike.anchor.set(0.5);
                spike.x = saveToChangeRightAr[e].x * tileSize + tileSize * 0.5;
                spike.y = saveToChangeRightAr[e].y * tileSize + tileSize * 0.5;
                this.curLvlCntrl.spikesGroup.add(spike);
            }
            for (var e = 0; e < saveToChangeLeftAr.length; ++e) {
                var spike = this.game.add.sprite(200, 200, 'doubleSpikesLeft');
                spike.anchor.set(0.5);
                spike.x = saveToChangeLeftAr[e].x * tileSize + tileSize * 0.5;
                spike.y = saveToChangeLeftAr[e].y * tileSize + tileSize * 0.5;
                this.curLvlCntrl.spikesGroup.add(spike);
            }
            //  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
            //  This call returns an array of body objects which you can perform addition actions on if
            //  required. There is also a parameter to control optimising the map build.
            var tiles = this.game.physics.p2.convertTilemap(this.map, this.groundLayer);
            this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);
            this.game.physics.p2.restitution = 0.1;
            this.game.physics.p2.gravity.y = 800;
            this.game.physics.p2.world.defaultContactMaterial.friction = 0;
            // this.game.physics.p2.world.defaultContactMaterial.relaxation = 0.1;//jumpy
            this.game.physics.p2.world.setGlobalStiffness(1e7); //1e7 is ok
            // this.game.physics.p2.world.defaultContactMaterial.frictionRelaxation = 1;
            //  this.game.physics.p2.world.defaultContactMaterial.surfaceVelocity = 50; 
            this.enemyCollisionGr = this.game.physics.p2.createCollisionGroup();
            this.tilesCollisionGr = this.game.physics.p2.createCollisionGroup();
            this.playerCollisionGr = this.game.physics.p2.createCollisionGroup();
            for (var i = 0; i < tiles.length; i++) {
                var tileBody = tiles[i];
                tileBody.setCollisionGroup(this.tilesCollisionGr);
                tileBody.collides([this.playerCollisionGr]); //, this.objsHitProcess, this);//, this.enemyCollisionGr
            }
            //console.log("length ar " + tiles.length);
            // this.groundLayer.debug = true;
            //  Here are some more options you can set:
            // contactMaterial.friction = 0.0;     // Friction to use in the contact of these two materials.
            // contactMaterial.restitution = 0.0;  // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
            // contactMaterial.stiffness = 1e3;    // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
            // contactMaterial.relaxation = 0;     // Relaxation of the resulting ContactEquation that this ContactMaterial generate.
            // contactMaterial.frictionStiffness = 1e7;    // Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
            // contactMaterial.frictionRelaxation = 3;     // Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
            // contactMaterial.surfaceVelocity = 0.0;        // Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.
            /*
            this.platformGroup.forEach((item) => {
                //item.scale.set(ScaleControl.scaleXUse, ScaleControl.scaleYUse);
                item.rememberPos();
                item.visible = true;
            }, this, false);
            */
            // console.log("length this.platformGroup: " + this.platformGroup.length);
            // this.map.createFromObjects('exit', exitGID, 'exit', 0, true, false, this.curLvlCntrl.exitGr);
            //this.game.physics.enable(this.spikesGroup);
            // this.scaleGroup.removeChild(this.player.spr);
            // this.scaleGroup.add(this.player.spr);
            this.resize();
            // console.log("2 test platform info: X: " + this.platform1.x + " Y: " + this.platform1.y + ". Visible: " + this.platform1.visible);
            // this.hudGroup.add(this.musicBtn);
        };
        PlayState.prototype.hitSpike = function (sprite, tile) {
            console.log('hit spike');
            tile.alpha = 0.2;
            this.groundLayer.dirty = true;
            return false;
        };
        PlayState.prototype.resetPlayerPos = function () {
            /* console.log("reset player pos");
             console.log("this.world.width " + this.world.width * 0.3);
             console.log("this.groundLayer.height-300 " + (this.world.height - 300));*/
            this.player.fall();
        };
        PlayState.prototype.resetLevelPos = function () {
            if (typeof this.curLvlCntrl !== 'undefined' && this.curLvlCntrl != null)
                this.curLvlCntrl.resetLvl();
            this.player.isDead = false;
            this.noHitTimer = this.noHitTimer = this.game.time.now + 350;
        };
        PlayState.prototype.destroLvl = function () {
            //console.log('destroy all');
            this.map.destroy();
            this.groundLayer.destroy();
            this.scaleGroup.removeChild(this.curLvlCntrl.platformGroup);
            this.curLvlCntrl.destroyLvl();
            this.curLvlCntrl = null;
            /*
            for (var i = 0; i < (<any>window).game.hearts.length; i++) {
                (<any>window).game.hearts[i].destroy();
            }

            for (var i = 0; i < (<any>window).game.coins.length; i++) {
                (<any>window).game.coins[i].destroy();
            }
            */
        };
        PlayState.prototype.musicSwitch = function () {
            if (this.music.isPlaying) {
                this.music.pause();
            }
            else {
                this.music.resume();
            }
        };
        PlayState.prototype.startGame = function () {
            this.resize();
            this.livesLeft = this.livesMax;
            //this.livesBar.updateValues(this.livesLeft, this.livesMax);
            // this.game.paused = false;
            this.resetLevelPos();
            this.resetPlayerPos();
        };
        PlayState.prototype.loseLife = function () {
            /*if (Constants.MUSIC_ON)
                Constants.MAIN_STATE.loseLifeSnd.play();

            let tween = this.game.add.tween(this.redScreen).to({
                alpha: 1
            }, 400, Phaser.Easing.Cubic.In, true, 0);

            tween.onComplete.add(function () {
                let tween = this.game.add.tween(this.redScreen).to({
                    alpha: 0
                }, 400, Phaser.Easing.Cubic.Out, true, 0);
            }, this);
            */
            if (this.loseScreenSpr.visible || window.checkGameOverScreenOn() || (this.player.isShowingDeathAnim))
                return;
            if (this.game.time.now > this.noHitTimer) {
                this.noHitTimer = this.game.time.now + 2000;
            }
            else {
                return;
            }
            console.log('hit spike');
            window.socket.emit('hit', {
                damage: 'spike', auth: Constants.MAIN_STATE.authInfo
            });
            if (Constants.MUSIC_ON)
                Constants.MAIN_STATE.hitSnd.play();
            this.player.showHurt();
            var resetTimer = this.game.time.create(true);
            //  Set a TimerEvent to occur after 2 seconds
            resetTimer.repeat(700, 1, this.resetLevelPos, this);
            //  Start the timer running - this is important!
            //  It won't start automatically, allowing you to hook it to button events and the like.
            resetTimer.start();
            //console.log("lose life");
            // this.livesLeft--;
            //this.player.health -= 10;
            if (this.player.health <= 0) {
            }
            else {
            }
            //this.livesBar.updateValues(this.livesLeft, this.livesMax);
            //this.spawnAppearText(this.livesBar.x + 60 * ScaleControl.scaleMin, this.livesBar.y + 120 * ScaleControl.scaleYUse, "-1", 1, "#F01B00");
        };
        PlayState.prototype.cleanPlayers = function () {
            for (var i = 0; i < window.game.enemies.length; i++) {
                if (window.game.enemies[i] != null) {
                    window.game.enemies[i].destroy();
                }
            }
            window.game.enemies.splice(0, window.game.enemies.length);
        };
        PlayState.prototype.endGame = function () {
            if (this.player.isDead)
                return;
            //this.destroLvl();
            this.curLvl = 0;
            console.log('end game');
            window.goldStat = this.player.score;
            window.killStat = this.player.killScore;
            window.timeStat = Utils.formatTime(this.curPlayTime / 1000);
            // this.loadLvl();
            /*
            this.loseScreenSpr.visible = true;
            this.playAgainBtn.visible = true;
            this.gameOverText.visible = true; //uncomment to show
            */
            if (this.player.killerNameID.length > 0) {
                window.killUser = this.player.killerNameID;
                this.gameOverText.visible = true;
                this.gameOverText.text = 'Was killed by ' + this.player.killerNameID;
            }
            else {
                this.gameOverText.visible = false;
            }
            Constants.MAIN_STATE.checkDidUnlock();
            Constants.MAIN_STATE.upgrGr.upgradeLvlHeart = 1;
            Constants.MAIN_STATE.upgrGr.upgradeLvlSword = 1;
            Constants.MAIN_STATE.cleanPlayers();
            window.game.physics.p2.clear();
            window.averageFPS = this.allFps / this.countedFrames;
            //console.log("average fps: " + (<any>window).averageFPS);
            if (this.allFps != 0) {
                window.socket.emit('stats', {
                    minfps: window.game.time.fpsMin, avgfps: Math.floor(this.allFps / this.countedFrames),
                    maxfps: window.game.time.fpsMax, id: Constants.MAIN_STATE.givenLoginID, auth: Constants.MAIN_STATE.authInfo
                });
            }
            // (<any>window).game.socket.disconnect();
            this.allFps = 0;
            this.countedFrames = 0;
            window.showGameOver();
            this.game.paused = true;
            this.player.stop();
            // this.player.resetAtStart();
            ScaleControl.renew(this.game);
            if (this.playAgainBtn.visible) {
                this.add.tween(this.playAgainBtn.scale).to({ y: 1.1 * ScaleControl.scaleMin, x: 1.1 * ScaleControl.scaleMin }, 500, Phaser.Easing.Elastic.Out, true, 0, -1, true);
            }
            this.loseScreenSpr.bringToTop();
            this.playAgainBtn.bringToTop();
            this.gameOverText.bringToTop();
            this.gameOverText.x = this.game.width * 0.5;
            this.gameOverText.y = this.game.height * 0.6;
            this.playAgainBtn.x = this.game.width * 0.5;
            this.playAgainBtn.y = this.game.height * 0.8;
            // this.game.paused = true;
            //this.startGame();
        };
        PlayState.prototype.callCollide = function () {
            // console.log("collide");
            if (this.curLvl == 0) {
            }
        };
        PlayState.prototype.controlTraps = function () {
            if (this.player.isDead)
                return;
            if (typeof this.curLvlCntrl !== 'undefined' && this.curLvlCntrl != null)
                this.curLvlCntrl.update();
        };
        //This is where we use the socket id. 
        //Search through enemies list to find the right enemy of the id.
        PlayState.prototype.findplayerbyid = function (id) {
            for (var i = 0; i < window.game.enemies.length; i++) {
                if (window.game.enemies[i].nameID == id) {
                    return window.game.enemies[i];
                }
            }
        };
        PlayState.prototype.addText = function (_x, _y, _text, boundSpr, fixedCamera, timeAlive) {
            if (boundSpr === void 0) { boundSpr = null; }
            if (fixedCamera === void 0) { fixedCamera = false; }
            if (timeAlive === void 0) { timeAlive = -1; }
            var text = new BaseGame.AppearText(this.game, _x, _y);
            if (boundSpr != null) {
                text.playerBoundSpr = boundSpr;
                boundSpr.appearText = text;
            }
            this.game.add.existing(text);
            text.text = _text;
            if (timeAlive != -1) {
                text.timeAlive = timeAlive;
            }
            text.launch();
            if (fixedCamera) {
                text.fixedToCamera = true;
            }
        };
        PlayState.prototype.changeSkin = function (nameGiven) {
            if (typeof nameGiven == 'undefined' || nameGiven == null) {
                nameGiven = 'default';
            }
            window.socket.emit('changeSkin', /*JSON.stringify(*/ {
                auth: Constants.MAIN_STATE.authInfo,
                name: nameGiven,
                id: Constants.MAIN_STATE.givenLoginID
            });
        };
        PlayState.prototype.update = function () {
            if (this.upKey.justDown) {
                var skins = ['default', 'unicorn', 'knightBurn']; //, 'whiteHair', 'skeleton', 'mario', 'spiderman', 'redHat', 'batman', 'panda', 'zombie', 'choo', 'bender'
                this.lastSkin = Utils.scrollingValue(this.lastSkin, skins.length - 1, 1, -1);
                console.log("NO CHANGE skinIndx: " + this.lastSkin + " Skin: " + skins[this.lastSkin]);
            }
            if (this.upKey2.justDown) {
                /*
                (<any>window).game.socket.emit('hit', {
                    damage: 'spike', auth: Constants.MAIN_STATE.authInfo
                });
                (<any>window).game.socket.emit('hit', {
                    damage: 'spike', auth: Constants.MAIN_STATE.authInfo
                });*/
                /* this.player.score += 10;
                 this.upgrGr.renewInfoText();
                 this.upgrGr.checkVisibility();*/
                /*if (typeof Constants.MAIN_STATE.upgrGr != 'undefined') {
                    Constants.MAIN_STATE.upgrGr.renewInfoText();
                    Constants.MAIN_STATE.upgrGr.updateBtnTexts();
                    Constants.MAIN_STATE.upgrGr.checkVisibility();
                }*/
                // this.destroLvl();
                // this.loadLvl();
                // this.resetGame();
                /* this.player.spr.body.x = 100;
                 this.player.spr.body.y = 100; */
                //this.addText(this.player.spr.body.x, this.player.spr.body.y - this.player.spr.height-60, 'Test text here lala', this.player);
                // console.log("checkGameOverScreenOn() " + (<any>window).checkGameOverScreenOn());
                // this.livesLeft = 1;
                this.resetSavedUnlocks();
            }
            this.allFps += this.game.time.fps;
            this.countedFrames++;
            if (window.checkGameOverScreenOn() == false && !this.game.paused) {
                this.curPlayTime += this.game.time.elapsedMS;
            }
            this.controlTraps();
            if (typeof this.player.spr !== 'undefined' && this.player.spr != null) {
                this.player.update();
            }
            //Make the sprite collide with the ground layer
            /* this.game.physics.arcade.collide(this.player, this.groundLayer, this.callCollide, null, this);
             // this.game.physics.arcade.collide(this.player, this.platformLayer, null, null, this);
             this.game.physics.arcade.collide(this.player, this.curLvlCntrl.bigBlock, null, null, this);
             */
        };
        PlayState.prototype.endLvl = function () {
            if (this.curLvl < this.maxLvls - 1) {
                this.curLvl++;
                this.destroLvl();
                this.loadLvl();
                this.startGame();
            }
            else {
                this.startGame();
            }
        };
        PlayState.prototype.resizeBtns = function () {
            /*this.jumpBtn.x = (this.game.width * 0.9);
            this.jumpBtn.y = this.game.height * 0.85;
            this.jumpBtn.scale.set(ScaleControl.scaleMin * 1.9, ScaleControl.scaleMin * 1.9);
            this.rightBtn.x = (60 + 200) * ScaleControl.scaleXUse;
            this.rightBtn.y = this.game.height * 0.85;
            this.rightBtn.scale.set(ScaleControl.scaleMin * 1.9, ScaleControl.scaleMin * 1.9);
            this.leftBtn.x = (60 + 40) * ScaleControl.scaleXUse;
            this.leftBtn.y = this.game.height * 0.85;
            this.leftBtn.scale.set(ScaleControl.scaleMin * 1.9, ScaleControl.scaleMin * 1.9);*/
        };
        PlayState.prototype.render = function () {
            // update FPS
            this.fpsText.text = 'FPS: ' + (String(this.game.time.fps) || '--');
            /* if (typeof this.player.spr != 'undefined'&&this.player.spr!=null)
             this.game.debug.body(this.player.spr);
           
              this.game.debug.bodyInfo(this.player.spr, 32, 32);
             this.game.debug.bodyInfo(this.curLvlCntrl.bigBlock, 32, 32);
             this.game.debug.body(this.curLvlCntrl.bigBlock); */
            /* this.game.debug.body(this.platform2)
             this.game.debug.body(this.platform3);
             this.game.debug.body(this.bigBlock); */
        };
        PlayState.prototype.updateHUDresize = function () {
            this.loseScreenSpr.height = this.game.height;
            this.loseScreenSpr.width = this.game.width;
            this.loseScreenSpr.anchor.setTo(0, 0);
            this.loseScreenSpr.x = 0; //this.game.width*0.5,
            this.loseScreenSpr.y = 0; //this.game.height*0.5;
            this.gameOverText.x = this.game.width * 0.5;
            this.gameOverText.y = this.game.height * 0.6;
            this.gameOverText.fixedToCamera = true;
            this.musicBtn.fixedToCamera = true;
            this.musicBtn.x = this.game.width - 40;
            this.musicBtn.y = this.leaderBoard.fillDarkSpr.y + this.leaderBoard.fillDarkSpr.height + 40;
            this.musicBtn.fixedToCamera = true;
            //console.log('music btn x ' + this.musicBtn.x );
            if (this.playAgainBtn.visible) {
                this.add.tween(this.playAgainBtn.scale).to({ y: 1.1 * ScaleControl.scaleMin, x: 1.1 * ScaleControl.scaleMin }, 500, Phaser.Easing.Elastic.Out, true, 0, -1, true);
            }
            this.playAgainBtn.x = this.game.width * 0.5;
            this.playAgainBtn.y = this.game.height * 0.8;
            this.playAgainBtn.fixedToCamera = true;
            // this.livesBar.scale.set(ScaleControl.scaleXUse * 0.8, ScaleControl.scaleYUse * 0.8);
        };
        /*
        * if game is set to scalemode RESIZE, then browser will call resize() each time resize happens.
        */
        PlayState.prototype.resize = function () {
            Constants.MAIN_STATE = this;
            if (this.game == null || this.game.world == null)
                return;
            ScaleControl.renew(this.game);
            // console.log("resize scaleX: " + ScaleControl.scaleX + " ScaleControl.scaleY: " + ScaleControl.scaleY);
            if (this.game.width < this.game.height) {
            }
            else {
                ScaleControl.hideTurn();
                this.game.paused = false; //will turn off all pauses
            }
            // console.log(" this.game.paused " + this.game.paused);
            if ((this.game != null && this.game.world != null) && (this.background != null && this.groundLayer != null)) {
                this.player.renewUsualPhysics();
                // console.log("RESIZE this.game.width " + this.game.width + ", Height: " + this.game.height);
                //this.map.setScale(ScaleControl.scaleXUse, ScaleControl.scaleYUse);
                // this.groundLayer.setScale(ScaleControl.scaleXUse, ScaleControl.scaleYUse);
                if (this.game != null && this.game.world != null) {
                    this.groundLayer.resizeWorld();
                    this.groundLayer.resize(this.game.width, this.game.height);
                }
                this.underMapScale.scale.set(ScaleControl.scaleXUse, ScaleControl.scaleYUse);
                //this.scaleGroup.scale.set(ScaleControl.scaleXUse, ScaleControl.scaleYUse); 
                this.fpsText.fixedToCamera = true;
                this.fpsText.x = 5;
                this.fpsText.y = this.game.height - 30;
                this.fpsText.fixedToCamera = true;
                //this.curLvlCntrl.resize();
                // this.resizeBtns();
                /*
                this.musicBtn.x = this.game.world.width - 105 * ScaleControl.scaleX;
                this.musicBtn.y = 34 * ScaleControl.scaleY;
                this.musicBtn.scale.set(ScaleControl.scaleXUse, ScaleControl.scaleYUse);
                */
                /*if (this.endMenu.visible) {
                    this.endMenu.resize();
                }

                this.topDark.height = this.game.height;
                this.topDark.width = this.game.width;
                this.topDark.anchor.setTo(0.5, 0.5);
                this.topDark.x = this.game.world.centerX,
                this.topDark.y = this.game.world.centerY;


                this.pauseBtn.x = this.game.world.width - 55 * ScaleControl.scaleX;
                this.pauseBtn.y = 10 * ScaleControl.scaleY;
                this.pauseBtn.scale.set(ScaleControl.scaleXUse, ScaleControl.scaleYUse);
                */
                this.updateHUDresize();
                this.leaderBoard.resize();
                this.upgrGr.resize();
                this.background.height = this.game.height;
                this.background.width = this.game.width;
                this.background.anchor.setTo(0.5, 0.5);
                this.background.x = this.game.world.centerX,
                    this.background.y = this.game.world.centerY;
            }
        };
        return PlayState;
    }(Phaser.State));
    BaseGame.PlayState = PlayState;
})(BaseGame || (BaseGame = {}));
/// <reference path="./libs/phaser.d.ts" />
/// <reference path="PlayState.ts" />
/**
 * All the global variables which will be used throughout the game.
 */
var Constants = (function () {
    function Constants() {
    }
    return Constants;
}());
//Size and scale
Constants.PLAYER_NAME = 'Name';
Constants.GAME_SCALE = 1;
Constants.CALCULATED_WIDTH = 0;
Constants.CALCULATED_HEIGHT = 0;
Constants.GAME_WIDTH = 990;
Constants.GAME_HEIGHT = 630;
Constants.LANDSCAPE_LOCKED = true;
Constants.PORTRAIT_LOCKED = false;
Constants.MUSIC_ON = true;
/// <reference path="./libs/phaser.d.ts" />
var BaseGame;
(function (BaseGame) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Preloader.prototype.preload = function () {
            this.preloadBar = new BaseGame.BarSpr(this.game, this.game.world.centerX, this.game.world.centerY - 20, 'preloadBar', 'preloadBarEmpt');
            // this.load.setPreloadSprite(this.preloadBar);
            this.createAssets();
            //  Firefox doesn't support mp3 files, so use ogg
            //this.game.load.audio('boden', ['assets/audio/bodenstaendig_2000_in_rock_4bit.mp3', 'assets/audio/bodenstaendig_2000_in_rock_4bit.ogg']);
            ScaleControl.renew(this.game);
            this.resize();
        };
        Preloader.prototype.createAssets = function () {
            var clientStr = '.';
            //clientStr = 'client';
            this.load.image('gameOver', clientStr + '/assets/loading.png');
            this.load.spritesheet('simon', clientStr + '/assets/avaSheet_1.png', 25, 35, 5);
            this.load.image('back', clientStr + '/assets/back.png');
            this.load.image('tileset', clientStr + '/assets/tiles.png');
            this.load.image('tile', clientStr + '/assets/tile45.png');
            this.load.image('tileUpside', clientStr + '/assets/tile45Ups.png');
            this.load.image('tileEmpt', clientStr + '/assets/tile45emp.png');
            this.load.audio('jumpSnd', './assets/audio/Jump.mp3', true);
            this.load.audio('hurtSnd', './assets/audio/Hit_Hurt.mp3', true);
            this.load.audio('pickupSnd', './assets/audio/PickupCoin.mp3', true);
            this.load.audio('swooshSnd', './assets/audio/Swish.mp3', true);
            this.load.image('onMusicBtn', clientStr + '/assets/onMusicBtn.png');
            this.load.image('offMusicBtn', clientStr + '/assets/offMusicBtn.png');
            this.load.image('sword', clientStr + '/assets/sword.png');
            this.load.image('hitLineInner', clientStr + '/assets/hitLineInner.png');
            this.load.image('hitLineOuter', clientStr + '/assets/hitLineOuter.png');
            this.load.image('fullBar', clientStr + '/assets/fullBar.png');
            this.load.image('emptBar', clientStr + '/assets/emptBar.png');
            this.load.image('heartSpr', clientStr + '/assets/hearBig.png');
            this.load.image('coin', clientStr + '/assets/coin.png');
            this.load.image('swordIcon', clientStr + '/assets/swordIcon.png');
            this.load.image('heartIcon', clientStr + '/assets/heartIcon.png');
            this.load.spritesheet('unicornAva', clientStr + '/assets/unicorn.png', 25, 34, 5);
            this.load.spritesheet('avaBurnKnight', clientStr + '/assets/knightBurn.png', 25, 37, 5);
            this.load.spritesheet('rainbow', clientStr + '/assets/unicornRainbow.png', 25, 41, 7);
            this.load.spritesheet('burn', clientStr + '/assets/burn.png', 36, 28, 5);
            this.load.spritesheet('avaZombie', clientStr + '/assets/avaSheet_zombie.png', 25, 35, 5);
            this.load.spritesheet('avaChoo', clientStr + '/assets/avaSheet_choo.png', 25, 35, 5);
            this.load.spritesheet('avaBender', clientStr + '/assets/avaSheet_bender.png', 25, 34, 5);
            this.load.spritesheet('avaPanda', clientStr + '/assets/avaSheet_panda.png', 25, 34, 5);
            this.load.spritesheet('avaRedHat', clientStr + '/assets/redHat.png', 25, 34, 5);
            this.load.spritesheet('batmanAva', clientStr + '/assets/batmanAva.png', 25, 34, 5);
            this.load.spritesheet('spidermanAva', clientStr + '/assets/avaSheet_spiderMan.png', 25, 34, 5);
            this.load.spritesheet('marioAva', clientStr + '/assets/avaSheet_mario.png', 25, 34, 5);
            this.load.spritesheet('whiteHairAva', clientStr + '/assets/avaSheet_whiteHair.png', 25, 34, 5);
            this.load.spritesheet('skeletonAva', clientStr + '/assets/avaSheet_skeleton.png', 25, 34, 5);
            this.load.image('doubleSpikes', clientStr + '/assets/double_spikes.png');
            this.load.image('doubleSpikesDown', clientStr + '/assets/double_spikes_down.png');
            this.load.image('doubleSpikesLeft', clientStr + '/assets/double_spikes_left.png');
            this.load.image('doubleSpikesRight', clientStr + '/assets/double_spikes_right.png');
            this.load.image('menuLogo', clientStr + '/assets/loading.png');
            this.load.image('menuBack', clientStr + '/assets/loading.png');
            this.load.image('menuStart', clientStr + '/assets/loading.png');
            this.load.image('spikes', clientStr + '/assets/spikes.png');
            this.load.image('exit', clientStr + '/assets/exit60.png');
            this.load.image('bigBlock', clientStr + '/assets/tileBigBlock.png');
            this.load.image('sideBlock', clientStr + '/assets/platform_1.png');
            this.load.image('sideBlockSpikes', clientStr + '/assets/sideSpikes1.png');
            this.load.image('pauseBtn', clientStr + '/assets/pauseBtn.png');
            this.load.image('lifeBarFull', clientStr + '/assets/lives10bar.png');
            this.load.image('lifeBarEmpt', clientStr + '/assets/lives10empt.png');
            this.load.image('crown', clientStr + '/assets/crown.png');
            this.load.image('gold', clientStr + '/assets/gold.png');
            /*this.load.tilemap('lvlBegin', clientStr +'/assets/mapTrapAdv_0.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('lvl0', clientStr + '/assets/mapTrapAdv.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('lvl1', clientStr +'/assets/lvl1.json', null, Phaser.Tilemap.TILED_JSON);*/
            //this.load.tilemap('lvlLoad', clientStr + '/assets/lvl1.json', null, Phaser.Tilemap.TILED_JSON);//temp
        };
        Preloader.prototype.loadUpdate = function () {
            // update loading text percent           
            //this.setLoadingText(this.load.progress); 
            //console.log("preloader " + this.load.progress);
            //this.preloadBar.scale.x = this.load.progress / 100 * ScaleControl.scaleX;
            // console.log("this.game.world.centerX " + this.game.world.centerX + ". this.game.world.centerY " + this.game.world.centerY + " ScaleControl.scaleY " + ScaleControl.scaleY);
            //  console.log("this.game.world.centerX SCALE " + this.game.world.centerX / ScaleControl.scaleXUse + ". this.game.world.centerY " + this.game.world.centerY / ScaleControl.scaleYUse);
            //  console.log("this.preloadBar.x " + this.preloadBar.spriteFull.x + " this.preloadBar.spriteFull.y " + this.preloadBar.spriteFull.y);
            this.preloadBar.setXY(this.game.world.centerX / ScaleControl.scaleXUse - this.preloadBar.width * 0.5 / ScaleControl.scaleXUse, this.game.world.centerY / ScaleControl.scaleYUse);
            this.preloadBar.scale.x = ScaleControl.scaleX;
            this.preloadBar.scale.y = ScaleControl.scaleY;
            this.preloadBar.updateValues(this.load.progress, 100);
            //loaderTween = game.add.tween(loader_elements.redgraphics).to({angle:this.load.progress*1.8}, 250, Phaser.Easing.Linear.None,true);
        };
        Preloader.prototype.create = function () {
            var tween = this.add.tween(this.preloadBar)
                .to({ alpha: 0 }, 100, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
            this.resize();
        };
        /*
     * if game is set to scalemode RESIZE, then browser will call resize() each time resize happens.
     */
        Preloader.prototype.resize = function () {
            /*console.log("preload resize this.preloadBar.x " + this.preloadBar.x + " Y " + this.preloadBar.y );
            console.log("preload resize this.preloadBar.width " + this.preloadBar.width);
            console.log("this.game.width " + this.game.width + " this.game.height " + this.game.height);*/
            ScaleControl.renew(this.game);
            this.loadUpdate();
            if (this.preloadBar != null) {
                //this.words.scale.set(this.scaleMin, this.scaleMin);
                this.preloadBar.scale.set(ScaleControl.scaleX, ScaleControl.scaleY);
            }
        };
        Preloader.prototype.startMainMenu = function () {
            ScaleControl.renew(this.game);
            if (window.document.getElementById("title").style.display !== "none") {
                this.game.state.start('MainMenu', true, false); //PlayState
                console.log('load menu');
                window.$("#bannerSpr").show();
            }
            else {
                this.game.state.start('PlayState', true, false);
                console.log('load play');
            }
        };
        return Preloader;
    }(Phaser.State));
    BaseGame.Preloader = Preloader;
})(BaseGame || (BaseGame = {}));
/// <reference path="./libs/phaser.d.ts" />
var BaseGame;
(function (BaseGame) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MainMenu.prototype.create = function () {
            this.background = this.add.sprite(0, 0, 'menuBack');
            this.background.alpha = 0;
            this.playBtn = this.game.add.button(this.world.centerX, 520, 'menuStart');
            this.playBtn.anchor.setTo(0.5);
            this.logo = this.add.sprite(this.world.centerX, -300, 'menuLogo');
            this.logo.anchor.setTo(0.5);
            this.add.tween(this.background).to({ alpha: 1 }, 1000, Phaser.Easing.Bounce.InOut, true);
            //this.add.tween(this.logo.scale).to({ y: 1.1, x: 1.1 }, 500, Phaser.Easing.Elastic.Out, true, 0, -1, true);
            this.add.tween(this.playBtn.scale).to({ y: 1.1, x: 1.1 }, 500, Phaser.Easing.Elastic.Out, true, 0, -1, true);
            this.game.stage.disableVisibilityChange = true;
            // this.input.onDown.addOnce(this.fadeOut, this);
            this.playBtn.events.onInputUp.add(function (_) {
                this.fadeOut();
            }, this);
            window.game.loaded = true;
            this.inputfield = this.game.add.inputField(10, 10, {
                placeHolder: 'Username',
                font: '22px Arial',
                width: 250
            });
            this.inputfield.anchor.set(0, 0);
            this.resize();
            this.background.visible = this.playBtn.visible = this.logo.visible = this.inputfield.visible = false;
        };
        MainMenu.prototype.fadeOut = function () {
            this.add.tween(this.background).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
            var tween = this.add.tween(this.playBtn).to({ y: 900 }, 500, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
        };
        MainMenu.prototype.startGame = function () {
            this.background.visible = this.playBtn.visible = this.logo.visible = false;
            Constants.PLAYER_NAME = this.inputfield.value;
            if (Constants.PLAYER_NAME == '' || Constants.PLAYER_NAME == null) {
                Constants.PLAYER_NAME = 'User';
            }
            console.log('player name ' + this.inputfield.value);
            this.game.state.start('PlayState', true, false);
        };
        MainMenu.prototype.update = function () {
            this.inputfield.update();
        };
        /*
        * if game is set to scalemode RESIZE, then browser will call resize() each time resize happens.
         */
        MainMenu.prototype.resize = function () {
            ScaleControl.scaleX = this.game.width / Constants.GAME_WIDTH;
            ScaleControl.scaleY = this.game.height / Constants.GAME_HEIGHT;
            ScaleControl.scaleMin = Math.min(ScaleControl.scaleX, ScaleControl.scaleY);
            if (this.game.width < this.game.height) {
            }
            else {
                ScaleControl.hideTurn();
            }
            if (this.background != null) {
                this.background.height = this.game.height;
                this.background.width = this.game.width;
                this.background.anchor.setTo(0.5, 0.5);
                this.background.x = this.game.world.centerX,
                    this.background.y = this.game.world.centerY;
                //this.words.scale.set(this.scaleMin, this.scaleMin);
                this.playBtn.scale.set(ScaleControl.scaleMin, ScaleControl.scaleMin);
                this.playBtn.x = this.world.centerX;
                this.playBtn.y = 520 * ScaleControl.scaleY;
                this.add.tween(this.playBtn.scale).to({ y: 1.1 * ScaleControl.scaleMin, x: 1.1 * ScaleControl.scaleMin }, 500, Phaser.Easing.Elastic.Out, true, 0, -1, true);
                this.logo.scale.set(ScaleControl.scaleMin, ScaleControl.scaleMin);
                this.logo.x = this.world.centerX;
                this.logo.y = 250 * ScaleControl.scaleY;
                this.inputfield.scale.set(ScaleControl.scaleMin, ScaleControl.scaleMin);
                this.inputfield.x = this.world.centerX - this.inputfield.width * 0.5;
                this.inputfield.y = 100 * ScaleControl.scaleY;
            }
        };
        return MainMenu;
    }(Phaser.State));
    BaseGame.MainMenu = MainMenu;
})(BaseGame || (BaseGame = {}));
/// <reference path="./libs/phaser.d.ts" />
/// <reference path="Boot.ts" />
/// <reference path="Preloader.ts" />
/// <reference path="MainMenu.ts" />
/// <reference path="PlayerCtrl.ts" />
//import NchanSubscriber = require('nchan');
/*
import * as BootModule from "./Boot";
import Boot = BootModule.BaseGame.Boot;

import * as Level1Module from "./Level1";
import Level1 = Level1Module.BaseGame.Level1;

import * as MainMenuModule from "./MainMenu";
import MainMenu = MainMenuModule.BaseGame.MainMenu;

import * as PreloaderModule from "./Preloader";
import Preloader = PreloaderModule.BaseGame.Preloader;*/
var BaseGame;
(function (BaseGame) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            var _this = _super.call(this, 990, 630, Phaser.CANVAS, 'game') || this;
            /*
                //if (typeof (<any>window).io !== 'undefined') {
               // this.socket = (<any>window).io({ transports: ['websocket'], upgrade: false });
                this.socket = new NchanSubscriber(url, opt); // NchanSubscriber is a global variable.
                this.socket.start(); // begin (or resume) subscribing
                this.socket.stop(); // stop subscriber. do not reconnect.

                this.createForSocket();
            }*/
            _this.enemies = [];
            _this.hearts = [];
            _this.coins = [];
            _this.wallets = [];
            _this.gameProperties = {
                gameWidth: 4000,
                gameHeight: 4000,
                game_elemnt: "game",
                in_game: false,
            };
            _this.state.add('Boot', BaseGame.Boot, false);
            _this.state.add('Preloader', BaseGame.Preloader, false);
            _this.state.add('MainMenu', BaseGame.MainMenu, false);
            _this.state.add('PlayState', BaseGame.PlayState, false);
            _this.state.start('Boot');
            return _this;
        }
        // this function is fired when we connect
        /*onsocketConnected() {
           console.log("connected to server");
           (<any>window).game.gameProperties.in_game = true;
           (<any>window).game.enemies = [];
           //(<any>window).game.load.json('version', 'http://phaser.io/version.json');
   
           (<any>window).game.state.start('Boot');
          
           // send the server our initial position and tell it we are connected
           socket.emit('new_player', {x: 0, y: 0, angle: 0});
           
       }
   
   
       onsocketDisconnected() {
           (<any>window).game.state.start('MainMenu', true, false);
       }
   
       createForSocket() {
           //this.game.stage.backgroundColor = 0xE1A193;
   
           console.log("client started");
           this.socket.on("connect", this.onsocketConnected);
           this.socket.on("disconnect", this.onsocketDisconnected);
           //listen to new enemy connections
          // this.socket.on("new_enemyPlayer", onNewPlayer);
          // this.socket.on("create_player", this.createPlayer);
         */
        /*
        //listen for main player creation
        socket.on("create_player", createPlayer);

        //listen to enemy movement
        socket.on("enemy_move", onEnemyMove);
        //when received remove_player, remove the player passed;
        socket.on('remove_player', onRemovePlayer);
        //when the player receives the new input
        socket.on('input_recieved', onInputRecieved);
        //when the player gets killed
        socket.on('killed', onKilled);
        //when the player gains in size
        socket.on('gained', onGained);
        // check for item removal
        socket.on('itemremove', onitemremove);
        // check for item update
        socket.on('item_update', onitemUpdate);
        // check for leaderboard
        socket.on('leader_board', lbupdate);
        
    }*/
        Game.prototype.createPlayer = function () {
            /*
            this.socket.player = {
                id: server.lastPlayderID++,
                x: randomInt(100, 400),
                y: randomInt(100, 400)
            };*/
        };
        return Game;
    }(Phaser.Game));
    BaseGame.Game = Game;
})(BaseGame || (BaseGame = {}));
window.onload = function () {
    window.game = new BaseGame.Game();
};
/// <reference path="./libs/phaser.d.ts" />
/// <reference path="LevelBase.ts" />
var BaseGame;
(function (BaseGame) {
    var LevelBegin = (function (_super) {
        __extends(LevelBegin, _super);
        function LevelBegin(game, state) {
            var _this = _super.call(this, game, state) || this;
            _this.trapsActivated = 0;
            _this.didVisit2Platform = false;
            _this.bigBlockMoved = false;
            _this.create();
            _this.addGroupsToState();
            return _this;
        }
        LevelBegin.prototype.create = function () {
            this.exitGr = this.game.add.group();
        };
        LevelBegin.prototype.init = function () {
        };
        LevelBegin.prototype.addGroupsToState = function () {
        };
        LevelBegin.prototype.resetLvl = function () {
        };
        LevelBegin.prototype.destroyLvl = function () {
            //super.destroyLvl();
            this.exitGr.forEach(function (item) {
                item.destroy();
            }, this, false);
            this.startZone.destroy();
        };
        LevelBegin.prototype.trapsControl = function () {
        };
        LevelBegin.prototype.resize = function () {
            // super.resize();
        };
        LevelBegin.prototype.update = function () {
        };
        return LevelBegin;
    }(BaseGame.LevelBase));
    BaseGame.LevelBegin = LevelBegin;
})(BaseGame || (BaseGame = {}));
var BaseGame;
(function (BaseGame) {
    var LoseGroup = (function (_super) {
        __extends(LoseGroup, _super);
        function LoseGroup(_game) {
            var _this = _super.call(this, _game) || this;
            _this.fillDarkSpr = _this.game.add.graphics(Constants.GAME_WIDTH, Constants.GAME_HEIGHT);
            // set a fill and line style
            _this.fillDarkSpr.beginFill(0x000, 0.5);
            _this.fillDarkSpr.drawRect(0, 0, Constants.GAME_WIDTH, Constants.GAME_HEIGHT);
            _this.fillDarkSpr.endFill();
            _this.fillDarkSpr.x = 0;
            _this.fillDarkSpr.y = 0;
            _this.allBtnsWidth = (50 + 15) * 3;
            _this.add(_this.fillDarkSpr);
            console.log("created inside pause");
            _this.resize();
            _this.onChildInputDown.add(_this.pressed, _this);
            return _this;
        }
        LoseGroup.prototype.pressed = function () {
            this.hide();
        };
        LoseGroup.prototype.over = function (_btn) {
            _btn.scale.set(ScaleControl.scaleMin * 1.1, ScaleControl.scaleMin * 1.1);
        };
        LoseGroup.prototype.out = function (_btn) {
            _btn.scale.set(ScaleControl.scaleMin, ScaleControl.scaleMin);
        };
        LoseGroup.prototype.resize = function () {
            this.fillDarkSpr.height = this.game.height;
            this.fillDarkSpr.width = this.game.width;
            this.allBtnsWidth = ((50 + 45) * 3) * ScaleControl.scaleMin;
        };
        LoseGroup.prototype.continueGame = function () {
            /*if (Constants.MUSIC_ON)
                Constants.MAIN_STATE.navSnd.play();
            this.game.paused = false;
            this.hide();*/
        };
        LoseGroup.prototype.switchSound = function () {
            /*if (Constants.MUSIC_ON)
                Constants.MAIN_STATE.navSnd.play();
            Constants.MAIN_STATE.musicSwitch(true);*/
            this.checkLoadedMusicBtn();
        };
        LoseGroup.prototype.checkLoadedMusicBtn = function () {
            /*  if (!Constants.MUSIC_ON) {
  
                  this.soundBtn.loadTexture('noSndSH');
              }
              else {
                  this.soundBtn.loadTexture('sndOnSh');
              }*/
        };
        LoseGroup.prototype.hide = function () {
            this.visible = false;
            // Constants.MAIN_STATE.pauseBtn.input.start();
        };
        LoseGroup.prototype.show = function () {
            this.resize();
            this.visible = true;
            this.checkLoadedMusicBtn();
            console.log("show pause");
            // Constants.MAIN_STATE.pauseBtn.input.enabled = false;
            // Constants.MAIN_STATE.pauseBtn.input.enabled = true;
        };
        LoseGroup.prototype.backToMenu = function () {
            /* if (Constants.MUSIC_ON)
                 Constants.MAIN_STATE.navSnd.play();  */
            this.game.paused = false;
            this.visible = false;
            this.game.state.start('MainMenu', true, false);
        };
        return LoseGroup;
    }(Phaser.Group));
    BaseGame.LoseGroup = LoseGroup;
})(BaseGame || (BaseGame = {}));
var BaseGame;
(function (BaseGame) {
    var LeaderBoardGr = (function (_super) {
        __extends(LeaderBoardGr, _super);
        function LeaderBoardGr(_game) {
            var _this = _super.call(this, _game) || this;
            _this.fillDarkSpr = _this.game.add.graphics(Constants.GAME_WIDTH, Constants.GAME_HEIGHT);
            // set a fill and line style
            _this.fillDarkSpr.beginFill(0x000, 0.7);
            //this.fillDarkSpr.drawRect(0, 0, 300, 350);
            _this.fillDarkSpr.drawRoundedRect(0, 0, 300, 350, 5);
            _this.fillDarkSpr.endFill();
            _this.fillDarkSpr.x = 0;
            _this.fillDarkSpr.y = 0;
            _this.allBtnsWidth = (50 + 15) * 3;
            /*
            this.continueBtn = this.game.add.button(this.game.world.centerX - this.allBtnsWidth * 0.5, this.game.world.centerY, 'continueBtn', this.continueGame, this, 2, 1, 0);
            this.continueBtn.anchor.set(0.5, 0.5);

            this.soundBtn = this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'sndOnSh', this.switchSound, this, 2, 1, 0);
            this.soundBtn.anchor.set( 0.5, 0.5);

            this.menuBtn = this.game.add.button(this.game.world.centerX + this.allBtnsWidth * 0.5, this.game.world.centerY, 'menuBtn', this.backToMenu, this, 2, 1, 0);
            this.menuBtn.anchor.set(0.5, 0.5);
            */
            // this.mainText.width = 850 * ScaleControl.scaleMin;
            /*
            this.continueBtn.onInputOver.add(this.over, this, 1, [this.continueBtn]);
            this.continueBtn.onInputOut.add(this.out, this, 1, [this.continueBtn]);

            this.menuBtn.onInputOver.add(this.over, this, 1, [this.menuBtn]);
            this.menuBtn.onInputOut.add(this.out, this, 1, [this.menuBtn]);

            this.soundBtn.onInputOver.add(this.over, this, 1, [this.soundBtn]);
            this.soundBtn.onInputOut.add(this.out, this, 1, [this.soundBtn]);
            */
            _this.add(_this.fillDarkSpr);
            _this.fixedToCamera = true;
            /*this.add(this.continueBtn);
            this.add(this.soundBtn);
            this.add(this.menuBtn);*/
            console.log("created inside pause");
            _this.resize();
            _this.checkLoadedMusicBtn();
            return _this;
        }
        LeaderBoardGr.prototype.createTexts = function () {
            var style = { font: 'Pixel Cyr', fill: 'FFffff', align: 'left', wordWrap: true, wordWrapWidth: 280 };
            this.textSpr = this.game.add.text(this.game.world.centerX, 30, "1", style);
            this.textSpr.anchor.setTo(0, 0);
            // this.mainText.font = 'Concert One';
            this.textSpr.fontSize = 22; //30
            this.textSpr.align = 'left';
            this.textSpr.stroke = "#000";
            this.textSpr.strokeThickness = 16;
            this.textSpr.wordWrapWidth = 350;
            this.textSpr.colors = ['#F7DF3C'];
            this.textSpr.stroke = '#000';
            this.textSpr.strokeThickness = 2;
            this.textNamesSpr = this.game.add.text(this.game.world.centerX, 30, "1", style);
            this.textNamesSpr.anchor.setTo(0, 0);
            // this.mainText.font = 'Concert One';
            this.textNamesSpr.fontSize = 22;
            this.textNamesSpr.align = 'left';
            this.textNamesSpr.stroke = "#000";
            this.textNamesSpr.strokeThickness = 16;
            this.textNamesSpr.wordWrapWidth = 350;
            this.textNamesSpr.colors = ['#FFffff'];
            this.textNamesSpr.stroke = '#000';
            this.textNamesSpr.strokeThickness = 2;
            // this.textNamesSpr.lineSpacing = -5;
            this.textGoldSpr = this.game.add.text(this.game.world.centerX, 30, "1", style);
            this.textGoldSpr.anchor.setTo(0, 0);
            // this.mainText.font = 'Concert One';
            this.textGoldSpr.fontSize = 22;
            this.textGoldSpr.align = 'left';
            this.textGoldSpr.stroke = "#000";
            this.textGoldSpr.strokeThickness = 16;
            this.textGoldSpr.colors = ['#FFffff'];
            this.textGoldSpr.stroke = '#000';
            this.textGoldSpr.strokeThickness = 2;
            this.add(this.textSpr);
            this.add(this.textNamesSpr);
            this.add(this.textGoldSpr);
            this.fixedToCamera = true;
        };
        LeaderBoardGr.prototype.over = function (_btn) {
            _btn.scale.set(ScaleControl.scaleMin * 1.1, ScaleControl.scaleMin * 1.1);
        };
        LeaderBoardGr.prototype.out = function (_btn) {
            _btn.scale.set(ScaleControl.scaleMin, ScaleControl.scaleMin);
        };
        LeaderBoardGr.prototype.resize = function () {
            this.fillDarkSpr.y = 10;
            this.fillDarkSpr.x = this.game.width - 310;
            if (typeof this.textSpr != 'undefined') {
                this.textSpr.x = this.fillDarkSpr.x + 5;
                this.textSpr.y = this.fillDarkSpr.y;
                this.textNamesSpr.x = this.fillDarkSpr.x + 5;
                this.textNamesSpr.y = this.fillDarkSpr.y + 30;
                this.textGoldSpr.x = this.fillDarkSpr.x + 255;
                this.textGoldSpr.y = this.fillDarkSpr.y + 30;
            }
            /*
            this.continueBtn.scale.set(ScaleControl.scaleMin, ScaleControl.scaleMin);
            this.soundBtn.scale.set(ScaleControl.scaleMin, ScaleControl.scaleMin);
            this.menuBtn.scale.set(ScaleControl.scaleMin, ScaleControl.scaleMin);

            this.allBtnsWidth = ((50 + 45) * 3) * ScaleControl.scaleMin;
            this.continueBtn.x = this.game.world.centerX - this.allBtnsWidth * 0.5,
            this.continueBtn.y = this.game.world.centerY;

            this.soundBtn.x = this.game.world.centerX;
            this.soundBtn.y =  this.game.world.centerY;

            this.menuBtn.x = this.game.world.centerX + this.allBtnsWidth * 0.5,
            this.menuBtn.y = this.game.world.centerY;
            */
        };
        LeaderBoardGr.prototype.renewText = function (data) {
            if (typeof this.textSpr === 'undefined') {
                return;
            }
            var nameStr = '';
            var goldStr = '';
            for (var i = 0; i < data.length; i++) {
                /*
                 this.player.health = dataCopy[i].character.health;
                 this.player.healthMax = 100;//dataUnit.health;
                 this.player.score = dataCopy[i].user.score;//dataUnit.health;
                */
                nameStr += ("" + (data[i].place) + "    ");
                nameStr += data[i].name + '\n';
                goldStr += ("" + data[i].score) + "\n";
            }
            if (this.textSpr.text == "Rank Name         Gold")
                this.textSpr.text = "Rank Name         Gold ";
            else {
                this.textSpr.text = "Rank Name         Gold";
            }
            this.textNamesSpr.text = nameStr;
            this.textGoldSpr.text = goldStr;
        };
        LeaderBoardGr.prototype.continueGame = function () {
            /*if (Constants.MUSIC_ON)
                Constants.MAIN_STATE.navSnd.play(); */
            this.game.paused = false;
            this.hide();
        };
        LeaderBoardGr.prototype.switchSound = function () {
            /*if (Constants.MUSIC_ON)
                Constants.MAIN_STATE.navSnd.play();
            Constants.MAIN_STATE.musicSwitch(true);*/
            this.checkLoadedMusicBtn();
        };
        LeaderBoardGr.prototype.checkLoadedMusicBtn = function () {
            /*  if (!Constants.MUSIC_ON) {
  
                  this.soundBtn.loadTexture('noSndSH');
              }
              else {
                  this.soundBtn.loadTexture('sndOnSh');
              }*/
        };
        LeaderBoardGr.prototype.hide = function () {
            this.visible = false;
            // Constants.MAIN_STATE.pauseBtn.input.start();
        };
        LeaderBoardGr.prototype.show = function () {
            this.resize();
            this.visible = true;
            this.checkLoadedMusicBtn();
            console.log("show leaderboard");
            // Constants.MAIN_STATE.pauseBtn.input.enabled = false;
            // Constants.MAIN_STATE.pauseBtn.input.enabled = true;
        };
        LeaderBoardGr.prototype.backToMenu = function () {
            /* if (Constants.MUSIC_ON)
                 Constants.MAIN_STATE.navSnd.play();  */
            this.game.paused = false;
            this.visible = false;
            this.game.state.start('MainMenu', true, false);
        };
        return LeaderBoardGr;
    }(Phaser.Group));
    BaseGame.LeaderBoardGr = LeaderBoardGr;
})(BaseGame || (BaseGame = {}));
var BaseGame;
(function (BaseGame) {
    var UpgradeGroup = (function (_super) {
        __extends(UpgradeGroup, _super);
        function UpgradeGroup(_game) {
            var _this = _super.call(this, _game) || this;
            _this.upgradeLvlSword = 1;
            _this.upgradeLvlHeart = 1;
            _this.infoTextAdd = "";
            _this.fillDarkSpr = _this.game.add.graphics(195, 165);
            // set a fill and line style
            _this.fillDarkSpr.beginFill(0x000, 0.5);
            _this.fillDarkSpr.drawRoundedRect(0, 0, 195, 165, 5);
            _this.fillDarkSpr.endFill();
            _this.fillDarkSpr.x = 10;
            _this.fillDarkSpr.y = 10;
            _this.pricesAr = [10, 30, 60, 100, 150];
            _this.swordBtn = _this.game.add.button(_this.fillDarkSpr.x - 71 * 0.5, _this.fillDarkSpr.y + _this.fillDarkSpr.height + 10, 'swordIcon', _this.swordUpgrade, _this, 2, 1, 0);
            _this.swordBtn.anchor.set(0.5);
            _this.heartBtn = _this.game.add.button(_this.swordBtn.x + _this.swordBtn.width * 0.5 + 20, _this.fillDarkSpr.y + _this.fillDarkSpr.height + 10, 'heartIcon', _this.heartUpgrade, _this, 2, 1, 0);
            _this.heartBtn.anchor.set(0.5);
            _this.swordBtn.onInputOver.add(_this.over, _this, 1, [_this.swordBtn]);
            _this.swordBtn.onInputOut.add(_this.out, _this, 1, [_this.swordBtn]);
            _this.heartBtn.onInputOver.add(_this.over, _this, 1, [_this.heartBtn]);
            _this.heartBtn.onInputOut.add(_this.out, _this, 1, [_this.heartBtn]);
            _this.add(_this.fillDarkSpr);
            _this.add(_this.swordBtn);
            _this.add(_this.heartBtn);
            console.log("created inside pause");
            _this.resize();
            _this.fixedToCamera = true;
            _this.renewInfoText();
            _this.checkVisibility();
            _this.tempRedrawTextsBtns();
            return _this;
        }
        UpgradeGroup.prototype.renewInfoText = function () {
            if (typeof this.textNamesSpr != 'undefined') {
                //  console.log('did update info text');
                if (this.infoTextAdd == "") {
                    this.infoTextAdd = " ";
                }
                else {
                    this.infoTextAdd = "";
                }
                this.textNamesSpr.text = '' + Constants.MAIN_STATE.player.nameID + this.infoTextAdd;
                this.textSpr.text = "Health: " + Constants.MAIN_STATE.player.health + "/" + Constants.MAIN_STATE.player.healthMax + '\n'
                    + "Damage: " + Constants.MAIN_STATE.player.damage + "\n" +
                    "Gold: " + Constants.MAIN_STATE.player.score + "\n" +
                    "Kills: " + Constants.MAIN_STATE.player.killScore;
            }
        };
        UpgradeGroup.prototype.checkVisibility = function () {
            this.swordBtn.scale.set(1, 1);
            this.heartBtn.scale.set(1, 1);
            if (typeof this.textSwordIconLvl === 'undefined')
                return;
            if (Constants.MAIN_STATE.player.score >= this.needPriceForSword()) {
                this.updateBtnTexts();
                this.textSwordIconLvl.anchor.setTo(0.5);
                this.swordBtn.visible = this.textSwordIconLvl.visible = this.textSwordPrice.visible = true;
            }
            else {
                this.swordBtn.visible = this.textSwordIconLvl.visible = this.textSwordPrice.visible = false;
            }
            if (Constants.MAIN_STATE.player.score >= this.needPriceForHeart()) {
                this.updateBtnTexts();
                this.textHeartIconLvl.anchor.setTo(0.5);
                this.heartBtn.visible = this.textHeartIconLvl.visible = this.textHeartPrice.visible = true;
            }
            else {
                this.heartBtn.visible = this.textHeartIconLvl.visible = this.textHeartPrice.visible = false;
            }
        };
        UpgradeGroup.prototype.needPriceForSword = function () {
            var needGold = 0;
            needGold = this.pricesAr[this.upgradeLvlSword - 1]; //(this.upgradeLvlSword) * 10;
            return needGold;
        };
        UpgradeGroup.prototype.needPriceForHeart = function () {
            var needGold = 0;
            needGold = this.pricesAr[this.upgradeLvlHeart - 1];
            return needGold;
        };
        UpgradeGroup.prototype.tempRedrawTextsBtns = function () {
            if (typeof this.textSwordIconLvl === 'undefined')
                return;
            this.textSwordIconLvl.text = "00" + this.upgradeLvlSword;
            this.textSwordPrice.text = "00" + this.needPriceForSword() + ' coins';
            this.textHeartIconLvl.text = "00" + this.upgradeLvlHeart;
            this.textHeartPrice.text = "00" + this.needPriceForHeart() + ' coins';
        };
        UpgradeGroup.prototype.updateBtnTexts = function () {
            if (typeof this.textSwordIconLvl === 'undefined')
                return;
            this.textSwordIconLvl.text = "" + this.upgradeLvlSword;
            this.textSwordPrice.text = "" + this.needPriceForSword() + ' coins';
            this.textHeartIconLvl.text = "" + this.upgradeLvlHeart;
            this.textHeartPrice.text = "" + this.needPriceForHeart() + ' coins';
        };
        UpgradeGroup.prototype.swordUpgrade = function () {
            if (Constants.MAIN_STATE.player.score >= this.needPriceForSword()) {
                // upgradeBuy {type: attack / health }
                window.socket.emit('upgradeBuy', {
                    auth: Constants.MAIN_STATE.authInfo,
                    type: 'attack'
                });
                if (this.upgradeLvlSword < 5)
                    this.upgradeLvlSword++;
                //Constants.MAIN_STATE.player.score -= this.needPriceForSword();
                this.checkVisibility();
                if (typeof this.textSwordIconLvl === 'undefined')
                    return;
                this.textSwordIconLvl.text = "" + this.upgradeLvlSword;
                this.textSwordPrice.text = "" + this.needPriceForSword() + ' coins';
                Constants.MAIN_STATE.addText(this.fillDarkSpr.x + this.fillDarkSpr.width * 0.5 + 70, this.fillDarkSpr.y + this.fillDarkSpr.height + 100, "Your damage has increased!", null, true);
            }
        };
        UpgradeGroup.prototype.heartUpgrade = function () {
            if (Constants.MAIN_STATE.player.score >= this.needPriceForHeart()) {
                window.socket.emit('upgradeBuy', {
                    auth: Constants.MAIN_STATE.authInfo,
                    type: 'health'
                });
                if (this.upgradeLvlHeart < 5)
                    this.upgradeLvlHeart++;
                //Constants.MAIN_STATE.player.score -= this.needPriceForHeart();
                if (typeof this.textSwordIconLvl === 'undefined')
                    return;
                this.textHeartIconLvl.text = "" + this.upgradeLvlHeart;
                this.textHeartPrice.text = "" + this.needPriceForHeart() + ' coins';
                this.checkVisibility();
                Constants.MAIN_STATE.addText(this.fillDarkSpr.x + this.fillDarkSpr.width * 0.5 + 70, this.fillDarkSpr.y + this.fillDarkSpr.height + 125, "Your maximum health has increased!", null, true);
            }
        };
        UpgradeGroup.prototype.over = function (_btn) {
            _btn.scale.set(1.1, 1.1);
        };
        UpgradeGroup.prototype.out = function (_btn) {
            _btn.scale.set(1, 1);
        };
        UpgradeGroup.prototype.createTexts = function () {
            var style = { font: 'Pixel Cyr', fill: 'FFffff', align: 'left', wordWrap: true, wordWrapWidth: 280 };
            this.textSpr = this.game.add.text(this.game.world.centerX, 30, "0", style);
            this.textSpr.anchor.setTo(0, 0);
            // this.mainText.font = 'Concert One';
            this.textSpr.fontSize = 22; //30
            this.textSpr.align = 'left';
            this.textSpr.stroke = "#000";
            this.textSpr.strokeThickness = 16;
            this.textSpr.wordWrapWidth = 350;
            this.textSpr.colors = ['#FFffff'];
            this.textSpr.stroke = '#000';
            this.textSpr.strokeThickness = 2;
            this.textNamesSpr = this.game.add.text(this.game.world.centerX, 30, "0", style);
            this.textNamesSpr.anchor.setTo(0, 0);
            // this.mainText.font = 'Concert One';
            this.textNamesSpr.fontSize = 25;
            this.textNamesSpr.align = 'left';
            this.textNamesSpr.stroke = "#000";
            this.textNamesSpr.strokeThickness = 16;
            this.textNamesSpr.wordWrapWidth = 350;
            this.textNamesSpr.colors = ['#F7DF3C'];
            this.textNamesSpr.stroke = '#000';
            this.textNamesSpr.strokeThickness = 2;
            this.textSwordIconLvl = this.game.add.text(this.game.world.centerX, 30, "0", style);
            this.textSwordIconLvl.anchor.setTo(0.5);
            // this.mainText.font = 'Concert One';
            this.textSwordIconLvl.fontSize = 36; //30
            this.textSwordIconLvl.align = 'left';
            this.textSwordIconLvl.stroke = "#000";
            this.textSwordIconLvl.strokeThickness = 16;
            this.textSwordIconLvl.wordWrapWidth = 350;
            this.textSwordIconLvl.colors = ['#Ffffff'];
            this.textSwordIconLvl.stroke = '#000';
            this.textSwordIconLvl.strokeThickness = 2;
            this.textSwordPrice = this.game.add.text(this.game.world.centerX, 30, "0", style);
            this.textSwordPrice.anchor.setTo(0.5);
            // this.mainText.font = 'Concert One';
            this.textSwordPrice.fontSize = 20; //30
            this.textSwordPrice.align = 'left';
            this.textSwordPrice.stroke = "#000";
            this.textSwordPrice.strokeThickness = 16;
            this.textSwordPrice.wordWrapWidth = 350;
            this.textSwordPrice.colors = ['#F7DF3C'];
            this.textSwordPrice.stroke = '#000';
            this.textSwordPrice.strokeThickness = 2;
            //heart
            this.textHeartIconLvl = this.game.add.text(this.game.world.centerX, 30, "0", style);
            this.textHeartIconLvl.anchor.setTo(0.5);
            // this.mainText.font = 'Concert One';
            this.textHeartIconLvl.fontSize = 36; //30
            this.textHeartIconLvl.align = 'left';
            this.textHeartIconLvl.stroke = "#000";
            this.textHeartIconLvl.strokeThickness = 16;
            this.textHeartIconLvl.wordWrapWidth = 350;
            this.textHeartIconLvl.colors = ['#Ffffff'];
            this.textHeartIconLvl.stroke = '#000';
            this.textHeartIconLvl.strokeThickness = 2;
            this.textHeartPrice = this.game.add.text(this.game.world.centerX, 30, "0", style);
            this.textHeartPrice.anchor.setTo(0.5);
            // this.mainText.font = 'Concert One';
            this.textHeartPrice.fontSize = 20; //30
            this.textHeartPrice.align = 'left';
            this.textHeartPrice.stroke = "#000";
            this.textHeartPrice.strokeThickness = 16;
            this.textHeartPrice.wordWrapWidth = 350;
            this.textHeartPrice.colors = ['#F7DF3C'];
            this.textHeartPrice.stroke = '#000';
            this.textHeartPrice.strokeThickness = 2;
            this.textSwordIconLvl.x = this.swordBtn.x;
            this.textSwordIconLvl.y = this.swordBtn.y;
            this.textSwordPrice.x = this.swordBtn.x;
            this.textSwordPrice.y = this.swordBtn.y + this.swordBtn.height * 0.5 + 10;
            this.textHeartIconLvl.x = this.heartBtn.x;
            this.textHeartIconLvl.y = this.heartBtn.y;
            this.textHeartPrice.x = this.heartBtn.x;
            this.textHeartPrice.y = this.heartBtn.y + this.heartBtn.height * 0.5 + 10;
            this.add(this.textSpr);
            this.add(this.textNamesSpr);
            this.add(this.textSwordIconLvl);
            this.add(this.textSwordPrice);
            this.add(this.textHeartIconLvl);
            this.add(this.textHeartPrice);
        };
        UpgradeGroup.prototype.resize = function () {
            // this.swordBtn.scale.set(ScaleControl.scaleMin, ScaleControl.scaleMin);
            //this.heartBtn.scale.set(ScaleControl.scaleMin, ScaleControl.scaleMin);
            if (typeof this.textSpr === 'undefined')
                return;
            this.textSpr.x = this.fillDarkSpr.x + 5;
            this.textSpr.y = this.fillDarkSpr.y + 35;
            this.textNamesSpr.x = this.fillDarkSpr.x + 5;
            this.textNamesSpr.y = this.fillDarkSpr.y + 5;
            this.swordBtn.x = this.fillDarkSpr.x + this.swordBtn.width * 0.5 + 10;
            this.swordBtn.y = this.fillDarkSpr.y + this.fillDarkSpr.height + this.swordBtn.height * 0.5 + 10;
            this.heartBtn.x = this.fillDarkSpr.x + this.fillDarkSpr.width - this.heartBtn.width * 0.5 - 10;
            this.heartBtn.y = this.fillDarkSpr.y + this.fillDarkSpr.height + this.heartBtn.height * 0.5 + 10;
            this.textSwordIconLvl.x = this.swordBtn.x;
            this.textSwordIconLvl.y = this.swordBtn.y;
            this.textSwordPrice.x = this.swordBtn.x;
            this.textSwordPrice.y = this.swordBtn.y + this.swordBtn.height * 0.5 + 10;
            this.textHeartIconLvl.x = this.heartBtn.x;
            this.textHeartIconLvl.y = this.heartBtn.y;
            this.textHeartPrice.x = this.heartBtn.x;
            this.textHeartPrice.y = this.heartBtn.y + this.heartBtn.height * 0.5 + 10;
        };
        UpgradeGroup.prototype.continueGame = function () {
            /*if (Constants.MUSIC_ON)
                Constants.MAIN_STATE.navSnd.play();
            this.game.paused = false;
            this.hide();*/
        };
        UpgradeGroup.prototype.switchSound = function () {
            /*if (Constants.MUSIC_ON)
                Constants.MAIN_STATE.navSnd.play();
            Constants.MAIN_STATE.musicSwitch(true);*/
            this.checkLoadedMusicBtn();
        };
        UpgradeGroup.prototype.checkLoadedMusicBtn = function () {
            /*  if (!Constants.MUSIC_ON) {
  
                  this.soundBtn.loadTexture('noSndSH');
              }
              else {
                  this.soundBtn.loadTexture('sndOnSh');
              }*/
        };
        UpgradeGroup.prototype.hide = function () {
            this.visible = false;
            // Constants.MAIN_STATE.pauseBtn.input.start();
        };
        UpgradeGroup.prototype.show = function () {
            this.resize();
            this.visible = true;
            this.checkLoadedMusicBtn();
            console.log("show pause");
            // Constants.MAIN_STATE.pauseBtn.input.enabled = false;
            // Constants.MAIN_STATE.pauseBtn.input.enabled = true;
        };
        UpgradeGroup.prototype.backToMenu = function () {
            /* if (Constants.MUSIC_ON)
                 Constants.MAIN_STATE.navSnd.play();  */
            this.game.paused = false;
            this.visible = false;
            this.game.state.start('MainMenu', true, false);
        };
        return UpgradeGroup;
    }(Phaser.Group));
    BaseGame.UpgradeGroup = UpgradeGroup;
})(BaseGame || (BaseGame = {}));
var BaseGame;
(function (BaseGame) {
    var PauseGroup = (function (_super) {
        __extends(PauseGroup, _super);
        function PauseGroup(_game) {
            var _this = _super.call(this, _game) || this;
            _this.fillDarkSpr = _this.game.add.graphics(Constants.GAME_WIDTH, Constants.GAME_HEIGHT);
            // set a fill and line style
            _this.fillDarkSpr.beginFill(0x000, 0.5);
            _this.fillDarkSpr.drawRect(0, 0, Constants.GAME_WIDTH, Constants.GAME_HEIGHT);
            _this.fillDarkSpr.endFill();
            _this.fillDarkSpr.x = 0;
            _this.fillDarkSpr.y = 0;
            _this.allBtnsWidth = (50 + 15) * 3;
            _this.continueBtn = _this.game.add.button(_this.game.world.centerX - _this.allBtnsWidth * 0.5, _this.game.world.centerY, 'continueBtn', _this.continueGame, _this, 2, 1, 0);
            _this.continueBtn.anchor.set(0.5, 0.5);
            _this.soundBtn = _this.game.add.button(_this.game.world.centerX, _this.game.world.centerY, 'sndOnSh', _this.switchSound, _this, 2, 1, 0);
            _this.soundBtn.anchor.set(0.5, 0.5);
            _this.menuBtn = _this.game.add.button(_this.game.world.centerX + _this.allBtnsWidth * 0.5, _this.game.world.centerY, 'menuBtn', _this.backToMenu, _this, 2, 1, 0);
            _this.menuBtn.anchor.set(0.5, 0.5);
            _this.continueBtn.onInputOver.add(_this.over, _this, 1, [_this.continueBtn]);
            _this.continueBtn.onInputOut.add(_this.out, _this, 1, [_this.continueBtn]);
            _this.menuBtn.onInputOver.add(_this.over, _this, 1, [_this.menuBtn]);
            _this.menuBtn.onInputOut.add(_this.out, _this, 1, [_this.menuBtn]);
            _this.soundBtn.onInputOver.add(_this.over, _this, 1, [_this.soundBtn]);
            _this.soundBtn.onInputOut.add(_this.out, _this, 1, [_this.soundBtn]);
            _this.add(_this.fillDarkSpr);
            _this.add(_this.continueBtn);
            _this.add(_this.soundBtn);
            _this.add(_this.menuBtn);
            console.log("created inside pause");
            _this.resize();
            _this.checkLoadedMusicBtn();
            return _this;
        }
        PauseGroup.prototype.over = function (_btn) {
            _btn.scale.set(ScaleControl.scaleMin * 1.1, ScaleControl.scaleMin * 1.1);
        };
        PauseGroup.prototype.out = function (_btn) {
            _btn.scale.set(ScaleControl.scaleMin, ScaleControl.scaleMin);
        };
        PauseGroup.prototype.resize = function () {
            this.fillDarkSpr.height = this.game.height;
            this.fillDarkSpr.width = this.game.width;
            this.continueBtn.scale.set(ScaleControl.scaleMin, ScaleControl.scaleMin);
            this.soundBtn.scale.set(ScaleControl.scaleMin, ScaleControl.scaleMin);
            this.menuBtn.scale.set(ScaleControl.scaleMin, ScaleControl.scaleMin);
            this.allBtnsWidth = ((50 + 45) * 3) * ScaleControl.scaleMin;
            this.continueBtn.x = this.game.world.centerX - this.allBtnsWidth * 0.5,
                this.continueBtn.y = this.game.world.centerY;
            this.soundBtn.x = this.game.world.centerX;
            this.soundBtn.y = this.game.world.centerY;
            this.menuBtn.x = this.game.world.centerX + this.allBtnsWidth * 0.5,
                this.menuBtn.y = this.game.world.centerY;
        };
        PauseGroup.prototype.continueGame = function () {
            /*if (Constants.MUSIC_ON)
                Constants.MAIN_STATE.navSnd.play();
            this.game.paused = false;
            this.hide();*/
        };
        PauseGroup.prototype.switchSound = function () {
            /*if (Constants.MUSIC_ON)
                Constants.MAIN_STATE.navSnd.play();
            Constants.MAIN_STATE.musicSwitch(true);*/
            this.checkLoadedMusicBtn();
        };
        PauseGroup.prototype.checkLoadedMusicBtn = function () {
            /*  if (!Constants.MUSIC_ON) {
  
                  this.soundBtn.loadTexture('noSndSH');
              }
              else {
                  this.soundBtn.loadTexture('sndOnSh');
              }*/
        };
        PauseGroup.prototype.hide = function () {
            this.visible = false;
            // Constants.MAIN_STATE.pauseBtn.input.start();
        };
        PauseGroup.prototype.show = function () {
            this.resize();
            this.visible = true;
            this.checkLoadedMusicBtn();
            console.log("show pause");
            // Constants.MAIN_STATE.pauseBtn.input.enabled = false;
            // Constants.MAIN_STATE.pauseBtn.input.enabled = true;
        };
        PauseGroup.prototype.backToMenu = function () {
            /* if (Constants.MUSIC_ON)
                 Constants.MAIN_STATE.navSnd.play();  */
            this.game.paused = false;
            this.visible = false;
            this.game.state.start('MainMenu', true, false);
        };
        return PauseGroup;
    }(Phaser.Group));
    BaseGame.PauseGroup = PauseGroup;
})(BaseGame || (BaseGame = {}));
/// <reference path="./libs/phaser.d.ts" />
var BaseGame;
(function (BaseGame) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y) {
            var _this = _super.call(this, game, x, y, 'simon') || this;
            _this.anchor.setTo(0.5);
            _this.animations.add('walk', [0, 1, 2, 1, 0, 3], 14, true);
            _this.animations.add('jump', [4], 4, true);
            _this.animations.add('idle', [0], 4, true);
            _this.animations.add('fall', [0], 4, true);
            game.physics.p2.enable(_this, true);
            _this.body.fixedRotation = true;
            _this.body.setCircle(18);
            // this.body.collideWorldBounds = true;
            //this.body.acceleration.y = 700;
            //game.add.existing(this);
            /* this.body.checkCollision.up = true;
             this.body.checkCollision.down = true;
             this.body.setSize(19, 35, 20, 0);
             this.renewUsualPhysics();*/
            _this.setNoMoveTimer();
            return _this;
        }
        Player.prototype.checkIfCanJump = function () {
            var yAxis = p2.vec2.fromValues(0, 1);
            var result = false;
            for (var i = 0; i < this.game.physics.p2.world.narrowphase.contactEquations.length; i++) {
                var c = this.game.physics.p2.world.narrowphase.contactEquations[i];
                if (c.bodyA === this.body.data || c.bodyB === this.body.data) {
                    var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
                    if (c.bodyA === this.body.data)
                        d *= -1;
                    if (d > 0.5)
                        result = true;
                }
            }
            return result;
        };
        Player.prototype.stop = function () {
            /* this.body.acceleration.y = this.body.velocity.y = 0;
             this.body.acceleration.x = this.body.velocity.x = 0;*/
        };
        Player.prototype.renewUsualPhysics = function () {
            /*
            this.body.checkCollision.down = this.body.checkCollision.up = this.body.checkCollision.right = this.body.checkCollision.left = true;
            this.rotation = 0;
            this.body.maxVelocity.y = 850; //* ScaleControl.scaleYUse;
            this.body.acceleration.y = 1050; //* ScaleControl.scaleYUse;
            */
        };
        Player.prototype.fall = function () {
            //  this.body.checkCollision.down = this.body.checkCollision.up = false;
        };
        Player.prototype.flySideTween = function () {
            this.stop();
            this.isDead = true;
            console.log("fly side");
            this.fall();
            //this.firstSet = false;
            // this.body.acceleration.y = 200;
            var scaleTween = this.game.add.tween(this).to({ rotation: -10, y: this.y - 100, x: this.x - 100 }, 400, Phaser.Easing.Linear.None, true, 0);
            scaleTween.onComplete.add(function () { console.log("ended scale"); Constants.MAIN_STATE.resetPlayerPos(); this.stop(); this.renewUsualPhysics(); this.firstSet = false; }, this);
        };
        Player.prototype.moveLeft = function () {
            if (this.game.time.now > this.noMoveSideTimer && typeof Constants.MAIN_STATE.player != 'undefined' && typeof Constants.MAIN_STATE.player.spr.body != 'undefined' && typeof Constants.MAIN_STATE != 'undefined') {
                // Constants.MAIN_STATE.player.body.moveLeft(200);
                Constants.MAIN_STATE.player.spr.body.velocity.x = -240;
                Constants.MAIN_STATE.player.renewUsualPhysics();
                Constants.MAIN_STATE.player.spr.animations.play('walk');
                if (Constants.MAIN_STATE.player.spr.scale.x === 1) {
                    Constants.MAIN_STATE.player.spr.scale.x = -1;
                }
            }
        };
        Player.prototype.moveRight = function () {
            if (this.game.time.now > this.noMoveSideTimer && typeof Constants.MAIN_STATE.player != 'undefined' && typeof Constants.MAIN_STATE.player.spr.body != 'undefined'
                && typeof Constants.MAIN_STATE != 'undefined') {
                //Constants.MAIN_STATE.player.body.moveRight(200);
                Constants.MAIN_STATE.player.spr.body.velocity.x = 240;
                Constants.MAIN_STATE.player.renewUsualPhysics();
                Constants.MAIN_STATE.player.spr.animations.play('walk');
                if (Constants.MAIN_STATE.player.spr.scale.x === -1) {
                    Constants.MAIN_STATE.player.spr.scale.x = 1;
                }
            }
            else {
            }
        };
        Player.prototype.jump = function () {
            if (typeof Constants.MAIN_STATE.player.spr.body != 'undefined' && this.checkIfCanJump() /*Constants.MAIN_STATE.player.body.velocity.y == 0*/
                && typeof Constants.MAIN_STATE != 'undefined' && this.game.time.now > Constants.MAIN_STATE.jumpTimer) {
                Constants.MAIN_STATE.player.spr.body.velocity.y = -130; // * ScaleControl.scaleYUse;
                Constants.MAIN_STATE.player.renewUsualPhysics();
                Constants.MAIN_STATE.jumpTimer = Constants.MAIN_STATE.player.game.time.now + 750;
                Constants.MAIN_STATE.player.spr.animations.play('jump');
                if (this.overlappingPlatform) {
                    this.stopCurrentOverlap();
                    this.overlappingPlatform = false;
                }
            }
        };
        Player.prototype.setNoMoveTimer = function () {
            this.noMoveSideTimer = this.game.time.now + 550;
        };
        Player.prototype.stopCurrentOverlap = function () {
            if (Constants.MAIN_STATE.curLvl == 2) {
            }
        };
        Player.prototype.update = function () {
            var _this = this;
            /*
            if (this.body.y > Constants.GAME_HEIGHT * ScaleControl.scaleYUse * 0.3)
            {
                if (this.body.onFloor() || this.body.y > Constants.GAME_HEIGHT * ScaleControl.scaleYUse * 0.6)
                this.firstSet = true;
            }
*/
            if (this.body.x < 0) {
                this.body.x = 0;
            }
            this.body.velocity.x = 0; //for keyboard
            if (Constants.MAIN_STATE.loseScreenSpr.visible) {
                return;
            }
            //typeof myVar != 'undefined'
            if (typeof Constants.MAIN_STATE != 'undefined') {
                if (typeof Constants.MAIN_STATE.curLvlCntrl.platformGroup != 'undefined') {
                    Constants.MAIN_STATE.curLvlCntrl.platformGroup.forEach(function (item) {
                        if (_this.overlap(item)) {
                            if (item.isSet) {
                                // Constants.MAIN_STATE.physics.arcade.collide(this, item, null, null, this);
                                if (_this.body.velocity.y > 0) {
                                    // this.body.reset(this.body.x + this.anchor.x, this.body.y + this.anchor.y);
                                    _this.stop();
                                    if (Constants.MAIN_STATE.curLvl == 1) {
                                        if (item == Constants.MAIN_STATE.curLvlCntrl.platform2) {
                                            if (Constants.MAIN_STATE.curLvlCntrl.spikesOnPlatform.visible) {
                                                Constants.MAIN_STATE.curLvlCntrl.launch1PlatformTo2();
                                            }
                                            Constants.MAIN_STATE.curLvlCntrl.didVisit2Platform = true;
                                        }
                                    }
                                    else if (Constants.MAIN_STATE.curLvl == 2) {
                                        if (item == Constants.MAIN_STATE.curLvlCntrl.platform1) {
                                            Constants.MAIN_STATE.curLvlCntrl.platform1.isActivated = true;
                                            // if (!this.overlappingPlatform)
                                            // Constants.MAIN_STATE.rotatePlatform1();
                                            _this.overlappingPlatform = true;
                                        }
                                        else {
                                            _this.overlappingPlatform = false;
                                        }
                                    }
                                }
                            }
                            else {
                                _this.renewUsualPhysics();
                            }
                        }
                    }, this, false);
                }
                if (typeof Constants.MAIN_STATE.curLvlCntrl.spikesGroup != 'undefined') {
                    Constants.MAIN_STATE.curLvlCntrl.spikesGroup.forEach(function (item) {
                        if (_this.overlap(item)) {
                            Constants.MAIN_STATE.loseLife();
                            _this.body.velocity.y = 0;
                        }
                    }, this, false);
                }
                if (typeof Constants.MAIN_STATE.curLvlCntrl.spikesOnPlatform != 'undefined') {
                    if (Constants.MAIN_STATE.curLvlCntrl.spikesOnPlatform != null && this.overlap(Constants.MAIN_STATE.curLvlCntrl.spikesOnPlatform)) {
                        if (Constants.MAIN_STATE.curLvlCntrl.spikesOnPlatform.visible) {
                            Constants.MAIN_STATE.loseLife();
                            this.body.velocity.y = 0;
                        }
                    }
                }
                if (typeof Constants.MAIN_STATE.curLvlCntrl.hiddenSpikesGroup != 'undefined') {
                    Constants.MAIN_STATE.curLvlCntrl.hiddenSpikesGroup.forEach(function (item) {
                        if (_this.overlap(item)) {
                            if (item.visible) {
                                Constants.MAIN_STATE.loseLife();
                                _this.body.velocity.y = 0;
                            }
                        }
                    }, this, false);
                }
                if (typeof Constants.MAIN_STATE.curLvlCntrl.bigBlockGr != 'undefined') {
                    Constants.MAIN_STATE.curLvlCntrl.bigBlockGr.forEach(function (item) {
                        if (_this.overlap(item)) {
                            if (item.visible && item.body.velocity.y > 0) {
                                Constants.MAIN_STATE.loseLife();
                            }
                        }
                    }, this, false);
                }
            }
            if (this.holdRight) {
                console.log('hold right');
                this.moveRight();
            }
            if (this.holdLeft) {
                console.log('hold Left');
                this.moveLeft();
            }
            if (this.holdUp) {
                console.log('hold up');
                this.jump();
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP) || this.game.input.keyboard.isDown(Phaser.Keyboard.W) || this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                //this.holdUp = true;
                this.jump();
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
                this.moveLeft();
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
                this.moveRight();
            }
            else if (!this.holdRight && !this.holdLeft && !this.holdUp) {
                if (this.body.velocity.y < 0) {
                    this.animations.frame = 4;
                }
                else
                    this.animations.frame = 0;
            }
        };
        return Player;
    }(Phaser.Sprite));
    BaseGame.Player = Player;
})(BaseGame || (BaseGame = {}));
/**
 * All the global variables which will be used throughout the game.
*/
var Utils;
(function (Utils) {
    var RADTODEG = 180 / Math.PI;
    var left1;
    var right1;
    var top1;
    var down1;
    var left2;
    var right2;
    var top2;
    var down2;
    /**
   * Format seconds as minutes with a colon, an optionally with milliseconds too.
   *
   * @param	Seconds		The number of seconds (for example, time remaining, time spent, etc).
   * @param	ShowMS		Whether to show milliseconds after a "." as well.  Default value is false.
   * @return	A nicely formatted String, like "1:03".
   */
    function formatTime(Seconds, ShowMS) {
        if (ShowMS === void 0) { ShowMS = false; }
        var timeString = Math.floor(Seconds / 60) + ":";
        var timeStringHelper = Math.floor(Seconds) % 60;
        if (timeStringHelper < 10) {
            timeString += "0";
        }
        timeString += ("" + timeStringHelper);
        if (ShowMS) {
            timeString += ".";
            timeStringHelper = Math.floor((Seconds - Math.floor(Seconds)) * 100);
            if (timeStringHelper < 10) {
                timeString += "0";
            }
            timeString += ("" + timeStringHelper);
        }
        return timeString;
    }
    Utils.formatTime = formatTime;
    /**
     * Save the game state.
     *
     * If no key is given, will save as "save-default"
     * If a key is give, will prepend with "save-"
     */
    function save(key, obj) {
        if (key === undefined)
            key = 'default';
        JSON.stringify(obj);
        localStorage.setItem('save-' + key, obj);
    }
    Utils.save = save;
    ;
    /**
     * Load a game state.
     *
     * If no key is given, will load "save-default"
     * If a key is give, will prepend with "save-"
     */
    function loadSave(key) {
        if (key === undefined)
            key = 'default';
        var saveObj = localStorage.getItem('save-' + key);
        if (saveObj && typeof saveObj != undefined && saveObj != "undefined") {
            // console.log("type " + typeof saveObj );
            return JSON.parse(saveObj);
        }
        else {
            return -1;
        }
    }
    Utils.loadSave = loadSave;
    ;
    function serialize(saveObject) {
        // var saveObject = {};
        // saveObject.max = this.player.serialize();
        // saveObject.highScore = this.highScore;
        // saveObject.level = this.level;
        return JSON.stringify(saveObject);
    }
    Utils.serialize = serialize;
    ;
    /**
     * This is a class method, not an instance method!
     *
     * @param state string | object the state to unserialize into a character
     *
     * @return Character instance, class depending on the state restored
     */
    function unserialize(state) {
        // We should be able to accept an object or a string.
        if (typeof state === 'string') {
            state = JSON.parse(state);
        }
        // Class name can be specified in the serialized data.
        if (state.options.className) {
        }
    }
    Utils.unserialize = unserialize;
    ;
    function angleBetweenSprs(a, target) {
        var dx = (target.x) - (a.x); // + a.anchorX);
        var dy = (target.y) - (a.y); // + a.anchorY);
        return Math.atan2(dy, dx) * RADTODEG; //asDegrees(Math.atan2(dy, dx));
    }
    Utils.angleBetweenSprs = angleBetweenSprs;
    function moveTowardsObject(Source, Dest, Speed) {
        if (Speed === void 0) { Speed = 60; }
        var a = angleBetweenSprs(Source, Dest);
        return new Phaser.Point(Math.cos(a) * Speed, Math.sin(a) * Speed);
    }
    Utils.moveTowardsObject = moveTowardsObject;
    function moveFromObject(Source, Dest, Speed) {
        if (Speed === void 0) { Speed = 60; }
        var a = angleBetweenSprs(Source, Dest);
        a -= 180;
        return new Phaser.Point(Math.cos(a) * Speed, Math.sin(a) * Speed);
    }
    Utils.moveFromObject = moveFromObject;
    function checkOverlap(spriteA, spriteB, bufferA, bufferB) {
        /*
                var boundsA: Phaser.Rectangle = spriteA.getBounds();
                var boundsB: Phaser.Rectangle = spriteB.getBounds();
                boundsA.width -= bufferA;
                boundsA.x += bufferA * 0.5;
                boundsA.height -= bufferA;
                boundsA.y += bufferA * 0.5;
        
                boundsB.width -= bufferB;
                boundsB.x += bufferB * 0.5;
                boundsB.height -= bufferB;
                boundsB.y += bufferB * 0.5;
        
                return Phaser.Rectangle.intersects(boundsA, boundsB);
                */
        if (bufferA === void 0) { bufferA = 0; }
        if (bufferB === void 0) { bufferB = 0; }
    }
    Utils.checkOverlap = checkOverlap;
    function scrollingValue(curV, maxV, change, minV) {
        if (minV === void 0) { minV = 0; }
        var newV;
        var difr = 0;
        if (curV + change > maxV) {
            difr = (maxV - (curV + change)) * -1;
            newV = minV + difr;
        }
        else if (curV + change < 0) {
            difr = curV + change;
            newV = maxV + difr;
        }
        else {
            newV = curV + change;
        }
        return newV;
    }
    Utils.scrollingValue = scrollingValue;
    function overlapsRects(imgX, imgY, imgWidth, imgHeight, img2X, img2Y, img2Width, img2Height, buffSize) {
        if (buffSize === void 0) { buffSize = 0; }
        left1 = imgX - imgWidth * 0.5 + buffSize;
        right1 = imgX + imgWidth * 0.5 - buffSize;
        top1 = imgY - imgHeight * 0.5 + buffSize;
        down1 = imgY + imgHeight * 0.5 - buffSize;
        left2 = img2X - img2Width * 0.5 + buffSize;
        right2 = img2X + img2Width * 0.5 - buffSize;
        top2 = img2Y - img2Height * 0.5 + buffSize;
        down2 = img2Y + img2Height * 0.5 - buffSize;
        // return !(a.right < b.x || a.bottom < b.y || a.x > b.right || a.y > b.bottom);
        //  return !(right1 < left1 || down1 < top2 || left1 > right2 || top1 > down2);
        return (right2 > left1) && (left2 < right1) && (down2 > top1) && (top2 < down1);
        //return !(left1 > right2 + buffSize || right1 < left2 - buffSize || top1 > down2 + buffSize || down1 < top2 - buffSize);
        // return !(left1 > right2  || right1 < left2  || top1 > down2 || down1 < top2);
        //return !(left > a.right + tolerance || right < a.left - tolerance || top > a.bottom + tolerance || bottom < a.top - tolerance);
    }
    Utils.overlapsRects = overlapsRects;
    function overlaps(img, img2, buffSize) {
        if (buffSize === void 0) { buffSize = 0; }
        left1 = img.x - img.width * img.anchor.x + buffSize;
        right1 = left1 + img.width * img.scale.x - buffSize * 2;
        top1 = img.y - img.height * img.anchor.y + buffSize;
        down1 = top1 + img.height * img.scale.y - buffSize * 2;
        left2 = img2.x - img2.width * img2.anchor.x + buffSize;
        right2 = left2 + img2.width * img2.scale.x - buffSize * 2;
        top2 = img2.y - img2.height * img2.anchor.y + buffSize;
        down2 = top2 + img2.height * img2.scale.y - buffSize * 2;
        // return !(a.right < b.x || a.bottom < b.y || a.x > b.right || a.y > b.bottom);
        //  return !(right1 < left1 || down1 < top2 || left1 > right2 || top1 > down2);
        return (right2 > left1) && (left2 < right1) && (down2 > top1) && (top2 < down1);
        //return !(left1 > right2 + buffSize || right1 < left2 - buffSize || top1 > down2 + buffSize || down1 < top2 - buffSize);
        // return !(left1 > right2  || right1 < left2  || top1 > down2 || down1 < top2);
        //return !(left > a.right + tolerance || right < a.left - tolerance || top > a.bottom + tolerance || bottom < a.top - tolerance);
    }
    Utils.overlaps = overlaps;
})(Utils || (Utils = {}));
//# sourceMappingURL=final.js.map