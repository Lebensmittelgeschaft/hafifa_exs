
    /*
     MAIN GAME LOOP
    */
    let gameLoop = ()=>{
      if(!IS_ALIVE){
        paused = true;
        background.render();
        ground.render();
        character.render();
        obstacles.forEach(obstacle=>obstacle.render());
        nicCages.forEach(nc=>nc.render());
        drawScore();
        drawTextAtCenter("yee Dead. Press \"R\" to restart");
      }
      else if(!gameStarted){
        background.render();
      ground.render();
      character.render();
      obstacles.forEach(obstacle=>obstacle.render());
      nicCages.forEach(nc=>nc.render());
      drawScore();
      drawTextAtCenter("Press \"S\" to Start");
       } 
      else if(!paused){
      //updates
      background.update();
      ground.update();
      if(DUMB_AI_ON)dumbAI(character,obstacles);
      else character.update();
      obstacles = obstacles.filter(obstacle=> obstacle.update());
      if(!IMPOSSIBLE_MODE)
      obstacles = obstacles.filter(obstacle=> obstacle.update());
      nicCages = nicCages.filter(nc=> nc.update());
      if(obstaclesCollisionDetection(obstacles)){
        if(IS_ALIVE){
        audioGlobal.death.play();
        if(score>bestScore) localStorage.setItem("bestScore",score);
      }
        IS_ALIVE = false;
        }
        if(obstaclesCollisionDetection(nicCages)){
          audioGlobal.nicCage.play();
          nicCages.shift();
          STOP_SPAWN = true;
          setTimeout(()=>{STOP_SPAWN = false;},STOP_OBSTACLES_SPAWN_TIMEOUT);
          score +=500;
       }
      score++;
      //renderings
      background.render();
      ground.render();
      character.render();
      obstacles.forEach(obstacle=>obstacle.render());
      nicCages.forEach(nc=>nc.render());
      drawScore();

      //only to render the hitbox on top of the rendered scene
      if(DRAW_HITBOX)
        drawHitBox();  
      }
      else{
        drawTextAtCenter("Paused");
      }
      window.requestAnimationFrame(gameLoop);
  };












    //Initialize Game Objects

    //init background
    background = new Background(CANVAS_HEIGHT,
                                      CANVAS_WIDTH/2,
                                      backgroundImage,
                                      BACKGROUND_SPEED,
                                      context,
                                      canvas);
    //init ground 
    ground = new Ground(GROUND_HEIGHT,
      GROUND_WIDTH,
      CANVAS_HEIGHT,
      groundImage,
      GROUND_SPEED,
      context,
      canvas);

    //init character
    character = new Character(CHARACTER_HEIGHT,
      CHARACTER_WIDTH,
      ground.getGroundHeight(),
      characterRunningSprites,
      characterJumpingSprites,
      characterFallingSprites,
      characterSlidingSprites,
      CHARACTER_SPEED,
      CHARACTER_JUMP_HEIGHT,
      audioGlobal.jump,
      context,
      canvas);

      //init obstacles
      setInterval(()=>{
        if(!paused&&!STOP_SPAWN){
        obstacles.push(new Obstacle(OBSTACLE_HEIGHT,OBSTACLE_WIDTH,ground.getGroundHeight(),
        obstacleSprites,
        OBSTACLE_SPEED,
        CHARACTER_HEIGHT,
        CHARACTER_JUMP_HEIGHT
        ,context,canvas));}
      }, OBSTACLE_SPAWN_RATE);
      //init Nic Cage
      setInterval(()=>{
        if(!paused){
          audioGlobal.airHorn.play();
        nicCages.push(new Obstacle(OBSTACLE_HEIGHT,OBSTACLE_WIDTH,ground.getGroundHeight(),
        [nicCageImage],
        OBSTACLE_SPEED,
        CHARACTER_HEIGHT,
        CHARACTER_JUMP_HEIGHT
        ,context,canvas));}
      }, NICOLAS_CAGE_SPAWN_RATE);

    //controls
    document.addEventListener('keydown',(event)=>{
      switch(event.keyCode){
        case 32: //spacebar jump
        if(character.getIsRunning()&&IS_ALIVE&&gameStarted)character.jump();
        event.preventDefault();//prevents space affecting previously pressed inputs+any other functionality chrome default to adding to spacebar
        break;
        case 40: //down arrow slide
        if(character.getIsRunning()&&IS_ALIVE&&gameStarted)character.slide();
        break;
        case 80: //'p' pause
        if(gameStarted)
        paused = !paused;
        break;
        case 82: //'r' reload
        window.location.reload();
        break;
        case 83: //'s' start
        if(!gameStarted){
          audioGlobal.start.play();
        gameStarted = true;
        paused = false;}
        break;
      }
    });
    document.addEventListener('keyup',(event)=>{
      switch(event.keyCode){
        case 40: //down arrow
        if(character.getIsSliding()&&IS_ALIVE)character.run();
        break;
      }
    });




      gameLoop();
  

