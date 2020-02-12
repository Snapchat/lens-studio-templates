// JSMathLibrary.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: Math Library implemented on Javascript 

//@input bool advanced {"label":"Settings"}
//@input bool addAll {"label" : "Add All", "showIf":"advanced", "showIfValue":"true"}
//@ui {"widget":"group_start", "label" : "Add Selected","showIf":"advanced", "showIfValue":"true"}
//@input bool addVec2 {"label":"vec2", "showIf":"addAll", "showIfValue":"false"}
//@input bool addVec3 {"label":"vec3", "showIf":"addAll", "showIfValue":"false"}
//@input bool addVec4 {"label":"vec4", "showIf":"addAll", "showIfValue":"false"}
//@input bool addVec4b {"label":"vec4b", "showIf":"addAll", "showIfValue":"false"}

//@ui {"widget":"separator", "showIf":"addAll", "showIfValue":"false"}

//@input bool addQuat {"label":"quat", "showIf":"addAll", "showIfValue":"false"}
//@ui {"widget":"separator", "showIf":"addAll", "showIfValue":"false"}

//@input bool addMat2 {"label":"mat2", "showIf":"addAll", "showIfValue":"false"}
//@input bool addMat3 {"label":"mat3", "showIf":"addAll", "showIfValue":"false"}
//@input bool addMat4 {"label":"mat4", "showIf":"addAll", "showIfValue":"false"}
//@ui {"widget":"group_end", "showIf":"addAll", "showIfValue":"false"}

if (script.addAll) {
    script.addVec2 = true;
    script.addVec3 = true;
    script.addVec4 = true;
    script.addVec4b = true;
    script.addQuat = true;
    script.addMat2 = true;
    script.addMat3 = true;
    script.addMat4 = true;
}

global.MathLib = {};

//vec2 begin
if (script.addVec2) {
    MathLib.vec2 = function (x, y) {
        this.x = x;
        this.y = y;
    };
    with (MathLib) {
        vec2.prototype = {
            angleTo: function (v) {
                return Math.acos((this.x * v.x + this.y * v.y) / (this.length * v.length));
            },
            clampLength: function (max) {
                var x = this.x, y = this.y;

                var curLength = Math.sqrt((x * x) + (y * y));
                var scale = curLength > max ? (max / curLength) : 1.0;
                return new vec2(x * scale, y * scale);
            },
            distance: function (v) {
                var dx = v.x - this.x;
                var dy = v.y - this.y;
                return Math.sqrt(dx * dx + dy * dy);
            },
            dot: function (v) {
                return this.x * v.x + this.y * v.y;
            },
            equal: function (v) {
                return this.x === v.x && this.y === v.y;
            },
            moveTowards: function (target, step) {
                return vec2.lerp(this, target, Math.min(1.0, step / this.distance(target)));
            },
            div: function (v) {
                return new vec2(this.x / v.x, this.y / v.y);
            },
            mult: function (v) {
                return new vec2(this.x * v.x, this.y * v.y);
            },
            project: function (normalVec) {
                return normalVec.uniformScale(this.dot(normalVec) / normalVec.lengthSquared);
            },
            projectOnPlane: function (normalPlane) {
                var vecProjection = this.project(normalPlane);
                return this.sub(vecProjection);
            },
            reflect: function (normalPlane) {
                return this.sub(normalPlane.uniformScale(this.dot(normalPlane) * 2.0));
            },
            add: function (v) {
                return new vec2(this.x + v.x, this.y + v.y);
            },
            sub: function (v) {
                return new vec2(this.x - v.x, this.y - v.y);
            },
            uniformScale: function (v) {
                return new vec2(this.x * v, this.y * v);
            },
            scale: function (v) {
                return new vec2(this.x * v.x, this.y * v.y);
            },
            len: function () {
                var x = this.x, y = this.y;
                return Math.sqrt((x * x) + (y * y));
            },
            lenSquared: function () {
                var x = this.x, y = this.y;
                return x * x + y * y;
            },
            normalize: function () {
                // don't call len func for performance
                var x = this.x, y = this.y;
                var iLen = 1.0 / Math.sqrt((x * x) + (y * y));
                return new vec2(x * iLen, y * iLen);
            },
            toString: function toString() {
                return '{x: ' + this.x + ', y: ' + this.y + '}';
            }
        };
        Object.defineProperty(vec2.prototype, 'length', { get: vec2.prototype.len });
        Object.defineProperty(
            vec2.prototype, 'lengthSquared', { get: vec2.prototype.lenSquared });
        Object.defineProperty(vec2.prototype, 'r', {
            get: function () {
                return this.x;
            },
            set: function (v) {
                this.x = v;
            }
        });
        Object.defineProperty(vec2.prototype, 'g', {
            get: function () {
                return this.y;
            },
            set: function (v) {
                return this.y = v;
            }
        });

        vec2.one = function () {
            return new vec2(1, 1);
        };
        vec2.zero = function () {
            return new vec2(0, 0);
        };
        vec2.up = function () {
            return new vec2(0, 1);
        };
        vec2.down = function () {
            return new vec2(0, -1);
        };
        vec2.left = function () {
            return new vec2(-1, 0);
        };
        vec2.right = function () {
            return new vec2(1, 0);
        };
        vec2.max = function (a, b) {
            return new vec2(Math.max(a.x, b.x), Math.max(a.y, b.y));
        };
        vec2.min = function (a, b) {
            return new vec2(Math.min(a.x, b.x), Math.min(a.y, b.y));
        };
        vec2.lerp = function lerp(a, b, t) {
            var lerpVec = new vec2();
            lerpVec.x = a.x + (b.x - a.x) * t;
            lerpVec.y = a.y + (b.y - a.y) * t;
            return lerpVec;
        };
    } //end with MathLib
}
//vec2 end

