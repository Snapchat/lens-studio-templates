// PositionBasedDynamicsHelpers.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: A Helper script that contains simple classes used for the position based dynamics simultaion

var Point = function (invMass, pos) {
    this.invMass = invMass;
    this.pos = pos;
    this.oldPos = pos;
}

Point.prototype.update = function (dt, acc) {
    if (this.invMass > 0.0) {
        var tmp = this.pos;
        this.pos = this.pos.add(this.pos.sub(this.oldPos)).add(acc.uniformScale(dt * dt));
        this.oldPos = tmp;
    }
}

Point.prototype.getPosition = function () { return this.pos }

Point.prototype.getInverseMass = function () { return this.invMass }

Point.prototype.addPosition = function (deltaPos, isForce) {
    if (this.invMass > 0.0 || isForce) {
        this.pos = this.pos.add(deltaPos);
    }
}

Point.prototype.setPosition = function (newPos) {
    this.oldPos = this.pos;
    this.pos = newPos;
}

global.Point = Point;



var Constraint = function (p0, p1, s, isRigid) {
    this.particle0 = p0;
    this.particle1 = p1;
    this.restLength = p0.getPosition().distance(p1.getPosition());
    this.stiffness = s;
    this.isRigid = isRigid;
}


Constraint.prototype.solve = function () {
    var invMass0 = this.particle0.getInverseMass();
    var invMass1 = this.particle1.getInverseMass();
    var sumMass = invMass0 + invMass1;
    var sumMass = this.particle0.getInverseMass() + this.particle1.getInverseMass();
    if (sumMass == 0) {
        return; //both static
    }
    var diff = this.particle0.getPosition().sub(this.particle1.getPosition());
    var distance = diff.length;
    var constraint = distance - this.restLength;
    var correction = diff.normalize().uniformScale(- this.stiffness * constraint / sumMass);
    if (this.isRigid) {
        this.particle1.addPosition(correction.uniformScale(-sumMass));
    }
    else {
        this.particle0.addPosition(correction.uniformScale(invMass0));
        this.particle1.addPosition(correction.uniformScale(-invMass1));
    }
}
global.Constraint = Constraint;

