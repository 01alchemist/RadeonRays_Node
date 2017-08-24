const RPR = require("./../src/core/wrapper/radeon-pro-render").default
const rpr = require("../build/Debug/radeonrays.node")
const assert = require("./../src/utils/assert").default
const fs = require("fs");
const saveAsPNG = require("./save-as-png")
const matrix = require("./matrixutils")
const createDOFMesh = require('./create-dof-mesh');
const glmatrix = require("gl-matrix")
const mat4 = glmatrix.mat4;

const M_PI_2 = 1.5707963705062848 // pi/2
const M_PI_4 = 0.785398163397448309616; // pi/4

function simpleRenderTest() {
    let context, matsys, scene;
    console.time("CreateContext");
    let result = rpr.CreateContext(RPR.RPR_CREATION_FLAGS_ENABLE_GPU0)
    console.timeEnd("CreateContext");
    console.log(result)
    if (result.status !== RPR.RPR_SUCCESS) {
        return false;
    }
    context = result.context;

    result = rpr.ContextCreateMaterialSystem(context, 0);
    console.log(result);
    if (result.status !== RPR.RPR_SUCCESS) {
        return false;
    }
    matsys = result.material_system;
    result = rpr.ContextCreateScene(context);
    console.log(result);
    if (result.status !== RPR.RPR_SUCCESS) {
        return false;
    }
    scene = result.scene;

     const cube = {
        vertices: new Float32Array([
            -1, 1, -1,
            1, 1, -1,
            1, 1, 1,
            -1, 1, 1,
            -1, -1, -1,
            1, -1, -1,
            1, -1, 1,
            -1, -1, 1,
            -1, -1, 1,
            -1, -1, -1,
            -1, 1, -1,
            -1, 1, 1,
            1, -1, 1,
            1, -1, -1,
            1, 1, -1,
            1, 1, 1,
            -1, -1, -1,
            1, -1, -1,
            1, 1, -1,
            -1, 1, -1,
            -1, -1, 1,
            1, -1, 1,
            1, 1, 1,
            -1, 1, 1
        ]),
        normals:new Float32Array([
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
        ]),
        texcoords:new Float32Array([
            0, 0,
            1, 0,
            1, 1,
            0, 1,
            0, 0,
            1, 0,
            1, 1,
            0, 1,
            0, 0,
            1, 0,
            1, 1,
            0, 1,
            0, 0,
            1, 0,
            1, 1,
            0, 1,
            0, 0,
            1, 0,
            1, 1,
            0, 1,
            0, 0,
            1, 0,
            1, 1,
            0, 1,
        ])
    };

    const plane = {
        vertices: new Float32Array([
            -5.0, 0.0, -5.0,
            -5.0, 0.0, 5.0,
            5.0, 0.0, 5.0,
            5.0, 0.0, -5.0,
        ]),
        normals: new Float32Array([
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
        ]),
        texcoords: new Float32Array([
            0.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
            1.0, 0.0,
        ])
    };

    const indices = new Uint32Array([
        3, 1, 0,
        2, 1, 3,

        6, 4, 5,
        7, 4, 6,

        11, 9, 8,
        10, 9, 11,

        14, 12, 13,
        15, 12, 14,

        19, 17, 16,
        18, 17, 19,

        22, 20, 21,
        23, 20, 22
    ]);


    const num_face_vertices = new Uint32Array([
        3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3
    ]);

    //material
    let diffuse
    result = rpr.MaterialSystemCreateNode(matsys, RPR.RPR_MATERIAL_NODE_DIFFUSE);
    console.log(result);
    if (result.status !== RPR.RPR_SUCCESS) {
        return false;
    }
    diffuse = result.node;
    result = rpr.MaterialNodeSetInputF(diffuse, "color", 0.7, 0.7, 0.0, 0.0);
    console.log(result);
    if (result.status !== RPR.RPR_SUCCESS) {
        return false;
    }

    //sphere
    let mesh = createSphere(context, 64, 32, 2.0, {x: 0, y: 0, z: 0});
    if (mesh === 0) {
        return false;
    }
    result = rpr.SceneAttachShape(scene, mesh);
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);

    result = rpr.ShapeSetMaterial(mesh, diffuse);
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);

    let m = matrix.translation([0, 1, 0]);
    result = rpr.ShapeSetTransform(mesh, false, m);
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);

    //plane mesh
    result = rpr.ContextCreateMesh(context,
        plane.vertices, plane.vertices.length, Float32Array.BYTES_PER_ELEMENT * 3,
        plane.normals, plane.normals.length, Float32Array.BYTES_PER_ELEMENT * 3,
        plane.texcoords, plane.texcoords.length, Float32Array.BYTES_PER_ELEMENT * 2,
        indices, 4,
        indices, 4,
        indices, 4,
        num_face_vertices, 2);
    let plane_mesh = result.mesh;
    result = rpr.SceneAttachShape(scene, plane_mesh);
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);
    result = rpr.ShapeSetMaterial(plane_mesh, diffuse);
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS); 
    
    // let dofMesh = createDOFMesh(context);

    // result = rpr.SceneAttachShape(scene, dofMesh);
    // assert(result.status == RPR.RPR_SUCCESS);
    // console.log(result);

    //camera
    let camera; 
    result = rpr.ContextCreateCamera(context);
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);
    camera = result.camera;
    result = rpr.CameraLookAt(camera, 0, 3, 10, 0, 0, 0, 0, 1, 0);
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);
    result = rpr.CameraSetFocalLength(camera, 23.0);
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);
    result = rpr.CameraSetFStop(camera, 5.4);
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);
    result = rpr.SceneSetCamera(scene, camera);
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);
    //camera 2
    // let camera; 
    // result = rpr.ContextCreateCamera(context);
    // assert(result.status == RPR.RPR_SUCCESS);
    // console.log(result);
    // camera = result.camera;
    // result = rpr.CameraLookAt(camera, 0.0, +0.6, 4.0, 0.0, +0.6, 0.0, 0.0, 1.0, 0.0);
    // assert(result.status == RPR.RPR_SUCCESS);
    // console.log(result);
    // result = rpr.CameraSetFocalLength(camera, 200.0);
    // assert(result.status == RPR.RPR_SUCCESS);
    // console.log(result);
    // result = rpr.CameraSetFStop(camera, 0.5);
    // assert(result.status == RPR.RPR_SUCCESS);
    // console.log(result);
    // result = rpr.CameraSetFocusDistance(camera, 10.0);
    // assert(result.status == RPR.RPR_SUCCESS);
    // console.log(result);
    // result = rpr.CameraSetMode(camera, RPR.RPR_CAMERA_MODE_PERSPECTIVE);
    // assert(result.status == RPR.RPR_SUCCESS);
    // console.log(result);
    // result = rpr.SceneSetCamera(scene, camera);
    // assert(result.status == RPR.RPR_SUCCESS);
    // console.log(result);

    //spot light
    let spotLight; 
    result = rpr.ContextCreateSpotLight(context);
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);
    spotLight = result.light;

    let spotLightm = matrix.mul(
        matrix.translation([0, 1, 0]),
        matrix.rotation_x(-M_PI_2),
    );
    console.log("  matrix: [ " + spotLightm.join(", ") + " ]");
    result = rpr.LightSetTransform(spotLight, true, spotLightm);
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);
    result = rpr.SpotLightSetConeShape(spotLight, M_PI_4, Math.PI * 2 / 3);
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);
    result = rpr.SpotLightSetRadiantPower3f(spotLight, 350, 350, 350);
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);
    result = rpr.SceneAttachLight(scene, spotLight);
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);

    //point light
    // result = rpr.ContextCreatePointLight(context);
    // assert(result.status == RPR.RPR_SUCCESS);
    // console.log(result);
    // let pointLight = result.light;
    // let pointLightm = mat4.fromTranslation(mat4.create(), [0.0, +0.6, 4.0]);
    // result = rpr.LightSetTransform(pointLight, true, pointLightm);
    // assert(result.status == RPR.RPR_SUCCESS);
    // console.log(result);
    // result = rpr.PointLightSetRadiantPower3f(pointLight, 1000, 1000, 1000);
    // assert(result.status == RPR.RPR_SUCCESS);
    // console.log(result);
    // result = rpr.SceneAttachLight(scene, pointLight);
    // assert(result.status == RPR.RPR_SUCCESS);
    // console.log(result);

    // result = rpr.ContextCreateDirectionalLight(context);
    // assert(result.status == RPR.RPR_SUCCESS);
    // let lightDir = result.light;
    // result = rpr.SceneAttachLight(scene, lightDir);
    // assert(result.status == RPR.RPR_SUCCESS);
    // console.log(result);

    result = rpr.ContextSetScene(context, scene);
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);

    //setup out
    let frame_buffer;
    const fb_width = 800;
    const fb_height = 600;
    // Frame buffer format
    const num_components = 4;
    const type = RPR.RPR_COMPONENT_TYPE_FLOAT32;

    result = rpr.ContextCreateFrameBuffer(
        context, 
        num_components, type,
        fb_width, fb_height
    );
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);
    frame_buffer = result.frame_buffer;

    result = rpr.ContextSetAOV(context, RPR.RPR_AOV_COLOR, frame_buffer);
    // result = rpr.ContextSetAOV(context, RPR.RPR_AOV_SHADING_NORMAL, frame_buffer);
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);
    result = rpr.FrameBufferClear(frame_buffer);
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);
    const kRenderIterations = 256;
    
    //render
    console.log("Rendering started...")
    for (let i = 0; i < kRenderIterations; ++i)
    {
        result = rpr.ContextRender(context);
        assert(result.status == RPR.RPR_SUCCESS);
    }

    console.log("Rendering completed!")

    const bufferSize = fb_width * fb_height * 4 * 4;
    const BufferType = typeof SharedArrayBuffer === "undefined" ? ArrayBuffer : SharedArrayBuffer;
    const sbuffer = new BufferType(bufferSize);
    const output1 = Buffer.from(sbuffer);

    result = rpr.FrameBufferGetInfo(frame_buffer, output1, bufferSize);
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);

    fs.writeFileSync(`output/dof.rgba`, output1);
    // saveAsPNG(output1, fb_width, fb_height, "dof");
    return;
    //change spotLight
    result = rpr.SpotLightSetConeShape(spotLight, M_PI_4 * 0.5, M_PI_4 * 0.5);
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);
    result = rpr.FrameBufferClear(frame_buffer);
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);
    
    console.log("Rendering started...")
    for (let i = 0; i < kRenderIterations; ++i)
    {
        result = rpr.ContextRender(context);
        assert(result.status == RPR.RPR_SUCCESS);
    }
    console.log("Rendering completed!")

    const output2 = Buffer.alloc(bufferSize);

    result = rpr.FrameBufferGetInfo(frame_buffer, output2, bufferSize);
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);
    fs.writeFileSync(`output/dof-2.rgba`, output2);

    let rs;
    // result = rpr.ContextGetInfo(context, RPR_CONTEXT_RENDER_STATISTICS, sizeof(rpr_render_statistics), NULL);
    result = rpr.ContextGetInfo(context);
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);

    return;
    //cleanup
    result = rpr.SceneDetachLight(scene, spotLight);
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);
    result = rpr.ObjectDelete(spotLight); 
    spotLight = null;
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);
    rpr.ObjectDelete(diffuse);
    console.log(result);
    result = rpr.SceneSetCamera(scene, null);
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);
    result = rpr.ObjectDelete(scene); 
    scene = null;
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);
    result = rpr.ObjectDelete(camera); 
    camera = null;
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);
    result = rpr.ObjectDelete(frame_buffer); 
    frame_buffer = null;
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);
    result = rpr.ObjectDelete(matsys); 
    matsys = null;
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);
}

