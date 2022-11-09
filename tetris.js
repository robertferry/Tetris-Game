document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const width = 10;
    let nextRandom = 0
    let timerId 
    let score = 0
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]
    
    // console.log(squares);

    //The shapes
    const lShapes = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ];

    const zShapes = [
        [0,10,11,21,],
        [11,12,20,21],
        [0,10,11,21],
        [11,12,20,21]
    ];

    const tShapes = [
        [1,10,11,12],
        [1,11,12,21],
        [10,11,12,21],
        [1,10,11,21]
    ];

    const oShapes = [
        [0,1,10,11],
        [0,1,10,11],
        [0,1,10,11],
        [0,1,10,11]
    ];

    const iShapes = [
        [1,11,21,31],
        [10,11,12,13],
        [1,11,21,31],
        [10,11,12,13]
    ];

    const theShapes = [lShapes, zShapes, tShapes, oShapes, iShapes];


let currentPosition = 4;
let currentRotation = 0;
//this below will randomly select a shape.
let random = Math.floor(Math.random()*theShapes.length)
let current = theShapes[random][0];

//draw the first shape
function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('shape')
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }
//////////////////

draw()
function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('shape')
      squares[currentPosition + index].style.backgroundColor = ''

    })
  }

//make the shape move down every second
// timerId = setInterval(moveDown, 500)

///add the controls with an eventlistener and a function attached
function control(e) {
    if (e.keyCode === 37) {
        moveLeft()
    }
    else if (e.keyCode === 39){
        moveRight()
    }
    else if (e.keyCode === 38){
        rotate()
    }
    else if (e.keyCode === 40){
        //move faster
    }
}
document.addEventListener('keyup', control)




//Move down function👇👇below here.this makes the block move down one column
function moveDown() {
    undraw()
    currentPosition += width
    draw()                    
    freeze();
}
/////remember ''current'' is the first random shape
/////and ''squares'' is the array that selects all the divs in the main grid.
function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('bottom'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('bottom'))
        // start a new shape to fall
        random = nextRandom /// this was added for minigrid
        nextRandom = Math.floor(Math.random() * theShapes.length)
        current = theShapes[random][currentRotation]
        currentPosition = 4;
        draw()
        displayShape()
        addScore()
        gameOver()
    }
}

// move the shape to the left and prevent it from going off screen
function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

    if(!isAtLeftEdge) currentPosition -=1

    if(current.some(index => squares[currentPosition + index].classList.contains('bottom'))) {
    currentPosition += 1;
}
draw()
}

///move the shape to the right and prevent it from going off screen.. 
function moveRight() {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)

    if(!isAtRightEdge) currentPosition +=1

    if(current.some(index => squares[currentPosition + index].classList.contains('bottom'))) {
    currentPosition -= 1;
}
draw()
}



 ///FIX ROTATION OF TETROMINOS A THE EDGE 
 function isAtRight() {
    return current.some(index=> (currentPosition + index + 1) % width === 0)  
  }
  
  function isAtLeft() {
    return current.some(index=> (currentPosition + index) % width === 0)
  }
  
  function checkRotatedPosition(P){
    P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
    if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
      if (isAtRight()){            //use actual position to check if it's flipped over to right side
        currentPosition += 1    //if so, add one to wrap it back around
        checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
        }
    }
    else if (P % width > 5) {
      if (isAtLeft()){
        currentPosition -= 1
      checkRotatedPosition(P)
      }
    }
  }

//// rotate the shape 
function rotate() {
    undraw()
    currentRotation ++
    if(currentRotation === current.length) {
        currentRotation = 0
    }
    current = theShapes[random][currentRotation]
    checkRotatedPosition()
    draw()
}

//show up the next shape in the mini grid 
const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
let displayIndex = 0


//the shapes without the rotations 
const upNextShape = [
    [1,5,9,2],   //lshape
    [0,4,5,9], //zshape
    [1,4,5,6], //tshape
    [0,1,4,5], //oshape
    [1,5,9,13]  //ishape
]

//draw the shape in the mini grid
function displayShape() {
    ///first you clear the mini grid if there is anything
    displaySquares.forEach(square => {
        square.classList.remove('shape')
        square.style.backgroundColor = ''
    })
    upNextShape[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add('shape')
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
}

//add functionality to the button 
startBtn.addEventListener('click', () => {
    if (timerId) {
        clearInterval(timerId)
        timerId = null
    } else {
        draw()
        timerId = setInterval(moveDown, 200)
        nextRandom = Math.floor(Math.random()*theShapes.length)
        displayShape()
    }
})

//add score
function addScore() {
    for (let i = 0; i < 199; i +=width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

      if(row.every(index => squares[index].classList.contains('bottom'))) {
        score +=1
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('bottom')
          squares[index].classList.remove('shape')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('bottom'))) {
        scoreDisplay.innerHTML = 'Game over buddy';
        clearInterval(timerId)
    }
}



















})
 