//vec3 begin
if (script.addVec3) {
    MathLib.vec3 = function (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    with (MathLib) {

        vec3.prototype = {
            add: function (v) {
                return new vec3(this.x + v.x, this.y + v.y, this.z + v.z);
            },
            sub: function (v) {
                return new vec3(this.x - v.x, this.y - v.y, this.z - v.z);
            },
            mult: function (v) {
                return new vec3(this.x * v.x, this.y * v.y, this.z * v.z);
            },
            scale: function (v) {
                return new vec3(this.x * v.x, this.y * v.y, this.z * v.z);
            },
            div: function (v) {
                return new vec3(this.x / v.x, this.y / v.y, this.z / v.z);
            },
            uniformScale: function (s) {
                return new vec3(this.x * s, this.y * s, this.z * s);
            },
            equal: function (v) {
                return this.x === v.x && this.y === v.y && this.z === v.z;
            },
            getLength: function () {
                var x = this.x;
                var y = this.y;
                var z = this.z;
                return Math.sqrt(x * x + y * y + z * z);
            },
            clampLength: function (maxLength) {
                var curLength = this.length;
                var scale = curLength > maxLength ? maxLength / curLength : 1.0;

                return new vec3(this.x * scale, this.y * scale, this.z * scale);
            },
            getLengthSquared: function () {
                var x = this.x;
                var y = this.y;
                var z = this.z;
                return x * x + y * y + z * z;
            },
            normalize: function () {
                var x = this.x;
                var y = this.y;
                var z = this.z;
                var invLength = 1.0 / Math.sqrt(x * x + y * y + z * z);
                return new vec3(x * invLength, y * invLength, z * invLength);
            },
            angleTo: function (v) {
                return Math.acos((this.x * v.x + this.y * v.y + this.z * v.z) / (this.length * v.length));
            },
            distance: function (v) {
                return v.sub(this).length;
            },
            dot: function (v) {
                return this.x * v.x + this.y * v.y + this.z * v.z;
            },
            moveTowards: function (v, step) {
                step = Math.min(1.0, step / this.distance(v));
                var x = this.x;
                var y = this.y;
                var z = this.z;
                return new vec3(x + step * (v.x - x), y + step * (v.y - y), z + step * (v.z - z));
            },
            project: function (v) {
                var vx = v.x;
                var vy = v.y;
                var vz = v.z;
                return v.uniformScale((this.x * vx + this.y * vy + this.z * vz) / (vx * vx + vy * vy + vz * vz));
            },
            projectOnPlane: function (v) {
                var res = this.project(v);
                res.x = this.x - res.x;
                res.y = this.y - res.y;
                res.z = this.z - res.z;

                return res;
            },
            reflect: function (v) {
                var x = this.x;
                var y = this.y;
                var z = this.z;
                var res = v.uniformScale((x * v.x + y * v.y + z * v.z) * 2);
                res.x = x - res.x;
                res.y = y - res.y;
                res.z = z - res.z;

                return res;
            },
            toString: function () {
                return '{x: ' + this.x + ', y: ' + this.y + ', z: ' + this.z + '}';
            },
            cross: function (v) {
                var thisx = this.x;
                var thisy = this.y;
                var thisz = this.z;

                var vx = v.x;
                var vy = v.y;
                var vz = v.z;
                return new vec3(
                    thisy * vz - thisz * vy,
                    thisz * vx - thisx * vz,
                    thisx * vy - thisy * vx
                );
            },
            rotateTowards: function (v, step) {
                var len = this.length;
                var vecNormalized = this.uniformScale(1.0 / len);
                var targetNormalized = v.normalize();

                if (step > Math.acos(vecNormalized.x * targetNormalized.x + vecNormalized.y * targetNormalized.y + vecNormalized.z * targetNormalized.z)) {
                    return targetNormalized.iUniformScale(len);
                }

                //vecNormalized become axis
                vecNormalized = vecNormalized.cross(targetNormalized).iNormalize();

                var s = Math.sin(step);
                var c = Math.cos(step);
                var temp = vecNormalized.uniformScale(1.0 - c);

                var thisx = this.x; var tempx = temp.x; var vecNormalizedx = vecNormalized.x;
                var thisy = this.y; var tempy = temp.y; var vecNormalizedy = vecNormalized.y;
                var thisz = this.z; var tempz = temp.z; var vecNormalizedz = vecNormalized.z;
                //Multiplying a vector by a rotation matrix          
                return new vec3(thisx * (c + tempx * vecNormalizedx) +
                    thisy * (tempy * vecNormalizedx - s * vecNormalizedz) +
                    thisz * (tempz * vecNormalizedx + s * vecNormalizedy),

                    thisx * (tempx * vecNormalizedy + s * vecNormalizedz) +
                    thisy * (c + tempy * vecNormalizedy) +
                    thisz * (tempz * vecNormalizedy - s * vecNormalizedx),

                    thisx * (tempx * vecNormalizedz - s * vecNormalizedy) +
                    thisy * (tempy * vecNormalizedz + s * vecNormalizedx) +
                    thisz * (c + tempz * vecNormalizedz));
            },
            //special functions for optimization
            iUniformScale: function (s) {
                this.x *= s;
                this.y *= s;
                this.z *= s;

                return this;
            },
            iNormalize: function () {
                var x = this.x;
                var y = this.y;
                var z = this.z;
                var invLength = 1.0 / Math.sqrt(x * x + y * y + z * z);
                this.x *= invLength;
                this.y *= invLength;
                this.z *= invLength;

                return this;
            },
            iAdd: function (v) {
                this.x += v.x;
                this.y += v.y;
                this.z += v.z;

                return this;
            },
            iSub: function (v) {
                this.x -= v.x;
                this.y -= v.y;
                this.z -= v.z;

                return this;
            }
        }

        Object.defineProperty(vec3.prototype, 'r', {
            get: function () {
                return this.x;
            },
            set: function (x) {
                this.x = x;
            }
        });
        Object.defineProperty(vec3.prototype, 'g', {
            get: function () {
                return this.y;
            },
            set: function (y) {
                this.y = y;
            }
        });
        Object.defineProperty(vec3.prototype, 'b', {
            get: function () {
                return this.z;
            },
            set: function (z) {
                this.z = z;
            }
        });
        Object.defineProperty(vec3.prototype, 'length', { get: vec3.prototype.getLength });
        Object.defineProperty(vec3.prototype, 'lengthSquared', { get: vec3.prototype.getLengthSquared });

        vec3.orthonormalize = function (x, y) {
            x.iNormalize();

            y.iNormalize();
            y.iSub(x.uniformScale(y.x * x.x + y.y * x.y + y.z * x.z));
            y.iNormalize();
        }
        vec3.max = function (x, y) {
            return new vec3(Math.max(x.x, y.x), Math.max(x.y, y.y), Math.max(x.z, y.z));
        }
        vec3.min = function (x, y) {
            return new vec3(Math.min(x.x, y.x), Math.min(x.y, y.y), Math.min(x.z, y.z));
        }
        vec3.lerp = function (x, y, step) {
            var xx = x.x;
            var xy = x.y;
            var xz = x.z;
            return new vec3(xx + step * (y.x - xx), xy + step * (y.y - xy), xz + step * (y.z - xz));
        }
        vec3.slerp = function (x, y, step) {
            var xLength = x.length;
            var yLength = y.length;

            x = x.normalize();
            y = y.normalize();

            var alpha = Math.acos(x.x * y.x + x.y * y.y + x.z * y.z);
            var invSinAlpha = 1.0 / Math.sin(alpha);

            return x.iUniformScale(Math.sin((1 - step) * alpha) * invSinAlpha).
                iAdd(y.iUniformScale(Math.sin(step * alpha) * invSinAlpha)).
                iUniformScale(xLength + step * (yLength - xLength));
        }
        vec3.one = function () {
            return new vec3(1.0, 1.0, 1.0);
        }
        vec3.zero = function () {
            return new vec3(0.0, 0.0, 0.0);
        }
        vec3.up = function () {
            return new vec3(0.0, 1.0, 0.0);
        }
        vec3.down = function () {
            return new vec3(0.0, -1.0, 0.0);
        }
        vec3.left = function () {
            return new vec3(-1.0, 0.0, 0.0);
        }
        vec3.right = function () {
            return new vec3(1.0, 0.0, 0.0);
        }
        vec3.back = function () {
            return new vec3(0.0, 0.0, -1.0);
        }
        vec3.forward = function () {
            return new vec3(0.0, 0.0, 1.0);
        }

    } //end with (MathLib)
} //vec3 end 

//vec4 begin
if (script.addVec4) {
    MathLib.vec4 = function (x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    with (MathLib) {

        vec4.prototype = {
            add: function (v) {
                return new vec4(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w);
            },
            sub: function (v) {
                return new vec4(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w);
            },
            mult: function (v) {
                return new vec4(this.x * v.x, this.y * v.y, this.z * v.z, this.w * v.w);
            },
            scale: function (v) {
                return new vec4(this.x * v.x, this.y * v.y, this.z * v.z, this.w * v.w);
            },
            div: function (v) {
                return new vec4(this.x / v.x, this.y / v.y, this.z / v.z, this.w / v.w);
            },
            uniformScale: function (s) {
                return new vec4(this.x * s, this.y * s, this.z * s, this.w * s);
            },
            equal: function (v) {
                return this.x === v.x && this.y === v.y && this.z === v.z && this.w === v.w;
            },
            getLength: function () {
                var x = this.x;
                var y = this.y;
                var z = this.z;
                var w = this.w;
                return Math.sqrt(x * x + y * y + z * z + w * w);
            },
            clampLength: function (maxLength) {
                var curLength = this.length;
                var scale = curLength > maxLength ? maxLength / curLength : 1.0;

                return new vec4(this.x * scale, this.y * scale, this.z * scale, this.w * scale);
            },
            getLengthSquared: function () {
                var x = this.x;
                var y = this.y;
                var z = this.z;
                var w = this.w;
                return x * x + y * y + z * z + w * w;
            },
            normalize: function () {
                var x = this.x;
                var y = this.y;
                var z = this.z;
                var w = this.w;
                var invLength = 1.0 / Math.sqrt(x * x + y * y + z * z + w * w);
                return new vec4(x * invLength, y * invLength, z * invLength, w * invLength);
            },
            angleTo: function (v) {
                return Math.acos((this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w) / (this.length * v.length));
            },
            distance: function (v) {
                return v.sub(this).length;
            },
            dot: function (v) {
                return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
            },
            moveTowards: function (v, step) {
                var x = this.x;
                var y = this.y;
                var z = this.z;
                var w = this.w;
                step = Math.min(1.0, step / this.distance(v));
                return new vec4(x + step * (v.x - x), y + step * (v.y - y),
                    z + step * (v.z - z), w + step * (v.w - w));
            },
            project: function (v) {
                var vx = v.x;
                var vy = v.y;
                var vz = v.z;
                var vw = v.w;
                return v.uniformScale((this.x * vx + this.y * vy + this.z * vz + this.w * vw) / (vx * vx + vy * vy + vz * vz + vw * vw));
            },
            projectOnPlane: function (v) {
                var res = this.project(v);
                res.x = this.x - res.x;
                res.y = this.y - res.y;
                res.z = this.z - res.z;
                res.w = this.w - res.w;

                return res;
            },
            reflect: function (v) {
                var x = this.x;
                var y = this.y;
                var z = this.z;
                var w = this.w;
                var res = v.uniformScale((x * v.x + y * v.y + z * v.z + w * v.w) * 2);
                res.x = x - res.x;
                res.y = y - res.y;
                res.z = z - res.z;
                res.w = w - res.w;

                return res;
            },
            toString: function () {
                return '{x: ' + this.x + ', y: ' + this.y + ', z: ' + this.z + ', w: ' + this.w + '}';
            }
        }

        Object.defineProperty(vec4.prototype, 'r', {
            get: function () {
                return this.x;
            },
            set: function (x) {
                this.x = x;
            }
        });
        Object.defineProperty(vec4.prototype, 'g', {
            get: function () {
                return this.y;
            },
            set: function (y) {
                this.y = y;
            }
        });
        Object.defineProperty(vec4.prototype, 'b', {
            get: function () {
                return this.z;
            },
            set: function (z) {
                this.z = z;
            }
        });
        Object.defineProperty(vec4.prototype, 'a', {
            get: function () {
                return this.w;
            },
            set: function (w) {
                this.w = w;
            }
        });
        Object.defineProperty(vec4.prototype, 'length', { get: vec4.prototype.getLength });
        Object.defineProperty(vec4.prototype, 'lengthSquared', { get: vec4.prototype.getLengthSquared });

        vec4.max = function (x, y) {
            return new vec4(Math.max(x.x, y.x), Math.max(x.y, y.y), Math.max(x.z, y.z), Math.max(x.w, y.w));
        }
        vec4.min = function (x, y) {
            return new vec4(Math.min(x.x, y.x), Math.min(x.y, y.y), Math.min(x.z, y.z), Math.min(x.w, y.w));
        }
        vec4.lerp = function (x, y, step) {
            var xx = x.x;
            var xy = x.y;
            var xz = x.z;
            var xw = x.w;
            return new vec4(xx + step * (y.x - xx), xy + step * (y.y - xy),
                xz + step * (y.z - xz), xw + step * (y.w - xw));
        }
        vec4.one = function () {
            return new vec4(1.0, 1.0, 1.0, 1.0);
        }
        vec4.zero = function () {
            return new vec4(0.0, 0.0, 0.0, 0.0);
        }

    } //end with (MathLib)
} //vec4 end

//vec4b begin
if (script.addVec4b) {
    MathLib.vec4b = function (x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    with (MathLib) {

        vec4b.prototype = {
            toString: function () {
                return '{x: ' + Number(this.x) + ', y: ' + Number(this.y) +
                    ', z: ' + Number(this.z) + ', w: ' + Number(this.w) + '}';
            }
        }

        Object.defineProperty(vec4b.prototype, 'r', {
            get: function () {
                return this.x;
            },
            set: function (x) {
                this.x = x;
            }
        });
        Object.defineProperty(vec4b.prototype, 'g', {
            get: function () {
                return this.y;
            },
            set: function (y) {
                this.y = y;
            }
        });
        Object.defineProperty(vec4b.prototype, 'b', {
            get: function () {
                return this.z;
            },
            set: function (z) {
                this.z = z;
            }
        });
        Object.defineProperty(vec4b.prototype, 'a', {
            get: function () {
                return this.w;
            },
            set: function (w) {
                this.w = w;
            }
        });

    } //end with (MathLib)
} //vec4b end

//quat begin
if (script.addQuat) {
    MathLib.quat = function (w, x, y, z) {
        this.w = w;
        this.x = x;
        this.y = y;
        this.z = z;
    }

    with (MathLib) {

        quat.prototype = {
            invert: function () {
                return new quat(this.w, -this.x, -this.y, -this.z);
            },
            normalize: function () {
                var x = this.x, y = this.y, z = this.z, w = this.w;
                var len = Math.sqrt(w * w + x * x + y * y + z * z);
                if (len <= 0)
                    return new quat(1.0, 0.0, 0.0, 0.0);

                len = 1.0 / len;
                return new quat(w * len, x * len, y * len, z * len);
            },
            toString: function () {
                return '{x: ' + this.x + ', y: ' + this.y + ', z: ' + this.z + ', w: ' + this.w + '}';
            },
            toEulerAngles: function () {
                const singularityTestValue = 0.4999;

                var x = this.x, y = this.y, z = this.z, w = this.w;

                var sqw = w * w;
                var sqx = x * x;
                var sqy = y * y;
                var sqz = z * z;

                var unit = sqx + sqy + sqz + sqw;
                var test = (x * z - y * w) / unit;

                var xEul, yEul, zEul;

                //singularity at north pole
                if (test > singularityTestValue * unit) {
                    xEul = 2.0 * Math.atan2(x, w);
                    yEul = Math.PI * 0.5;
                    zEul = 0.0;
                }
                //singularity at north pole
                else if (test < -singularityTestValue * unit) {
                    xEul = -2.0 * Math.atan2(x, w);
                    yEul = -Math.PI * 0.5;
                    zEul = 0.0;
                } else {
                    xEul = Math.atan2(2.0 * (y * z + x * w),
                        -sqx - sqy + sqz + sqw);
                    yEul = Math.asin(-2.0 * test);
                    zEul = Math.atan2(2.0 * (x * y + z * w),
                        sqx - sqy - sqz + sqw);
                }

                if (xEul < 0.0)
                    xEul += Math.PI * 2.0;
                if (yEul < 0.0)
                    yEul += Math.PI * 2.0;
                if (zEul < 0.0)
                    zEul += Math.PI * 2.0;

                return new vec3(xEul, yEul, zEul);
            },
            getAngle: function () {
                return Math.acos(this.w) * 2.0;
            },
            getAxis: function () {
                var tmp = 1.0 - this.w * this.w;
                if (tmp <= 0.0) {
                    return new vec3(0.0, 0.0, 1.0);
                }

                tmp = 1.0 / Math.sqrt(tmp);
                return new vec3(this.x * tmp, this.y * tmp, this.z * tmp);
            },
            dot: function (q) {
                return this.w * q.w + this.x * q.x + this.y * q.y + this.z * q.z;
            },
            multiply: function (q) {
                var x = this.x, y = this.y, z = this.z, w = this.w;
                var qx = q.x, qy = q.y, qz = q.z, qw = q.w;

                return new quat(
                    w * qw - x * qx - y * qy - z * qz,
                    w * qx + x * qw + y * qz - z * qy,
                    w * qy + y * qw + z * qx - x * qz,
                    w * qz + z * qw + x * qy - y * qx
                );
            },
            equal: function (q) {
                return this.w === q.w && this.x === q.x && this.y === q.y && this.z === q.z;
            },
            //special functions for simplify implementation of other functions
            uniformScale: function (s) {
                return new quat(
                    this.w * s,
                    this.x * s,
                    this.y * s,
                    this.z * s
                );
            },
            add: function (q) {
                return new quat(
                    this.w + q.w,
                    this.x + q.x,
                    this.y + q.y,
                    this.z + q.z
                );
            },
            iUniformScale: function (s) {
                this.w *= s;
                this.x *= s;
                this.y *= s;
                this.z *= s;

                return this;
            },
            iNormalize: function (s) {
                var len = Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
                if (len <= 0) {
                    this.w = 1.0;
                    this.x = 0.0;
                    this.y = 0.0;
                    this.z = 0.0;
                } else {
                    len = 1.0 / len;
                    this.w *= len;
                    this.x *= len;
                    this.y *= len;
                    this.z *= len;
                }

                return this;
            },
            iAdd: function (q) {
                this.w += q.w;
                this.x += q.x;
                this.y += q.y;
                this.z += q.z;

                return this;
            }
        }

        quat.angleBetween = function (x, y) {
            var xw = x.w, xx = x.x, xy = x.y, xz = x.z;
            var invSqr = 1.0 / (xw * xw + xx * xx + xy * xy + xz * xz);
            var tmp = new quat(xw * invSqr, -xx * invSqr, -xy * invSqr, -xz * invSqr);

            var angle = Math.acos(tmp.multiply(y).w) * 2.0;
            return angle > 180.0 ? 360.0 - angle : angle;
        }

        quat.angleAxis = function (a, v) {
            var s = Math.sin(a * 0.5);

            return new quat(
                Math.cos(a * 0.5),
                v.x * s,
                v.y * s,
                v.z * s
            );
        }
        quat.fromEulerAngles = function (x, y, z) {
            x *= 0.5;
            y *= 0.5;
            z *= 0.5;

            var cx = Math.cos(x), cy = Math.cos(y), cz = Math.cos(z);
            var sx = Math.sin(x), sy = Math.sin(y), sz = Math.sin(z);

            var sxsy = sx * sy, cxcy = cx * cy, sxcy = sx * cy, cxsy = cx * sy;

            return new quat(
                cxcy * cz + sxsy * sz,
                sxcy * cz - cxsy * sz,
                cxsy * cz + sxcy * sz,
                cxcy * sz - sxsy * cz
            );
        }
        quat.fromEulerVec = function (v) {
            return quat.fromEulerAngles(v.x, v.y, v.z);
        }
        quat.rotationFromTo = function (from, to) {
            var angle = from.angleTo(to);
            var axis = from.cross(to);

            if (axis.dot(axis) == 0.0)
                axis = new vec3(1.0, 0.0, 0.0);

            return quat.angleAxis(angle, axis.normalize());
        }

        quat.lookAt = function (forward, up) {
            vec3.orthonormalize(forward, up);
            var right = up.cross(forward).iNormalize();

            return quat.fromMat3(
                [
                    right.x, right.y, right.z,
                    up.x, up.y, up.z,
                    forward.x, forward.y, forward.z
                ]
            );
        }
        quat.lerp = function (x, y, a) {
            var cosTheta = x.dot(y);

            // Perform a linear interpolation when cosTheta is close to 1 to avoid side effect of sin(angle) becoming a zero denominator
            if (cosTheta > 1.0) {
                var xw = x.w, xx = x.x, xy = x.y, xz = x.z;
                // Linear interpolation
                return new quat(
                    xw + a * (y.w - xw),
                    xx + a * (y.x - xx),
                    xy + a * (y.y - xy),
                    xz + a * (y.z - xz)
                );
            } else {
                // Essential Mathematics, page 467
                var angle = Math.acos(cosTheta);
                return x.uniformScale(Math.sin((1.0 - a) * angle)).iAdd(y.uniformScale(Math.sin(a * angle))).iUniformScale(1.0 / Math.sin(angle));
            }
        }
        quat.slerp = function (x, y, a) {
            var cosTheta = x.dot(y);

            // If cosTheta < 0, the interpolation will take the long way around the sphere. 
            // To fix this, one quat must be negated.
            if (cosTheta < 0.0) {
                y = new quat(-y.w, -y.x, -y.y, -y.z);
                cosTheta = -cosTheta;
            }

            // Perform a linear interpolation when cosTheta is close to 1 to avoid side effect of sin(angle) becoming a zero denominator
            if (cosTheta > 1.0) {
                var xw = x.w, xx = x.x, xy = x.y, xz = x.z;
                // Linear interpolation
                return new quat(
                    xw + a * (y.w - xw),
                    xx + a * (y.x - xx),
                    xy + a * (y.y - xy),
                    xz + a * (y.z - xz)
                );
            } else {
                // Essential Mathematics, page 467
                var angle = Math.acos(cosTheta);
                return x.uniformScale(Math.sin((1.0 - a) * angle)).iAdd(y.uniformScale(Math.sin(a * angle))).iUniformScale(1.0 / Math.sin(angle));
            }
        }
        quat.quatIdentity = function () {
            return new quat(1.0, 0.0, 0.0, 0.0);
        }
        //special functions for simplify implementation of other functions
        quat.fromMat3 = function (m) {
            var fourXSquaredMinus1 = m[0] - m[4] - m[8];
            var fourYSquaredMinus1 = m[4] - m[0] - m[8];
            var fourZSquaredMinus1 = m[8] - m[0] - m[4];

            var biggestIndex = 0;
            var fourBiggestSquaredMinus1 = m[0] + m[4] + m[8];
            if (fourXSquaredMinus1 > fourBiggestSquaredMinus1) {
                fourBiggestSquaredMinus1 = fourXSquaredMinus1;
                biggestIndex = 1;
            }
            if (fourYSquaredMinus1 > fourBiggestSquaredMinus1) {
                fourBiggestSquaredMinus1 = fourYSquaredMinus1;
                biggestIndex = 2;
            }
            if (fourZSquaredMinus1 > fourBiggestSquaredMinus1) {
                fourBiggestSquaredMinus1 = fourZSquaredMinus1;
                biggestIndex = 3;
            }

            var biggestVal = Math.sqrt(fourBiggestSquaredMinus1 + 1.0) * 0.5;
            var mult = 0.25 / biggestVal;

            var result = new quat(1.0, 0.0, 0.0, 0.0);
            switch (biggestIndex) {
                case 0:
                    result.w = biggestVal;
                    result.x = (m[5] - m[7]) * mult;
                    result.y = (m[6] - m[2]) * mult;
                    result.z = (m[1] - m[3]) * mult;
                    break;
                case 1:
                    result.w = (m[5] - m[7]) * mult;
                    result.x = biggestVal;
                    result.y = (m[1] + m[3]) * mult;
                    result.z = (m[6] + m[2]) * mult;
                    break;
                case 2:
                    result.w = (m[6] - m[2]) * mult;
                    result.x = (m[1] + m[3]) * mult;
                    result.y = biggestVal;
                    result.z = (m[5] + m[7]) * mult;
                    break;
                case 3:
                    result.w = (m[1] - m[3]) * mult;
                    result.x = (m[6] + m[2]) * mult;
                    result.y = (m[5] + m[7]) * mult;
                    result.z = biggestVal;
                    break;
            }
            return result;
        }

    } //end with (MathLib)
}//quat end

//mat2 begin
if (script.addMat2) {
    MathLib.mat2 = function () {
        this.values = [1, 0, 0, 1];
    };
    with (MathLib) {
        mat2.prototype = {
            get column0() {
                return new vec2(this.values[0], this.values[1]);
            },
            set column0(v) {
                this.values[0] = v.x;
                this.values[1] = v.y;
            },
            get column1() {
                return new vec2(this.values[2], this.values[3]);
            },
            set column1(v) {
                this.values[2] = v.x;
                this.values[3] = v.y;
            },
            transpose: function () {
                var transposed = mat2.clone(this);
                var values = transposed.values;
                var a1 = Number(values[1]);
                values[1] = values[2];
                values[2] = a1;
                return transposed;
            },
            add: function (m) {
                return mat2.add(this, m);
            },
            div: function (m) {
                return mat2.div(this, m);
            },
            mult: function (m) {
                return mat2.mul(this, m);
            },
            sub: function (m) {
                return mat2.sub(this, m);
            },
            equal: function (m) {
                var values = this.values;
                var mValues = m.values;

                return values[0] === mValues[0] &&
                    values[1] === mValues[1] &&
                    values[2] === mValues[2] &&
                    values[3] === mValues[3];
            },
            multiplyScalar: function (s) {
                var m = new mat2();

                var values = this.values;
                var mValues = m.values;
                mValues[0] = values[0] * s;
                mValues[1] = values[1] * s;
                mValues[2] = values[2] * s;
                mValues[3] = values[3] * s;
                return m;
            },
            inverse: function () {
                var determinant = 1 / this.determinant();
                var a = new mat2();

                var values = this.values;
                var aValues = a.values;
                aValues[0] = values[3] * determinant;
                aValues[1] = -values[1] * determinant;
                aValues[2] = -values[2] * determinant;
                aValues[3] = values[0] * determinant;
                return a;
            },
            determinant: function () {
                var values = this.values;
                return values[0] * values[3] -
                    values[2] * values[1];
            },
            toString: function toString() {
                var values = this.values;
                return '[' + values[0] + ', ' + values[1] + ']' +
                    '[' + values[2] + ', ' + values[3] + ']';
            },
            getDescription: function () {
                var out = this.transpose();
                var values = out.values;
                return '\n' + values[0] + ' ' + values[1] + '\n' +
                    values[2] + ' ' + values[3];
            }
        };
        Object.defineProperty(
            mat2.prototype, 'description', { get: mat2.prototype.getDescription });
        mat2.zero = function () {
            var m = new mat2();
            m.values[0] = 0;
            m.values[3] = 0;
            return m;
        };
        mat2.identity = function () {
            return new mat2();
        };
        mat2.add = function (m1, m2) {
            var m = new mat2();

            var mValues = m.values;
            var m1Values = m1.values;
            var m2Values = m2.values;
            mValues[0] = m1Values[0] + m2Values[0];
            mValues[1] = m1Values[1] + m2Values[1];
            mValues[2] = m1Values[2] + m2Values[2];
            mValues[3] = m1Values[3] + m2Values[3];

            return m;
        };
        mat2.div = function (m1, m2) {
            return mat2.mul(m1, m2.inverse());
        };
        mat2.mul = function (m1, m2) {
            var m = new mat2();
            var mValues = m.values;
            var m1Values = m1.values;
            var m2Values = m2.values;
            mValues[0] =
                m1Values[0] * m2Values[0] + m1Values[2] * m2Values[1];
            mValues[1] =
                m1Values[1] * m2Values[0] + m1Values[3] * m2Values[1];
            mValues[2] =
                m1Values[0] * m2Values[2] + m1Values[2] * m2Values[3];
            mValues[3] =
                m1Values[1] * m2Values[2] + m1Values[3] * m2Values[3];
            return m;
        };
        mat2.sub = function (m1, m2) {
            var m = new mat2();

            var mValues = m.values;
            var m1Values = m1.values;
            var m2Values = m2.values;
            mValues[0] = m1Values[0] - m2Values[0];
            mValues[1] = m1Values[1] - m2Values[1];
            mValues[2] = m1Values[2] - m2Values[2];
            mValues[3] = m1Values[3] - m2Values[3];

            return m;
        };
        mat2.clone = function (m) {
            var cloned = new mat2();
            var mValues = m.values;
            var clonedValues = cloned.values;

            clonedValues[0] = mValues[0];
            clonedValues[1] = mValues[1];
            clonedValues[2] = mValues[2];
            clonedValues[3] = mValues[3];

            return cloned;
        };
    } //end with MathLib
}//mat2 end

//mat3 begin
if (script.addMat3) {
    MathLib.mat3 = function () {
        this.values =
            [
                1.0, 0.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 0.0, 1.0
            ];
    }

    with (MathLib) {

        mat3.prototype = {
            getDescription: function () {
                var mat = this.transpose();
                var values = mat.values;
                var result = "";
                for (var i = 0; i < 3; ++i) {
                    result += '\n' +
                        values[i * 3] + ' ' + values[i * 3 + 1] + ' ' + values[i * 3 + 2];
                }

                return result;
            },
            get column0() {
                return new vec3(this.values[0], this.values[1], this.values[2]);
            },
            set column0(v) {
                this.values[0] = v.x;
                this.values[1] = v.y;
                this.values[2] = v.z;
            },
            get column1() {
                return new vec3(this.values[3], this.values[4], this.values[5]);
            },
            set column1(v) {
                this.values[3] = v.x;
                this.values[4] = v.y;
                this.values[5] = v.z;
            },
            get column2() {
                return new vec3(this.values[6], this.values[7], this.values[8]);
            },
            set column2(v) {
                this.values[6] = v.x;
                this.values[7] = v.y;
                this.values[8] = v.z;
            },
            add: function (m) {
                return mat3.add(this, m);
            },
            sub: function (m) {
                return mat3.sub(this, m);
            },
            mult: function (m) {
                return mat3.mul(this, m);
            },
            div: function (m) {
                return mat3.div(this, m);
            },
            determinant: function () {
                var values = this.values;
                return values[0] * (values[4] * values[8] - values[7] * values[5])
                    - values[3] * (values[1] * values[8] - values[7] * values[2])
                    + values[6] * (values[1] * values[5] - values[4] * values[2]);
            },
            inverse: function () {
                var values = this.values;
                var oneOverDeterminant = 1.0 / (
                    + values[0] * (values[4] * values[8] - values[7] * values[5])
                    - values[3] * (values[1] * values[8] - values[7] * values[2])
                    + values[6] * (values[1] * values[5] - values[4] * values[2]));

                var inverseMat = new mat3();
                var inverseMatValues = inverseMat.values;
                inverseMatValues[0] = + (values[4] * values[8] - values[7] * values[5]) * oneOverDeterminant;
                inverseMatValues[3] = - (values[3] * values[8] - values[6] * values[5]) * oneOverDeterminant;
                inverseMatValues[6] = + (values[3] * values[7] - values[6] * values[4]) * oneOverDeterminant;
                inverseMatValues[1] = - (values[1] * values[8] - values[7] * values[2]) * oneOverDeterminant;
                inverseMatValues[4] = + (values[0] * values[8] - values[6] * values[2]) * oneOverDeterminant;
                inverseMatValues[7] = - (values[0] * values[7] - values[6] * values[1]) * oneOverDeterminant;
                inverseMatValues[2] = + (values[1] * values[5] - values[4] * values[2]) * oneOverDeterminant;
                inverseMatValues[5] = - (values[0] * values[5] - values[3] * values[2]) * oneOverDeterminant;
                inverseMatValues[8] = + (values[0] * values[4] - values[3] * values[1]) * oneOverDeterminant;

                return inverseMat;
            },
            transpose: function () {
                var tMat = new mat3();

                var values = this.values;
                var tMatValues = tMat.values;
                tMatValues[0] = values[0];
                tMatValues[1] = values[3];
                tMatValues[2] = values[6];
                tMatValues[3] = values[1];
                tMatValues[4] = values[4];
                tMatValues[5] = values[7];
                tMatValues[6] = values[2];
                tMatValues[7] = values[5];
                tMatValues[8] = values[8];

                return tMat;
            },
            equal: function (m) {
                var values = this.values;
                var mValues = m.values;

                return values[0] === mValues[0] &&
                    values[1] === mValues[1] &&
                    values[2] === mValues[2] &&
                    values[3] === mValues[3] &&
                    values[4] === mValues[4] &&
                    values[5] === mValues[5] &&
                    values[6] === mValues[6] &&
                    values[7] === mValues[7] &&
                    values[8] === mValues[8];
            },
            multiplyScalar: function (s) {
                var m = new mat3();

                var values = this.values;
                var mValues = m.values;
                mValues[0] = values[0] * s;
                mValues[1] = values[1] * s;
                mValues[2] = values[2] * s;
                mValues[3] = values[3] * s;
                mValues[4] = values[4] * s;
                mValues[5] = values[5] * s;
                mValues[6] = values[6] * s;
                mValues[7] = values[7] * s;
                mValues[8] = values[8] * s;

                return m;
            },
            toString: function () {
                var values = this.values;
                return "[" + values[0] + ", " + values[1] + ", " + values[2] + "]\n" +
                    "[" + values[3] + ", " + values[4] + ", " + values[5] + "]\n" +
                    "[" + values[6] + ", " + values[7] + ", " + values[8] + "]";
            }
        } //end prototype

        Object.defineProperty(mat3.prototype, 'description', { get: mat3.prototype.getDescription });

        mat3.identity = function () {
            return new mat3();
        }
        mat3.zero = function () {
            var m = new mat3();
            m.values[0] = 0;
            m.values[4] = 0;
            m.values[8] = 0;

            return m;
        }
        mat3.makeFromRotation = function (q) {
            var m = new mat3();

            var qx = q.x;
            var qy = q.y;
            var qz = q.z;

            var qxx = qx * qx;
            var qyy = qy * qy;
            var qzz = qz * qz;
            var qxz = qx * qz;
            var qxy = qx * qy;
            var qyz = qy * qz;
            var qwx = q.w * qx;
            var qwy = q.w * qy;
            var qwz = q.w * qz;

            var mValues = m.values;
            mValues[0] = 1 - 2 * (qyy + qzz);
            mValues[1] = 2 * (qxy + qwz);
            mValues[2] = 2 * (qxz - qwy);

            mValues[3] = 2 * (qxy - qwz);
            mValues[4] = 1 - 2 * (qxx + qzz);
            mValues[5] = 2 * (qyz + qwx);

            mValues[6] = 2 * (qxz + qwy);
            mValues[7] = 2 * (qyz - qwx);
            mValues[8] = 1 - 2 * (qxx + qyy);

            return m;
        }
        mat3.add = function (m1, m2) {
            var m = new mat3();

            var mValues = m.values;
            var m1Values = m1.values;
            var m2Values = m2.values;
            mValues[0] = m1Values[0] + m2Values[0];
            mValues[1] = m1Values[1] + m2Values[1];
            mValues[2] = m1Values[2] + m2Values[2];

            mValues[3] = m1Values[3] + m2Values[3];
            mValues[4] = m1Values[4] + m2Values[4];
            mValues[5] = m1Values[5] + m2Values[5];

            mValues[6] = m1Values[6] + m2Values[6];
            mValues[7] = m1Values[7] + m2Values[7];
            mValues[8] = m1Values[8] + m2Values[8];

            return m;
        }
        mat3.sub = function (m1, m2) {
            var m = new mat3();

            var mValues = m.values;
            var m1Values = m1.values;
            var m2Values = m2.values;
            mValues[0] = m1Values[0] - m2Values[0];
            mValues[1] = m1Values[1] - m2Values[1];
            mValues[2] = m1Values[2] - m2Values[2];

            mValues[3] = m1Values[3] - m2Values[3];
            mValues[4] = m1Values[4] - m2Values[4];
            mValues[5] = m1Values[5] - m2Values[5];

            mValues[6] = m1Values[6] - m2Values[6];
            mValues[7] = m1Values[7] - m2Values[7];
            mValues[8] = m1Values[8] - m2Values[8];

            return m;
        }
        mat3.mul = function (m1, m2) {
            var m = new mat3();

            var mValues = m.values;
            var m1Values = m1.values;
            var m2Values = m2.values;

            var SrcA00 = m1Values[0];
            var SrcA01 = m1Values[1];
            var SrcA02 = m1Values[2];
            var SrcA10 = m1Values[3];
            var SrcA11 = m1Values[4];
            var SrcA12 = m1Values[5];
            var SrcA20 = m1Values[6];
            var SrcA21 = m1Values[7];
            var SrcA22 = m1Values[8];

            var SrcB00 = m2Values[0];
            var SrcB01 = m2Values[1];
            var SrcB02 = m2Values[2];
            var SrcB10 = m2Values[3];
            var SrcB11 = m2Values[4];
            var SrcB12 = m2Values[5];
            var SrcB20 = m2Values[6];
            var SrcB21 = m2Values[7];
            var SrcB22 = m2Values[8];

            mValues[0] = SrcA00 * SrcB00 + SrcA10 * SrcB01 + SrcA20 * SrcB02;
            mValues[1] = SrcA01 * SrcB00 + SrcA11 * SrcB01 + SrcA21 * SrcB02;
            mValues[2] = SrcA02 * SrcB00 + SrcA12 * SrcB01 + SrcA22 * SrcB02;
            mValues[3] = SrcA00 * SrcB10 + SrcA10 * SrcB11 + SrcA20 * SrcB12;
            mValues[4] = SrcA01 * SrcB10 + SrcA11 * SrcB11 + SrcA21 * SrcB12;
            mValues[5] = SrcA02 * SrcB10 + SrcA12 * SrcB11 + SrcA22 * SrcB12;
            mValues[6] = SrcA00 * SrcB20 + SrcA10 * SrcB21 + SrcA20 * SrcB22;
            mValues[7] = SrcA01 * SrcB20 + SrcA11 * SrcB21 + SrcA21 * SrcB22;
            mValues[8] = SrcA02 * SrcB20 + SrcA12 * SrcB21 + SrcA22 * SrcB22;

            return m;
        }
        mat3.div = function (m1, m2) {
            return mat3.mul(m1, m2.inverse());
        }

    } //end with MathLib
}//mat3 end

//mat4 begin
if (script.addMat4) {
    MathLib.mat4 = function () {
        this.values = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    };
    with (MathLib) {
        mat4.prototype = {
            get column0() {
                return new vec4(
                    this.values[0], this.values[1], this.values[2], this.values[3]);
            },
            set column0(v) {
                this.values[0] = v.x;
                this.values[1] = v.y;
                this.values[2] = v.z;
                this.values[3] = v.w;
            },
            get column1() {
                return new vec4(
                    this.values[4], this.values[5], this.values[6], this.values[7]);
            },
            set column1(v) {
                this.values[4] = v.x;
                this.values[5] = v.y;
                this.values[6] = v.z;
                this.values[7] = v.w;
            },
            get column2() {
                return new vec4(
                    this.values[8], this.values[9], this.values[10], this.values[11]);
            },
            set column2(v) {
                this.values[8] = v.x;
                this.values[9] = v.y;
                this.values[10] = v.z;
                this.values[11] = v.w;
            },
            get column3() {
                return new vec4(
                    this.values[12], this.values[13], this.values[14], this.values[15]);
            },
            set column3(v) {
                this.values[12] = v.x;
                this.values[13] = v.y;
                this.values[14] = v.z;
                this.values[15] = v.w;
            },
            toString: function toString() {
                var str = '';
                var size = 4;
                var values = this.values;
                for (var i = 0; i < size; ++i) {
                    str += '[';
                    for (var j = 0; j < size; ++j) {
                        str += values[i * size + j];
                        if (j === size - 1) {
                            str += ']';
                        } else
                            str += ', ';
                    }
                }
                return str;
            },
            multiplyScalar: function (scalar) {
                var a = mat4.clone(this);
                var values = a.values;

                values[0] *= scalar;
                values[1] *= scalar;
                values[2] *= scalar;
                values[3] *= scalar;
                values[4] *= scalar;
                values[5] *= scalar;
                values[6] *= scalar;
                values[7] *= scalar;
                values[8] *= scalar;
                values[9] *= scalar;
                values[10] *= scalar;
                values[11] *= scalar;
                values[12] *= scalar;
                values[13] *= scalar;
                values[14] *= scalar;
                values[15] *= scalar;
                return a;
            },
            determinant: function () {
                var values = this.values;

                var SubFactor00 =
                    values[10] * values[15] - values[14] * values[11];
                var SubFactor01 =
                    values[9] * values[15] - values[13] * values[11];
                var SubFactor02 =
                    values[9] * values[14] - values[13] * values[10];
                var SubFactor03 =
                    values[8] * values[15] - values[12] * values[11];
                var SubFactor04 =
                    values[8] * values[14] - values[12] * values[10];
                var SubFactor05 =
                    values[8] * values[13] - values[12] * values[9];

                var DetCof = [
                    +(values[5] * SubFactor00 - values[6] * SubFactor01 +
                        values[7] * SubFactor02),
                    -(values[4] * SubFactor00 - values[6] * SubFactor03 +
                        values[7] * SubFactor04),
                    +(values[4] * SubFactor01 - values[5] * SubFactor03 +
                        values[7] * SubFactor05),
                    -(values[4] * SubFactor02 - values[5] * SubFactor04 +
                        values[6] * SubFactor05)
                ];

                return values[0] * DetCof[0] + values[1] * DetCof[1] +
                    values[2] * DetCof[2] + values[3] * DetCof[3];
            },
            inverse: function () {
                var values = this.values;

                var Coef00 =
                    values[10] * values[15] - values[14] * values[11];
                var Coef02 =
                    values[6] * values[15] - values[14] * values[7];
                var Coef03 =
                    values[6] * values[11] - values[10] * values[7];

                var Coef04 =
                    values[9] * values[15] - values[13] * values[11];
                var Coef06 =
                    values[5] * values[15] - values[13] * values[7];
                var Coef07 =
                    values[5] * values[11] - values[9] * values[7];

                var Coef08 =
                    values[9] * values[14] - values[13] * values[10];
                var Coef10 =
                    values[5] * values[14] - values[13] * values[6];
                var Coef11 =
                    values[5] * values[10] - values[9] * values[6];

                var Coef12 =
                    values[8] * values[15] - values[12] * values[11];
                var Coef14 =
                    values[4] * values[15] - values[12] * values[7];
                var Coef15 =
                    values[4] * values[11] - values[8] * values[7];

                var Coef16 =
                    values[8] * values[14] - values[12] * values[10];
                var Coef18 =
                    values[4] * values[14] - values[12] * values[6];
                var Coef19 =
                    values[4] * values[10] - values[8] * values[6];

                var Coef20 =
                    values[8] * values[13] - values[12] * values[9];
                var Coef22 =
                    values[4] * values[13] - values[12] * values[5];
                var Coef23 =
                    values[4] * values[9] - values[8] * values[5];

                var Fac0 = [Coef00, Coef00, Coef02, Coef03];
                var Fac1 = [Coef04, Coef04, Coef06, Coef07];
                var Fac2 = [Coef08, Coef08, Coef10, Coef11];
                var Fac3 = [Coef12, Coef12, Coef14, Coef15];
                var Fac4 = [Coef16, Coef16, Coef18, Coef19];
                var Fac5 = [Coef20, Coef20, Coef22, Coef23];

                var Vec0 =
                    [values[4], values[0], values[0], values[0]];
                var Vec1 =
                    [values[5], values[1], values[1], values[1]];
                var Vec2 =
                    [values[6], values[2], values[2], values[2]];
                var Vec3 =
                    [values[7], values[3], values[3], values[3]];

                var Inv0 = [
                    Vec1[0] * Fac0[0] - Vec2[0] * Fac1[0] + Vec3[0] * Fac2[0],
                    Vec1[1] * Fac0[1] - Vec2[1] * Fac1[1] + Vec3[1] * Fac2[1],
                    Vec1[2] * Fac0[2] - Vec2[2] * Fac1[2] + Vec3[2] * Fac2[2],
                    Vec1[3] * Fac0[3] - Vec2[3] * Fac1[3] + Vec3[3] * Fac2[3]
                ];
                var Inv1 = [
                    Vec0[0] * Fac0[0] - Vec2[0] * Fac3[0] + Vec3[0] * Fac4[0],
                    Vec0[1] * Fac0[1] - Vec2[1] * Fac3[1] + Vec3[1] * Fac4[1],
                    Vec0[2] * Fac0[2] - Vec2[2] * Fac3[2] + Vec3[2] * Fac4[2],
                    Vec0[3] * Fac0[3] - Vec2[3] * Fac3[3] + Vec3[3] * Fac4[3]
                ];
                var Inv2 = [
                    Vec0[0] * Fac1[0] - Vec1[0] * Fac3[0] + Vec3[0] * Fac5[0],
                    Vec0[1] * Fac1[1] - Vec1[1] * Fac3[1] + Vec3[1] * Fac5[1],
                    Vec0[2] * Fac1[2] - Vec1[2] * Fac3[2] + Vec3[2] * Fac5[2],
                    Vec0[3] * Fac1[3] - Vec1[3] * Fac3[3] + Vec3[3] * Fac5[3]
                ];
                var Inv3 = [
                    Vec0[0] * Fac2[0] - Vec1[0] * Fac4[0] + Vec2[0] * Fac5[0],
                    Vec0[1] * Fac2[1] - Vec1[1] * Fac4[1] + Vec2[1] * Fac5[1],
                    Vec0[2] * Fac2[2] - Vec1[2] * Fac4[2] + Vec2[2] * Fac5[2],
                    Vec0[3] * Fac2[3] - Vec1[3] * Fac4[3] + Vec2[3] * Fac5[3]
                ];

                var oneOverDet = 1 /
                    (Inv0[0] * values[0] - Inv1[0] * values[1] +
                        Inv2[0] * values[2] - Inv3[0] * values[3]);
                var result = new mat4();
                var resultValues = result.values;

                resultValues[0] = Inv0[0] * oneOverDet;
                resultValues[1] = -Inv0[1] * oneOverDet;
                resultValues[2] = Inv0[2] * oneOverDet;
                resultValues[3] = -Inv0[3] * oneOverDet;

                resultValues[4] = -Inv1[0] * oneOverDet;
                resultValues[5] = Inv1[1] * oneOverDet;
                resultValues[6] = -Inv1[2] * oneOverDet;
                resultValues[7] = Inv1[3] * oneOverDet;

                resultValues[8] = Inv2[0] * oneOverDet;
                resultValues[9] = -Inv2[1] * oneOverDet;
                resultValues[10] = Inv2[2] * oneOverDet;
                resultValues[11] = -Inv2[3] * oneOverDet;

                resultValues[12] = -Inv3[0] * oneOverDet;
                resultValues[13] = Inv3[1] * oneOverDet;
                resultValues[14] = -Inv3[2] * oneOverDet;
                resultValues[15] = Inv3[3] * oneOverDet;

                return result;
            },
            add: function (m) {
                return mat4.add(this, m);
            },
            sub: function (m) {
                return mat4.sub(this, m);
            },
            div: function (m) {
                return mat4.div(this, m);
            },
            mult: function (m) {
                return mat4.mul(this, m);
            },
            equal: function (m) {
                var values = this.values;
                var mValues = m.values;

                return values[0] === mValues[0] && values[1] === mValues[1] &&
                    values[2] === mValues[2] && values[3] === mValues[3] &&
                    values[4] === mValues[4] && values[5] === mValues[5] &&
                    values[6] === mValues[6] && values[7] === mValues[7] &&
                    values[8] === mValues[8] && values[9] === mValues[9] &&
                    values[10] === mValues[10] &&
                    values[11] === mValues[11] &&
                    values[12] === mValues[12] &&
                    values[13] === mValues[13] &&
                    values[14] === mValues[14] && values[15] === mValues[15];
            },
            transpose: function () {
                var result = new mat4();
                var resultValues = result.values;
                var values = this.values;

                resultValues[0] = values[0];
                resultValues[1] = values[4];
                resultValues[2] = values[8];
                resultValues[3] = values[12];

                resultValues[4] = values[1];
                resultValues[5] = values[5];
                resultValues[6] = values[9];
                resultValues[7] = values[13];

                resultValues[8] = values[2];
                resultValues[9] = values[6];
                resultValues[10] = values[10];
                resultValues[11] = values[14];

                resultValues[12] = values[3];
                resultValues[13] = values[7];
                resultValues[14] = values[11];
                resultValues[15] = values[15];
                return result;
            },
            getDescription: function () {
                var out = this.transpose();
                var values = out.values;
                var size = 4;
                var result = '';
                for (var i = 0; i < values.length; i += 4) {
                    if (i % size === 0) {
                        result += '\n';
                    }
                    result += values[i] + ' ' + values[i + 1] + ' ' +
                        values[i + 2] + ' ' + values[i + 3];
                }
                return result;
            },
            extractEulerAngles: function () {
                var mat = new mat3();
                var matValues = mat.values;
                var values = this.values;

                matValues[0] = values[0];
                matValues[1] = values[1];
                matValues[2] = values[2];
                matValues[3] = values[4];
                matValues[4] = values[5];
                matValues[5] = values[6];
                matValues[6] = values[8];
                matValues[7] = values[9];
                matValues[8] = values[10];
                var q = quat.fromMat3(matValues);
                return q.toEulerAngles();
            },
            multiplyPoint: function (point) {
                var res4 = this.multiplyVector(new vec4(point.x, point.y, point.z, 1.0));
                return new vec3(res4.x, res4.y, res4.z);
            },
            multiplyVector: function (v) {
                var values = this.values;
                var vx = v.x;
                var vy = v.y;
                var vz = v.z;
                var vw = v.w;

                var v1 = [
                    values[0] * vx, values[1] * vx, values[2] * vx,
                    values[3] * vx
                ];
                var v2 = [
                    values[4] * vy, values[5] * vy, values[6] * vy,
                    values[7] * vy
                ];
                var v3 = [
                    values[8] * vz, values[9] * vz, values[10] * vz,
                    values[11] * vz
                ];
                var v4 = [
                    values[12] * vw, values[13] * vw, values[14] * vw,
                    values[15] * vw
                ];

                return new vec4(
                    v1[0] + v2[0] + v3[0] + v4[0], v1[1] + v2[1] + v3[1] + v4[1],
                    v1[2] + v2[2] + v3[2] + v4[2], v1[3] + v2[3] + v3[3] + v4[3]);
            },
            multiplyDirection: function (dst) {
                var res4 = this.multiplyVector(new vec4(dst.x, dst.y, dst.z, 0.0));
                return new vec3(res4.x, res4.y, res4.z);
            }
        };
        Object.defineProperty(mat4.prototype, 'description', { get: mat4.prototype.getDescription });

        mat4.identity = function () {
            return new mat4();
        };

        mat4.zero = function () {
            var a = new mat4();
            var values = a.values;
            values[0] = 0;
            values[1] = 0;
            values[2] = 0;
            values[3] = 0;
            values[4] = 0;
            values[5] = 0;
            values[6] = 0;
            values[7] = 0;
            values[8] = 0;
            values[9] = 0;
            values[10] = 0;
            values[11] = 0;
            values[12] = 0;
            values[13] = 0;
            values[14] = 0;
            values[15] = 0;

            return a;
        };

        mat4.add = function (b, c) {
            var a = new mat4();
            var aValues = a.values, bValues = b.values, cValues = c.values;

            aValues[0] = bValues[0] + cValues[0];
            aValues[1] = bValues[1] + cValues[1];
            aValues[2] = bValues[2] + cValues[2];
            aValues[3] = bValues[3] + cValues[3];

            aValues[4] = bValues[4] + cValues[4];
            aValues[5] = bValues[5] + cValues[5];
            aValues[6] = bValues[6] + cValues[6];
            aValues[7] = bValues[7] + cValues[7];

            aValues[8] = bValues[8] + cValues[8];
            aValues[9] = bValues[9] + cValues[9];
            aValues[10] = bValues[10] + cValues[10];
            aValues[11] = bValues[11] + cValues[11];

            aValues[12] = bValues[12] + cValues[12];
            aValues[13] = bValues[13] + cValues[13];
            aValues[14] = bValues[14] + cValues[14];
            aValues[15] = bValues[15] + cValues[15];

            return a;
        };

        mat4.sub = function (b, c) {
            var a = new mat4();
            var aValues = a.values, bValues = b.values, cValues = c.values;
            aValues[0] = bValues[0] - cValues[0];
            aValues[1] = bValues[1] - cValues[1];
            aValues[2] = bValues[2] - cValues[2];
            aValues[3] = bValues[3] - cValues[3];

            aValues[4] = bValues[4] - cValues[4];
            aValues[5] = bValues[5] - cValues[5];
            aValues[6] = bValues[6] - cValues[6];
            aValues[7] = bValues[7] - cValues[7];

            aValues[8] = bValues[8] - cValues[8];
            aValues[9] = bValues[9] - cValues[9];
            aValues[10] = bValues[10] - cValues[10];
            aValues[11] = bValues[11] - cValues[11];

            aValues[12] = bValues[12] - cValues[12];
            aValues[13] = bValues[13] - cValues[13];
            aValues[14] = bValues[14] - cValues[14];
            aValues[15] = bValues[15] - cValues[15];

            return a;
        };

        mat4.mul = function (b, c) {
            var a = new mat4();
            var aValues = a.values, bValues = b.values, cValues = c.values;
            aValues[0] = cValues[0] * bValues[0] + cValues[1] * bValues[4] + cValues[2] * bValues[8] + cValues[3] * bValues[12];
            aValues[1] = cValues[0] * bValues[1] + cValues[1] * bValues[5] + cValues[2] * bValues[9] + cValues[3] * bValues[13];
            aValues[2] = cValues[0] * bValues[2] + cValues[1] * bValues[6] + cValues[2] * bValues[10] + cValues[3] * bValues[14];
            aValues[3] = cValues[0] * bValues[3] + cValues[1] * bValues[7] + cValues[2] * bValues[11] + cValues[3] * bValues[15];

            aValues[4] = cValues[4] * bValues[0] + cValues[5] * bValues[4] + cValues[6] * bValues[8] + cValues[7] * bValues[12];
            aValues[5] = cValues[4] * bValues[1] + cValues[5] * bValues[5] + cValues[6] * bValues[9] + cValues[7] * bValues[13];
            aValues[6] = cValues[4] * bValues[2] + cValues[5] * bValues[6] + cValues[6] * bValues[10] + cValues[7] * bValues[14];
            aValues[7] = cValues[4] * bValues[3] + cValues[5] * bValues[7] + cValues[6] * bValues[11] + cValues[7] * bValues[15];

            aValues[8] = cValues[8] * bValues[0] + cValues[9] * bValues[4] + cValues[10] * bValues[8] + cValues[11] * bValues[12];
            aValues[9] = cValues[8] * bValues[1] + cValues[9] * bValues[5] + cValues[10] * bValues[9] + cValues[11] * bValues[13];
            aValues[10] = cValues[8] * bValues[2] + cValues[9] * bValues[6] + cValues[10] * bValues[10] + cValues[11] * bValues[14];
            aValues[11] = cValues[8] * bValues[3] + cValues[9] * bValues[7] + cValues[10] * bValues[11] + cValues[11] * bValues[15];

            aValues[12] = cValues[12] * bValues[0] + cValues[13] * bValues[4] + cValues[14] * bValues[8] + cValues[15] * bValues[12];
            aValues[13] = cValues[12] * bValues[1] + cValues[13] * bValues[5] + cValues[14] * bValues[9] + cValues[15] * bValues[13];
            aValues[14] = cValues[12] * bValues[2] + cValues[13] * bValues[6] + cValues[14] * bValues[10] + cValues[15] * bValues[14];
            aValues[15] = cValues[12] * bValues[3] + cValues[13] * bValues[7] + cValues[14] * bValues[11] + cValues[15] * bValues[15];

            return a;
        };

        mat4.div = function (m1, m2) {
            return mat4.mul(m2.inverse(), m1);
        };

        mat4.compMult = function (a, b) {
            var r = new mat4();
            var rValues = r.values, aValues = a.values, bValues = b.values;
            rValues[0] = aValues[0] * bValues[0];
            rValues[1] = aValues[1] * bValues[1];
            rValues[2] = aValues[2] * bValues[2];
            rValues[3] = aValues[3] * bValues[3];
            rValues[4] = aValues[4] * bValues[4];
            rValues[5] = aValues[5] * bValues[5];
            rValues[6] = aValues[6] * bValues[6];
            rValues[7] = aValues[7] * bValues[7];
            rValues[8] = aValues[8] * bValues[8];
            rValues[9] = aValues[9] * bValues[9];
            rValues[10] = aValues[10] * bValues[10];
            rValues[11] = aValues[11] * bValues[11];
            rValues[12] = aValues[12] * bValues[12];
            rValues[13] = aValues[13] * bValues[13];
            rValues[14] = aValues[14] * bValues[14];
            rValues[15] = aValues[15] * bValues[15];

            return r;
        };

        mat4.fromEulerX = function (angleX) {
            var cosX = Math.cos(angleX);
            var sinX = Math.sin(angleX);

            var m = new mat4();
            m.values = [1, 0, 0, 0, 0, cosX, sinX, 0, 0, -sinX, cosX, 0, 0, 0, 0, 1];

            return m;
        };
        mat4.fromEulerY = function (angleY) {
            var cosY = Math.cos(angleY);
            var sinY = Math.sin(angleY);

            var m = new mat4();
            m.values = [cosY, 0, -sinY, 0, 0, 1, 0, 0, sinY, 0, cosY, 0, 0, 0, 0, 1];

            return m;
        };
        mat4.fromEulerZ = function (angleZ) {
            var cosZ = Math.cos(angleZ);
            var sinZ = Math.sin(angleZ);

            var m = new mat4();
            m.values = [cosZ, sinZ, 0, 0, -sinZ, cosZ, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

            return m;
        };
        mat4.fromScale = function (scale) {
            var result = new mat4();
            result.values[0] = scale.x;
            result.values[5] = scale.y;
            result.values[10] = scale.z;

            return result;
        };
        mat4.fromTranslation = function (v) {
            var result = new mat4();
            result.values[12] = v.x;
            result.values[13] = v.y;
            result.values[14] = v.z;
            result.values[15] = 1.0;

            return result;
        };
        mat4.outerProduct = function (c, r) {
            var m = new mat4();
            var mValues = m.values;
            var cx = c.x, cy = c.y, cz = c.z, cw = c.w;
            var rx = r.x, ry = r.y, rz = r.z, rw = r.w;

            mValues[0] = cx * rx;
            mValues[1] = cy * rx;
            mValues[2] = cz * rx;
            mValues[3] = cw * rx;

            mValues[4] = cx * ry;
            mValues[5] = cy * ry;
            mValues[6] = cz * ry;
            mValues[7] = cw * ry;

            mValues[8] = cx * rz;
            mValues[9] = cy * rz;
            mValues[10] = cz * rz;
            mValues[11] = cw * rz;

            mValues[12] = cx * rw;
            mValues[13] = cy * rw;
            mValues[14] = cz * rw;
            mValues[15] = cw * rw;

            return m;
        };
        mat4.makeBasis = function (x, y, z) {
            var m = new mat4();
            m.column0 = new vec4(x.x, x.y, x.z, 0);
            m.column1 = new vec4(y.x, y.y, y.z, 0);
            m.column2 = new vec4(z.x, z.y, z.z, 0);

            return m;
        };

        mat4.compose = function (translation, rotation, scale) {
            return mat4.scale(mat4.mul(mat4.fromTranslation(translation), mat4.fromRotation(rotation)), scale);
        };

        mat4.fromRotation = function (rotation) {
            return mat4.fromMat3(mat3.makeFromRotation(rotation));
        };

        mat4.fromEulerAngles = function (euler) {
            return mat4.fromRotation(quat.fromEulerVec(euler));
        };

        mat4.lookAt = function (eye, center, up) {
            var f = center.sub(eye).normalize();
            var s = f.cross(up).normalize();
            var u = s.cross(f);

            var result = new mat4();
            var values = result.values;

            values[0] = s.x;
            values[4] = s.y;
            values[8] = s.z;
            values[1] = u.x;
            values[5] = u.y;
            values[9] = u.z;
            values[2] = -f.x;
            values[6] = -f.y;
            values[10] = -f.z;
            values[12] = -s.dot(eye);
            values[13] = -u.dot(eye);
            values[14] = f.dot(eye);

            return result;
        };

        mat4.orthographic = function (left, right, bottom, top, zNear, zFar) {
            var result = new mat4();

            var fmn = 1.0 / (zFar - zNear);
            var rml = 1.0 / (right - left);
            var tmb = 1.0 / (top - bottom);

            var values = result.values;

            values[0] = 2.0 * rml;
            values[5] = 2.0 * tmb;
            values[12] = -(right + left) * rml;
            values[13] = -(top + bottom) * tmb;
            values[10] = -2.0 * fmn;
            values[14] = -(zFar + zNear) * fmn;

            return result;
        };

        mat4.perspective = function (fovY, aspect, zNear, zFar) {
            const tanHalfFovy = Math.tan(fovY * 0.5);
            var result = mat4.zero();
            var values = result.values;

            var izSub = 1.0 / (zFar - zNear);

            values[0] = 1.0 / (aspect * tanHalfFovy);
            values[5] = 1.0 / (tanHalfFovy);
            values[11] = -1.0;
            values[10] = -(zFar + zNear) * izSub;
            values[14] = -(2.0 * zFar * zNear) * izSub;

            return result;
        };

        mat4.clone = function (m) {
            var cloned = new mat4();
            var values = cloned.values, mValues = m.values;
            values[0] = mValues[0];
            values[1] = mValues[1];
            values[2] = mValues[2];
            values[3] = mValues[3];
            values[4] = mValues[4];
            values[5] = mValues[5];
            values[6] = mValues[6];
            values[7] = mValues[7];
            values[8] = mValues[8];
            values[9] = mValues[9];
            values[10] = mValues[10];
            values[11] = mValues[11];
            values[12] = mValues[12];
            values[13] = mValues[13];
            values[14] = mValues[14];
            values[15] = mValues[15];

            return cloned;
        };
        mat4.fromMat3 = function (m) {
            var res = new mat4();
            var values = res.values, mValues = m.values;

            values[0] = mValues[0];
            values[1] = mValues[1];
            values[2] = mValues[2];
            values[4] = mValues[3];
            values[5] = mValues[4];
            values[6] = mValues[5];
            values[8] = mValues[6];
            values[9] = mValues[7];
            values[10] = mValues[8];

            return res;
        };
        mat4.scale = function (m, scale) {
            var res = new mat4();
            var values = res.values, mValues = m.values;
            var sx = scale.x, sy = scale.y, sz = scale.z;

            values[0] = mValues[0] * sx;
            values[1] = mValues[1] * sx;
            values[2] = mValues[2] * sx;
            values[3] = mValues[3] * sx;

            values[4] = mValues[4] * sy;
            values[5] = mValues[5] * sy;
            values[6] = mValues[6] * sy;
            values[7] = mValues[7] * sy;

            values[8] = mValues[8] * sz;
            values[9] = mValues[9] * sz;
            values[10] = mValues[10] * sz;
            values[11] = mValues[11] * sz;

            values[12] = mValues[12];
            values[13] = mValues[13];
            values[14] = mValues[14];
            values[15] = mValues[15];

            return res;
        };
    } //end with MathLib
}//mat4 end

//to-from engine math
if (script.addVec2) {
    MathLib.vec2.prototype.toEngine = function () {
        return new vec2(this.x, this.y);
    }
    MathLib.vec2.toEngine = function (v) {
        return new vec2(v.x, v.y);
    }
    MathLib.vec2.fromEngine = function (v) {
        return new MathLib.vec2(v.x, v.y);
    }
}

if (script.addVec3) {
    MathLib.vec3.prototype.toEngine = function () {
        return new vec3(this.x, this.y, this.z);
    }
    MathLib.vec3.toEngine = function (v) {
        return new vec3(v.x, v.y, v.z);
    }
    MathLib.vec3.fromEngine = function (v) {
        return new MathLib.vec3(v.x, v.y, v.z);
    }
}

if (script.addVec4) {
    MathLib.vec4.prototype.toEngine = function () {
        return new vec4(this.x, this.y, this.z, this.w);
    }
    MathLib.vec4.toEngine = function (v) {
        return new vec4(v.x, v.y, v.z, v.w);
    }
    MathLib.vec4.fromEngine = function (v) {
        return new MathLib.vec4(v.x, v.y, v.z, v.w);
    }
}

if (script.addVec4b) {
    MathLib.vec4b.prototype.toEngine = function () {
        return new vec4b(this.x, this.y, this.z, this.w);
    }
    MathLib.vec4b.toEngine = function (v) {
        return new vec4b(v.x, v.y, v.z, v.w);
    }
    MathLib.vec4b.fromEngine = function (v) {
        return new MathLib.vec4b(v.x, v.y, v.z, v.w);
    }
}

if (script.addQuat) {
    MathLib.quat.prototype.toEngine = function () {
        return new quat(this.w, this.x, this.y, this.z);
    }
    MathLib.quat.toEngine = function (q) {
        return new quat(q.w, q.x, q.y, q.z);
    }
    MathLib.quat.fromEngine = function (q) {
        return new MathLib.quat(q.w, q.x, q.y, q.z);
    }
}

if (script.addMat2) {
    MathLib.mat2.prototype.toEngine = function () {
        var mat = new mat2();
        mat.column0 = new vec2(this.values[0], this.values[1]);
        mat.column1 = new vec2(this.values[2], this.values[3]);

        return mat;
    }
    MathLib.mat2.toEngine = function (m) {
        var mat = new mat2();
        mat.column0 = new vec2(m.values[0], m.values[1]);
        mat.column1 = new vec2(m.values[2], m.values[3]);

        return mat;
    }
    MathLib.mat2.fromEngine = function (m) {
        var mat = new MathLib.mat2();
        mat.column0 = new MathLib.vec2(m.column0.x, m.column0.y);
        mat.column1 = new MathLib.vec2(m.column1.x, m.column1.y);

        return mat;
    }
}

if (script.addMat3) {
    MathLib.mat3.prototype.toEngine = function () {
        var mat = new mat3();
        mat.column0 = new vec3(this.values[0], this.values[1], this.values[2]);
        mat.column1 = new vec3(this.values[3], this.values[4], this.values[5]);
        mat.column2 = new vec3(this.values[6], this.values[7], this.values[8]);

        return mat;
    }
    MathLib.mat3.toEngine = function (m) {
        var mat = new mat3();
        mat.column0 = new vec3(m.values[0], m.values[1], m.values[2]);
        mat.column1 = new vec3(m.values[3], m.values[4], m.values[5]);
        mat.column2 = new vec3(m.values[6], m.values[7], m.values[8]);

        return mat;
    }
    MathLib.mat3.fromEngine = function (m) {
        var mat = new MathLib.mat3();
        mat.column0 = new MathLib.vec3(m.column0.x, m.column0.y, m.column0.z);
        mat.column1 = new MathLib.vec3(m.column1.x, m.column1.y, m.column1.z);
        mat.column2 = new MathLib.vec3(m.column2.x, m.column2.y, m.column2.z);

        return mat;
    }
}

if (script.addMat4) {
    MathLib.mat4.prototype.toEngine = function () {
        var mat = new mat4();
        mat.column0 = new vec4(this.values[0], this.values[1], this.values[2], this.values[3]);
        mat.column1 = new vec4(this.values[4], this.values[5], this.values[6], this.values[7]);
        mat.column2 = new vec4(this.values[8], this.values[9], this.values[10], this.values[11]);
        mat.column3 = new vec4(this.values[12], this.values[13], this.values[14], this.values[15]);

        return mat;
    }
    MathLib.mat4.toEngine = function (m) {
        var mat = new mat4();
        mat.column0 = new vec4(m.values[0], m.values[1], m.values[2], m.values[3]);
        mat.column1 = new vec4(m.values[4], m.values[5], m.values[6], m.values[7]);
        mat.column2 = new vec4(m.values[8], m.values[9], m.values[10], m.values[11]);
        mat.column3 = new vec4(m.values[12], m.values[13], m.values[14], m.values[15]);

        return mat;
    }
    MathLib.mat4.fromEngine = function (m) {
        var mat = new MathLib.mat4();
        mat.column0 = new MathLib.vec4(m.column0.x, m.column0.y, m.column0.z, m.column0.w);
        mat.column1 = new MathLib.vec4(m.column1.x, m.column1.y, m.column1.z, m.column1.w);
        mat.column2 = new MathLib.vec4(m.column2.x, m.column2.y, m.column2.z, m.column2.w);
        mat.column3 = new MathLib.vec4(m.column3.x, m.column3.y, m.column3.z, m.column3.w);

        return mat;
    }
}
//to-from engine math

