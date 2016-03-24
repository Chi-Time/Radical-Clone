///----- Creates and defines the game and all of it's sub-states ------\\\

// The game window.
var game = new Phaser.Game(480, 720, Phaser.CANVAS, "gameDiv");

// The state's to be used.
game.state.add("Boot", BootState);
game.state.add("Menu", MenuState);
game.state.add("Game", GameState);
game.state.add("Finish", FinishState);

// Start the boot state.
game.state.start("Boot");