function createSphere(context, lat, lon, r, c) {
    let num_verts = (lat - 2) * lon + 2;
    let num_tris = (lat - 2) * (lon - 1) * 2;

    let vertices = new Float32Array(num_verts * 3);
    let normals = new Float32Array(num_verts * 3);
    let uvs = new Float32Array(num_verts * 2);
    let indices = new Int32Array(num_tris * 3);

    let t = 0;
    let iv = 0;
    let it = 0;
    for (let j = 1; j < lat - 1; j++)
        for (let i = 0; i < lon; i++) {
            let theta = j / (lat - 1) * Math.PI;
            let phi = i / (lon - 1) * Math.PI * 2;
            vertices[iv] = r * Math.sin(theta) * Math.cos(phi) + c.x;
            vertices[iv + 1] = r * Math.cos(theta) + c.y;
            vertices[iv + 2] = r * -Math.sin(theta) * Math.sin(phi) + c.z;
            normals[iv] = Math.sin(theta) * Math.cos(phi);
            normals[iv + 1] = Math.cos(theta);
            normals[iv + 2] = -Math.sin(theta) * Math.sin(phi);
            uvs[it] = phi / (2 * Math.PI);
            uvs[it + 1].y = theta / (Math.PI);
            ++t;
            iv += 3;
            it + 2;
        }

    vertices[iv] = c.x;
    vertices[iv + 1] = c.y + r;
    vertices[iv + 2] = c.z;
    normals[iv] = 0;
    normals[iv + 1] = 1;
    normals[iv + 2] = 0;
    uvs[it] = 0;
    uvs[it + 1] = 0;
    ++t;
    iv += 3;
    it + 2;
    vertices[iv] = c.x;
    vertices[iv + 1] = c.y - r;
    vertices[iv + 2] = c.z;
    normals[iv] = 0;
    normals[iv + 1] = -1;
    normals[iv + 2] = 0;
    uvs[it] = 1;
    uvs[it + 1] = 1;
    ++t;
    iv += 3;
    it + 2;

    t = 0;
    for (let j = 0; j < lat - 3; j++)
        for (let i = 0; i < lon - 1; i++) {
            indices[t++] = j * lon + i;
            indices[t++] = (j + 1) * lon + i + 1;
            indices[t++] = j * lon + i + 1;
            indices[t++] = j * lon + i;
            indices[t++] = (j + 1) * lon + i;
            indices[t++] = (j + 1) * lon + i + 1;
        }

    for (let i = 0; i < lon - 1; i++) {
        indices[t++] = (lat - 2) * lon;
        indices[t++] = i;
        indices[t++] = i + 1;
        indices[t++] = (lat - 2) * lon + 1;
        indices[t++] = (lat - 3) * lon + i + 1;
        indices[t++] = (lat - 3) * lon + i;
    }

    let faces = new Int32Array(indices.length / 3).fill(3)
    let result = rpr.ContextCreateMesh(
        context,
        vertices, vertices.length, Float32Array.BYTES_PER_ELEMENT * 3,
        normals, normals.length, Float32Array.BYTES_PER_ELEMENT * 3,
        uvs, uvs.length, Float32Array.BYTES_PER_ELEMENT * 2,
        indices, 4,
        indices, 4,
        indices, 4,
        faces, faces.length);
    console.log(result);
    if (result.status !== RPR.RPR_SUCCESS) {
        console.log("Error creating mesh");
        return false;
    }
    return result.mesh;
}

simpleRenderTest();