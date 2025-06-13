'use strict';

function initIn(obj, canvasId) {
    obj.gl = document.getElementById(canvasId).getContext('webgl2');
    if (!obj.gl) {
        throw new Error("Canvas context not found.");
    }

    obj.program = webglUtils.createProgramFromSources(obj.gl, [ vertexShaderSource, fragmentShaderSource ]);
    if (!obj.program) {
        throw new Error("Failed to create shader program.");
    }

    // look up where the vertex data needs to go.
    obj.positionAttribLoc = obj.gl.getAttribLocation(obj.program, "a_position");
    obj.colorAttribLoc = obj.gl.getAttribLocation(obj.program, "a_color");

    // look up uniform locations
    obj.matrixLoc = obj.gl.getUniformLocation(obj.program, "u_matrix");
    obj.isLineLoc = obj.gl.getUniformLocation(obj.program, "u_isLine");
    obj.lineColorLoc = obj.gl.getUniformLocation(obj.program, "u_lineColor");

    // Create buffers for triangle positions
    obj.trianglePositionBuffer = obj.gl.createBuffer();

    // Create vertex array object (VAO)
    obj.vao = obj.gl.createVertexArray();
    obj.gl.bindVertexArray(obj.vao);

    // Turn on the attribute
    obj.gl.enableVertexAttribArray(obj.positionAttribLoc);

    // Bind the vertex buffer
    obj.gl.bindBuffer(obj.gl.ARRAY_BUFFER, obj.trianglePositionBuffer);

    // Set geometry
    setGeometry(obj.gl);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    obj.gl.vertexAttribPointer(obj.positionAttribLoc, 3, obj.gl.FLOAT, false, 0, 0);

    // Create color buffer
    obj.colorBuffer = obj.gl.createBuffer();
    obj.gl.bindBuffer(obj.gl.ARRAY_BUFFER, obj.colorBuffer);

    // Set colors for each piece
    setTriangleColors(obj.gl, obj.cube);

    // Turn on the attribute
    obj.gl.enableVertexAttribArray(obj.colorAttribLoc);

    // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
    obj.gl.vertexAttribPointer(obj.colorAttribLoc, 3, obj.gl.UNSIGNED_BYTE, true, 0, 0);

}

const vertexShaderSource = `#version 300 es

in vec4 a_position;
in vec4 a_color;

uniform mat4 u_matrix;

out vec4 v_color;

void main() {
gl_Position = u_matrix * a_position;

v_color = a_color;
}
`;

const fragmentShaderSource = `#version 300 es

precision highp float;

in vec4 v_color;

uniform bool u_isLine;
uniform vec4 u_lineColor;

out vec4 outColor;

void main() {
  outColor = v_color;
}
`;

