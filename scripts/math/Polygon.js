/**
 * Based on J. O'Rourke's "Triangulate" algorithm in "Computational Geometry in C"
 * Adapted from http://www.sinc.sunysb.edu/Stu/nwellcom/ams345/triangulate.js
 */

define(
    function() {
	
        return {
            create: function() {
				
                function _clockwise(vertices) {
                    
                    var sum = 0;

                    for(var i = 0; i < vertices.length; ++i) {
                        var cur  = vertices[i];
                        var next = vertices[(i + 1) % vertices.length];
                        var next2= vertices[(i + 2) % vertices.length];
                        sum += _area2(cur, next, next2);
                    }

                    return sum < 0;
                }

                function _toCounterClockwise(vertices) {
                    if(_clockwise(vertices)) {
                        vertices = vertices.reverse();
                    }
                    return vertices;
                }

                function _linkInit() {
                    _vertices = _toCounterClockwise(_vertices);
				
                    for(var i = 0; i < _vertices.length; ++i) {
                        //create link
                        var cur = _vertices[i];
                        var next= _vertices[(i + 1) % _vertices.length];
                        var prev= _vertices[((i - 1) < 0 ? (_vertices.length - 1) : (i - 1))];
                        cur.next = next;
                        cur.prev = prev;
                        prev.next= cur;
                        next.prev= cur;
						
                        //set idx
                        cur.idx = i;
                    }
                }
				
                function _earInit() {
                    var v0, v1, v2;
                    v1 = _vertices[0];
                    do {
                        v2 = v1.next;
                        v0 = v1.prev;
                        v1.ear = _diagonal(v0, v2);
                        v1 = v1.next;
                    } while(v1 != _vertices[0]);
                }
				
                function _collinear(a,b,c) {
                    return( _area2(a,b,c) == 0 );
                }
				
                function XOR(a,b) {
                    return (a || b) && !(a && b);
                }
				
                function _intersectProp(a,b,c,d) {
                    if(_collinear(a,b,c) || _collinear(a,b,d) || _collinear(c,d,a) || _collinear(c,d,b))
                        return false;
                    return XOR( _left(a,b,c), _left(a,b,d) ) && XOR( _left(c,d,a), _left(c,d,b));
                }
				
                function _diagonalie(a, b) {
                    var c,c1;
                    c = a;
                    do {
                        c1 = c.next;
                        if( (c!=a) && (c1!=a) && (c!=b) && (c1!=b) && _intersectProp(a, b, c, c1) ) {
                            return false;
                        }
                        c = c.next;
                    } while( c != a );
                    return true;
                }
				
                function _area2(a,b,c) {
                    return( (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]) );
                }
				
                function _leftOn(a, b, c) {
                    return _area2(a,b,c) >= 0;
                }
				
                function _left(a, b, c) {
                    return _area2(a,b,c) > 0;
                }
				
                function _inCone(a, b) {
                    var a0,a1;
                    a1 = a.next;
                    a0 = a.prev;
					
                    if( _leftOn(a, a1, a0) ) return( _left(a, b, a0) && _left(b, a, a1) );
                    return( !( _leftOn(a, b, a1) && _leftOn(b, a, a0)) );
                }
				
                function _diagonal(v1, v2) {
                    return _inCone(v1, v2) && _inCone(v2, v1) && _diagonalie(v1, v2);
                }

                function _toCCWAndGetIndices(v1, v2, v3) {
                    var temp = [v1, v2, v3];
                    temp = _toCounterClockwise(temp);
                    temp = temp.map(function(val){
                        return val.idx;
                    });
                    return temp;
                }
				
                var _vertices = [];
				
                var _self = {
                    getVertices: function() {
                        return _vertices;
                    },
					
                    clearVertices: function() {
                        _vertices = [];
                    },
				
                    //arrOfXY -> [x,y, x,y, x,y, ..]
                    addVertices: function(arrOfXY) {
                        for(var i = 0; i < arrOfXY.length; i+=2) {
                            this.addVertex(arrOfXY[i], arrOfXY[i+1]);
                        }
                    },
					
                    addVertex: function(x, y) {
                        _vertices.push([x,y]);
                    },
					
                    /**
                     * returns array of indices that makes triangles
                     * ex:
                     * [ 0,1,2, 0,2,3 ]
                     */
                    triangulate: function() {
                        _linkInit();
                        _earInit();
						
                        var v0, v1, v2, v3, v4;
                        var n   = _vertices.length;
                        var head= _vertices[0];
                        var ret = [];
                        var temp;
						
                        while(n > 3) {
                            v2 = head;
                            while(true) {
                                broke = v2.ear;
                                if(broke) {
                                    v3 = v2.next;
                                    v4 = v3.next;
                                    v1 = v2.prev;
                                    v0 = v1.prev;

                                    temp = _toCCWAndGetIndices(v1, v2, v3);
                                    ret = ret.concat(temp.reverse());
                                    
                                    //ret.push(v3.idx, v2.idx, v1.idx);

                                    v1.ear = _diagonal(v0, v3);
                                    v3.ear = _diagonal(v1, v4);
                                    v1.next= v3;
                                    v3.prev= v1;
                                    head = v3;
                                    --n;
                                    break;
                                }
                                v2 = v2.next;
                                if(v2 == head) {
                                    //TODO: failed!
                                    console.log("triangulation fail!");
                                    return null;
                                }
                            }
                        }

                        temp = _toCCWAndGetIndices(head.prev, head, head.next);
                        ret = ret.concat(temp.reverse());
						
                        return ret;
                    }
                };

                return _self;
            }
        };
    }
    );