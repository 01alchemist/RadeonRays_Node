function translation(v)
{
    return new Float32Array([
        1, 0, 0, v[0], 
        0, 1, 0, v[1], 
        0, 0, 1, v[2], 
        0, 0, 0, 1
    ]);
}

function rotation_x(ang)
{
    return new Float32Array([
        1, 0, 0, 0, 
        0, Math.cos(ang), -Math.sin(ang), 0,
        0, Math.sin(ang), Math.cos(ang), 0,
        0, 0, 0, 1
    ]);
}

function mul(m1, m2){
    let res = new Float32Array(16);
    for (let i=0;i<4;++i)
    {
        for (let j=0;j<4;++j)
        {
            res[(i * 4) + j] = 0.0;
            for (let k=0;k<4;++k)
                res[(i * 4) + j] += m1[(i * 4) + k] * m2[(k * 4) + j];
        }
    }
    return res;
}

module.exports = {
    mul,
    translation,
    rotation_x
}