function setGeometry(gl){
  const positions = [];

  //Faces U and D
  for (let y = 0; y <= 90; y += 90) {
    for (let x = 0; x < 90; x += 30) {
      for (let z = 0; z < 90; z += 30) {
        positions.push(
          x, y, z,
          x, y, z + 30,
          x + 30, y, z,
          x, y, z + 30,
          x + 30, y, z + 30,
          x + 30, y, z
        );
      }
    }
  }

  //Faces L and R
  for (let x = 0; x <= 90; x += 90) {
    for (let y = 0; y < 90; y += 30) {
      for (let z = 0; z < 90; z += 30) {
        positions.push(
          x, y, z,
          x, y, z + 30,
          x, y + 30, z,
          x, y, z + 30,
          x, y + 30, z + 30,
          x, y + 30, z,
        );
      }
    }
  }

  //Faces F and B
  for (let z = 0; z <= 90; z += 90) {
    for (let x = 0; x < 90; x += 30) {
      for (let y = 0; y < 90; y += 30) {
        positions.push(
          x, y, z,
          x + 30, y, z,
          x, y + 30, z,
          x + 30, y, z,
          x + 30, y + 30, z,
          x, y + 30, z,
        );
      }
    }
  }

  //U and D lines
  for(let x = 30; x <= 60; x += 30){
    for(let y = -1/16; y <= 90+1/16; y += 90+1/8){
      positions.push(
        x - .5, y, 0,
        x + .5, y, 0,
        x - .5, y, 90,
        x + .5, y, 0,
        x + .5, y, 90,
        x - .5, y, 90,
      )
    }
  }
  for(let y = -1/16; y <= 90+1/16; y += 90+1/8){
    for(let z = 30; z <= 60; z += 30){
      positions.push(
        0, y, z - .5,
        0, y, z + .5,
        90, y, z - .5,
        0, y, z + .5,
        90, y, z + .5,
        90, y, z - .5,
      )
    }
  }

  //R and L lines
  for(let x = -1/16; x <= 90+1/16; x += 90+1/8){
    for(let y = 30; y <= 60; y += 30){
      positions.push(
        x, y - .5, 0,
        x, y + .5, 0,
        x, y - .5, 90,
        x, y + .5, 0,
        x, y + .5, 90,
        x, y - .5, 90,
      )
    }
  }
  for(let x = -1/16; x <= 90+1/16; x += 90+1/8){
    for(let z = 30; z <= 60; z += 30){
      positions.push(
        x, 0, z - .5,
        x, 0, z + .5,
        x, 90, z - .5,
        x, 0, z + .5,
        x, 90, z + .5,
        x, 90, z - .5,
      )
    }
  }

  //F and B lines
  for(let y = 30; y <= 60; y += 30){
    for(let z = -1/16; z <= 90+1/16; z += 90+1/8){
      positions.push(
        0, y - .5, z,
        0, y + .5, z,
        90, y - .5, z,
        0, y + .5, z,
        90, y + .5, z,
        90, y - .5, z,
      )
    }
  }
  for(let x = 30; x <= 60; x += 30){
    for(let z = -1/16; z <= 90+1/16; z += 90+1/8){
      positions.push(
        x - .5, 0, z,
        x + .5, 0, z,
        x - .5, 90, z,
        x + .5, 0, z,
        x + .5, 90, z,
        x - .5, 90, z,
      )
    }
  }

  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(positions),
      gl.STATIC_DRAW
  );
}

function setLineGeometry(gl){
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([]),
        gl.STATIC_DRAW
    );
}

function drawRubikFace(face, cube, colors) {
    const template = RubiksCube.template[face[0]];
    const facePieces = cube.getFacePieces(template);
    const colorMap = {
        'Y': [255, 255, 0], // Yellow
        'W': [255, 255, 255],  // White
        'O': [255, 127, 0], // Orange
        'R': [255, 0,   0], // Red
        'B': [0,   0,   255], // Blue
        'G': [0,   255, 0], // Green
        '': [0, 0, 0] // Default color for empty faces
    };

    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            const piece = facePieces[template(i, j)];
            
            const color = colorMap[piece.faces[face] ?? ''];
            
            // Each piece has 6 vertices (2 triangles)
            for (let k = 0; k < 6; ++k)
                colors.push(...color);
        }
    }
}

function setTriangleColors(gl, cube) {
    const colors = [];
    
    // colors.push(...colorMap[piece.faces[0]]); // Up
    const faces = ['U', 'D', 'L', 'R', 'F', 'B'];

    for(const face of faces) {    
        drawRubikFace(face, cube, colors);
    }

    //lineColors

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Uint8Array(colors),
        gl.STATIC_DRAW
    );
    
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

