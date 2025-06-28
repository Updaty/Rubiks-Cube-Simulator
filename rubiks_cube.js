'use strict';

class CubePiece {
    static faces = ['U', 'D', 'L', 'R', 'F', 'B'];

    initBuffers(gl) {
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getVertices()), gl.STATIC_DRAW);
    }

    constructor(position='000') {
        if (!/^[0-2]{3}$/.test(position)){
            throw new Error("Invalid position format. Use '000' to '222'.");
        }
        
        this.faces = {U: '', D: '', L: '', R: '', F: '', B: ''};

        const defaultColor = {
            U:'Y',
            D:'W',
            L:'O',
            R:'R',
            F:'B',
            B:'G'
        };// Up - Yellow, Down - White, Left - Orange, Right - Red, Front - Blue, Back - Green


        switch (position[0]) {
            case '0':
                this.faces.L = defaultColor.L; // Left
                break;
            case '2':
                this.faces.R = defaultColor.R; // Right
        }
        switch (position[1]) {
            case '0':
                this.faces.U = defaultColor.U; // Up
                break;
            case '2':
                this.faces.D = defaultColor.D; // Down
        }
        switch (position[2]) {
            case '0':
                this.faces.F = defaultColor.F; // Front
                break;
            case '2':
                this.faces.B = defaultColor.B; // Back
        }
    }
    
    rotate(rotation) {
        const oldFaces = {...this.faces}; // Create a copy of the current faces
        switch (rotation) {
            case 'R':
            case "L'":
            case "M'":
                this.faces.U = oldFaces.F; // up becomes back
                this.faces.D = oldFaces.B; // down becomes front
                // left remains left
                // right remains right
                this.faces.F = oldFaces.D; // front becomes down
                this.faces.B = oldFaces.U; // back becomes up
                break;
            
            case 'L':
            case "R'":
            case 'M':
                this.faces.U = oldFaces.B; // up becomes back
                this.faces.D = oldFaces.F; // down becomes front
                // left remains left
                // right remains right
                this.faces.F = oldFaces.U; // front becomes up
                this.faces.B = oldFaces.D; // back becomes down
                break;
            
            case 'U':
            case "D'":
            case "E'":
                // up remains up
                // down remains down
                this.faces.L = oldFaces.F; // left becomes back
                this.faces.R = oldFaces.B; // right becomes front
                this.faces.F = oldFaces.R; // front becomes left
                this.faces.B = oldFaces.L; // back becomes right
                break;
            
            case 'D':
            case "U'":
            case 'E':
                // up remains up
                // down remains down
                this.faces.L = oldFaces.B; // left becomes front
                this.faces.R = oldFaces.F; // right becomes back
                this.faces.F = oldFaces.L; // front becomes right
                this.faces.B = oldFaces.R; // back becomes left
                break;
            
            case 'F':
            case "B'":
            case 'S':
                this.faces.U = oldFaces.L; // up becomes right
                this.faces.D = oldFaces.R; // down becomes left
                this.faces.L = oldFaces.D; // left becomes up
                this.faces.R = oldFaces.U; // right becomes down
                // front remains front
                // back remains back
                break;
            case 'B':
            case "F'":
            case "S'":
                this.faces.U = oldFaces.R; // up becomes left
                this.faces.D = oldFaces.L; // down becomes right
                this.faces.L = oldFaces.U; // left becomes down
                this.faces.R = oldFaces.D; // right becomes up
                // front remains front
                // back remains back
                break;
            case 'U2':
            case 'D2':
            case 'E2':
                // up remains up
                // down remains down
                this.faces.L = oldFaces.R; // left becomes right
                this.faces.R = oldFaces.L; // right becomes left
                this.faces.F = oldFaces.B; // front becomes back
                this.faces.B = oldFaces.F; // back becomes front
                break;
            case 'R2':
            case 'L2':
            case 'M2':
                this.faces.U = oldFaces.D; // up becomes down
                this.faces.D = oldFaces.U; // down becomes up
                // left remains left
                // right remains right
                this.faces.F = oldFaces.B; // front becomes back
                this.faces.B = oldFaces.F; // back becomes front
                break;
            case 'F2':
            case 'B2':
            case 'S2':
                this.faces.U = oldFaces.D; // up becomes down
                this.faces.D = oldFaces.U; // down becomes up
                this.faces.L = oldFaces.R; // left becomes right
                this.faces.R = oldFaces.L; // right becomes left
                // front remains front
                // back remains back
                break;
            default:
                throw new Error("Invalid rotation command.");
        }
    }
}

class RubiksCube {
    constructor() {
        this.pieces = {};
        this.initPieces();
    }

    initPieces() {
        for (let x = 0; x < 3; ++x) {
            for (let y = 0; y < 3; ++y) {
                for (let z = 0; z < 3; ++z) {
                    
                    const position = `${x}${y}${z}`;

                    this.pieces[position] = new CubePiece(position);
                }
            }
        }
    }

    static toggleSign = {
        "'": "",
        "2": "2",
        "": "'"
    }


