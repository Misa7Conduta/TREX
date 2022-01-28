 var JOGAR = 1;
 var ENCERRAR = 0;
 var estadoJogo = JOGAR;
 
 var trex, trex_correndo, trex_colidiu;
 var solo, soloinvisivel, imagemdosolo;

 var nuvem, grupodenuvens, imagemdanuvem;
 var grupodeobstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

 var pontuacao;

 var somCheckPoint;
 var somJump;
 var somDie;

 var gameOverImage
 var resetImage

//-------------------------------------------------------------------------------------------------
 
function preload(){
  trex_correndo = loadAnimation("assets/trex1.png","assets/trex3.png","aassets/trex4.png");
  trex_colidiu = loadAnimation("assets/trex_collided.png");
  
  imagemdosolo = loadImage("assets/ground2.png");
  imagemdanuvem = loadImage("assets/cloud.png");
  imagemdofim = loadImage("assets/gameOver.png");
  reiniciar = loadImage("assets/restart.png");

  obstaculo1 = loadImage("assets/obstacle1.png");
  obstaculo2 = loadImage("assets/obstacle2.png");
  obstaculo3 = loadImage("assets/obstacle3.png");
  obstaculo4 = loadImage("assets/obstacle4.png");
  obstaculo5 = loadImage("assets/obstacle5.png");
  obstaculo6 = loadImage("assets/obstacle6.png");
  
  somCheckPoint = loadSound("assets/checkPoint.mp3");
  somDie = loadSound("assets/die.mp3");
  somJump = loadSound("assets/jump.mp3");



}

//-----------------------------------------------------------------------------------------------

 function setup() {
  createCanvas(600, 200);
  
  gameOverImage = createSprite(300,100, 100, 10);
  gameOverImage.addImage(imagemdofim);
  gameOverImage.scale = 0.7;
    
  resetImage = createSprite(300,130, 100, 10);
  resetImage.addImage(reiniciar);
  resetImage.scale = 0.4;
  
  resetImage.visible = false;
  gameOverImage.visible = false;
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided" , trex_colidiu)
  trex.scale = 0.5;
  
  solo = createSprite(200,189,400,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
  //solo.velocityX = -(6 + pontuacao / 500); 
  
  soloinvisivel = createSprite(200,200,400,10);
  soloinvisivel.visible = false;
   
  //criar grupos de obstáculos e de nuvens
  grupodeobstaculos = createGroup();
  grupodenuvens = createGroup();
  
  console.log("Oi" + 5);
   
  //-------------------------------------------------------------------
   //trex.setCollider("rectangle",0,0,80, trex.width +150, trex.height);
   trex.setCollider("circle",0,0,40);
  
  
  trex.debug = true
  pontuacao = 0;
}
//----------------------------------------------------------------------
function draw() {
   background("white");
   
  //exibindo pontuação
  text("Pontuação: "+ pontuacao, 500,60);
    
  console.log("isto é ",estadoJogo)
  
  
  if(estadoJogo === JOGAR){
    //mover o solo
    solo.velocityX = -(6 + pontuacao / 500);
    //marcando pontuação
    pontuacao = pontuacao + Math.round(getFrameRate()/60);
    
    if (solo.x < 0){
      solo.x = solo.width/2;
    }
    
    if((touches.length > 0 || keyDown("space")) && trex.y >= height-120){
       trex.velocityY = -13;
       touches = [];
       //somJump.play();
    
    }
  
   if(grupodeobstaculos.isTouching(trex)){
    estadoJogo = ENCERRAR;
    //somDie.play();
  
    //Hack do Trex
    //trex.velocityY = -13;
  }
    
   trex.velocityY = trex.velocityY + 0.8
    gerarNuvens();
    gerarObstaculos();
  
}      
  else if (estadoJogo === ENCERRAR) {
     solo.velocityX = 0;
     trex.changeAnimation("collided" , trex_colidiu);
    
     gameOverImage.visible = true;
     resetImage.visible = true;
     
     solo.velocityX = 0;
     trex.velocityX = 0;

     grupodeobstaculos.setVelocityXEach(-1);
     grupodenuvens.setVelocityXEach(-1);
     grupodeobstaculos.setVelocityXEach(0);
     grupodenuvens.setVelocityXEach(0);
    
    
    if(mousePressedOver(resetImage)){

     reset();
    } 
   
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
 
 
}
 


  
  
  //evita que o Trex caia no solo
  trex.collide(soloinvisivel);
  drawSprites()
}

function gerarObstaculos(){
 if (frameCount % 60 === 0){
   var obstaculo = createSprite(599,174,10,40);
  obstaculo.velocityX = -(6 + pontuacao / 500);
      
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;
      default: break;
    }
   
    //atribuir escala e tempo de duração ao obstáculo         
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;
   
    //adicionar cada obstáculo ao grupo
    grupodeobstaculos.add(obstaculo);
 }
}

function gerarNuvens() {
  //escreva o código aqui para gerar as nuvens 
  if (frameCount % 60 === 0) {
    nuvem = createSprite(600,105,40,10);
    nuvem.y = Math.round(random(10,60));
    nuvem.addImage(imagemdanuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    
     //atribuir tempo de duração à variável
    nuvem.lifetime = 218;
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
        
    //adiciondo nuvem ao grupo
   grupodenuvens.add(nuvem);
  }
}

function reset(){

estadoJogo = JOGAR;
gameOverImage.visible = false;
resetImage.visible = false;


grupodeobstaculos.destroyEach();
grupodenuvens.destroyEach();

trex.changeAnimation("running", trex_correndo);
pontuacao = 0;














}





