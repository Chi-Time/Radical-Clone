///------ Responsible for preloading all game assets and displaying preloader to player ------\\\

BootState = function ()
{};

BootState.prototype =
{
    preload : function ()
    {
        // Create a loadling label to display to the user informing that loading is occuring.
		var loadingLabel = game.add.text(80, 150, 'loading...', {font: '30px Courier', fill: '#ffffff'});
        // Load the required graphical assets.
        game.load.image("ship", "assets/sprites/ship.png");
        game.load.image("barrier", "assets/sprites/barrier.png");
        game.load.spritesheet("playerShip", "assets/sprites/ShipAtlas.png", 50, 50);
        // Load the required audio assets.
        game.load.audio("BGM", "assets/audio/Infinite Sensations.ogg");
        game.load.audio("DeathSFX", "assets/audio/Death Sound.ogg");
    },
    
    create : function ()
    {
        // DEBUG INFORMATION \\
        console.log("Boot was called");
        // Once the game has preloaded start the menu.
        game.state.start("Menu");
    },
};