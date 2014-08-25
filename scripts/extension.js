

(function () {
    Kinetic.Point = function (config) {
        this.initPoint(config);
    };

    Kinetic.Point.prototype = {
        initPoint: function (config) {
            Kinetic.Shape.call(this, config);
        },
        isAbove: function (anotherPoint) {
            //console.log(this.getAbsolutePosition().y.toString() + "=" + anotherPoint.getAbsolutePosition().y.toString() + ":" + (this.getAbsolutePosition().y == anotherPoint.getAbsolutePosition().y + constants.partSize));
            return (this.getAbsolutePosition().y === anotherPoint.getAbsolutePosition().y - constants.partSize && this.getAbsolutePosition().x === anotherPoint.getAbsolutePosition().x);
        },
        isBelow: function (anotherPoint) {
            return (this.getAbsolutePosition().y === anotherPoint.getAbsolutePosition().y + constants.partSize && this.getAbsolutePosition().x === anotherPoint.getAbsolutePosition().x);
        },
        isNextTo: function (anotherPoint) {
            return Math.abs(this.getAbsolutePosition().x - anotherPoint.getAbsolutePosition().x) === constants.partSize && this.getAbsolutePosition().y === anotherPoint.getAbsolutePosition().y;
        },
        overlaps: function (anotherPoint) {
            return this.getAbsolutePosition().x === anotherPoint.getAbsolutePosition().x && this.getAbsolutePosition().y === anotherPoint.getAbsolutePosition().y;
        },
        getRoundPosition: function () {
            var pos = this.getAbsolutePosition();
            pos.x = Math.round(pos.x);
            pos.y = Math.round(pos.y);
            return pos;
        }
    };

    Kinetic.Util.extend(Kinetic.Point, Kinetic.Shape);

}());

(function () {
    Kinetic.TetrisPart = function (config) {
        this.initTetrisPart(config);
        this.className="TetrisPart";
    };

    Kinetic.TetrisPart.prototype = {
        initTetrisPart: function (config) {
            Kinetic.Rect.call(this, config);
        },
        isAbove: function (anotherPart) {
            return (this.getRoundPosition().y === anotherPart.getRoundPosition().y - constants.partSize && this.getRoundPosition().x === anotherPart.getRoundPosition().x);
        },
        isBelow: function (anotherPart) {
            return (this.getRoundPosition().y === anotherPart.getRoundPosition().y + constants.partSize && this.getRoundPosition().x === anotherPart.getRoundPosition().x);
        },
        isNextTo: function (anotherPart) {
            return Math.abs(this.getRoundPosition().x - anotherPart.getRoundPosition().x) === constants.partSize && this.getRoundPosition().y === anotherPart.getRoundPosition().y;
        },
        overlaps: function (anotherPart) {
            return this.getRoundPosition().x === anotherPart.getRoundPosition().x && this.getRoundPosition().y === anotherPart.getRoundPosition().y;
        },
        getRoundPosition: function () {
            var pos = this.getAbsolutePosition();
            pos.x = Math.round(pos.x);
            pos.y = Math.round(pos.y);
            return pos;
        }

    };

    Kinetic.Util.extend(Kinetic.TetrisPart, Kinetic.Rect);

}());
