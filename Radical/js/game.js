// The player ship object.
var ship;
// The background music of the game.
var BGM;
// The death sound container.
var deathSFX;
// The group object holding the game barriers.
var barrierGroup;
// The horizontal velocity of the ship.
var shipHorizontalSpeed = 400;
// The fall speed of the barriers.
var barrierFallSpeed = 150;
// The time between barrier spawns.
var barrierSpawnDelay = 1200;
// The number of barriers passed by the player.
var barrierCountScore = 0;
// The current game's level.
var gameLevel = 1;
// The score text to display to the player.
var scoreText;
// Debug text to show the current game's fps.
var fpsText;
// Can we increase our score count?
var bCanIncreaseScore = true;
// Can we increase the game level?
var bCanIncreaseLevel = true;
// Boolean to judge whether audio has already been created.
var bCanCreateAudio = true;
// Should the audio be muted.
var bShouldMuteAudio = false;
// The button responsible for muting the audio.
var muteButton;
 
// The game state object.
var GameState = function(game)
{};
 
// The extension of the game state.
GameState.prototype = 
{
  	create : function ()
    {
        // Create the game's initial elements.
        this.initGameValues();
        this.initGraphics();
        this.initInput();
        this.initUserInterface();
        this.initAudio();
        
        // Enable checking of advancedTiming for debug.
        this.game.time.advancedTiming = true;
	},
    
    // Initialises the game logic default values.
    initGameValues : function ()
    {
        // Set the ship's initial horizontal speed.
        shipHorizontalSpeed = 400;
        // Set the initial barrier fall speed.
        barrierFallSpeed = 150;
        // Set the initial delay between barrier spawns.
        barrierSpawnDelay = 1200;
        // Set the initial barrier count to zero.
        barrierCountScore = 0;
        // Set the initial game level.
        gameLevel = 1;
        // The game can increase the player's score.
        bCanIncreaseScore = true;
        // The game can increase the game level.
        bCanIncreaseLevel = true;
        // Start the physics system for use in the whole game.
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // After the barrierDelay has elapsed spawn new ones.
        game.time.events.loop(barrierSpawnDelay, this.spawnBarrier);
    },
    
    // Initialises the graphical sprites and objects.
    initGraphics : function ()
    {
        // Set the game's background color.
        game.stage.backgroundColor = '#182d3b';
        // Create a group to hold our barriers.
        barrierGroup = game.add.group();
        // Add the ship object's sprite into the game.
        ship = game.add.sprite(game.width / 2, game.height - 40, "playerShip");
        // Enable the physics system for the ship.
        game.physics.enable(ship, Phaser.Physics.ARCADE);
        // Set the default anchor of the ship.
        ship.anchor.set(0.5);
        // Set the size of the ship's physics's body.
        ship.body.setSize(16,20,0,3);
        // Disable rotation for the ship's body.
        ship.body.allowRotation = false;
        // Add in the idle animation for the player ship.
        ship.animations.add("Idle", [0,1,2,3], 5, false);
    },
    
    // Initialises input listeners and events.
    initInput : function ()
    {
        // When a click event is passed, move the ship.
        game.input.onDown.add(MoveShip);
        // When a click event has ended, stop the ship.
        game.input.onUp.add(StopShip); 
    },
    
    // Initialises the UI elements.
    initUserInterface : function ()
    {
        // Create a text object to display our fps.
        fpsText = game.add.text(50, 700, this.game.time.fps, {font: '18px Courier', fill: '#ffffff'});
        // Create a text object and assign it to our score text.
        scoreText = game.add.text(50,50, "Score: " + barrierCountScore, {font: '18px Courier', fill: '#ffffff'});
        // Create the mute button which allows the player to toggle whether the audio is muted or not.
        button = game.add.button(game.world.centerX - 95, 400, 'ship', MuteAudioButtonEvent, this, 2, 1, 0);
    },
    
    // Initialises the game's audio.
    initAudio : function ()
    {
        // If we have not already created our audio instances.
        if(bCanCreateAudio)
        {
            // Assign the BGM variable an audio object.
            BGM = game.add.audio("BGM");
            // Assign the deathSFX variable an audio object.
            deathSFX = game.add.audio("DeathSFX");
            // Set the deathSFX's initial volume.
            deathSFX.volume = 0.35;
            // Begin playing the background music.
            BGM.play();
            // Set the background music to loop.
            BGM.loopFull();
            // We no longer need to create audio instances for the duration of this game instance.
            bCanCreateAudio = false;
        }
    },
    
    update : function ()
    {
        // Allow our ship to screenwrap.
        this.wrapScreen(ship);
        // Check for a collision event between this two bodies and fire the endgame if one occurs.
        game.physics.arcade.collide(ship, barrierGroup, EndGame);
        // Play the idle ship animation.
        ship.animations.play('Idle');
        // Check the current level of the game.
        this.currentLevel();
        
        // Constantly update our text to display the current game's fps.
        fpsText.text = "FPS: " + this.game.time.fps;
    },
    
    // Spawn's two random barriers with a gap between them.
    spawnBarrier : function ()
    {
        // Pick a random position.
        var position = game.rnd.between(0, 4);
        // Log this position for debug purposes.
        //console.log(position);
        // Create a new temporary barrier from the barrier object.
        var barrier = new Barrier(game, position, 1);             
        // Add this object to the current game.
        game.add.existing(barrier);
        // Add this object to the barrier group.
        barrierGroup.add(barrier);
        // Create another barrier one step away from the first to create a maneuverable gap.
        barrier = new Barrier(game, position + 1, 0);               
        // Add this object to the current game.
        game.add.existing(barrier);
        // Add this object to the barrier group.
        barrierGroup.add(barrier);
    },
    
    // Wraps an object around the screen.
    wrapScreen : function (objectToWrap)
    {
        // If the object goes past the left side of the screen.
        if(objectToWrap.x < 0)
        {
            // Appear at the right of the screen.
            objectToWrap.x = game.width;
        }
        
        // If the object surpasses the right side of the screen.
        if(objectToWrap.x > game.width)
        {
            // Appear at the left side of the screen.
            objectToWrap.x = 0;
        }
    },
    
    // Evaluates what the current game level is.
    currentLevel : function ()
    {
        // If the current score is a multiple of 10
        if(barrierCountScore % 4 == 0 && barrierCountScore != 0)
        {
            // Can we increase our current level?
            if(bCanIncreaseLevel)
            {
                // Evaluate the current game level.
                switch (gameLevel)
                {
                    case 1:
                        // Increase the number of game levels.
                        gameLevel = 2;
                        ChangeLevel(2, 150, 450, '#182d3b');

                        break;
                    case 2:
                        // Increase the number of game levels.
                        //gameLevel = 3;
                        // Increase the barrier's fall speed.
                        //barrierFallSpeed = 175;
                        // Increase the player's movement speed.
                        //shipHorizontalSpeed = 500;
                        ChangeLevel(3, 175, 500, '#152835');

                        break;
                    case 3:
                        // Increase the number of game levels.
                        //gameLevel = 4;
                        // Increase the barrier's fall speed.
                        //barrierFallSpeed = 200;
                        // Increase the player's movement speed.
                        //shipHorizontalSpeed = 550;
                        ChangeLevel(4, 200, 550, '#2f424e');

                        break;
                    case 4:
                        // Increase the barrier's fall speed.
                        //barrierFallSpeed = 250;
                        // Increase the player's movement speed.
                        //shipHorizontalSpeed = 600;
                        
                        ChangeLevel(4, 250, 600, '#8b969d');

                        break;
                }
                // The level has been increased and so there is no need to change it again in this period.
                bCanIncreaseLevel = false;
            }
        }
        else
        {
            // The score is not a multiple of 10 and so we are able to increase our level again next time.
            bCanIncreaseLevel = true;
        }
    },
    
    //DEBUG INFO\\
    render : function ()
    {
        // Render the ships body for debug purposes.
        this.game.debug.body(ship);
    },
}

