//Canvas Setting
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
//Canvas Size
canvas.width=400;
canvas.height=700;
//Putting Canvas in HTML
document.body.appendChild(canvas);

let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;
let gameOver = false;

//Spaceship Coordinates
let spaceshipX = canvas.width/2-32;
let spaceshipY = canvas.height-64;

//Used to save the keys pressed
let keysDown={};

//List saving bullets, enemies
let bulletList = [];

let score = 0;

function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src="images/space.jpg";
    
    spaceshipImage = new Image();
    spaceshipImage.src = "images/spaceship.png";
    
    bulletImage = new Image();
    bulletImage.src = "images/bullet.png";

    enemyImage = new Image();
    enemyImage.src = "images/enemy.png";

    gameOverImage = new Image();
    gameOverImage.src = "images/gameover.png";
}

function createBullet(){
    let b = new Bullet();
    b.init();
}

function createEnemy(){
    const interval = setInterval(function(){
        let e = new Enemy();
        e.init();
    }, 1000)
} 

//Keyboard event; 완료
function setupKeyboardListener(){
    document.addEventListener("keydown", function(event){
        keysDown[event.keyCode] = true;
        console.log(keysDown);
    });
    document.addEventListener("keyup", function(event){
        delete keysDown[event.keyCode];

        if(event.keyCode == 32){
            createBullet()
        }
    });
}

function update(){
    if(39 in keysDown){
        spaceshipX += 5;
    } //right
    if(37 in keysDown){
        spaceshipX -= 5;
    }

    if(spaceshipX<=0){
        spaceshipX = 0;
    } 
    if(spaceshipX>=canvas.width-64){
        spaceshipX = canvas.width-64;
    }

    //Y coordinate update of Bullet
    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].alive){
            bulletList[i].update();
            bulletList[i].checkHit();
        }
    }

    for(let i=0; i<enemyList.length; i++){
        enemyList[i].update();
    }
}

function generateRandomValue(min, max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min;
    return randomNum;
}

let enemyList = [];
function Enemy(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.y = 0;
        this.x = generateRandomValue(0, canvas.width-32);
        enemyList.push(this);
    };
    this.update = function(){
        this.y += 2;

        if(this.y >= canvas.height - 32){
            gameOver = true;
        }
    };
}

function Bullet(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.x = spaceshipX+24;
        this.y = spaceshipY;
        this.alive = true;
        bulletList.push(this);
     };
    this.update = function(){
        this.y -= 7;
    };

    this.checkHit = function(){
        for(let i=0; i<enemyList.length; i++){
            if(this.y <= enemyList[i].y && 
                this.x>=enemyList[i].x && 
                this.x<=enemyList[i].x + 32)
                {
                    score+=10;
                    this.alive = false;
                    enemyList.splice(i, 1);  //When enemy dies, it disappears
                 }
        }
    };
}

function render(){
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
    ctx.fillText(`Score: ${score}`, 20, 20);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].alive){
            ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
        }
    }

    for(let i=0; i<enemyList.length; i++){
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
    }

}

function main(){
    if(!gameOver){
        update();
        render();
        requestAnimationFrame(main);
    }
    else{
        ctx.drawImage(gameOverImage, 10, 100, 380, 380);
    }
}


loadImage();
setupKeyboardListener();
createEnemy();
main();

