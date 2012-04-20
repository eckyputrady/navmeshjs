require(
    [
        "jquery",
        "navmesh/NavMesh",
        "navmesh/NavMeshWalker",
        "math/Line2D"
    ],
    function(
        $,
        NavMesh,
        NavMeshWalker,
        Line2D
    ) {

		//Helper
		function testNavMesh(navmesh, fromVec2, toVec2, expectedResult) {
			var walker = NavMeshWalker.create().init(navmesh, fromVec2);
			if(walker.getCurCell() == navmesh.getCells()[0]) {
				console.log("walker succ");
			}
			walker.goto(toVec2);
			if(walker.getCurPos()[0] == expectedResult[0] && walker.getCurPos()[1] == expectedResult[1]) {
				console.log("test succ");
			} else {
				console.log("test fail. expected = " + expectedResult + ", actual: " + walker.getCurPos());
			}
		}
		
		//Create NavMesh
		var navmesh = NavMesh.create();
		
		//Test Env 1 (winding order = CCW)
		(function testEnv1() {
			//Init navmesh
			var pos = [
				[0, 0],
				[0, 1],
				[1, 1],
				[1, 0]
			];
			var ind = [
				0, 2, 1,
				0, 3, 2
			];
			navmesh.init(pos, ind);

			//Test - cells
			var cells = navmesh.getCells();
			if(cells[0].getLinks()[0] != cells[1]) {
				console.log("fail! actual: " + cells[0].getLinks());
			}
			
			//Test - in-cell
			testNavMesh(navmesh, [0.1, 0.1], [0.2, 0.2], [0.2, 0.2]);
			
			//Test - inter cells
			testNavMesh(navmesh, [0.1, 0.2], [0.8, 0.2], [0.8, 0.2]);
			
			//Test - cell to out
			testNavMesh(navmesh, [0.4, 0.4], [-0.5, 0.4], [0, 0.4]);
			
			//Test - cell to edge
			testNavMesh(navmesh, [0.1, 0.1], [0, 0], [0, 0]);
			testNavMesh(navmesh, [0.1, 0.1], [-1, -1], [0, 0]);
			
			//Test - edge to cell
			testNavMesh(navmesh, [0, 0], [0.2, 0.2], [0.2, 0.2]);
			
			//Test - walking in shared edge
			testNavMesh(navmesh, [0.1, 0.1], [0.8, 0.8], [0.8, 0.8]);
			
			//Test - walking in non-shared edge
			testNavMesh(navmesh, [0, 0.1], [0, 0.8], [0, 0.8]);
			
			//Test - walking in non-shared edge, from extreme pos to extreme pos
			testNavMesh(navmesh, [0, 0], [0, 1], [0, 1]);
		}());
		
		//Test Env 2 (winding order = CW)
		console.log("testEnv2");
		(function testEnv2() {
			//Init navmesh
			var pos = [
				[0, 0],
				[0, 1],
				[1, 1],
				[1, 0]
			];
			var ind = [
				0, 1, 2,
				0, 2, 3
			];
			navmesh.init(pos, ind);

			//Test - cells
			
			//Test - in-cell
			testNavMesh(navmesh, [0.1, 0.1], [0.2, 0.2], [0.2, 0.2]);
			
			//Test - inter cells
			testNavMesh(navmesh, [0.1, 0.2], [0.8, 0.2], [0.8, 0.2]);
			
			//Test - cell to out
			testNavMesh(navmesh, [0.4, 0.4], [-0.5, 0.4], [0, 0.4]);
			
			//Test - cell to edge
			testNavMesh(navmesh, [0.1, 0.1], [0, 0], [0, 0]);
			testNavMesh(navmesh, [0.1, 0.1], [-1, -1], [0, 0]);
			
			//Test - edge to cell
			testNavMesh(navmesh, [0, 0], [0.2, 0.2], [0.2, 0.2]);
			
			//Test - walking in edge
			testNavMesh(navmesh, [0.1, 0.1], [0.8, 0.8], [0.8, 0.8]);
			
			//Test - walking in non-shared edge
			testNavMesh(navmesh, [0, 0.1], [0, 0.8], [0, 0.8]);
			
			//Test - walking in non-shared edge, from extreme pos to extreme pos
			testNavMesh(navmesh, [0, 0], [0, 1], [0, 1]);
		}());
    }
);
