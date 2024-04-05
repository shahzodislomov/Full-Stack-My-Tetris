Config = {
    size:{
        'width':10,
        'height':20
    },
    levels:{
        0:{
            'interval':750,
            'threshold':25
        },
        1:{
            'interval':725,
            'threshold':50
        },
        2:{
            'interval':700,
            'threshold':75
        },
        3:{
            'interval':675,
            'threshold':100
        },
        4:{
            'interval':650,
            'threshold':125
        },
        5:{
            'interval':625,
            'threshold':150
        },
        6:{
            'interval':600,
            'threshold':175
        },
        7:{
            'interval':580,
            'threshold':200
        },
        8:{
            'interval':560,
            'threshold':225
        },
        9:{
            'interval':540,
            'threshold':250
        },
        10:{
            'interval':520,
            'threshold':275
        },
        11:{
            'interval':500,
            'threshold':300
        },
        12:{
            'interval':480,
            'threshold':325
        },
        13:{
            'interval':460,
            'threshold':350
        },
        14:{
            'interval':440,
            'threshold':375
        },
        15:{
            'interval':420,
            'threshold':400
        },
        16:{
            'interval':400,
            'threshold':425
        },
        17:{
            'interval':380,
            'threshold':450
        },
        18:{
            'interval':360,
            'threshold':475
        },
        19:{
            'interval':340,
            'threshold':500
        },
        20:{
            'interval':320,
            'threshold':525
        },
        21:{
            'interval':300,
            'threshold':550
        },
        22:{
            'interval':285,
            'threshold':575
        },
        23:{
            'interval':270,
            'threshold':600
        },
        24:{
            'interval':255,
            'threshold':625
        },
        25:{
            'interval':240,
            'threshold':650
        },
        26:{
            'interval':225,
            'threshold':675
        },
        27:{
            'interval':210,
            'threshold':700
        },
        28:{
            'interval':195,
            'threshold':725
        },
        29:{
            'interval':180,
            'threshold':750
        },
        30:{
            'interval':165,
            'threshold':775
        },
        31:{
            'interval':155,
            'threshold':825
        },
        32:{
            'interval':145,
            'threshold':880
        },
        33:{
            'interval':140,
            'threshold':950
        },
        34:{
            'interval':135,
            'threshold':1050
        },
        35:{
            'interval':130,
            'threshold':1150
        },
        36:{
            'interval':125,
            'threshold':1250
        },
        37:{
            'interval':120,
            'threshold':1350
        },
        38:{
            'interval':115,
            'threshold':1500
        },
        39:{
            'interval':110,
            'threshold':2000
        },
        40:{
            'interval':100,
            'threshold':5000
        }
    }
}
;(function() {
    'use strict';
    function Grid(gridDiv) {
        this.gridDiv=document.getElementById(gridDiv);
        this.inititialiseCells();
        this.previewDiv=document.getElementById('js-next-piece');
        this.initialisePreviewCells();
        this.timer=new window.Timer(this);
        this.keyListener=new window.KeyListener(this);
        this.startGame();

    }

    Grid.prototype = {
        size:Config.size,
        gridDiv:{},
        cells:[],
        level:0,
        levels:Config.levels,
        pieces:[],
        previewCells:[],
        previewDiv:{},
        score:0,
        inititialiseCells:function()
        {
            for (var y=0;y<this.size.height;y++)
            {    
                this.cells[y]=[];
                for (var x=0;x<this.size.width;x++)
                {
                    this.cells[y][x]=new window.Cell(x,y);
                    this.cells[y][x].buildCellHtml()
                    this.cells[y][x].appendCell(this.gridDiv);
                }
            }
        },
        initialisePreviewCells: function()
        {
            for (var y=0; y<5; y++)
            {
                this.previewCells[y]=[];
                for (var x=0; x<5; x++)
                {
                    this.previewCells[y][x]=new window.Cell(x,y);
                    this.previewCells[y][x].buildCellHtml()
                    this.previewCells[y][x].appendCell(this.previewDiv);
                }
            }
        },
        startGame:function()
        {
            this.addPieceToGame();
            this.addPieceToGame();
            this.pieces[0].displayPreviewPiece(this.previewCells);
            this.pieces[1].displayPiece(this.cells);
            this.timer.startTimer();

        },
        addPieceToGame:function()
        {
            this.pieces.unshift(new Piece());
        },
        outputScore: function()
        {
            document.getElementById("js-score").innerHTML=this.score;
        },
        outputLevel: function()
        {
            document.getElementById("js-level").innerHTML=this.level;
        },
        findCompletedRows: function(piecePosition)
        {
            var rowsToCheck={};
            for (var index in piecePosition)
            {
                rowsToCheck[piecePosition[index].y]=1;

            }
            var removeRows={};
            for (var row in rowsToCheck)
            {
                var cellCount=0;
                for (var x=0; x<this.size.width; x++)
                {
                    cellCount+=this.cells[row][x].state;
                }
                if (cellCount === this.size.width)
                {
                    removeRows[row]=1;
                }

            }
            var score=Object.keys(removeRows).length * Object.keys(removeRows).length;
            this.score+=score;
            this.outputScore();
            for (var removeRow in removeRows)
            {
                for (var x=0; x<this.size.width; x++)
                {
                    this.cells[removeRow][x].unmarkCell(); 
                    for (var y=removeRow; y>=0; y--)
                    {
                        if ((y-1)>=0)
                        {
                            if (1==this.cells[y-1][x].state)
                            {
                                this.cells[y][x].markCell(this.cells[y-1][x].colour);
                            }
                            else
                            {
                                this.cells[y][x].unmarkCell();
                            }
                        }
                    }
                }
            }
        }
    };
    window.Grid = Grid;
}());
;(function() {
    'use strict';
    function Piece() {
        this.currentPosition={};
        this.selectShape();
        this.selectColour();
        this.allowedMoves={
            'left':true,
            'right':true,
            'down':true,
            'rotate':true
        };
        this.stopped=false;
        this.devOutput();
    }
    Piece.prototype = {
        allowedMoves:{
            'left':true,
            'right':true,
            'down':true,
            'rotate':true
        },
        colour:'',
        colours:{
            0:'blue',
            1:'green',
            2:'yellow',
            3:'red',
            4:'grey',
            5:'black',
            6:'purple',
            7:'orange',
            8:'turquoise'
        },
        currentPosition:{},
        currentOrientation:0,
        nextPosition:{},
        nextOrientation:0,
        shape:{},
        shapes:{
            0:
            {               
                0:{0:{x:5,y:0},1:{x:5,y:1},2:{x:5,y:2},3:{x:5,y:3}},
                1:{0:{x:3,y:1},1:{x:4,y:1},2:{x:5,y:1},3:{x:6,y:1}} 
            },   
            1:
            {               
                0:{0:{x:5,y:0},1:{x:5,y:1},2:{x:4,y:2},3:{x:5,y:2}},               
                1:{0:{x:4,y:0},1:{x:4,y:1},2:{x:5,y:1},3:{x:6,y:1}}, 
                2:{0:{x:5,y:0},1:{x:6,y:0},2:{x:5,y:1},3:{x:5,y:2}},                 
                3:{0:{x:4,y:1},1:{x:5,y:1},2:{x:6,y:1},3:{x:6,y:2}}
            },
            2:
            {
                0:{0:{x:5,y:0},1:{x:5,y:1},2:{x:5,y:2},3:{x:6,y:2}},                
                1:{0:{x:4,y:1},1:{x:5,y:1},2:{x:6,y:1},3:{x:4,y:2}},                
                2:{0:{x:4,y:0},1:{x:5,y:0},2:{x:5,y:1},3:{x:5,y:2}},                
                3:{0:{x:6,y:0},1:{x:4,y:1},2:{x:5,y:1},3:{x:6,y:1}}
            },
            3:
            {
                0:{0:{x:4,y:0},1:{x:5,y:0},2:{x:4,y:1},3:{x:5,y:1}}
            },
            4:
            {
                0:{0:{x:5,y:0},1:{x:6,y:0},2:{x:4,y:1},3:{x:5,y:1}},                
                1:{0:{x:4,y:0},1:{x:4,y:1},2:{x:5,y:1},3:{x:5,y:2}}
            },
            5:
            {
                0:{0:{x:4,y:1},1:{x:5,y:1},2:{x:6,y:1},3:{x:5,y:2}},                
                1:{0:{x:5,y:0},1:{x:4,y:1},2:{x:5,y:1},3:{x:5,y:2}},
                2:{0:{x:5,y:0},1:{x:4,y:1},2:{x:5,y:1},3:{x:6,y:1}},                
                3:{0:{x:5,y:0},1:{x:5,y:1},2:{x:6,y:1},3:{x:5,y:2}}
            },
            6:
            {
                0:{0:{x:4,y:0},1:{x:5,y:0},2:{x:5,y:1},3:{x:6,y:1}},                
                1:{0:{x:5,y:0},1:{x:4,y:1},2:{x:5,y:1},3:{x:4,y:2}}
            }
        },
        stopped:false,
        countElements: function(obj)
        {
            return Object.keys(obj).length;
        },
        selectShape:function()
        {
            this.shape=this.shapes[this.selectRandom(this.shapes)];
            this.currentOrientation=this.selectRandom(this.shape);
            this.cloneOrientation();
        },
        selectColour:function()
        {
            this.colour=this.colours[this.selectRandom(this.colours)];
        },
        selectRandom: function (obj) 
        {
            return Math.floor(Math.random() * this.countElements(obj));
        },
        cloneOrientation: function()
        {
            this.currentPosition={
                0:{
                    x:this.shape[this.currentOrientation][0].x,
                    y:this.shape[this.currentOrientation][0].y
                },
                1:{
                    x:this.shape[this.currentOrientation][1].x,
                    y:this.shape[this.currentOrientation][1].y
                },
                2:{
                    x:this.shape[this.currentOrientation][2].x,
                    y:this.shape[this.currentOrientation][2].y
                },
                3:{
                    x:this.shape[this.currentOrientation][3].x,
                    y:this.shape[this.currentOrientation][3].y
                }
            }
        },
        getNextOrientation: function()
        {
            var count=this.countElements(this.shape);
            if (this.currentOrientation === (count - 1))
            {
                var orientation=this.shape[0];
                this.nextOrientation=0;
                return orientation;
            }
            else
            {
                var orientation=this.shape[this.currentOrientation + 1];
                this.nextOrientation=this.currentOrientation + 1;
                return orientation;
            }
        },
        displayPiece:function(cells)
        {
            for (var index in this.currentPosition)
            {
                var coordinates=this.currentPosition[index];
                cells[coordinates.y][coordinates.x].markCell(this.colour);
            }
        },
        displayPreviewPiece: function(previewCells)
        {
            for (var y=0; y<5; y++)
            {
                for (var x=0; x<5; x++)
                {
                    previewCells[y][x].unmarkCell();
                }
            }
            for (var index in this.currentPosition)
            {
                var coordinates=this.currentPosition[index];
                previewCells[coordinates.y+1][coordinates.x-3].markCell(this.colour);
            }
        },
        movePiece:function(cells,direction,interval)
        {
            if (false === this.checkMove('down') &&
                'down' === direction)
            {
                var pauseInterval=interval-1;
                var t=this;
                setTimeout(function() { t.setStopped(); },pauseInterval);
            }
            else
            {
                if (true === this.checkMove(direction))
                {
                    for (var index in this.currentPosition)
                    {
                        var coordinates=this.currentPosition[index];
                        cells[coordinates.y][coordinates.x].unmarkCell();
                        this.setNewCoordinates(coordinates,direction);
                    }
                    this.setAllowedMoves(cells);
                    this.displayPiece(cells);
                }
            }
        },
        setNewCoordinates:function (currentCoordinates,direction)
        {
            switch(direction)
            {
                case 'left':
                    currentCoordinates.x--;
                    break;
                case 'right':
                    currentCoordinates.x++;
                    break;
                case 'down':
                    currentCoordinates.y++;
                    break;
            }
        },
        rotate:function(cells)
        {
            if (true === this.checkMove('rotate'))
            {
                this.nextPosition=this.getNextOrientation();
                var compareOrientation=this.shape[this.currentOrientation];
                var xoffset=this.currentPosition[0].x - compareOrientation[0].x;
                var yoffset=this.currentPosition[0].y - compareOrientation[0].y;
                for (var index in this.currentPosition)
                {
                    var coordinates=this.currentPosition[index];
                    cells[coordinates.y][coordinates.x].unmarkCell();
                    this.currentPosition[index].x=(this.nextPosition[index].x + xoffset);
                    this.currentPosition[index].y=(this.nextPosition[index].y + yoffset);

                }
                this.setAllowedMoves(cells);
                this.displayPiece(cells);
                this.currentOrientation=this.nextOrientation;
            }
        },
        setStopped: function ()
        {
            this.stopped=true;
        },
        resetAllowedMoves: function()
        {
            this.allowedMoves['left']=true;
            this.allowedMoves['right']=true;
            this.allowedMoves['down']=true;
            this.allowedMoves['rotate']=true;

        },
        setAllowedMoves: function(cells)
        {
            this.resetAllowedMoves();
            for (var index in this.currentPosition)
            {
                var coordinates=this.currentPosition[index];
                if (0 === coordinates.x ||
                    1 === cells[coordinates.y][(coordinates.x - 1)].state)
                {
                    this.allowedMoves['left']=false;

                }
                if ((Config.size.width - 1) === coordinates.x ||
                    1 === cells[coordinates.y][(coordinates.x + 1)].state)
                {
                    this.allowedMoves['right']=false;
                }

                if ((Config.size.height - 1) === coordinates.y ||
                    1 === cells[(coordinates.y + 1)][coordinates.x].state)
                {
                    this.allowedMoves['down']=false;
                }
            }
            var nextPositionTest=this.getNextOrientation();
            var compareOrientation=this.shape[this.currentOrientation];
            var xoffset=this.currentPosition[0].x - compareOrientation[0].x;
            var yoffset=this.currentPosition[0].y - compareOrientation[0].y;
            for (var index in this.currentPosition)
            {
                var coordinates=this.currentPosition[index];
                var nextPosX=nextPositionTest[index].x + xoffset;
                var nextPosY=nextPositionTest[index].y + yoffset;
                if (nextPosX<0 ||
                    nextPosX>=Config.size.width)
                {
                    this.allowedMoves['rotate']=false;
                    break;
                }
                if (nextPosY<0 ||
                    nextPosY>=Config.size.height)
                {
                    this.allowedMoves['rotate']=false;
                    break;
                }
                if (1 === cells[nextPosY][nextPosX].state)
                {
                    this.allowedMoves['rotate']=false;
                    break;
                }
            }
        },
        checkMove:function(move)
        {
            return this.allowedMoves[move];
        },
        devOutput: function()
        {
            var devPieceOut=document.createElement("div");
            var coordinates="<span class='dev-coordinates'>";
            var c=1;
            for (var coords in this.currentPosition)
            {
                coordinates+=c+"y:"+this.currentPosition[coords].y+" x:"+this.currentPosition[coords].x+"; ";
                c++;
            }
            coordinates+="</span><br/><br/>";
            devPieceOut.innerHTML=coordinates;
            var allowedMoves="<span class='dev-allowed'>";
            for (var allowed in this.allowedMoves)
            {
                allowedMoves+=this.allowedMoves[allowed]+"; ";
                c++;
            }
            allowedMoves+="</span><br/><br/>";
            devPieceOut.innerHTML=JSON.stringify(this,null,4)+"<br/><br/>";
        }
    };
    window.Piece = Piece;
}());
;(function() {
    'use strict';
    function Cell(x,y) {
        this.x=x;
        this.y=y;
    }
    Cell.prototype = {
        cellHtml:'',
        devState:false,
        colour:'white',
        piece:{},
        state:0,
        x:0,
        y:0,
        appendCell: function(gridDiv)
        {
            gridDiv.appendChild(this.cellHtml);
        },
        buildCellHtml: function()
        {
            this.cellHtml=document.createElement("div");
            this.addDevOutput();
            this.setHtmlClass();
        },
        markCell: function(colour)
        {
            this.setColour(colour);
            this.setState(1);
        },
        unmarkCell: function()
        {
            this.setColour('white');
            this.setState(0);
        },
        setColour: function(colour)
        {
            this.colour=colour;
            this.setHtmlClass();
        },
        setState: function(state)
        {
            this.state=state;
            if (true === this.devState)
            {
                document.getElementById('js-state-dev-'+this.x+'-'+this.y).innerHTML=state;
            }
        },
        setHtmlClass: function()
        {
            this.cellHtml.setAttribute("class","cell "+this.colour);
        },
        addDevOutput: function()
        {
            if (true === this.devState)
            {
                this.cellHtml.innerHTML="<span id='js-x-dev' class='cell-dev x-dev'>"+this.x+"</span><span id='js-y-dev y-dev' class='cell-dev'>"+this.y+"</span><span id='js-state-dev-"+this.x+"-"+this.y+"' class='cell-dev state-dev'>"+this.state+"</span>";
            }
        }
    };
    window.Cell = Cell;
}());
;(function() {
    'use strict';
    var t;
    function KeyListener(grid,timer) {
        t=this;
        t.grid=grid;
        t.timer=grid.timer;
        t.inititialiseKeys();
    }
    KeyListener.prototype = {  
        grid:{},
        timer:{}, 
        inititialiseKeys:function()
        {
            window.addEventListener('keydown',t.keyListener);
        },
        keyListener:function(keyEvent)
        {
            var cells=t.grid.cells;
            var inPlayPiece=t.grid.pieces[1];
            switch (keyEvent.keyCode)
            {
                case 37:                  
                    keyEvent.preventDefault();
                    inPlayPiece.movePiece(cells,'left',t.timer);
                    break;
                case 39:
                    keyEvent.preventDefault();
                    inPlayPiece.movePiece(cells,'right',t.timer);
                    break;
                case 40:
                    keyEvent.preventDefault();
                    inPlayPiece.movePiece(cells,'down',t.timer);
                    break;

                case 32:
                    keyEvent.preventDefault();
                    inPlayPiece.rotate(cells);
                    break;

                case 49:
                    keyEvent.preventDefault();
                    if (true === t.timer.running)
                    {
                        t.timer.pauseTimer();
                    }
                    else
                    {
                        t.timer.startTimer();
                    }
                    break;
            }
        }
    };
    window.KeyListener = KeyListener;
}());;(function() {
    'use strict';
    var t;
    function Timer(grid) {
        t=this;
        t.grid=grid;
        t.currentInterval=t.grid.levels[0]['interval'];
        t.eventCounterSpan=document.getElementById('js-event-counter');
    }
    Timer.prototype = {
        currentInterval:0,
        eventCount:0,
        eventCounterSpan:{},
        intervalId:null,
        running:true,
        startTimer:function()
        {
            t.intervalId = setInterval(t.intervalTrigger,t.currentInterval);
            t.running=true;
        },
        pauseTimer:function()
        {
            window.clearInterval(t.intervalId);
            t.running=false;
        },
        intervalTrigger:function()
        {
            var pieces=t.grid.pieces;
            t.eventCount++;
            t.eventCounterSpan.innerHTML=t.eventCount;
            pieces[1].movePiece(t.grid.cells,'down',t.currentInterval);
            if (true === pieces[1].stopped)
            {
                pieces[1].displayPiece(t.grid.cells);
                t.grid.findCompletedRows(pieces[1].currentPosition);
                pieces.unshift(new Piece());
                pieces[0].displayPreviewPiece(t.grid.previewCells);
                var gameOver=false;
                for (var index in pieces[1].currentPosition)
                {
                    var coordinates=pieces[1].currentPosition[index];
                    if (1 === t.grid.cells[coordinates.y][coordinates.x].state)
                    {
                        gameOver=true;
                        break;
                    }
                }
                if (true === gameOver)
                {
                    t.pauseTimer();                 
                }
            }
            var levelData=t.grid.levels[t.grid.level];
            if (t.eventCount>=levelData.threshold)
            {
                t.grid.level++;
                t.grid.outputLevel();
                t.pauseTimer();
                t.currentInterval=levelData.interval;
                t.startTimer()
            }
        }
    };
    window.Timer = Timer;
}());
window.tetris=new window.Grid('js-tetris');