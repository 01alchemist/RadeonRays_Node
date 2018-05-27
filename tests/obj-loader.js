const fs = require("fs")
class Vector3 {
    constructor(x, y, z) {
        this.x = x
        this.y = y
        this.z = z
    }
}
class Color {
    constructor(r, g, b){
        this.r = r;
        this.g = g;
        this.b = b;
    }
}
class Triangle {

}
class Mesh {
    constructor(triangles) {
        this.vertices = new Float32Array(triangles.length * 3 * 3)
        this.normals = new Float32Array(triangles.length * 3 * 3)
        this.texcoords = new Float32Array(triangles.length * 3 * 2)
    }
    /* constructor(vertices, normals, uvs, indices) {
        this.vertices = vertices
        this.normals = normals
        this.texcoords = uvs
        this.indices = indices
    } */
}
function append(slice, ...elements){
    if (slice == undefined) {
        return elements;
    } else {
        slice.push.apply(slice, elements);
    }
    return slice;
}
class OBJLoader {
    constructor() {
        this.parentMaterial = null
        this.lastMesh = null
        this.materials = null
        this.hasMaterials = false
        this.materialsLoaded = false
        this.materialsLoading = false
        this.pendingCallback = null
        this.basePath = null
    }

    load(url, onLoad) {
        console.log("Loading OBJ:" + url)
        this.basePath = url.substring(0, url.lastIndexOf("/"))
        /* var self = this
        var xhr = new XMLHttpRequest()
        xhr.open("GET", url, true)
        xhr.onload = function() {
            self.lastMesh = self.loadOBJ(xhr.response)
            if (onLoad) {
                if (self.hasMaterials && self.materialsLoaded) {
                    onLoad(self.lastMesh)
                } else if (!self.hasMaterials) {
                    onLoad(self.lastMesh)
                } else {
                    self.pendingCallback = onLoad
                }
            }
        }
        xhr.send(null) */
        const data = fs.readFileSync(url, "utf-8")
        this.lastMesh = this.loadData(data)
        if (onLoad) {
            if (this.hasMaterials && this.materialsLoaded) {
                onLoad(this.lastMesh)
            } else if (!this.hasMaterials) {
                onLoad(this.lastMesh)
            } else {
                this.pendingCallback = onLoad
            }
        }
    }
    loadData(data, callback) {
        this.pendingCallback = callback
        this.hasMaterials = false
        this.materialsLoaded = false
        this.materialsLoading = false

        var vs = [null] //1024 // 1-based indexing
        var vts = [null] // 1-based indexing
        var vns = [null] // 1-based indexing
        var triangles
        this.materials = new Map() //make(map[string]*Material)
        var material = this.parentMaterial
        var lines = data.split("\n")

        for (var i = 0; i < lines.length; i++) {
            let line = lines[i].trim()
            if (line.length == 0) {
                continue
            }
            let item = OBJLoader.parseLine(line)
            if (item) {
                let f
                let v

                switch (item.keyword) {
                    case "mtllib":
                        this.hasMaterials = true
                        this.materialsLoaded = false
                        this.loadMTL(item.value[0])
                        break

                    case "usemtl":
                        material = this.getMaterial(item.value[0])
                        break

                    case "v":
                        f = OBJLoader.parseFloats(item.value)
                        v = new Vector3(f[0], f[1], f[2])
                        vs = append(vs, v)
                        break

                    case "vt":
                        f = OBJLoader.parseFloats(item.value)
                        v = new Vector3(f[0], f[1], 0)
                        vts = append(vts, v)
                        break

                    case "vn":
                        f = OBJLoader.parseFloats(item.value)
                        v = new Vector3(f[0], f[1], f[2])
                        vns = append(vns, v)
                        break

                    case "f":
                        var fvs = []
                        var fvts = []
                        var fvns = []

                        item.value.forEach(function(str, i) {
                            let vertex = str.split(/\/\/{1,}/)
                            fvs[i] = OBJLoader.parseIndex(vertex[0], vs.length)
                            fvts[i] = OBJLoader.parseIndex(
                                vertex[1],
                                vts.length,
                            )
                            fvns[i] = OBJLoader.parseIndex(
                                vertex[2],
                                vns.length,
                            )
                        })

                        for (let i = 1; i < fvs.length - 1; i++) {
                            let i1 = 0
                            let i2 = i
                            let i3 = i + 1
                            let t = new Triangle()
                            t.material = material
                            t.v1 = vs[fvs[i1]]
                            t.v2 = vs[fvs[i2]]
                            t.v3 = vs[fvs[i3]]
                            t.t1 = vts[fvts[i1]]
                            t.t2 = vts[fvts[i2]]
                            t.t3 = vts[fvts[i3]]
                            t.n1 = vns[fvns[i1]]
                            t.n2 = vns[fvns[i2]]
                            t.n3 = vns[fvns[i3]]
                            // t.updateBox()
                            // t.fixNormals()
                            triangles = append(triangles, t)
                        }
                        break
                }
            }
        }
        this.lastMesh = new Mesh(triangles)
        return this.lastMesh
    }

    getMaterial(index) {
        if (this.materials[index] == undefined) {
            var material = this.parentMaterial.clone()
            this.materials[index] = material
            return material
        } else {
            return this.materials[index]
        }
    }

    loadMTL(url) {
        if (this.materialsLoaded || this.materialsLoading) {
            return
        }
        this.materialsLoading = true
        url = this.basePath == "" ? url : this.basePath + "/" + url
        console.log("Loading MTL:" + url)
        var self = this
        fs.readFile(url, function(data) {
            var lines = data.split("\n")

            for (var i = 0; i < lines.length; i++) {
                let line = lines[i].trim()
                if (line.length == 0) {
                    continue
                }
                let item = OBJLoader.parseLine(line)
                if (item) {
                    var material
                    switch (item.keyword) {
                        case "newmtl":
                            material = self.materials[item.value[0]]
                            material = material
                                ? material
                                : self.parentMaterial.clone()
                            self.materials[item.value[0]] = material
                            break
                        case "Kd":
                            var c = OBJLoader.parseFloats(item.value)
                            material.color = new Color(c[0], c[1], c[2])
                            break
                        case "map_Kd":
                            //material.texture = Texture.getTexture(item.value[0]);
                            break
                    }
                }
            }
            self.materialsLoaded = true
            if (self.pendingCallback) {
                self.pendingCallback(self.lastMesh)
                self.pendingCallback = null
            }
        }, "utf-8")

        return null
    }

    static parseIndex(value, length) {
        var n = parseInt(value)
        if (n < 0) {
            n += length
        }
        return n
    }

    static parseLine(line) {
        try {
            var result = line.match(/^(\S+)\s(.*)/)
            if (result) {
                var _str = result.slice(1)
            } else {
                return null
            }
        } catch (e) {
            console.log("Error in line:", line, e)
            return null
        }
        if (!_str) {
            return null
        } else {
            return {
                keyword: _str[0],
                value: _str[1].split(/ {1,}/),
            }
        }
    }

    static parseFloats(fs) {
        var floats = []
        fs.forEach(function(f) {
            floats.push(parseFloat(f))
        })
        return floats
    }
}

module.exports = OBJLoader