// Mute's and unmute's the game's audio.
function MuteAudioButtonEvent ()
{
    // Toggle from muted to unmuted and vice versa.
    bShouldMuteAudio = !bShouldMuteAudio;
    
    // If the audio is muted.
    if(bShouldMuteAudio)
    {
        // Mute the audio.
        BGM.mute = true;
        deathSFX.mute = true;
    }
    else 
    {
        // Umute the audio.
        BGM.mute = false;
        deathSFX.mute = false;
    }
}

// Changes the current game level's settings.
function ChangeLevel (newLevelCount, newFallSpeed, newShipSpeed, hashColor)
{
    gameLevel = newLevelCount;
    barrierFallSpeed = newFallSpeed;
    shipHorizontalSpeed = newShipSpeed;
    
    game.stage.backgroundColor = hashColor;
}
 
// Stops the ship's movement.
function StopShip ()
{
    // Disable the ship's velocity for an instant stop.
     ship.body.velocity.x = 0;     
}

// Move's the ship left/right based upon the position of the input event. 
function MoveShip (event)
{
    // If the click event happened on the left of the screen.
    if(event.position.x < game.width / 2)
    {
        // Move the object left.
        speedMult = -1;
    }
    // If the click event occured on the right of the screen.
    else
    {
        // Move the object right.
        speedMult = 1;
    }
    
    // Move the ship's velocity based upon our speed and the normalised direction to move.
    ship.body.velocity.x = shipHorizontalSpeed * speedMult;
}

// Increase's the player's score and updates the UI to reflect it.
function IncreaseScore ()
{
    // Can the score be increased?
    if(bCanIncreaseScore)
    {
        // The score has now been increased so this becomes false.
        bCanIncreaseScore = false;
        // Increment the game score.
        barrierCountScore++;
        // Update the UI to reflect score changes.
        scoreText.text = "Score: " + barrierCountScore; 
    }
}

// Ends the current game instance.
function EndGame ()
{
    // Play the death sound effect.
    deathSFX.play();
    // Switch to the end game state.
    game.state.start("Finish");
}
 
// A barrier object.
Barrier = function (game, position, anchor) 
{
    // Call for a sprite object.
	Phaser.Sprite.call(this, game, position * game.width / 5, -20, "barrier");
    // Enable the physics for the sprite body.
	game.physics.enable(this, Phaser.Physics.ARCADE);
    // Set the sprite's inital anchor value.
    this.anchor.set(anchor, 0.5);
};

// Extension of the barrier object to become a Phaser sprite. 
Barrier.prototype = Object.create(Phaser.Sprite.prototype);

// Create's a constructer from the object's parameters.
Barrier.prototype.constructor = Barrier;
 
// Constant update of the barrier instance.
Barrier.prototype.update = function () 
{
    // Drop the barrier down the screen by it's fall speed.
	this.body.velocity.y = barrierFallSpeed;
    
    // Has the barrier exited the game screen.
	if(this.y > game.height)
    {
        // Destroy the barrier.
        this.destroy();
        // Increase the player's score.
        IncreaseScore();
    }
    else 
    {
        // The score can now be increased again.
        bCanIncreaseScore = true;
    }
};