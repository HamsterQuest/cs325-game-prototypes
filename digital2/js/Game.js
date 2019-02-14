"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var bouncy = null;

    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }

    return {

        create: function () {

            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

            // Create a sprite at the center of the screen using the 'logo' image.
            shoe1 = game.add.sprite( game.world.centerX-100, game.world.centerY, 'shoe1' );
            shoe2 = game.add.sprite( game.world.centerX-100, game.world.centerY+100, 'shoe2' );
            // Anchor the sprite at its center, as opposed to its top-left corner.
            // so it will be truly centered.



            // Add some text using a CSS style.
            // Center it in X, and position its top 15 pixels from the top of the world.
            var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
            var text = game.add.text( game.world.centerX, 15, "Build something amazing.", style );
            text.anchor.setTo( 0.5, 0.0 );

        },

        update: function () {

            
        }
    };
};
