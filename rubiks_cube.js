'use strict';

class CubePiece {
    static faces = ['U', 'D', 'L', 'R', 'F', 'B'];
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
                this.faces.U = oldFaces.F; // up becomes back
                this.faces.D = oldFaces.B; // down becomes front
                // left remains left
                // right remains right
                this.faces.F = oldFaces.D; // front becomes down
                this.faces.B = oldFaces.U; // back becomes up
                break;
            
            case 'L':
            case "R'":
                this.faces.U = oldFaces.B; // up becomes back
                this.faces.D = oldFaces.F; // down becomes front
                // left remains left
                // right remains right
                this.faces.F = oldFaces.U; // front becomes up
                this.faces.B = oldFaces.D; // back becomes down
                break;
            
            case 'U':
            case "D'":
                // up remains up
                // down remains down
                this.faces.L = oldFaces.F; // left becomes back
                this.faces.R = oldFaces.B; // right becomes front
                this.faces.F = oldFaces.R; // front becomes left
                this.faces.B = oldFaces.L; // back becomes right
                break;
            
            case 'D':
            case "U'":
                // up remains up
                // down remains down
                this.faces.L = oldFaces.B; // left becomes front
                this.faces.R = oldFaces.F; // right becomes back
                this.faces.F = oldFaces.L; // front becomes right
                this.faces.B = oldFaces.R; // back becomes left
                break;
            
            case 'F':
            case "B'":
                this.faces.U = oldFaces.L; // up becomes right
                this.faces.D = oldFaces.R; // down becomes left
                this.faces.L = oldFaces.D; // left becomes up
                this.faces.R = oldFaces.U; // right becomes down
                // front remains front
                // back remains back
                break;
            case 'B':
            case "F'":
                this.faces.U = oldFaces.R; // up becomes left
                this.faces.D = oldFaces.L; // down becomes right
                this.faces.L = oldFaces.U; // left becomes down
                this.faces.R = oldFaces.D; // right becomes up
                // front remains front
                // back remains back
                break;
            case 'U2':
            case 'D2':
                // up remains up
                // down remains down
                this.faces.L = oldFaces.R; // left becomes right
                this.faces.R = oldFaces.L; // right becomes left
                this.faces.F = oldFaces.B; // front becomes back
                this.faces.B = oldFaces.F; // back becomes front
                break;
            case 'R2':
            case 'L2':
                this.faces.U = oldFaces.D; // up becomes down
                this.faces.D = oldFaces.U; // down becomes up
                // left remains left
                // right remains right
                this.faces.F = oldFaces.B; // front becomes back
                this.faces.B = oldFaces.F; // back becomes front
                break;
            case 'F2':
            case 'B2':
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

    rotate(face){
        const template = RubiksCube.template[face[0]];
        const sign = face[1] ?? '';

        for (let i = 0; i < 3; ++i) {
            for (let j = 0; j < 3; ++j) {
                this.pieces[template(i, j)].rotate(face);

            }
        }
        
        const facePieces = this.getFacePieces(template);

        if(sign === "2") {
            for (let i = 0; i < 3; ++i) {
                for (let j = 0; j < 3; ++j) {
                    this.pieces[template(i, j)] = facePieces[template(2-i, 2-j)];
                }
            }
        } else if (sign === "'" != ('URB'.includes(face[0]))) {
            for (let i = 0; i < 3; ++i) {
                for (let j = 0; j < 3; ++j) {
                    this.pieces[template(i, j)] = facePieces[template(2-j, i)];
                }
            }
        } else {
            for (let i = 0; i < 3; ++i) {
                for (let j = 0; j < 3; ++j) {
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
        B: ((x,y) => `${x}${y}2`)
        
    }
    shuffle() {
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
                facePieces[n] = this.pieces[n]; // Up face
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

        {
            setGeometry(this.gl, this.cube);
            setTriangleColors(this.gl, this.cube);

            // Set the rubik projection matrix
            let matrix = m4.projection(this.gl.canvas.clientWidth, this.gl.canvas.clientHeight, 400);
            matrix = m4.translate(matrix, 200, 200, 0);
            matrix = m4.xRotate(matrix, this.rotation[0]);
            matrix = m4.yRotate(matrix, this.rotation[1]);
            matrix = m4.scale(matrix, 2.5, 2.5, 2.5);
            matrix = m4.translate(matrix, -45, -45, -45);

            //Set the matrix uniform
            this.gl.uniformMatrix4fv(this.matrixLoc, false, matrix);

            // Draw the geometry                     nine 
            this.gl.drawArrays(this.gl.TRIANGLES, 0, (9 + 8) * 6 * 6);
        }
    }

    rotate(angleX, angleY) {
        this.rotation[0] += angleX;
        this.rotation[1] += angleY;
        this.rotation[0] = this.rotation[0] % 360; // Keep within 0-360 degrees
        this.rotation[1] = this.rotation[1] % 360; // Keep within 0-360 degrees
        this.draw();
    }
}