const m4 = {
  translation: (tx, ty, tz) =>
    [
      1,  0,  0,  0,
      0,  1,  0,  0,
      0,  0,  1,  0,
      tx, ty, tz, 1,
    ],

  xRotation: (angle) => {
    const radianAngle = degToRad(angle);
    const c = Math.cos(radianAngle),
          s = Math.sin(radianAngle);
    return [
      1,  0,  0,  0,
      0,  c,  s,  0,
      0, -s,  c,  0,
      0,  0,  0,  1,
    ];
  },

  yRotation: (angle) => {
    const radianAngle = degToRad(angle);
    const c = Math.cos(radianAngle),
          s = Math.sin(radianAngle);
    return [
      c,  0, -s,  0,
      0,  1,  0,  0,
      s,  0,  c,  0,
      0,  0,  0,  1,
    ];
  },

  zRotation: (angle) => {
    const radianAngle = degToRad(angle);
    const c = Math.cos(radianAngle),
          s = Math.sin(radianAngle);
    return [
      c,  s,  0,  0,
     -s,  c,  0,  0,
      0,  0,  1,  0,
      0,  0,  0,  1,
    ];
  },

  scaling: (sx, sy, sz) =>
    [
      sx, 0,  0,  0,
      0, sy,  0,  0,
      0,  0, sz,  0,
      0,  0,  0,  1,
    ],
  projection: (width, height, depth) => 
    [
       2 / width, 0, 0, 0,
       0, -2 / height, 0, 0,
       0, 0, 2 / depth, 0,
      -1, 1, 0, 1,
    ],
  orthographic: (left, right, bottom, top, near, far) => 
    [
      2 / (right - left), 0, 0, 0,
      0, 2 / (top - bottom), 0, 0,
      0, 0, 2 / (near - far), 0,
  
      (left + right) / (left - right),
      (bottom + top) / (bottom - top),
      (near + far) / (near - far),
      1,
    ],  
  perspective: (fieldOfView, aspect, near, far) => {
    const f = Math.tan(Math.PI * 0.5 - 0.5 * degToRad(fieldOfView));
    const rangeInv = 1.0 / (near - far);
  
    return [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0
    ];
  },
  multiply: function(a, b) {
    const [
      b00, b01, b02, b03,
      b10, b11, b12, b13,
      b20, b21, b22, b23,
      b30, b31, b32, b33,
    ] = b;
    const [
      a00, a01, a02, a03,
      a10, a11, a12, a13,
      a20, a21, a22, a23,
      a30, a31, a32, a33
    ] = a;
  
    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  },
  inverse: (m) => {
  const [
    m00, m01, m02, m03,
    m10, m11, m12, m13, 
    m20, m21, m22, m23,
    m30, m31, m32, m33,
  ] = m;
  const
    tmp_0  = m22 * m33,
    tmp_1  = m32 * m23,
    tmp_2  = m12 * m33,
    tmp_3  = m32 * m13,
    tmp_4  = m12 * m23,
    tmp_5  = m22 * m13,
    tmp_6  = m02 * m33,
    tmp_7  = m32 * m03,
    tmp_8  = m02 * m23,
    tmp_9  = m22 * m03,
    tmp_10 = m02 * m13,
    tmp_11 = m12 * m03,
    tmp_12 = m20 * m31,
    tmp_13 = m30 * m21,
    tmp_14 = m10 * m31,
    tmp_15 = m30 * m11,
    tmp_16 = m10 * m21,
    tmp_17 = m20 * m11,
    tmp_18 = m00 * m31,
    tmp_19 = m30 * m01,
    tmp_20 = m00 * m21,
    tmp_21 = m20 * m01,
    tmp_22 = m00 * m11,
    tmp_23 = m10 * m01;

    const
    t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
         (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31),
    t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
         (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31),
    t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
         (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31),
    t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
             (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

    const d = 1. / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

    return [
      d * t0,
      d * t1,
      d * t2,
      d * t3,
      d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
           (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
      d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
           (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
      d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
           (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
      d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
           (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
      d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
           (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
      d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
           (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
      d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
           (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
      d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
           (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
      d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
           (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
      d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
           (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
      d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
           (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
      d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
           (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02)),
    ];
  },
  transpose: (m) =>
    [
      m[0], m[4], m[8], m[12],
      m[1], m[5], m[9], m[13],
      m[2], m[6], m[10], m[14],
      m[3], m[7], m[11], m[15],
    ],
  translate: (m, tx, ty, tz) =>
    m4.multiply(m, m4.translation(tx, ty, tz)),
 
  xRotate: (m, angle) =>
    m4.multiply(m, m4.xRotation(angle)),

  yRotate: (m, angle) =>
    m4.multiply(m, m4.yRotation(angle)),

  zRotate: (m, angle) =>
    m4.multiply(m, m4.zRotation(angle)),
 
  scale: (m, sx, sy, sz) =>
    m4.multiply(m, m4.scaling(sx, sy, sz)),
  lookAt: (cameraPosition, target, up) => {
    const zAxis = v3.normalize(v3.subtract(cameraPosition, target));
    const xAxis = v3.normalize(v3.cross(up, zAxis));
    const yAxis = v3.normalize(v3.cross(zAxis, xAxis));

    return [
      xAxis[0], xAxis[1], xAxis[2], 0,
      yAxis[0], yAxis[1], yAxis[2], 0,
      zAxis[0], zAxis[1], zAxis[2], 0,
      cameraPosition[0],
      cameraPosition[1],
      cameraPosition[2],
      1,
    ];
  }
};