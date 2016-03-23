///------ Responsible for creating and displaying the splash screen to the player along with some basic game settings ------\\\

MenuState = function ()
{};

MenuState.prototype =
{
    create : function ()
    {
        // DEBUG LABEL \\
        var menuLabel = game.add.text(80, 150, 'Click to start', {font: '20px Courier', fill: '#ffffff'});
        // DEBUG INFORMATION \\
        console.log("Menu was called");
        
        // Create a listener event for a mouse click or touch and executes the function when the event occurs.
        game.input.onDown.add(this.start);
    },
    
    // Start's the game.
    start : function ()
    {
        // Start the main game state.
        game.state.start("Game");
    }
};