// const RPR = require("./../src/core/wrapper/radeon-pro-render").default
// const rpr = require("../build/Debug/radeonrays.node")
const rpr = require("../dist")

module.exports = function(context) {
    let c = 0.5;
    let d = -7.0;
    let o = -7.0;
    let x = 0.6;

    const mesh_geo =
    {
        vertices:new Float32Array([
            -1.0*x,   (0.0 + 0.5)*c,  0.0 + o,
            1.0*x,    (0.0 + 0.5)*c,   0.0 + o,
            1.0*x,   (-0.5 + 0.5)*c,  0.0 + o,
            -1.0*x,    (-0.5 + 0.5)*c, 0.0 + o,
            -1.0*x,   (0.0 + 0.8)*c, 1.0*d + o,
            1.0*x,   (0.0 + 0.8)*c, 1.0*d + o,
            1.0*x,    (-0.5 + 0.8)*c, 1.0*d + o,
            -1.0*x,    (-0.5 + 0.8)*c, 1.0*d + o,
            -1.0*x,   (0.0 + 1.5)*c, 2.0*d + o,
            1.0*x,    (0.0 + 1.5)*c, 2.0*d + o,
            1.0*x,    (-0.5 + 1.5)*c, 2.0*d + o,
            -1.0*x,    (-0.5 + 1.5)*c, 2.0*d + o,
            -1.0*x,   (0.0 + 2.5)*c, 3.0*d + o,
            1.0*x,    (0.0 + 2.5)*c, 3.0*d + o,
            1.0*x,    (-0.5 + 2.5)*c, 3.0*d + o,
            -1.0*x,    (-0.5 + 2.5)*c, 3.0*d + o,
            -1.0*x,   (0.0 + 4.0)*c, 4.0*d + o,
            1.0*x,    (0.0 + 4.0)*c, 4.0*d + o,
            1.0*x,    (-0.5 + 4.0)*c, 4.0*d + o,
            -1.0*x,    (-0.5 + 4.0)*c, 4.0*d + o,
        ]),
        normals:new Float32Array([
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,

            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,

            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,

            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0
        ]),
        texcoords:new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 0.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ])
    };


    const indices = new Int32Array([
        2,1,0,
        3,2,0,

        4 + 2,4 + 1,4 + 0,
        4 + 3,4 + 2,4 + 0,

        8 + 2,8 + 1,8 + 0,
        8 + 3,8 + 2,8 + 0,

        12 + 2,12 + 1,12 + 0,
        12 + 3,12 + 2,12 + 0,

        16 + 2,16 + 1,16 + 0,
        16 + 3,16 + 2,16 + 0,

    ]);

    const faces = new Int32Array([
        3, 3,
        3, 3,
        3, 3,
        3, 3,
        3, 3,
    ]);
    //mesh
    result = rpr.ContextCreateMesh(
        context,
        mesh_geo.vertices, mesh_geo.vertices.length / 3, Float32Array.BYTES_PER_ELEMENT * 3,
        mesh_geo.normals, mesh_geo.normals.length / 3, Float32Array.BYTES_PER_ELEMENT * 3,
        mesh_geo.texcoords, mesh_geo.texcoords.length / 2, Float32Array.BYTES_PER_ELEMENT * 2,
        indices, 4,
        indices, 4,
        indices, 4,
        faces, faces.length);
    console.log(result);
    if (result.status !== RPR.RPR_SUCCESS) {
        console.log("Error creating mesh");
        return null;
    }
    return result.mesh;
}
