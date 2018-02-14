const NUMBER_OF_SPRITES_CHARACTRER = 8;
const NUMBER_OF_SPRITES_OBSTACLE = 4;
const PNG = '.PNG';
const RUN_PATH = 'assets/images/cat/Run '
const JUMP_PATH = 'assets/images/cat/Jump '
const FALL_PATH = 'assets/images/cat/Fall '
const SLIDE_PATH = 'assets/images/cat/Slide '
const OBSTACLE_PATH = 'assets/images/spr_toucan_fly_anim/spr_toucan_fly_anim-'
const RUN_ID= 'character_running_'
const JUMP_ID     = 'character_jumping_'
const FALL_ID     = 'character_falling_'
const SLIDE_ID    = 'character_sliding_'
const OBSTACLE_ID = 'obstacle_'


function addIDAndSource(element,src,id){
    element.src = src;
    element.id = id;
}

let assets = document.getElementById("assets");

let maxSprites = Math.max(NUMBER_OF_SPRITES_CHARACTRER
    ,NUMBER_OF_SPRITES_OBSTACLE);

for(let i = 0;i<maxSprites;i++){
    if(i<NUMBER_OF_SPRITES_CHARACTRER){
        //run
        let characterRun = document.createElement("IMG");
        addIDAndSource(characterRun,RUN_PATH+'('+(i+1)+')'+PNG
        ,RUN_ID+(i+1));
        assets.appendChild(characterRun);
        //jump
        let characterJump = document.createElement("IMG");
        addIDAndSource(characterJump,JUMP_PATH+'('+(i+1)+')'+PNG
        ,JUMP_ID+(i+1));
        assets.appendChild(characterJump);
        //fall
        let characterFall = document.createElement("IMG");
        addIDAndSource(characterFall,FALL_PATH+'('+(i+1)+')'+PNG
        ,FALL_ID+(i+1));
        assets.appendChild(characterFall);
        //slide
        let characterSlide = document.createElement("IMG");
        addIDAndSource(characterSlide,SLIDE_PATH+'('+(i+1)+')'+PNG
        ,SLIDE_ID+(i+1));
        assets.appendChild(characterSlide);
    }
    if(i<NUMBER_OF_SPRITES_OBSTACLE){
        let obstacle = document.createElement("IMG");
        addIDAndSource(obstacle,OBSTACLE_PATH+i+PNG
        ,OBSTACLE_ID+i);
        assets.appendChild(obstacle);
    }
}
    //^= select every element that begins with the given string
    const characterRunningSprites = document.querySelectorAll('[id^='+RUN_ID+']');

    const characterJumpingSprites = document.querySelectorAll('[id^='+JUMP_ID+']');

    const characterSlidingSprites = document.querySelectorAll('[id^='+SLIDE_ID+']');

    const characterFallingSprites = document.querySelectorAll('[id^='+FALL_ID+']');

    const obstacleSprites         = document.querySelectorAll('[id^='+OBSTACLE_ID+']');
    
  


    //Get Assets/Audio
    let audioGlobal = {};
    audioGlobal.jump    = document.getElementById('jump');

    audioGlobal.start   = document.getElementById('start');

    audioGlobal.death   = document.getElementById('death');

    audioGlobal.airHorn = document.getElementById('airHorn');

    audioGlobal.nicCage = document.getElementById('nicCageAudio');
    //Get Assets/Images
    const backgroundImage = document.getElementById("background");

    const groundImage     = document.getElementById("ground");

    const nicCageImage    = document.getElementById("nicCage");