    rotate(face){
        const sign = face[1] ?? '';
        
        
        if('xyz'.includes(face[0])){
            if(face[0] === 'x') {
                this.rotate('R' + RubiksCube.toggleSign[sign]);
                this.rotate('L' + sign);
                this.rotate('M' + sign);
            }else if(face[0] === 'y') {
                this.rotate('U' + sign);
                this.rotate('D' + RubiksCube.toggleSign[sign]);
                this.rotate('E' + RubiksCube.toggleSign[sign]);
            }else if(face[0] === 'z') {
                this.rotate('F' + sign);
                this.rotate('B' + RubiksCube.toggleSign[sign]);
                this.rotate('S' + sign);
            }
            return;
        } 
        
        const template = RubiksCube.template[face[0]];
        const facePieces = this.getFacePieces(template);

        if(sign === "2") {
            for (let i = 0; i < 3; ++i) {
                for (let j = 0; j < 3; ++j) {
                    this.pieces[template(i, j)].rotate(face);
                    this.pieces[template(i, j)] = facePieces[template(2-i, 2-j)];
                }
            }
        } else if (sign === "'" != ('URBM'.includes(face[0]))) {
            for (let i = 0; i < 3; ++i) {
                for (let j = 0; j < 3; ++j) {
                    this.pieces[template(i, j)].rotate(face);
                    this.pieces[template(i, j)] = facePieces[template(2-j, i)];
                }
            }
        } else {
            for (let i = 0; i < 3; ++i) {
                for (let j = 0; j < 3; ++j) {
                    this.pieces[template(i, j)].rotate(face);
                    this.pieces[template(i, j)] = facePieces[template(j, 2-i)];
                }
            }
        }
    }

    static template = {
        U: ((x,z) => `${x}0${z}`),
        D: ((x,z) => `${x}2${z}`),
        L: ((y,z) => `0${y}${z}`),
        R: ((y,z) => `2${y}${z}`),
        F: ((x,y) => `${x}${y}0`),
        B: ((x,y) => `${x}${y}2`),
        M: ((x,y) => `1${y}${x}`),
        E: ((x,z) => `${x}1${z}`),
        S: ((x,y) => `${x}${y}1`),
        
    }
    scramble() {
        const { faces } = CubePiece;
        const signs = ["","'","2"];
        for (let i = 0; i < 20; ++i) {
            const face = faces[Math.floor(Math.random() * faces.length)];
            const sign = signs[Math.floor(Math.random() * signs.length)];
            this.rotate(face + sign);
        }
    }
    getFacePieces(template) {
        const facePieces = {};
        
        for (let i = 0; i < 3; ++i) {
            for (let j = 0; j < 3; ++j) {
                const n = template(i, j);
                facePieces[n] = this.pieces[n]; 
            };
        };

        Object.freeze(facePieces);
        return facePieces;
    }
}

class RubiksCubeDrawer {
    constructor(cube, canvasId) {
        if (!(cube instanceof RubiksCube)) {
            throw new Error("Invalid Rubik's Cube instance.");
        }
        this.cube = cube;
        initIn(this, canvasId);
        this.rotation = [0, 0]; // Initial rotation angles
    }

    draw() {
        webglUtils.resizeCanvasToDisplaySize(this.gl.canvas);

        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        // Clear the canvas
        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.gl.enable(this.gl.DEPTH_TEST);
        //this.gl.enable(this.gl.CULL_FACE);

        this.gl.useProgram(this.program);

        this.gl.bindVertexArray(this.vao);

        

		// Set the rubik projection matrix
		let matrix = m4.perspective(50,this.gl.canvas.clientWidth / this.gl.canvas.clientHeight, 1, 2000)//projection(this.gl.canvas.clientWidth, this.gl.canvas.clientHeight, 400);
		matrix = m4.translate(matrix, 0, 0, -500);
		matrix = m4.xRotate(matrix, this.rotation[0]);
		matrix = m4.yRotate(matrix, 180-this.rotation[1]);
		matrix = m4.scale(matrix, 2.5, 2.5, 2.5);
		matrix = m4.translate(matrix, -45, -45, -45);


		//Set the matrix uniform
		this.gl.uniformMatrix4fv(this.matrixLoc, false, matrix);

		// Draw the geometry                     9 pieces and 4 lines on each side
		this.gl.drawArrays(this.gl.TRIANGLES, 0, (9 + 4) * 6 * 6);

        // this is the front top left corner
        const point = [0,0,0,1];

        const clipspace = m4.transformVector(matrix, point);

        this.matrix = matrix;

        // divide X and Y by W just like the GPU does.
        clipspace[0] /= clipspace[3];
        clipspace[1] /= clipspace[3];
        
        // convert from clipspace to pixels
        const pixelX = (clipspace[0] *  0.5 + 0.5) * this.gl.canvas.width;
        const pixelY = (clipspace[1] * -0.5 + 0.5) * this.gl.canvas.height;

        // position the div
        //non.style.right = "calc(10% + 405px - " + Math.floor(pixelX) + "px)";
        //non.style.top  = "calc(30px + " + Math.floor(pixelY) + "px + 5%)";
    }

    transformToCubeSpace(pointX, pointY) {
        // Convert from pixel coordinates to cube space
        const matrix = m4.inverse(this.matrix);
        
        const x = pointX / this.gl.canvas.width * 2 - 1;
        const y = 1 - pointY / this.gl.canvas.height * 2;
        
        const point = [x, y, 0, 1];

        const transformed = m4.transformVector(matrix, point);

        transformed[0] /= transformed[3];
        transformed[1] /= transformed[3];

        //transformed[0] = (transformed[0] *  0.5 + 0.5) * this.gl.canvas.width;
        //transformed[1] = (transformed[1] * -0.5 + 0.5) * this.gl.canvas.height;

        return transformed.slice(0, 3); // Return only x, y, z
    }

    rotateMinicube() {
        minicube.style.transform = `rotateX(${180-this.rotation[0]}deg) rotateY(${this.rotation[1]}deg)`;
    }

    rotate(angleX, angleY) {
        this.rotation[0] += angleX;
        this.rotation[1] += angleY;
        this.rotation[0] = this.rotation[0] % 360; // Keep within 0-360 degrees
        this.rotation[1] = this.rotation[1] % 360; // Keep within 0-360 degrees
        this.draw();
        this.rotateMinicube();
    }
}