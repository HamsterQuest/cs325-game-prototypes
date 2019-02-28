"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var shoe1 = null;
    var shoe2 = null;

    var key1;
    var key2;

    var trains;

    var timer;

    var score;

    var music = null;

    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        music.stop();
        game.state.start('LostScreen');

    }

    return {

        create: function () {

          // Change the background color of the game to blue
          game.stage.backgroundColor = '#71c5cf';

          // Set the physics system
          game.physics.startSystem(Phaser.Physics.ARCADE);

          // Display the shoes at the position x=100 and y=245
          shoe1 = game.add.sprite(100, 245, 'shoe1');
          shoe2 = game.add.sprite(105, 345, 'shoe2');

          // Add physics to the shoes
          // Needed for: movements, gravity, collisions, etc.
          game.physics.arcade.enable(shoe1);
          game.physics.arcade.enable(shoe2);

          // Add gravity to the shoes to make it fall
          

          // Call the 'jump' function when the spacekey is hit
          key1 = game.input.keyboard.addKey(Phaser.Keyboard.W);
          key1.onDown.add(this.jump1, this);

          key2 = game.input.keyboard.addKey(Phaser.Keyboard.P);
          key2.onDown.add(this.jump2, this);

          trains = game.add.group();

          timer = game.time.events.loop(1600, this.addRowOfTrains, this);

          this.score = 0;
          this.labelScore = game.add.text(20, 20, "0",
              { font: "30px Arial", fill: "#ffffff" });
          music = game.add.audio('footMusic');
          music.play();
        },

        update: function () {
          if (shoe1.y < 0 || shoe1.y > 490 || shoe2.y < 0 || shoe2.y > 490){
              this.quitGame();
          }
          game.physics.arcade.overlap(
                shoe1, trains, quitGame, null, this);
          game.physics.arcade.overlap(
                shoe2, trains, quitGame, null, this);
        },

        // Make the shoe jump
        jump1: function() {
            // Add a vertical velocity to the shoe
            shoe1.body.gravity.y = 1000;
         
            shoe1.body.velocity.y = -300; // because we don't like the player
        },

        jump2: function() {
            // Add a vertical velocity to the shoe
             shoe2.body.gravity.y = 1000;
            shoe2.body.velocity.y = -350;
        },
        addOneTrain: function(x, y) {
            // Create a train at the position x and y
            var train = game.add.sprite(x, y, 'train1');
            train.scale.setTo(1,1);
            // Add the train to our previously created group
            trains.add(train);

            // Enable physics on the train
            game.physics.arcade.enable(train);

            // Add velocity to the train to make it move left
            train.body.velocity.x = -200;

            // Automatically kill the train when it's no longer visible
            train.checkWorldBounds = true;
            train.outOfBoundsKill = true;
        },
        addRowOfTrains: function() {
            // Randomly pick a number between 0 and 3
            // This will be the number of trains
            var tnum = Math.floor(Math.random() * 2) + 1;
            this.score += 1;
            this.labelScore.text = this.score;

            for (var i = 0; i < tnum; i++){
                var hole = Math.floor(Math.random() * 5) + 1;
                this.addOneTrain(800, hole * 160);
            }
        },
    };
};
