
//Nice game

//Vars
var canvas;
var player;
var enemies;
var dot = [0, 0];
var gamespeed = 1;
var intialspeed = 5;
var keys;
var diff = 3;
var spawnRate = 100;
var maxmass = 100;
var massgrow = 4;
var mainInterval;
var keysInterval;
var paused;
var bonus=[];
var bonusrate = 1000;
var winningMass = 500;
var speedincrease = 0.2;
var victory;
var defeat;
//--------------

init();

function init() // initial function, configs stuff.
{
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = (window.innerHeight) * 0.95;

    gamespeed = 1;

    paused = false;
    defeat = false;
    victory = false;

    dot[0] = canvas.width / 2;
    dot[1] = canvas.height / 2;

    player = {loc:dot,speed:intialspeed,mass:10,color:"rgb(255,0,0)"}

    enemies = [];
    enemies.push(CreateEnemy(false));
    enemies.push(CreateEnemy(false));

    var img = new Image();
    img.src = 'Assets/help.png';
    bonus = {pic:img,loc:dot,width:12,height:25,exist:false};

    keysInterval = setInterval(UserInput, 10);
    mainInterval = setInterval(MainLogic, 10);
    // User input functions
    window.addEventListener('keydown', function (e) {
        keys = (keys || []);
        keys[e.keyCode] = (e.type == "keydown");
    })
    window.addEventListener('keyup', function (e) {
        keys[e.keyCode] = (e.type == "keydown");
    })

    window.addEventListener("keydown", pausegame, false);
    // --------------------

    draw();
}

function MainLogic() // main interval, checks alot of stuff
{
    if(!paused)
    {
        document.getElementById("score").innerHTML = 
        Math.floor(player.mass).toString();

        var spawner = Math.floor((Math.random() * spawnRate) + 1);
        var rare = Math.floor((Math.random() * 3) + 1);
        var gift = Math.floor((Math.random() * bonusrate) + 1);

        EnemiesCheck();

        if(spawner == spawnRate)
        {
            if(rare == 2)
            {
               enemies.push(CreateEnemy(true));
            }
            else
            {
               enemies.push(CreateEnemy(false));
            }
        }

        if(gift == bonusrate)
        {
            createBonus();
        }
        if(player.mass > winningMass)
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
                Defeat();
            }
            else
            {
                if(diff > 1)
                {
                    diff -= speedincrease;
                }
                player.mass += enemies[i].mass/massgrow;
                enemies[i]= CreateEnemy(false);
            }
        }
    }
}

function Defeat() // you lost
{
    defeat = true;
    paused = true;
    window.addEventListener("keydown", restart, false);
    draw();
}

function Victory() // you win
{
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
function pausegame(a) // pause
{
    if(a.keyCode == 80)
    {
        paused = !paused;
        draw();
    }
}

function draw() // draw on canvas
{
  if(canvas.getContext)
  {
    var context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);

    DrawPlayer(context);
    DrawEnemies(context);
    DrawBonus(context);
    DrawPause(context);
    DrawLose(context);
    DrawVictory(context);
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

    var mass = Math.floor((Math.random() * maxmass) + 1);
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
       var eh = intialspeed/diff;
       enemy = {loc:point, speed:eh*2,mass:mass,color:"rgb(0,0,255)",direction: dir};
    }
    else
    {
       enemy = {loc:point, speed:intialspeed/diff,mass:mass,color:"rgb(25,207,69)",direction: dir};
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
   var rng = Math.floor((Math.random() * 3) + 1);

   if(rng == 1)
   {
     player.mass += 20;
   }
   else if(rng == 2)
   {
     player.mass = 5;
   }
   else
   {
     diff = 15;
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
    alert("Game help \n *Space - pause \n *Arrow keys to move \n *Try to grow big!");
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