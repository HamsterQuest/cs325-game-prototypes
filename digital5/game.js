//set width and height variables for game
var width = 1600;
var height = 900;
//create game object and initialize the canvas
var game = new Phaser.Game(width, height, Phaser.AUTO, null, {preload: preload, create: create, update: update});

//initialize some variables
var player;
var noodles;
var playerSpeed = 250;
var maxnoodleSpeed = 1500;
var maxplayerSpeed = 1000;
var showBodies = false;
var currentTime = 0;
var timer;
var gameDuration = 30;
var prompt;

var music;

function preload() {
	//set background color of canvas
	game.stage.backgroundColor = '#eee';

	//load assets
	game.load.image('player', 'asset/macaroni.png');
	game.load.image('noodle', 'asset/semicircle.png');

	//load physics body polygon data from a local JSON file
	this.game.load.physics("physics", "asset/data.json");
	
	game.load.audio('jam', ['assets/metajams revenge in space.mp3','assets/metajams revenge in space.ogg']);
	
}
function create() {
	prompt = game.add.text(width*0.5, height*0.5, "Clear the Macaronis!!", {fontSize: "40px"});
	prompt.anchor.set(0.5);
	//set world boundaries, allowing room at the bottom for noodles to fall
	game.world.setBounds(0,-100,width,height+50);

	//start p2 physics engine
	game.physics.startSystem(Phaser.Physics.P2JS);

	//initialize keyboard arrows for the game controls
	cursors = game.input.keyboard.createCursorKeys();

	//initialize player
	player = game.add.sprite(width*0.5, height*0.8, "player");
	//player.body.setCircle(45);
	//player.scale.setTo(0.5,0.5);
	game.physics.p2.enable(player, showBodies);
	//add physics body polygon
	player.body.clearShapes();
	player.body.loadPolygon("physics", "semicircle");
	//player.body.setCircle(200);
	//make player kinematic so that it does not respond to collisions
	player.body.kinematic = true;
	player.body.angle = 180;

	//initialize noodle group
	noodles = game.add.group();

	//spawn a noodle every .8 seconds, unless the end of the game is near
	game.time.events.loop(800, function() {
		if (currentTime < gameDuration - 4) {
			spawnnoodle();
		}
	}, game);

	//place timer text in the top left to count down
	timer = game.add.text(10, 10, gameDuration, { fontSize: "24px"} );
	//decrement the remaining time every second
	game.time.events.loop(1000, updateTimer, game);

	music = game.add.audio('jam');
	music.play();
}
function render(){
	//game.debug.body(player);
}
function update() {
	if(currentTime == 1){
		prompt.destroy();
	}

	if (player.body.velocity.y < maxnoodleSpeed) {
		player.body.velocity.y+= 20;
	}

	//extra no leaving (makes walls "sticky")
	if (player.position.x < 0 || player.position.x > width){
		player.body.velocity.x = 0;
	}

	if(player.position.y > height-150){ //player is on the ground
		player.position.y = 400; //fix bad position???
		player.body.velocity.y = 0;
		if(cursors.up.isDown){
			player.body.velocity.y -= 1000;
		}
		if (cursors.left.isDown && player.position.x > 0) {
			if(player.body.velocity.x > 0){ // if it was going right
				player.body.velocity.x -= playerSpeed; //stop
			}
			if(player.body.velocity.x > -maxplayerSpeed){
				player.body.velocity.x -= playerSpeed/5; //accel
			}
		}
		else if (cursors.right.isDown && player.position.x < width) {
			if(player.body.velocity.x < 0){ // if it was going left
				player.body.velocity.x += playerSpeed; // stop
			}
			if(player.body.velocity.x < maxplayerSpeed){
				player.body.velocity.x += playerSpeed/5; // accel
			}
		}
		else {
			player.body.velocity.x = 0;
		}
	}
	else { //player is in the air
		if(cursors.down.isDown){
			player.body.velocity.y += 500;
		}
		if (cursors.left.isDown && player.position.x > 10) {
			player.body.velocity.x -= playerSpeed/10;
		}
		else if (cursors.right.isDown && player.position.x < width) {
			player.body.velocity.x += playerSpeed/10;
		}
	}
	//move the player right and left based on keyboard arrows ^^


	//iterate through the noodle group
	for (var i in noodles.children) {
		var noodle = noodles.children[i];
		//accelerate noodles downards if below a maximum speed
		if (noodle.body.velocity.y < maxnoodleSpeed) {
			noodle.body.velocity.y+= 20;
		}
		//destroy noodles that have left through the top of the viewport
		if (noodle.position.y < height*0.1) {
			noodle.destroy();
		}
	}
}

function spawnnoodle() {
	//spawn noodle randomly at the top of the screen
	var x = Math.random() * width;
	var noodle = game.add.sprite(x, height*0.1, "noodle");
	game.physics.p2.enable(noodle, showBodies);
	//add physics body polygon
	noodle.body.clearShapes();
	noodle.body.loadPolygon("physics", "semicircle");
	//traingle.body.setCircle(100);
	//move noodle downwards
	noodle.body.moveDown(0);

	//add noodle to the noodles group
	noodles.add(noodle);
}

function updateTimer() {
	//increase current timer and set remaining time text
	currentTime++;
	timer.setText(gameDuration - currentTime);

	/*
	* stop the game and display the number of noodles caught
	* when time has run out
	*/
	if (currentTime == gameDuration) {
		var score = noodles.children.length;
		var txt;
		if(score == 0){
			txt = game.add.text(width*0.5, height*0.5, "You cleared all the Macaronis!", {fontSize: "40px"});
		}
		else{
			txt = game.add.text(width*0.5, height*0.5, "Macaronis left: "+score, {fontSize: "40px"});
		}
		txt.anchor.set(0.5);
		game.paused = true;
	}
}
