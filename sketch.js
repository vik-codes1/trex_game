localStorage["highScore"] = 0;

//making the sprite variables
var trex, gameOver, cloud, obstacles, ground, invisibleGround, gameOver, restart;

//variables for loading images
 var trexRunning, trexCollided, groundImage, cloudsImg, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, overImg, restartImg ;

//making score var
var count = 0;

//making the obstacle and clouds group
var ObstaclesGroup, CloudsGroup;

//initiate Game STATEs
var PLAY = 1;
var END = 2;
var gameState = 1;

function preload(){
  trexRunning = loadAnimation("trex1.png","trex3.png","trex4.png");
  trexCollided = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
  cloudsImg = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  overImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(800, 400);
  
  //making the trex
  trex = createSprite(50,345,40,70)
  trex.addAnimation("run",trexRunning);
  trex.scale = 0.75;
  
  trex.addAnimation("collide" ,trexCollided)
  
  //making the ground
  ground = createSprite(200,370,400,10);
  ground.addImage("ground", groundImage);
  
  
  invisibleGround = createSprite(200,380,400,10);
  invisibleGround.visible = false;
  
  //gameOver and restart
  gameOver = createSprite(400,200);
  restart = createSprite(400,240);
  gameOver.addImage(overImg);
  gameOver.scale = 0.5;
  restart.addImage(restartImg)
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  //making groups
  CloudsGroup = new Group();
  ObstaclesGroup = new Group();
  
  //text color and size
  textSize(18);
  textFont("Georgia");
}
  
function draw() {
  background(255);
  
  //trex should remain on ground
  trex.collide(invisibleGround);
  
  
  if(gameState === PLAY){
    
  //making the ground natural
  if(ground.x < 0){
    ground.x = ground.width/2;
  }
  
  ground.velocityX = -(5 + 3*count/100);  
  
  
  //making the trex jump
  if(trex.y > 338 && keyDown("space")){
    trex.velocityY = -10;
  }
  
  //calculating score
  count += Math.round(getFrameRate()/60);
    
  //making the trex fall down
  trex.velocityY +=0.5;
  
  //console.log(trex.y);
  //trex.debug = true;
  
  //making obstacles and clouds
  spawnClouds()
  spawnObstacles();
    
  if(trex.isTouching(ObstaclesGroup)){
    gameState  = 2;
  }

  }
  
  else if(gameState === 2) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collide", trexCollided)
    
    //setting the highScore
        if(localStorage["highScore"] < count){
      localStorage["highScore"] = count;
    }
    
    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  
  //displaying the sprites
  drawSprites();
  
  
  text("Score: "+ count, 650, 100);
  text("Highscore: "+ localStorage["highScore"], 100,100)
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    obstacles = createSprite(800,360,10,40);
    obstacles.velocityX = -(5 + count/100*3);
    
    //generate random obstacles
    var rand = round(random(1,6));
    
    
    switch(rand){
      case 1: obstacles.addImage(obstacle1);
        break;
        
        case 2: obstacles.addImage(obstacle2);
        break;
        
        case 3: obstacles.addImage(obstacle3);
        break;
        
        case 4: obstacles.addImage(obstacle4);
        break;
        
        case 5: obstacles.addImage(obstacle5);
        break;
        
        case 6: obstacles.addImage(obstacle6);
        break;
        
        default: break;
    }
    
    //adding to group
    ObstaclesGroup.add(obstacles);
    
    //assign scale and lifetime to the obstacle
    obstacles.scale = 0.5;
    obstacles.lifetime = 800/5;
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(800,320,40,10);
    cloud.y = round(random(220,280));
    //console.log(cloud.y);
    cloud.scale = 0.5;
    cloud.velocityX = -(3 + 3*count/100);
    cloud.addImage("clouds", cloudsImg);
    
    //assign lifetime to the variable
    cloud.lifetime = 800/3;
    
    CloudsGroup.add(cloud);
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    restart.depth = cloud.depth;
    restart.depth +=1;
  }
  
}


function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  
  trex.changeAnimation("run", trexRunning)
  
  count = 0;
  
}