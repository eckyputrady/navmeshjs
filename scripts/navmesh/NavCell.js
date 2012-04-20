define(
["../math/Line2D"],
function(Line2D){
	var NavCell = {
		/**
		Enum
		*/
		PathType: {
			NoRelationship: 0, //Edge case, going to vertex
			ExitingCell: 1, //Exiting this cell
			EndingCell: 2, //Still inside the cell
		},

		create: function() {
			var _self = {

				/**
				initialize with 3 vertices
				*/
				init: function(vec2A, vec2B, vec2C) {
					//Assign vecs
					_vecs[0] = vec2A;
					_vecs[1] = vec2B;
					_vecs[2] = vec2C;

					//Reinit lines
					_initLines();

					//Clear links
					_clearLinks();

					//return me
					return _self;
				},

				isPointInside: function(vec2Pos) {
					var expectedSide = _lines[0].pointSideTest(vec2Pos);
					for(var i = 1; i < _lines.length; ++i) {
						var res = _lines[i].pointSideTest(vec2Pos);
						if( (res < 0 && expectedSide > 0) ||
							(res > 0 && expectedSide < 0))
							return false;
					}

					return true;
				},

				/**
				@return { pathType: NavCell.PathType.*, intersection: vec2, cell:NavCell }
				*/
				classifyPathToCell: function(motionLine2D) {
					var pathType = _CLASS.PathType.NoRelationship;
					var intersection = [];
					var nextCell = null;

					for(var i = 0; i < _lines.length; ++i) {
						//Quick intersection test
						if(_lines[i].intersectTest(motionLine2D)) {
							var intersectResult = _lines[i].intersectTestDetailed(motionLine2D, intersection);
							if( intersectResult == Line2D.IntersectType.SegmentsIntersect ||
								intersectResult == Line2D.IntersectType.LinesIntersect) {
								nextCell = _links[i];
								pathType = NavCell.PathType.ExitingCell;

								return {
									pathType: pathType,
									intersection: intersection,
									nextCell: nextCell
								};
							}
						}
					}

					//Didn't hit any walls
					return {
						pathType: _CLASS.PathType.EndingCell,
						intersection: intersection,
						nextCell: nextCell
					};
				},

				/**
				Try to establish link between me and the other cell
				*/
				checkAndRequestLink: function(otherCell) {
					for(var i = 0; i < _lines.length; ++i) {
						if(!_links[i] && otherCell.requestLink(_lines[i], _self)) {
							_links[i] = otherCell;
							break;
						}
					}
				},

				/**
				callerCell request link to this. This will check whether the given line
				matches with any of my line. If match found, register callerCell to me.
				return true if linked.
				*/
				requestLink: function(otherLine2D, callerCell) {
					for(var i = 0; i < 3; ++i) {
						var ret = _getLineHash(otherLine2D);
						if(ret != undefined) {
							_links[ret] = callerCell;
							return true;
						}
					}
					return false;
				},

				getLinks: function() { return _links; }
			};

			//Privates
			var _vecs = [];
			var _lines = [Line2D.create(), Line2D.create(), Line2D.create()];
			var _links = [];
			var _lineHash = [];
			var _CLASS = NavCell;

			/**
			Initialize lines from given vecs
			*/
			function _initLines() {
				//Init lines
				_lines[0].init(_vecs[0], _vecs[1]);
				_lines[1].init(_vecs[1], _vecs[2]);
				_lines[2].init(_vecs[2], _vecs[0]);

				//Reinit line hashes
				_lineHash.splice(0, _lineHash.length);
				_setLineHash(_lines[0], 0);
				_setLineHash(_lines[1], 1);
				_setLineHash(_lines[2], 2);
			}

			/**
			Set all links to null
			*/
			function _clearLinks() {
				_links[0] = null;
				_links[1] = null;
				_links[2] = null;
			}

			/**
			Hash a line for easier equality checking
			*/
			function _setLineHash(line, linkIdx) {
				_lineHash[_getLineHashVal(line, false)] = linkIdx;
			}

			/**
			Given a line, return the link idx
			*/
			function _getLineHash(line) {
				return _lineHash[_getLineHashVal(line, false)] || _lineHash[_getLineHashVal(line, true)];
			}

			function _getLineHashVal(line, isReverse) {
				var a = line.getBegin();
				var b = line.getEnd();
				a = " " + a[0] + "," + a[1] + " ";
				b = " " + b[0] + "," + b[1] + " ";
				return !isReverse ? a+b : b+a;
			}

			return _self;
		}
	};

	return NavCell;
});