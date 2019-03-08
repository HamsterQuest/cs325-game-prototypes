"use strict";

window.onload = function() {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'logo', 'assets/phaser.png' );
		game.load.image('sky', 'assets/sky.png');
		game.load.image('star', 'assets/star.png');
    }
    
    var bouncy;
	
	var score = 0;
	var scoreText;
	
	var stars;
	
	var timer;
	
	var fallSpeed = 10;
	
	var time = 1600;
    
    function create() {
		//  We're going to be using physics, so enable the Arcade Physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);
	
		game.add.sprite(0, 0, 'sky');
        // Create a sprite at the center of the screen using the 'logo' image.
        bouncy = game.add.sprite( game.world.centerX, game.world.centerY, 'logo' );
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        bouncy.anchor.setTo( 0.5, 0.5 );
        
        // Turn on the arcade physics engine for this sprite.
        game.physics.enable( bouncy, Phaser.Physics.ARCADE );
        // Make it bounce off of the world bounds.
        bouncy.body.collideWorldBounds = true;
        
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        //var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        //var text = game.add.text( game.world.centerX, 15, "Build something.", style );
        //text.anchor.setTo( 0.5, 0.0 );
		
		// stars 
		stars = game.add.group();

		stars.enableBody = true;

		//  timer time
		timer = game.time.events.loop(time, makeStars, this);
		
		scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    }
    
    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, game.input.activePointer, 500, 500, 500 );
		game.physics.arcade.overlap(bouncy, stars, collectStar, null, this);
	}
	
	function collectStar (bouncy, star) {

    // Removes the star from the screen
    star.kill();
	
	 //  Add and update the score
    score -= 10;
    scoreText.text = 'Score: ' + score;
	}
	function makeStars(){
		/*for (var i = 0; i < 12; i++)
		{
			//  Create a star inside of the 'stars' group
			var star = stars.create(i * 70, 0, 'star');

			//  Let gravity do its thing
			star.body.gravity.y = fallSpeed;

			//  This just gives each star a slightly random bounce value
			star.body.bounce.y = 0.7 + Math.random() * 0.2;
		}*/
		
			var x = Math.floor(Math.random() * 840) + 10;
		// Create a star at the position x and y
            var star = game.add.sprite(x, 0, 'star');
            star.scale.setTo(1,1);
            // Add the star to our previously created group
            stars.add(star);

            // Enable physics on the star
            game.physics.arcade.enable(star);

            // make star go down
            star.body.gravity.y = fallSpeed;
			
			if(fallSpeed < 60){
				fallSpeed = fallSpeed+5;
				time = time -50;
			}

            // Automatically kill the train when it's no longer visible
            star.checkWorldBounds = true;
            star.outOfBoundsKill = true;
	}
};
