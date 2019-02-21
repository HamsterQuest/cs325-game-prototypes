"use strict";

GameStates.makeMainMenu = function( game, shared ) {

	var playButton = null;

    function startGame(pointer) {

        //	And start the actual game
        game.state.start('MainMenu');

    }

    return {

        create: function () {

			var style = { font: "50px Verdana", fill: "#7777ff", align: "center" };
			var text = game.add.text( game.world.centerX, 15, "You Lose", style );
			text.anchor.setTo( 0.5, 0.0 );
			game.world.bringToTop(text);
            playButton = game.add.button( 303, 400, 'playButton', startGame, null, 'over', 'out', 'down');

        },

        update: function () {

            //	Do some nice funky main menu effect here

        }

    };
};
