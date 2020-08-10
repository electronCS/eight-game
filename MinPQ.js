function MinPQ(){

    //constructor(){
        this.heap = new Array();
        this.heap.push(null);
        this.N = 0;

    //}

    this.contains = function(node) {

        for(var i = 1; i <= this.N; i++){

            if (node.board.equals(this.heap[i].board))
                return true;
        }

        return false;
    }

    this.less = function(e1, e2){
        var d1 = this.heap[e1].board.manhattan() + this.heap[e1].moves;
        var d2 = this.heap[e2].board.manhattan() + this.heap[e2].moves;
        return d1-d2<0;
    }
    this.print = function(){
        for (var i = 1; i <= this.N; i++){
            console.log(i + ": "+  (this.heap[i].board.manhattan() + this.heap[i].moves));
        }
    }
    this.add = function(e){

        this.heap.push(e);

        this.N++;
        this.swim(this.N);
        //this.print();
        //console.log("added, size is " + this.N + "heap size is" + this.heap.length);
        //console.log("+ (this.heap[this.heap.length-1] == null));
        //this.print();

    }
    this.peek = function(){
        if (this.N != 0)
            return this.heap[1];
        else{
            return null;
        }
    }
    this.pop = function(){
        if (this.N == 0){
            return null;
        }
        var temp = this.heap[1];
        this.heap[1] = this.heap[this.N];
        this.N--;
        this.sink(1);
        this.heap.pop();
        //this.print();
        //console.log("popped, size is " + this.N + " heap size is " + (this.heap.length));
        //this.print();
        return temp;
    }


    this.sink = function(k){
        while (2*k <= this.N){
            var j = 2*k;
            if (j < this.N && !(this.less(j, j+1))){
                j++;
            }
            if (this.less(k,j))
                break;
            else{
                var temp = this.heap[k];
                this.heap[k] = this.heap[j];
                this.heap[j] = temp;
                k = j;
            }
        }
    }
    this.swim = function(k){
        while(k > 1 && !this.less(int(k/2), k)){
            var temp = this.heap[k];
            this.heap[k] = this.heap[int(k/2)];
            this.heap[int(k/2)] = temp;
            k = int(k/2);
        }
    }


}
