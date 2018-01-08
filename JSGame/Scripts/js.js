
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
//--------------

init();

function init() 
{
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = (window.innerHeight) * 0.95;

    paused = false;

    dot[0] = canvas.width / 2;
    dot[1] = canvas.height / 2;

    player = {loc:dot,speed:intialspeed,mass:10,color:"rgb(255,0,0)"}

    enemies = [];
    enemies.push(CreateEnemy());
    enemies.push(CreateEnemy());

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

    window.addEventListener("keypress", pausegame, false )
    // --------------------

   // var test = Math.floor(Math.random() * 4) * 10 - 5;
    draw();
}

function MainLogic()
{
    if(!paused)
    {
        document.getElementById("score").innerHTML = 
        Math.floor(player.mass).toString();

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
                enemies[i]= CreateEnemy();
            }

            if(Collision(enemies[i]))
            {
                if(enemies[i].mass > player.mass)
                {
                    alert("gg");
                    clearInterval(mainInterval);
                    clearInterval(keysInterval);
                    init();
                }
                else
                {
                    player.mass += enemies[i].mass/massgrow;
                    enemies[i]= CreateEnemy();
                }
            }
        }
    

        var spawner = Math.floor((Math.random() * spawnRate) + 1);
        var gift = Math.floor((Math.random() * bonusrate) + 1);

        if(spawner == 54)
        {
        enemies.push(CreateEnemy());
        }

        if(gift == 320)
        {
            createBonus();
        }
        if(player.mass > 500)
        {
            alert("you are too big you won.");
            clearInterval(mainInterval);
            clearInterval(keysInterval);
            init();
        }

        BonusCollision();
    }
}

function pausegame(e)
{
    if(e.keyCode == 32)
    {
        if(!paused)
        {
            paused=true;
        }
        else
        {
            paused=false;
        }
    }
}

function draw()
{
  var color = 255;

  if(canvas.getContext)
  {
    var context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);
    //context.fillRect(0,0,100,100);

    DrawPlayer(context);
    DrawEnemies(context);
    DrawBonus(context);
  }
}

function UserInput() 
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
function CreateEnemy()
{
    var offset = -100;

    var mass = Math.floor((Math.random() * maxmass) + 1);
    var side = Math.floor((Math.random() * 4) + 1);
    var x;
    var y;
    var num = Math.floor((Math.random() * 4) + 1);
    var dir;

    if(side == 1) // up
    {
      x = Math.floor((Math.random() * canvas.width) + 1);
      y = Math.floor((Math.random() * offset) - 5);
    }
    else if(side == 2)// right
    {
        x = Math.floor((Math.random() * canvas.width+100) + canvas.width)+5;
        y = Math.floor((Math.random() * canvas.height) + 1);
    }
    else if(side == 3)// down
    {
        x = Math.floor((Math.random() * canvas.width) + 1);
        y = Math.floor((Math.random() * 100+canvas.height) + canvas.height+5);
    }
    else if(side == 4)// left
    {
        x = Math.floor((Math.random() * offset) - 5);
        y = Math.floor((Math.random() * canvas.height) + 1);
    }
    if(num == 1)
    {
       dir = "up";
    }
    else if(num == 2)
    {
       dir = "right";
    }
    else if(num == 3)
    {
       dir = "down";
    }
    else if(num == 4)
    {
       dir = "left";
    }
   

    var point=[10,10];

    point[0]= x;
    point[1] = y;

    var enemy = {loc:point, speed:intialspeed/diff,mass:mass,color:"rgb(25,207,69)",direction: dir};

    console.log(enemy);

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
function Collision(enemy)
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

function BonusCollision()
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

function BonusLogic()
{
   bonus.exist=false;
   var rng = Math.floor((Math.random() * 3) + 1);

   if(rng == 1)
   {
     player.mass += 30;
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
function IsOutside(enemy)
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

function ChangeSpeed()
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

function ChangeSlowness()
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