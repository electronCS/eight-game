

var isSolvable;
var pq;
var solutionNode;
var b;
var answer;
var recalculate;
var count;
var solved;
var fade;
function setup(){
    fade = 255;
    isSolvable = false;
    pq = null;
    solutionNode = null;
    count = 0;
    solved = false;
    recalculate = false;

    var n = new SearchNode();

    var size = 3;
    var tiles = new Array(size);
    for (var i = 0; i < size; i++){
        tiles[i] = new Array(size);
        for (var j = 0; j <size; j++){
            tiles[i][j] = i;
        }
    }
    b = new board(tiles);
    b.randomize();
    b.board[0][0] = 7;
    b.board[0][1] = 0;
    b.board[0][2] = 5;
    b.board[1][0] = 3;
    b.board[1][1] = 8;
    b.board[1][2] = 4;
    b.board[2][0] = 6;
    b.board[2][1] = 2;
    b.board[2][2] = 1;

    var myCanvas = createCanvas(700, 480);

    Solver(b);
    if (isSolvable){
        answer = solution();
    }
    else{
        if (b.board[0][0] != 0 && b.board[0][1] != 0){
            var temp = b.board[0][0];
            b.board[0][0] = b.board[0][1];
            b.board[0][1] = temp;
        }
        else{
            var temp = b.board[1][0];
            b.board[1][0] = b.board[1][1];
            b.board[1][1] = temp;
        }

        Solver(b);
        answer = solution();
    }


}

function draw(){

    background(255);
    fill(0);
    textSize(30);
    text("Moves: " + count, 130, 40);

    stroke(0);
    b.display(4*height/5);

    if (solved){
        textSize(100);
        fade--;
        fill(0, 255, 0, fade);
        stroke(0,0,0, fade)
        text("Solved!", width/18, 3*height/5);
    }

}
function keyPressed(){
    if (key == 'r' || key == 'R'){
        setup();
        return;
    }
    if (solved){
        return;
    }
    if (key == ' '){
        if (recalculate){
            Solver(b);
            answer = solution();
            recalculate = false;

        }
        if (answer.length > 0){
            count++;
            temp = answer.pop()
            b = temp;
        }
        else{
        }
    }
    var x,y;

    r = b.blank()[0];
    c = b.blank()[1];
    if((key == "w" || key == 'W') && r+1 < b.N) {
        count++;

        recalculate = true;
        var temp = b.board[r+1][c];

        b.board[r+1][c] = b.board[r][c];
        b.board[r][c] = temp;

    }
    else if((key == "s" || key == 'S') && r-1 >= 0) {
        count++;

        recalculate = true;
        var temp = b.board[r-1][c];
        b.board[r-1][c] = b.board[r][c];
        b.board[r][c] = temp;
    }
    else if((key == "d" || key == 'D') && c-1 >= 0) {
        count++;

        recalculate = true;
        var temp = b.board[r][c-1];
        b.board[r][c-1] = b.board[r][c];
        b.board[r][c] = temp;
    }
    else if((key == "a" || key == 'A') && c+1 < b.N) {
        count++;

        recalculate = true;

        var temp = b.board[r][c+1];
        b.board[r][c+1] = b.board[r][c];
        b.board[r][c] = temp;
    }

    if (b.isGoal()){
        solved = true;
    }


}


function Solver(initial) {

    solutionNode = null;
    pq = new MinPQ();
    pq.add(new SearchNode(initial,0,null));

    var mySet = new Set()
    mySet.add(pq.peek().board.hash());
    while(true) {

        var cur = pq.pop();
        var curBoard = cur.board;

        if(curBoard.isGoal()){
            isSolvable = true;
            solutionNode = cur;
            break;
        }

        if (curBoard.twin()){
            break;
        }

        var moves = cur.moves;
        var prevBoard = null;
        if(moves > 0){
            prevBoard = cur.prev;
        }

        curBoard.neighbors().forEach((nextBoard) => {
            if(prevBoard != null && nextBoard.equals(prevBoard)){}
            else{
                if (mySet.has(nextBoard.hash())){

                }
                else{
                    pq.add(new SearchNode(nextBoard,moves+1,cur))
                    mySet.add(nextBoard.hash());
                }
            }
        });
    }
}

function SearchNode(b, moves, prev){

    this.board = b;
    this.prev = prev;
    this.moves = moves
}

function isSolvable(){
    return isSolvable;
}

function moves(){
    if(isSolvable){
        return solutionNode.moves;
    }
    return -1;
}

function solution(){
    if(!isSolvable){
        return null;
    }
    var list = new Array();
    var node = solutionNode;
    while (node) {
        list.push(node.board);
        node = node.prev;

    }
    list.pop();
    return list;
}
