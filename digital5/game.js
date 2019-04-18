//set width and height variables for game
var width = 1600;
var height = 900;
//create game object and initialize the canvas
var game = new Phaser.Game(width, height, Phaser.AUTO, null, {preload: preload, create: create, update: update});

//initialize some variables
var ball;
var triangles;
var ballSpeed = 250;
var maxTriangleSpeed = 1500;
var maxBallSpeed = 1000;
var showBodies = false;
var currentTime = 0;
var timer;
var gameDuration = 30;

function preload() {
	//set background color of canvas
	game.stage.backgroundColor = '#eee';

	//load assets
	game.load.image('ball', 'asset/semicircle.png');
	game.load.image('triangle', 'asset/semicircle.png');

	//load physics body polygon data from a local JSON file
	this.game.load.physics("physics", "asset/data.json");
}
function create() {

	//set world boundaries, allowing room at the bottom for triangles to fall
	game.world.setBounds(0,-100,width,height+50);

	//start p2 physics engine
	game.physics.startSystem(Phaser.Physics.P2JS);

	//initialize keyboard arrows for the game controls
	cursors = game.input.keyboard.createCursorKeys();

	//initialize ball
	ball = game.add.sprite(width*0.5, height*0.8, "ball");
	//ball.body.setCircle(45);
	ball.scale.setTo(0.5,0.5);
	game.physics.p2.enable(ball, showBodies);
	//add physics body polygon
	ball.body.clearShapes();
	ball.body.loadPolygon("physics", "semicircle");
	//ball.body.setCircle(200);
	//make ball kinematic so that it does not respond to collisions
	ball.body.kinematic = true;
	ball.body.angle = 180;

	//initialize triangle group
	triangles = game.add.group();

	//spawn a triangle every .8 seconds, unless the end of the game is near
	game.time.events.loop(800, function() {
		if (currentTime < gameDuration - 4) {
			spawnTriangle();
		}
	}, game);

	//place timer text in the top left to count down
	timer = game.add.text(10, 10, gameDuration, { fontSize: "24px"} );
	//decrement the remaining time every second
	game.time.events.loop(1000, updateTimer, game);
	
}
function render(){
	//game.debug.body(ball);
}
function update() {
	if (ball.body.velocity.y < maxTriangleSpeed) {
		ball.body.velocity.y+= 20;
	}

	//extra no leaving (makes walls "sticky")
	if (ball.position.x < 0 || ball.position.x > width){
		ball.body.velocity.x = 0;
	}

	if(ball.position.y > height-150){ //ball is on the ground
		ball.position.y = 400; //fix bad position???
		ball.body.velocity.y = 0;
		if(cursors.up.isDown){
			ball.body.velocity.y -= 1000;
		}
		if (cursors.left.isDown && ball.position.x > 0) {
			if(ball.body.velocity.x > 0){ // if it was going right
				ball.body.velocity.x -= ballSpeed; //stop
			}
			if(ball.body.velocity.x > -maxBallSpeed){
				ball.body.velocity.x -= ballSpeed/5; //accel
			}
		}
		else if (cursors.right.isDown && ball.position.x < width) {
			if(ball.body.velocity.x < 0){ // if it was going left
				ball.body.velocity.x += ballSpeed; // stop
			}
			if(ball.body.velocity.x < maxBallSpeed){
				ball.body.velocity.x += ballSpeed/5; // accel
			}
		}
		else {
			ball.body.velocity.x = 0;
		}
	}
	else { //ball is in the air
		if(cursors.down.isDown){
			ball.body.velocity.y += 500;
		}
		if (cursors.left.isDown && ball.position.x > 10) {
			ball.body.velocity.x -= ballSpeed/10;
		}
		else if (cursors.right.isDown && ball.position.x < width) {
			ball.body.velocity.x += ballSpeed/10;
		}
	}
	//move the ball right and left based on keyboard arrows ^^


	//iterate through the triangle group
	for (var i in triangles.children) {
		var triangle = triangles.children[i];
		//accelerate triangles downards if below a maximum speed
		if (triangle.body.velocity.y < maxTriangleSpeed) {
			triangle.body.velocity.y+= 20;
		}
		//destroy triangles that have left through the top of the viewport
		if (triangle.position.y < height*0.1) {
			triangle.destroy();
		}
	}
}

function spawnTriangle() {
	//spawn triangle randomly at the top of the screen
	var x = Math.random() * width;
	var triangle = game.add.sprite(x, height*0.1, "triangle");
	game.physics.p2.enable(triangle, showBodies);
	//add physics body polygon
	triangle.body.clearShapes();
	triangle.body.loadPolygon("physics", "semicircle");
	//traingle.body.setCircle(100);
	//move triangle downwards
	triangle.body.moveDown(0);

	//add triangle to the triangles group
	triangles.add(triangle);
}

function updateTimer() {
	//increase current timer and set remaining time text
	currentTime++;
	timer.setText(gameDuration - currentTime);

	/*
	* stop the game and display the number of triangles caught
	* when time has run out
	*/
	if (currentTime == gameDuration) {
		var score = triangles.children.length;
		var txt = game.add.text(width*0.5, height*0.5, score, {fontSize: "40px"});
		txt.anchor.set(0.5);
		game.paused = true;
	}
}
