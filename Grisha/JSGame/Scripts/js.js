
//Nice game - by Grisha.

//Vars
var canvas;
var context;
var audio;
var player;
var enemies;
var dot = [0, 0];
var gamespeed = 1;
var keys;
var diff = 3;
var mainInterval;
var keysInterval;
var paused;
var bonus=[];
var victory;
var defeat;
var shadowsenabled;
var godmode=false;
//--------------
//Constants
const WINNING_MASS = 500;
const BONUS_RATE = 1000;
const SPAWN_RATE = 100;
const RARE_SPAWN_RATE = 3;
const MAX_MASS = 100;
const INIT_SPEED = 5;
const SPEED_INCREASE = 0.1;
const MASS_GROW = 4;
const PLAYER_COLOR = "rgb(255,0,0)";
const ENEMY_COLOR = "rgb(25,207,69)";
const RARE_ENEMY_COLOR = "rgb(0,0,255)";
const FPS = 60;

init();

function init() // initial function, configs stuff.
{
    InitCanvas();
    ResetGame();
    ResetIntervals();
    draw();
}

function InitCanvas()
{
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = (window.innerHeight) * 0.95;

    if(canvas.getContext)
    {
       context = canvas.getContext("2d");
    }
}

function ResetGame()
{
    gamespeed = 1;
    diff = 3;

    paused = false;
    defeat = false;
    victory = false;
    shadowsenabled=false;
    Shadows(shadowsenabled);

    dot[0] = canvas.width / 2;
    dot[1] = canvas.height / 2;

    player = {loc:dot,speed:INIT_SPEED,mass:10,color:PLAYER_COLOR};
    
    enemies = [];
    enemies.push(CreateEnemy(false));
    enemies.push(CreateEnemy(false));

    var img = new Image();
    img.src = 'Assets/help.png';
    bonus = {pic:img,loc:dot,width:12,height:25,exist:false};
}

function ResetIntervals()
{
    keysInterval = setInterval(UserInput, 1000/FPS);
    mainInterval = setInterval(MainLogic, 1000/FPS);

    window.addEventListener('keydown', function (e) {
        keys = (keys || []);
        keys[e.keyCode] = (e.type == "keydown");
    });
    window.addEventListener('keyup', function (e) {
        keys[e.keyCode] = (e.type == "keydown");
    });
    window.addEventListener("keydown", SinglePress, false);
}


function MainLogic() // main interval, checks alot of stuff
{
    if(!paused)
    {
        document.getElementById("score").innerHTML = 
        Math.floor(player.mass).toString();

        var spawner = Math.floor((Math.random() * SPAWN_RATE) + 1);
        var rare = Math.floor((Math.random() * RARE_SPAWN_RATE) + 1);
        var gift = Math.floor((Math.random() * BONUS_RATE) + 1);

        EnemiesCheck();

        if(spawner == SPAWN_RATE)
        {
            if(rare == RARE_SPAWN_RATE)
            {
               enemies.push(CreateEnemy(true));
            }
            else
            {
               enemies.push(CreateEnemy(false));
            }
        }

        if(gift == BONUS_RATE)
        {
            createBonus();
        }
        if(player.mass > WINNING_MASS)
        {
            Victory();
        }
        BonusCollision();
    }
}
function EnemiesCheck() // checks for each enemy(i) which way to go, collision etc
{
    for(var i=0; i<enemies.length; i++)
    {
        if(enemies[i].direction == "up")
        {
            enemies[i].loc[1] -= enemies[i].speed*gamespeed; 
        }
        if(enemies[i].direction == "right")
        {
            enemies[i].loc[0] += enemies[i].speed*gamespeed; 
        }
        if(enemies[i].direction == "down")
        {
            enemies[i].loc[1] += enemies[i].speed*gamespeed; 
        }
        if(enemies[i].direction == "left")
        {
            enemies[i].loc[0] -= enemies[i].speed*gamespeed; 
        }

        if(IsOutside(enemies[i]))
        {
            enemies[i]= CreateEnemy(false);
        }

        if(Collision(enemies[i]))
        {
            if(enemies[i].mass > player.mass)
            {
                if(!godmode)
                {
                  Defeat();
                }
            }
            else
            {
                if(diff > 1)
                {
                    diff -= SPEED_INCREASE;
                }
                audio = new Audio("./Assets/hit.mp3");
                audio.play();

                player.mass += enemies[i].mass/MASS_GROW;
                godmode = false;
                enemies[i]= CreateEnemy(false);
            }
        }
    }
}

