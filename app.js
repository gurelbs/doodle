document.addEventListener("DOMContentLoaded", () => {

    const grid = document.querySelector('.grid');
    const doodler = document.createElement('div');
    let doodlerLeftSpace = 50;
    let startPoint = 150;
    let doodlerBottomSpace = startPoint;
    let isGameOver = false;
    let platformCount = 5;
    let platforms = [];
    let upTimerId;
    let downTimerId;
    let isJumping = true;
    let isGoingLeft = false;
    let isGoingRight = false;
    let leftTimerId;
    let rightTimerId;
    let score = 0;
    let startOver = document.createElement('p');
    let gameAudio = new Audio('https://365openu-my.sharepoint.com/personal/begurel_365_openu_ac_il/Documents/Epic.mp3')
    let failAudio = new Audio('https://365openu-my.sharepoint.com/personal/begurel_365_openu_ac_il/Documents/fail.mp3')

    let createDoodler = () => {
        grid.appendChild(doodler);
        doodler.classList.add('doodler')
        doodlerLeftSpace = platforms[0].left
        doodler.style.left = doodlerLeftSpace + 'px';
        doodler.style.bottom = doodlerBottomSpace + 'px';
    }

    class Platform {
        constructor(newPlatButtom){
            this.bottom = newPlatButtom;
            this.left = Math.random() * 315;
            this.visual = document.createElement('div');

            const visual = this.visual;
            visual.classList.add('platform');
            visual.style.left = this.left + 'px';
            visual.style.bottom = this.bottom + 'px';
            grid.appendChild(visual)
        }
    }

    let createPlatfrom = () => {
        for (let i = 0; i < platformCount; i++) {
            let platGap = 600 / platformCount;
            let newPlatButtom = 100 + i * platGap;
            let newPlatform = new Platform(newPlatButtom)
            platforms.push(newPlatform);
        }
    }
    console.log(platforms);

    let movePlatform = () => {
        if (doodlerBottomSpace > 150) {
            platforms.forEach( platform => {
                platform.bottom -= 4;
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px';
                
                if (platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual;
                    firstPlatform.classList.remove('platform');
                    platforms.shift();
                    score++
                    console.log(platforms);
                    let newPlatform = new Platform(600);
                    platforms.push(newPlatform);

                }
            })
        }
    }

    let jump = () => {
        clearInterval(downTimerId)
        upTimerId = setInterval(() => {
            doodlerBottomSpace += 10;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if (doodlerBottomSpace > startPoint + 200){
                fall()
            }
        },30)
    }

    let fall = () => {
        clearInterval(upTimerId)
        isJumping = false;
        downTimerId = setInterval(() => {
            doodlerBottomSpace -= 5;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if (doodlerBottomSpace <= 0){
                GameOver()
            }
            platforms.forEach((platform) => {
                if (
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= platform.bottom + 15) &&
                    (doodlerLeftSpace + 60 >= platform.left) &&
                    (doodlerLeftSpace <= (platform.left + 85)) &&
                    !isJumping
                ) {
                    console.log(`landed`);
                    startPoint = doodlerBottomSpace;
                    jump()
                }
            })
        },30)
    }

    let GameOver = () => {
        console.log(`game over`);
        failAudio.play()
        while (grid.firstChild){
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score;
        startOver.innerHTML = `<a href="./" class="start-over">start over</a>`
        grid.appendChild(startOver)
        isGameOver = true;
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(rightTimerId)
        clearInterval(leftTimerId)
        gameAudio.pause()
    }

    let control = (e) => {
        if (e.key === 'ArrowLeft'){
            moveLeft()
        } else if (e.key === 'ArrowRight') {
            moveRight()
        } else if (e.key === 'ArrowUp') {
            moveStraight()
        }
    }

    let moveLeft = () => {
        if (isGoingRight){
            clearInterval(rightTimerId);
            isGoingRight = false;
        }
        isGoingLeft = true;
        leftTimerId = setInterval(()=>{
            if (doodlerLeftSpace >= 0 ){
                doodlerLeftSpace -= 5;
                doodler.style.left = doodlerLeftSpace + 'px';
            } else {
                moveRight()
            }
        },25)
    }

    let moveRight = () => {
        if (isGoingLeft){
            clearInterval(leftTimerId);
            isGoingLeft = false
        }
        isGoingRight = true;
        rightTimerId = setInterval(()=>{
            if (doodlerLeftSpace <= 340){
                doodlerLeftSpace += 5;
                doodler.style.left = doodlerLeftSpace + 'px';
            } else {
                moveLeft()
            }
        },25)
    }

    let moveStraight = () => {
        isGoingLeft = false;
        isGoingRight = false;
        clearInterval(rightTimerId);
        clearInterval(leftTimerId);

    }
    let start = () => {
        if (!isGameOver){
            createPlatfrom();
            createDoodler();
            gameAudio.play()
            setInterval(movePlatform,30);
            jump()
            document.addEventListener('keyup', control)
        }
    }

    //can be btn with DOM
    start()

})