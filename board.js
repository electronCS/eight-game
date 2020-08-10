
function board(tiles){
    this.N = tiles.length;
	this.board = new Array(this.N);
    for (var i = 0; i < this.N; i++){
        this.board[i] = new Array(this.N);
    }
	for(var i = 0; i < this.N; i++) {
		for(var j = 0; j < this.N; j++) {
			this.board[i][j] = tiles[i][j];
		}
	}

	this.goal = new Array(this.N);
    for (var i = 0; i < this.N; i++){
        this.goal[i] = new Array(this.N);
    }
	var counter = 1;
	for(var i = 0; i < this.N; i++) {
		for(var j = 0; j < this.N; j++) {
			this.goal[i][j] = counter;
			counter ++;
		}
	}
	this.goal[this.N-1][this.N-1] = 0;

    this.randomize = function(){
        var List = [];
        for (var i = 0; i < this.N * this.N; i++){
            List.push(i);
        }

        for (var i = 0; i < this.N * this.N; i++){
            var n = (int)(Math.random()*List.length);

            this.board[(int)(i/this.N)][i%this.N] = List[n];
            List.splice(n, 1);
        }
    }

    this.display = function(size){
        textSize(25);
        text("WASD to move", 420, 100);
        text("Space to autosolve", 420, 150);
        text("R for a new board", 420, 200);
        textSize(50);
        fill(200);
        var length = size/this.N - 1;
        for (var i = 0; i < this.N; i++){
            for (var j = 0; j < this.N; j++){
                if (this.board[i][j] == 0)
                    fill(255);
                rect(j*length,i*length + size/6,length,length);
                if (this.board[i][j] == 0)
                    fill(200);

            }
        }
        fill(0);
        for (var i = 0; i < this.N; i++){
            for (var j = 0; j < this.N; j++){
                if (this.board[i][j] != 0){
                    text(this.board[i][j], j * length + 2*length/5, i * length + 3*length/5 + size/6);
                }
            }
        }
    }

    this.hamming = function() {
        var total = 0;
        for(var i = 0; i < this.N; i++) {
            for(var j = 0; j < this.N; j++) {
                if(this.board[i][j] != this.goal[i][j] && this.board[i][j] != 0) {
                    total++;
                }
            }
        }
        return total;
    }

    this.manhattan = function() {
        var dx;
        var dy;
        var total = 0;
        for(var i = 0; i < this.N; i++) {
            for(var j = 0; j < this.N; j++) {
                if(this.board[i][j] != 0) {

                    dx = Math.abs(j-(this.board[i][j]-1)%this.N);
                    dy = Math.abs(int(i-(this.board[i][j]-1)/this.N));
                    total = total + dx + dy;
                }
            }
        }
        return total;

    }

    this.isGoal = function() {
        for(var i = 0; i < this.N; i++) {
            for(var j = 0; j < this.N; j++) {
                if(this.board[i][j] != this.goal[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    this.equals = function(y) {
        if(y == this) {
            return true;
        }
        if(!(y instanceof board) || y == null) {
            return false;
        }
        if(y.board.length != this.N || y.board[0].length != this.N) {
            return false;
        }
        for(var i = 0; i < this.N; i++) {
            for(var j = 0; j < this.N; j++) {
                if(y.board[i][j] != this.board[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    this.neighbors = function(){
        var list = new Array();
        var x,y;
        z = this.blank();
        x = this.blank()[1];
        y = this.blank()[0];

        if(x-1 >= 0) {
            var b = this.copy1();
            this.swap(b,y,x,y,x-1);
            list.push(new board(b));
        }
        if(x+1 < this.N) {
            var b = this.copy1();
            this.swap(b,y,x,y,x+1);
            list.push(new board(b));
        }
        if(y-1 >= 0) {
            var b = this.copy1();
            this.swap(b,y,x,y-1,x);
            list.push(new board(b));
        }
        if(y+1 < this.N) {
            var b = this.copy1();
            this.swap(b,y,x,y+1,x);
            list.push(new board(b));
        }

        return list;
    }

    this.swap = function(a, y, x, i, j) {
        var val = a[y][x];
        a[y][x] = a[i][j];
        a[i][j] = val;
    }

    this.copy1 = function() {
        var b = new Array();
        for(var i = 0 ; i < this.N; i++) {
            b.push(new Array());
            for(var j = 0; j < this.N; j++) {
                b[i].push(this.board[i][j]);
            }
        }
        return b;
    }

    this.blank = function() {
        var blank = new Array(2);
        for(var i = 0; i < this.N; i++) {
            for(var j = 0; j < this.N; j++) {
                if(this.board[i][j] == 0) {
                    blank[0] = i;
                    blank[1] = j;
                    return blank;
                }
            }
        }
        return null;
    }

    this.hash = function(){
        var hashKey = 0;
        var exp = 1;
        for(var i = 0; i < this.N; i++) {
            for(var j = 0; j < this.N; j++) {
                hashKey+= this.board[i][j] * exp;
                exp *= (this.N * this.N + 1);
            }
        }
        return hashKey;
    }
    this.twin = function() {

        var b = this.copy1();
        var swapped = false;
        for(var i = 0; i < this.N; i++) {
            for(var j = 0; j < this.N; j++) {

                if (b[i][j] != this.goal[i][j]){
                    if (swapped)
                        return false;
                    swapped = true;
                    var t = b[i][j] - 1;
                    var temp = b[i][j];

                    b[i][j] = b[int(t/this.N)][t%this.N];
                    b[int(t/this.N)][t%this.N] = temp;
                }

            }
        }
        return true;
    }

}
