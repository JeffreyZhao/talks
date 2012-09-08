var SortingAnimations;
    
eval(Wind.compileBlock(function () {

SortingAnimations = function (canvas) {

    var ctx = canvas.getContext ? canvas.getContext("2d") : null;
    
    var lineWidth = 9;
    var updateCost = 50;
    var compareCost = 30;
    
    var randomArray = function () {
        var array = [];
        var length = Math.floor(canvas.width / (lineWidth + 1));
        
        for (var i = 1; i <= length; i++) {
            array.push(i);
        }

        array.sort(function() { return (Math.round(Math.random()) - 0.5); });
        return array;
    }
    
    var paint = function (array, updating) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = lineWidth;

        for (var i = 0; i < array.length; i++)
        {
            var x = (lineWidth + 1) * i + lineWidth / 2;
            var height = array[i] * (lineWidth + 1) * canvas.height / canvas.width;
            
            ctx.beginPath();
            
            if (updating && updating.indexOf(i) >= 0) {
                ctx.strokeStyle = "red";
            } else {
                ctx.strokeStyle = "black";
            }
            
            ctx.moveTo(x, canvas.height);
            ctx.lineTo(x, canvas.height - height);
        
            ctx.stroke();
        }
    }
    
    var compareAsync = eval(Wind.compile("async", function (x, y) {
        $await(Wind.Async.sleep(compareCost));
        return x - y;
    }));

    var swapAsync = eval(Wind.compile("async", function (array, i, j) {
        var t = array[i];
        array[i] = array[j];
        array[j] = t;

        paint(array, [i, j]);
        $await(Wind.Async.sleep(updateCost));
    }));
    
    var assignAsync = eval(Wind.compile("async", function (array, i, value, updating) {
        array[i] = value;
        paint(array, updating);
        $await(Wind.Async.sleep(updateCost));
    }));
    
    var sortOperations = {
    
        Bubble: eval(Wind.compile("async", function (array) {
            for (var i = 0; i < array.length; i++) {
                for (var j = 0; j < array.length - i - 1; j++) {
                    var r = $await(compareAsync(array[j], array[j + 1]));
                    if (r > 0) $await(swapAsync(array, j, j + 1));
                }
            }
        })),
        
        Quick: eval(Wind.compile("async", function (array) {
    
            var partitionAsync = eval(Wind.compile("async", function (begin, end) {
                var i = begin;
                var j = end;
                var pivot = array[Math.floor((begin + end) / 2)];

                while (i <= j) {
                    while (true) {
                        var r = $await(compareAsync(array[i], pivot));
                        if (r < 0) { i++; } else { break; }
                    }

                    while (true) {
                        var r = $await(compareAsync(array[j], pivot));
                        if (r > 0) { j--; } else { break; }
                    }

                    if (i <= j) {
                        $await(swapAsync(array, i, j));
                        i++;
                        j--;
                    }
                }
                
                return i;
            }));
            
            var sortAsync = eval(Wind.compile("async", function (begin, end) {
                var index = $await(partitionAsync(begin, end));

                if (begin < index - 1) 
                    $await(sortAsync(begin, index - 1));

                if (index < end) 
                    $await(sortAsync(index, end));
            }));
        
            $await(sortAsync(0, array.length - 1));
        })),
        
        Selection: eval(Wind.compile("async", function (array) {
            for(var j = 0; j < array.length - 1; j++) {
                var mi = j;
                for (var i = j + 1; i < array.length; i++) {
                    var r = $await(compareAsync(array[i], array[mi]));
                    if (r < 0) { mi = i; }
                }

                $await(swapAsync(array, mi, j));
            }            
        })),
        
        Shell: eval(Wind.compile("async", function (array) {
            var gaps = [701, 301, 132, 57, 23, 10, 4, 1];

            for (var gap = Math.floor(array.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
                for (var i = gap; i < array.length; i++) {
                    var temp = array[i];
                    
                    var j;
                    for (j = i; j >= gap; j -= gap) {
                        var r = $await(compareAsync(temp, array[j - gap]));
                        if (r < 0) {
                            $await(assignAsync(array, j, array[j - gap]));
                        } else {
                            break;
                        }
                    }
                    
                    $await(assignAsync(array, j, temp, [j]));
                }
            }
        }))
    };

    this.supported = !!ctx;
    this.randomArray = randomArray;
    this.paint = paint;
    
    this.names = [];
    for (var m in sortOperations) this.names.push(m);
    
    this.sortAsync = eval(Wind.compile("async", function (name, array) {
        paint(array);
        $await(sortOperations[name](array));
        paint(array);
    }));
};

}));