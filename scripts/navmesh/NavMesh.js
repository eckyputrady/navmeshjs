define(
["./NavCell", "../math/Line2D"],
function(NavCell, Line2D){
	return {
		create: function() {
			var _self = {
				/**
				Initialize cells in navmesh
				@params {vec2[]} list of vec2 indicating positions
				@params {long[]} list of long indicating indices
				*/
				init: function(posVec2Arr, indArr) {
					//Empty members
					_cells.splice(0, _cells.length);

					//Create cells
					for(var i = 0; i < indArr.length; i += 3) {
						_cells.push(NavCell.create().init(
							posVec2Arr[indArr[i + 0]],
							posVec2Arr[indArr[i + 1]],
							posVec2Arr[indArr[i + 2]]
						));
					}

					//Link cells
					for(var i = 0; i < _cells.length - 1; ++i) {
						for(var j = i + 1; j < _cells.length; ++j) {
							_cells[i].checkAndRequestLink(_cells[j]);
						}
					}

					//Return me
					return _self;
				},

				getCells: function() {
					return _cells;
				},

				getCellByPos: function(vec2Pos) {
					for(var i = 0; i < _cells.length - 1; ++i) {
						if(_cells[i].isPointInside(vec2Pos))
							return _cells[i];
					}

					return null;
				},

				resolveMotionOnMesh: function(vec2Begin, vec2End, startCell, vec2OutPos) {
					var curCell = startCell;
					var motionLine = Line2D.create().init(vec2Begin, vec2End);
					var classifyRes = null;

					var i = 0;
					while(true) {
						//Use navcell to determine how our path and cell interact
						classifyRes = curCell.classifyPathToCell(motionLine);

						//If exiting cell
						if(classifyRes.pathType == NavCell.PathType.ExitingCell) {
							//Check whether linked cell available
							if(classifyRes.nextCell != null) {
								//Moving on to the new cell
								motionLine.init(classifyRes.intersection, motionLine.getEnd());
								curCell = classifyRes.nextCell;
							}

							//We hit a wall
							else {
								//No more movement
								motionLine.init(classifyRes.intersection, classifyRes.intersection);
							}
						}

						//If no relationship (edge/rare case)
						else if(classifyRes.pathType == NavCell.PathType.NoRelationship) {
							//Cancel movement
							motionLine.init(motionLine.getBegin(), motionLine.getBegin());
						}

						//Counter, just in case infinite loop
						++i;

						//Check loop exit
						if( classifyRes.pathType == NavCell.PathType.EndingCell ||
							motionLine.isZeroLength() || i > 200)
							break
					}

					//Error
					if(i > 200) {
						throw "> 200 steps needed to resolve motion!"
					}

					//Update the out pos
					vec2OutPos[0] = motionLine.getEnd()[0];
					vec2OutPos[1] = motionLine.getEnd()[1];

					//Return end cell
					return curCell;
				}
			};

			//Privates
			var _cells = [];

			return _self;
		}
	};
});