function Defeat() // you lost
{
    audio = new Audio("./Assets/lose.mp3");
    audio.play();

    defeat = true;
    paused = true;
    window.addEventListener("keydown", restart, false);
    draw();
}

function Victory() // you win
{
    audio = new Audio("./Assets/win.mp3");
    audio.play();

    victory = true;
    paused = true;
    window.addEventListener("keydown", restart, false);
    draw();
}

function restart(a)
{
    if(a.keyCode == 82)
    {
        paused = false;
        window.removeEventListener("keydown", restart, false);
        clearInterval(mainInterval);
        clearInterval(keysInterval);
        init();
    }
}
function SinglePress(a) // pause
{
    if(a.keyCode == 80)
    {
        paused = !paused;
        draw();
    }
    if(a.keyCode == 83) // shadows on off
    {
        shadowsenabled = !shadowsenabled;
        Shadows(shadowsenabled);
        draw();
    }
}

function draw() // draw on canvas
{
    context.clearRect(0, 0, canvas.width, canvas.height);

    DrawPlayer(context);
    DrawEnemies(context);
    DrawBonus(context);
    DrawPause(context);
    DrawLose(context);
    DrawVictory(context);
}

function Shadows(shadowsenabled)
{
    if(shadowsenabled == true)
    {
        context.shadowBlur=15;
        context.shadowColor='#000'; 
        context.shadowOffsetX=10; // offset along X axis
        context.shadowOffsetY=-10;  // offset along Y axis
    }
    else
    {
        context.shadowBlur=0;
        context.shadowOffsetX=0;
        context.shadowOffsetY=0;
    }
}

function UserInput() // responsible for user input , arrow keys.
{
    if(!paused)
    {
        if (keys && keys[37]) // left
        {
            if(player.loc[0] > 0)
            player.loc[0] -= player.speed*gamespeed; 
        }
        if (keys && keys[39]) // right
        {
            if(player.loc[0] < canvas.width)
            player.loc[0] += player.speed*gamespeed; 
        }
        if (keys && keys[38]) //up
        {
            if(player.loc[1] > 0)
            player.loc[1] -= player.speed*gamespeed; 
        }
        if (keys && keys[40])  //down
        {
            if(player.loc[1] < canvas.height)
            player.loc[1] += player.speed*gamespeed; 
        }

        draw();
    }
}

function DrawPlayer(context)
{
    if(godmode)
    {
        context.beginPath();
        context.arc(player.loc[0], player.loc[1], player.mass*2, 0, 2 * Math.PI);
        context.fillStyle = "rgba(255,255,255,0.3)";
        context.fill();
    }
    context.beginPath();
    context.arc(player.loc[0], player.loc[1], player.mass, 0, 2 * Math.PI);
    context.fillStyle = player.color;
    context.fill();
    context.stroke()
}

function DrawEnemies(context)
{
    for(var i=0; i<enemies.length; i++)
    {
        context.beginPath();
        context.arc(enemies[i].loc[0], enemies[i].loc[1], enemies[i].mass, 0, 2 * Math.PI);
        context.fillStyle = enemies[i].color;
        context.fill();
        context.stroke()
    }
}
function DrawBonus(context)
{
    if(bonus.exist)
    {
        context.drawImage(bonus.pic, bonus.loc[0], bonus.loc[1], bonus.width, bonus.height);
    }
}

function DrawPause(context)
{
    if(paused && !victory && !defeat)
    {
        var width = canvas.width / 3;
        var height = canvas.height / 6;

        context.fillStyle = "rgba(233,240,199,0.4)";
        context.fillRect(canvas.width/2 - width/2, canvas.height/2 - height/2, width, height);
        context.font = "30px Arial";
        context.fillStyle = "rgb(2,28,144)";
        context.textAlign = "center";
        context.fillText("Game is paused", canvas.width/2, canvas.height/2);
    }
}

