define(
[],
function(){
	var Line2D = {
		
		/**
		enum
		*/
		IntersectType: {
			CoLinear: 0,
			Parallel: 1,
			SegmentsIntersect: 2,
			ABisectsB: 3,
			BBisectsA: 4,
			LinesIntersect: 5,
		},

		create: function() {
			var _self = {
				init: function(vec2Begin, vec2End) {
					_vec2Begin = vec2Begin;
					_vec2End = vec2End;

					return _self;
				},

				/**
				Check which side regarding to this line is a given point
				@return {number} :
					== 0 	: on the line
					> 0 	: on the left of the line
					< 0 	: on the right of the line 
				*/
				pointSideTest: function(vec2Pos) {
					return _area2(_vec2Begin, _vec2End, vec2Pos);
				},

				/**
				@params {Line2D} line2D line segment to test
				@return {boolean} true if line2D intersects with this line
				*/
				intersectTest: function(line2D) {
					var a = _self.pointSideTest(line2D.getBegin());
					var b = _self.pointSideTest(line2D.getEnd());
					return (a > 0 && b < 0) || (a < 0 && b > 0);
				},

				/**
				return { Line2D.IntersectType }
				*/
				intersectTestDetailed: function(line2D, outIntersectPoint) {
					var a = _vec2Begin;
					var b = _vec2End;
					var c = line2D.getBegin();
					var d = line2D.getEnd();

					var denom = (d[1] - c[1]) * (b[0] - a[0]) -
								(d[0] - c[0]) * (b[1] - a[1]); 
					var u0 = (d[0] - c[0]) * (a[1] - c[1]) -
			                 (d[1] - c[1]) * (a[0] - c[0]);
			        var u1 = (c[0] - a[0]) * (b[1] - a[1]) -
			                 (c[1] - a[1]) * (b[0] - a[0]);

	                //if parallel
	                if(denom == 0) {
	                	//if collinear
	                	if(u0 == 0 && u1 == 0)
	                		return _CLASS.IntersectType.CoLinear;
	                	else
	                		return _CLASS.IntersectType.Parallel;
	                }

	                else {
	                	//Check if they intersect
	                	u0 = u0 / denom;
	                	u1 = u1 / denom;

	                	var x = a[0] + u0 * (b[0] - a[0]);
	                	var y = a[1] + u0 * (b[1] - a[1]);

	                	if(outIntersectPoint) {
	                		outIntersectPoint[0] = x;
	                		outIntersectPoint[1] = y;
	                	}

	                	//Determine intersection type
	                	if((u0 >= 0) && (u0 <= 1) && (u1 >= 0) && (u1 <= 1))
	                		return _CLASS.IntersectType.SegmentsIntersect;
	                	else if((u1 >= 0) && (u1 <= 1))
	                		return _CLASS.IntersectType.ABisectsB;
	                	else if((u0 >= 0) && (u0 <= 1))
	                		return _CLASS.IntersectType.BBisectsA;
	                	else
	                		return _CLASS.IntersectType.LinesIntersect;
	                }
				},

				getBegin: function() { return _vec2Begin; },
				getEnd: function() { return _vec2End; },
				isZeroLength: function() { return _vec2End[0] == _vec2Begin[0] && _vec2End[1] == _vec2Begin[1]; }
			};

			var _CLASS = Line2D;
			var _vec2Begin;
			var _vec2End;
				
			/**
			Calculate the area created by 3 vec2
			Can also be interpreted as: Calculate the are between line (a,b) and point (c).
			*/
            function _area2(a,b,c) {
                return( (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]) );
            }

			return _self;
		}
	};

	return Line2D;
});