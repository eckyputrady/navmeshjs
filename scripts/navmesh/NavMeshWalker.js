define(
[],
function(){
	return {
		create: function() {
			var _self = {
				init: function(navmesh, initPosVec2) {
					_curPos = initPosVec2;
					_curCell= navmesh.getCellByPos(_curPos);
					_navmesh= navmesh;

					return _self;
				},

				goto: function(newPos) {
					_curCell = _navmesh.resolveMotionOnMesh(_curPos, newPos, _curCell, _curPos);
				},

				getCurCell: function() { return _curCell; },
				getCurPos: function() { return _curPos; }
			};

			var _curCell;
			var _curPos;
			var _navmesh;

			return _self;
		}
	};
});