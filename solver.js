var _ = require('lodash');

var testSudoku = [5, 3, 0, 0, 7, 0, 0, 0, 0,
			      6, 0, 0, 1, 9, 5, 0, 0, 0,
			      0, 9, 8, 0, 0, 0, 0, 6, 0,
			      8, 0, 0, 0, 6, 0, 0, 0, 3,
			      4, 0, 0, 8, 0, 3, 0, 0, 1,
			      7, 0, 0, 0, 2, 0, 0, 0, 6,
			      0, 6, 0, 0, 0, 0, 2, 8, 0,
			      0, 0, 0, 4, 1, 9, 0, 0, 5,
			      0, 0, 0, 0, 8, 0, 0, 7, 9]

var testSolution = [5, 3, 4, 6, 7, 8, 9, 1, 2,
			        6, 7, 2, 1, 9, 5, 3, 4, 8,
			        1, 9, 8, 3, 4, 2, 5, 6, 7,
			        8, 5, 9, 7, 6, 1, 4, 2, 3,
			        4, 2, 6, 8, 5, 3, 7, 9, 1,
			        7, 1, 3, 9, 2, 4, 8, 5, 6,
			        9, 6, 1, 5, 3, 7, 2, 8, 4,
			        2, 8, 7, 4, 1, 9, 6, 3, 5,
			        3, 4, 5, 2, 8, 6, 1, 7, 9]

var testSudoku2 = [0, 5, 0, 9, 0, 2, 0, 0, 0,
			       0, 0, 9, 4, 0, 0, 5, 0, 3,
			       7, 0, 3, 0, 1, 0, 0, 0, 0,
			       9, 0, 7, 0, 2, 0, 4, 0, 0,
			       0, 4, 0, 5, 0, 6, 0, 7, 1,
			       0, 0, 5, 0, 0, 0, 2, 0, 8,
			       0, 0, 0, 7, 0, 0, 6, 0, 2,
			       6, 9, 0, 0, 0, 1, 7, 0, 0,
			       0, 0, 0, 2, 0, 4, 0, 3, 0]


function repeat(times, obj){
	return _.map(_.range(times), _.clone.bind(_, obj));
}

var Solver = {
	nums: [],
	table: {
		rows: repeat(9, []),
		cols: repeat(9, []),
		blocks: repeat(9, [])
	},
	initTable: function(inits){
		_.each(_.range(81), function(idx){
			var num = {val: inits[idx]};

			this.nums.push(num);
			this.getRowByIdx(idx).push(num);
			this.getColByIdx(idx).push(num);
			this.getBlockByIdx(idx).push(num);
		}, this);
	},

	getRowByIdx: function(idx){
		return this.table.rows[ Math.floor(idx / 9) ];
	},

	getColByIdx: function(idx){
		return this.table.cols[ idx % 9 ];
	},

	getBlockByIdx: function(idx){
		var rowNum = Math.floor(idx / 9);
		return this.table.blocks[Math.floor((idx - (rowNum * 9)) / 3) + Math.floor(rowNum / 3) * 3];
	},

	isSolved: function (){
		var row = _.range(1,10);
		return _.all(_.flatten(_.map(this.table, function(view){
			return _.map(view, function(nums){
				return _.difference(_.pluck(nums,'val'), row).length === 0;
			})
		})));
	},

	print: function(table){
		_.each((table || this.table).rows, function(nums, idx){
			console.log(_.map(nums, function(num){ return num.val; }).join(', '));
		});
	},

	solve: function(){
		var self = this,
			solutions = [];
		function solveAt(idx){
			if (idx >= 81) {
				if (self.isSolved()){
					solutions.push(_.cloneDeep(this.table));
					self.print();
				}
				return;
			}
			if (self.nums[idx].val !== 0){
				solveAt(idx + 1);
			} else {
				var options = _.difference(_.range(1,10), _.pluck(self.getRowByIdx(idx).concat(self.getColByIdx(idx)).concat(self.getBlockByIdx(idx)), 'val' ));
				_.each(options, function(num){
					self.nums[idx].val = num;
					solveAt(idx + 1);
				});
				self.nums[idx].val = 0;
			}
		}
		solveAt(0);
		return solutions;
	}
}

Solver.initTable(testSudoku2);

console.log(Solver.solve().length);