function DrawLose(context)
{
    if(defeat)
    {
        var width = canvas.width / 3;
        var height = canvas.height / 6;

        context.fillStyle = "rgba(233,240,199,0.4)";
        context.fillRect(canvas.width/2 - width/2, canvas.height/2 - height/2, width, height);
        context.font = "30px Arial";
        context.fillStyle = "rgb(2,28,144)";
        context.textAlign = "center";
        context.fillText("Defeated", canvas.width/2, canvas.height/2);
        context.fillText("Press R", canvas.width/2, canvas.height/2+height/3);
    }
}
function DrawVictory(context)
{
    if(victory)
    {
        var width = canvas.width / 3;
        var height = canvas.height / 6;

        context.fillStyle = "rgba(233,240,199,0.4)";
        context.fillRect(canvas.width/2 - width/2, canvas.height/2 - height/2, width, height);
        context.font = "30px Arial";
        context.fillStyle = "rgb(2,28,144)";
        context.textAlign = "center";
        context.fillText("You are too big, victory!", canvas.width/2, canvas.height/2);
        context.fillText("Press R", canvas.width/2, canvas.height/2+height/3);
    }
}
function CreateEnemy(rare) // creates random enemy.
{
    var offset = -100;

    var mass = Math.floor((Math.random() * MAX_MASS) + 1);
    var side = Math.floor((Math.random() * 4) + 1);
    var x,y;
    var num = Math.floor((Math.random() * 4) + 1);
    var dir;

    if(side == 1) // up
    {
      x = Math.floor((Math.random() * canvas.width) + 1);
      y = Math.floor((Math.random() * offset) - 5);
      dir = "down";
    }
    else if(side == 2)// right
    {
       x = Math.floor((Math.random() * canvas.width+100) + canvas.width)+5;
       y = Math.floor((Math.random() * canvas.height) + 1);
       dir="left";
    }
    else if(side == 3)// down
    {
        x = Math.floor((Math.random() * canvas.width) + 1);
        y = Math.floor((Math.random() * 100+canvas.height) + canvas.height+5);
        dir="up";
    }
    else if(side == 4)// left
    {
        x = Math.floor((Math.random() * offset) - 5);
        y = Math.floor((Math.random() * canvas.height) + 1);
        dir="right";
    }

    var point=[10,10];
    point[0]= x;
    point[1] = y;
    var enemy;

    if(rare)
    {
       var eh = INIT_SPEED/diff;
       enemy = {loc:point, speed:eh*2,mass:mass,color:RARE_ENEMY_COLOR,direction: dir};
    }
    else
    {
       enemy = {loc:point, speed:INIT_SPEED/diff,mass:mass,color:ENEMY_COLOR,direction: dir};
    }
    return enemy;
}

function createBonus()
{
    var x = Math.floor((Math.random() * canvas.width) + 1);
    var y = Math.floor((Math.random() * canvas.height) + 1);
    var point=[10,10];
    point[0]= x;
    point[1] = y;

    var img = new Image();
    img.src = 'Assets/bonus.png';
    bonus = {pic:img,loc:point,width:25,height:35,exist:true};

    diff = 3;  //default
}
function Collision(enemy) // checks collision between enemy and player
{
    var dx = player.loc[0] - enemy.loc[0];
    var dy = player.loc[1] - enemy.loc[1];
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < player.mass + enemy.mass) 
    {
        return true;
    }

    return false;
}

function BonusCollision() // checks collision with bonus
{
    if(bonus.exist)
    {
        var rect1 = {x: player.loc[0], y: player.loc[1], width: player.mass, height: player.mass}
        var rect2 = {x: bonus.loc[0], y: bonus.loc[1], width: bonus.width, height: bonus.height}

        if (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y) 
        {
            BonusLogic();
        }
    }
}

function BonusLogic() // what will you get from bonus?
{
   bonus.exist=false;
   var rng = Math.floor((Math.random() * 4) + 1);

   audio = new Audio("./Assets/bonus.mp3");
   audio.play();

   if(rng == 1)
   {
     player.mass += 20;
   }
   else if(rng == 2)
   {
     player.mass = 5;
   }
   else if(rng == 3)
   {
     diff = 15;
   }
   else
   {
       godmode = true;
   }

}
function IsOutside(enemy) // checks if enemy outside to create new one.
{
    var offset = 200;

    if(enemy.loc[0] < 0-offset || enemy.loc[0] > canvas.width+offset ||
      enemy.loc[1] < 0-offset || enemy.loc[1] > canvas.height+offset)
      {
          return true;
      }
      return false;
}

function help()
{
    alert("Game help \n *P - pause \n *Arrow keys to move \n *S - shadows on/off \n *Try to grow big!");
}

function ChangeSpeed() // change game speed.
{
    var num = document.getElementById("field").value;

    if(isNaN(num))
    {
        alert("don't break the game.");
    }
    else if(num > 0)
    {
        gamespeed=num;
    }
    else
    {
       alert("nope");
    }
}

function ChangeSlowness() // change how slow or fast enemies will be, default: 3(higher = slower)
{
    var num = document.getElementById("field2").value;

    if(isNaN(num))
    {
        alert("don't break the game.");
    }
    else if(num > 0)
    {
        diff=num;
    }
    else
    {
       alert("nope");
    }
}