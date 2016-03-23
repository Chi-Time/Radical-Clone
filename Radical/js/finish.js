///------ Responsible for displaying the game over and game stats to the player ------\\\

FinishState = function ()
{};

FinishState.prototype =
{
    create : function ()
    {
        // DEBUG LABEL \\
        var menuLabel = game.add.text(80, 150, 'You lose...', {font: '24px Courier', fill: '#ffffff'});
        // DEBUG INFORMATION \\
        console.log("Finish was called");
        
        // Create a listener event for a mouse click or touch.
        game.input.onDown.add(this.restart);
    },
    
    // Restart the current game.
    restart : function ()
    {
        // Start the main game loop.
        game.state.start("Game");
    }
};