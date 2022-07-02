const canvas = document.getElementById('tetris')
const context = canvas.getContext('2d')
context.scale(20,20)
function www(){
    let rowCount = 1
    outer: for(let y = arena.length-1;y>0;--y){
        for(let x = 0;x<arena.length;x++){
            if(arena[y][x] === 0){
                continue outer
            }
        }
        const row = arena.splice(y,1)[0].fill(0)
        arena.unshift(row)
        ++y
        player.score += rowCount*10
        rowCount*=2; 
    }
}
function collide(arena,player){
    const m = player.matrix
    const o = player.pos
    for(let y = 0;y<m.length;++y){
        for (let x = 0;x<m[y].length;++x){
            if(m[y][x]!==0&& arena[y+o.y][x+o.x]!==0){
                return true
            }
        }
    }
    return false
}
function creatMatrix(w,h){
    const matrix = [];
    while(h--){
        matrix.push(new Array(w).fill(0))
    }
    return matrix;
}
function createPiece(type){
    if(type === 'I'){
        return [
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
        ]
    }else if(type === 'L'){
        return [
            [0,2,0],
            [0,2,0],
            [0,2,2],
        ]
    }else if (type === 'J'){
        return [
            [0,3,0],
            [0,3,0],
            [3,3,0],
        ]
    }else if(type === '0'){
        return [
            [4,4],
            [4,4],
        ]
    }else if(type ==='Z'){
        return [
            [5,5,0],
            [0,5,5],
            [0,0,0],
        ]
    }else if(type === 'S'){
        return [
            [0,6,0],
            [6,6,6],
            [0,0,0],
        ]
    }else if (type ==='T'){
        return [
            [0,7,0],
            [7,7,7],
            [0,0,0],
        ]
    }


function drawMatrix(matrix,offset){
        matrix.forEach((row,y)=> {
            row.forEach((value,x)=>{
                if(value !==0 ){
                    context.fillStyle = colors[value]
                    context.fillRect(x+offset.x,y+offset.y,1,1)
                }
            })
            
        });

    }

}

function draw () {
    context.fillStyle = '#000';
    context.fillRect(0,0,canvas.clientWidth,canvas.height)

    drawMatrix(arena,{x:0,y:0})
    drawMatrix(player.matrix,player.pos)
}
function marge (arena,player) {
    player.matrix.forEach((row,y)=>{
        row.forEach((value,x)=>{
            if(value!==0){
                arena[y+player.pos.y][x+player.pos.x] = value

            }
        })
    })
}
function rotate(marge,dir){
    for(let y = 0;y<matrix.length;++y){
        for(let x = 0;x<y;++x){
            [
                matrix[x][y],
                matrix[y][x]

            ] = [
                matrix[y][x],
                matrix[x][y]
            ]
        }
    }
    if(dir>0){
        matrix.forEach(row=>row.reverse())  
    }else {
        matrix.reverse();
    }
}
function playerDrop (){
    player.pos.y++
    if(collide(arena,player)){
        player.pos.y--
        marge(arena,player)
        playerReset()
        arenaSweep()
        updateScore()
    }
    dropCounter=0
}
function playerrMove(offset){
    player.pos.x+=offset
    if(collide(arena,player)){
        player.pos.x -=offset
    }
}
function playerReser(){
    const piece = 'TJLOSZI'
    player.matrix = createPiece(piece[piece.length*Math.random()|0])
    player.pos.y = 0;
    player.pos.x = (arena[0].length/2 | 0) - (player.matrix[0].length/2 | 0)
    if(collide(arena,player)){
        arena(row=>row.fill(0))
        player.score = 0;
        updateScore()
    }
}
function playerRotate(dir){
    const pos = player.pos.x
    let offset = 1 
    rotate(player.matrix,dir)
    while(collide(arena,player)){
        player.pos.x+=offset
        offset = (offset+(offset>0?1:-1))
        if (offset>player.matrix[0].length){
            rotate(player.matrix,-dir)
            player.pos.x = pos
        }
    }
}
let dropCounter = 0
let dropInterval = 1000
let lasttime = 0
function update(time=0){
    const deltaTime = time.lasttime
    dropCounter = deltaTime
    if(dropCounter>dropInterval){
        playerDrop()
    }
    lasttime = time
    draw()
    requestAnimationFrame(update)
}
function updateScore(){
    document.getElementById('score').innerText = player.score
}
document.addEventListener('keydown',event =>{
    if(event.keyCode ===37){
        playerrMove(-1)
    }else if(event.keyCode ===39){
        playerrMove(1)
    }else if(event.keyCode ===40){
        playerDrop()
    }else if (event.keyCode ===81){
        playerRotate(-1)
    }else if (event.keyCode ===87){
        playerRotate(1)
    }
})

const colors = [
    null,
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '33877FF',
]

const arena = creatMatrix(12,20)
const player = {
    pos:{x:0,y:0},
    matrix:null,
    score:0
}

playerReser();
updateScore();
update();
