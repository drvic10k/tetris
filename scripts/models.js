models = {
    canvas: {
        stage: Kinetic.Stage,
        layer: Kinetic.Layer,
        create: function (id) {

            models.canvas.stage = new Kinetic.Stage({
                container: id,
                width: constants.widthTiles * constants.partSize,
                height: constants.heightTiles * constants.partSize
            });
            models.canvas.layer = new Kinetic.Layer();
            models.canvas.stage.add(models.canvas.layer);

            var border = new Kinetic.Rect({
                x: 0,
                y: 0,
                width: models.canvas.stage.attrs.width,
                height: models.canvas.stage.attrs.height,
                stroke: 'black',
                strokeWidth: 1
            });
            var l = new Kinetic.Layer();
            l.add(border);
            models.canvas.stage.add(l);

        }
    },
    session: {
        self: this,
        debris: {},
        score: {},
        downTimeOut: {},
        keyTimeOut: {},
        deferRotateTimeOut: {},
        create: function () {

            clearTimeout(self.downTimeOut);
            clearTimeout(self.keyTimeOut);
            clearTimeout(self.deferRotateTimeOut);
            models.canvas.layer.destroyChildren();
            self = this;
            self.debris = new models.debris();
            self.score = new models.score();
            self.block = {};
            (self.spawnBlock = function () {

                self.block = new models.block();

            })();

            models.canvas.layer.add(self.debris.group);

            (self.progress = function () {

                if (self.block != undefined) {

                    self.downTimeOut = setTimeout(function () {

                        self.progress();

                    }, 1000);

                    self.block.move(0, 1);
                }

            })();

            self.deferRotate = false;

            (self.queryKey = function () {

                if (self.block != undefined) {

                    var delay = 100;

                    if (key.isPressed(37)) {
                        models.session.moveBlock(-1, 0);
                    }
                    if (key.isPressed(39)) {
                        models.session.moveBlock(1, 0);
                    }
                    if (key.isPressed(40)) {
                        models.session.moveBlock(0, 1);
                        delay = 30;
                    }
                    if (key.isPressed(38)) {

                        if (!self.deferRotate) {
                            self.deferRotate = true;
                            self.deferRotateTimeOut = setTimeout(function () {
                                self.deferRotate = false;
                            }, 200);
                            models.session.rotateBlock();
                        }

                    }

                    self.keyTimeOut = setTimeout(function () {

                        self.queryKey();

                    }, delay);

                }

            })();

        },
        moveBlock: function (x, y) {
            if (self.block != undefined) { self.block.move(x, y); }
        },
        rotateBlock: function (x, y) {
            if (self.block != undefined) { self.block.rotate(); }
        }

    },
    score: function () {

        var self = this;
        self.score = ko.observable(0);
        self.increase = function (rows) {
            self.score(self.score() + 100 * rows.length);
        }

    },
    debris: function () {
        var self = this;
        self.layer = models.canvas.layer;
        var borderTile = new Kinetic.TetrisPart({
            x: 0,
            y: 0,
            name: "TetrisPart"
        });

        self.group = new Kinetic.Group({
            x: 0,
            y: 0
        });

        for (var i = 0; i < constants.widthTiles ; i++) {
            self.group.add(borderTile.clone({ x: (i + 0.5) * constants.partSize, y: (constants.heightTiles + 0.5) * constants.partSize }));
        }

        self.acceptBlock = function (block) {

            common.array.process(block.group.children, function (b) {

                var abs = b.getAbsolutePosition();
                b.setX(abs.x);
                b.setY(abs.y);
                b.moveTo(self.group);
            });

            block.layer.draw();
            var full = self.fullRows();
            models.session.score.increase(full);
            self.removeRows(full);
        };
        self.insidePoints = function () {
            return self.group.find('.TetrisPart');
        }

        self.row = function (index) {
            var result = [];
            self.insidePoints().each(function (shape) {

                if (shape.getAbsolutePosition().y == (index + 0.5) * constants.partSize) {
                    result.push(shape);
                }

            })

            return result;
        }

        self.fullRows = function () {
            var result = [];
            for (i = 0; i < constants.heightTiles ; i++) {
                var row = self.row(i);
                if (row.length == constants.widthTiles) {
                    result.push(i);
                }
            }
            return result;
        }

        self.removeRows = function (indices) {

            for (i in indices) {

                var row = self.row(indices[i]);
                for (s in row) {

                    row[s].destroy();

                }

                self.layer.draw();

                for (var j = indices[i]; j >= 0; j--) {

                    var row = self.row(j);
                    for (s in row) {

                        row[s].setY(row[s].attrs.y + constants.partSize);

                    }

                }

                self.layer.draw();

            }

        }

    },
    block: function () {
        var self = this;
        self.typeIndex = common.numbers.random(6);

        switch (self.typeIndex) {
            case 0:
                self.type = models.blockType.S;
                break;
            case 1:
                self.type = models.blockType.Z;
                break;
            case 2:
                self.type = models.blockType.I;
                break;
            case 3:
                self.type = models.blockType.L;
                break;
            case 4:
                self.type = models.blockType.J;
                break;
            case 5:
                self.type = models.blockType.O;
                break;
            case 6:
                self.type = models.blockType.T;
                break;
        }

        self.shape = [];
        self.center = { x: 0, y: 0 };
        self.group = new Kinetic.Group({
            x: 0,
            y: 0
        });
        self.layer = models.canvas.layer;
        self.rotation = common.numbers.random(3) * 90;
        self.rotateSwitch = 1;
        self.group.rotateDeg(self.rotation);
        models.canvas.layer.add(self.group);

        self.centerPoint = function () {

            return self.group.find('.center')[0];

        }

        self.insidePoints = function () {

            return self.group.find('.TetrisPart');

        }

        ; (self.generateShape = function () {

            var part = new Kinetic.TetrisPart({
                x: constants.partSize / 2,
                y: constants.partSize / 2,
                width: constants.partSize,
                height: constants.partSize,
                offsetX: constants.partSize / 2,
                offsetY: constants.partSize / 2,
                fill: 'green',
                stroke: 'black',
                strokeWidth: 2,
                name: 'TetrisPart'
            });

            //var insidePoint = new Kinetic.Point({
            //    x: 0,
            //    y: 0,
            //    name: "insidePoint"
            //});

            var addPart = function (offset, array) {

                var thisPart = part.clone({ x: offset.x + constants.partSize / 2, y: offset.y + constants.partSize / 2 });
                array.push(thisPart);

                //array.push(borderPoint.clone({ x: thisPart.attrs.x, y: thisPart.attrs.y }));
                //array.push(borderPoint.clone({ x: thisPart.attrs.x + thisPart.attrs.width, y: thisPart.attrs.y }));
                //array.push(borderPoint.clone({ x: thisPart.attrs.x + thisPart.attrs.width, y: thisPart.attrs.y + thisPart.attrs.height }));
                //array.push(borderPoint.clone({ x: thisPart.attrs.x, y: thisPart.attrs.y + thisPart.attrs.height }));

                //array.push(insidePoint.clone({ x: thisPart.attrs.x + thisPart.attrs.width / 2, y: thisPart.attrs.y + thisPart.attrs.height / 2 }));

                //array.push(insidePoint.clone({ x: thisPart.attrs.x, y: thisPart.attrs.y }));

            }

            switch (self.type) {
                case models.blockType.S:

                    self.center = { x: 1.5 * constants.partSize, y: constants.partSize };
                    addPart({ x: 2 * constants.partSize - self.center.x, y: -self.center.y }, self.shape);
                    addPart({ x: constants.partSize - self.center.x, y: -self.center.y }, self.shape);
                    addPart({ x: constants.partSize - self.center.x, y: constants.partSize - self.center.y }, self.shape);
                    addPart({ x: -self.center.x, y: constants.partSize - self.center.y }, self.shape);
                    break;

                case models.blockType.Z:
                    self.center = { x: 1.5 * constants.partSize, y: constants.partSize };
                    addPart({ x: -self.center.x, y: -self.center.y }, self.shape);
                    addPart({ x: constants.partSize - self.center.x, y: -self.center.y }, self.shape);
                    addPart({ x: constants.partSize - self.center.x, y: constants.partSize - self.center.y }, self.shape);
                    addPart({ x: 2 * constants.partSize - self.center.x, y: constants.partSize - self.center.y }, self.shape);
                    break;

                case models.blockType.I:
                    self.center = { x: 0.5 * constants.partSize, y: 2 * constants.partSize };
                    addPart({ x: -self.center.x, y: -self.center.y }, self.shape);
                    addPart({ x: -self.center.x, y: constants.partSize - self.center.y }, self.shape);
                    addPart({ x: -self.center.x, y: 2 * constants.partSize - self.center.y }, self.shape);
                    addPart({ x: -self.center.x, y: 3 * constants.partSize - self.center.y }, self.shape);
                    break;

                case models.blockType.L:
                    self.center = { x: constants.partSize, y: 1.5 * constants.partSize };
                    addPart({ x: -self.center.x, y: -self.center.y }, self.shape);
                    addPart({ x: -self.center.x, y: constants.partSize - self.center.y }, self.shape);
                    addPart({ x: -self.center.x, y: 2 * constants.partSize - self.center.y }, self.shape);
                    addPart({ x: constants.partSize - self.center.x, y: 2 * constants.partSize - self.center.y }, self.shape);
                    break;

                case models.blockType.J:
                    self.center = { x: constants.partSize, y: 1.5 * constants.partSize };
                    addPart({ x: constants.partSize - self.center.x, y: -self.center.y }, self.shape);
                    addPart({ x: constants.partSize - self.center.x, y: constants.partSize - self.center.y }, self.shape);
                    addPart({ x: constants.partSize - self.center.x, y: 2 * constants.partSize - self.center.y }, self.shape);
                    addPart({ x: -self.center.x, y: 2 * constants.partSize - self.center.y }, self.shape);
                    break;

                case models.blockType.O:
                    self.center = { x: constants.partSize, y: constants.partSize };
                    addPart({ x: -self.center.x, y: -self.center.y }, self.shape);
                    addPart({ x: constants.partSize - self.center.x, y: -self.center.y }, self.shape);
                    addPart({ x: constants.partSize - self.center.x, y: constants.partSize - self.center.y }, self.shape);
                    addPart({ x: -self.center.x, y: constants.partSize - self.center.y }, self.shape);
                    break;

                case models.blockType.T:
                    self.center = { x: 1.5 * constants.partSize, y: constants.partSize };
                    addPart({ x: constants.partSize - self.center.x, y: -self.center.y }, self.shape);
                    addPart({ x: -self.center.x, y: constants.partSize - self.center.y }, self.shape);
                    addPart({ x: constants.partSize - self.center.x, y: constants.partSize - self.center.y }, self.shape);
                    addPart({ x: 2 * constants.partSize - self.center.x, y: constants.partSize - self.center.y }, self.shape);
                    break;

            }

            self.shape.push(new Kinetic.Point({ x: self.center.x, y: self.center.y, name: 'center' }));

        })();

        self.alignToGrid = function () {
            if (Math.round(self.centerPoint().getAbsolutePosition().y / 10) * 10 % 20 != 0) {
                self.group.move({ y: 0.5 * constants.partSize });
            }
            if (Math.round(self.centerPoint().getAbsolutePosition().x / 10) * 10 % 20 != 0) {
                self.group.move({ x: 0.5 * constants.partSize * self.rotateSwitch });
                self.rotateSwitch = -1 * self.rotateSwitch;
            }
        }

        ; (self.draw = function () {

            for (var s in self.shape) {
                self.group.add(self.shape[s]);
            }
            self.group.attrs.x = models.canvas.stage.attrs.width / 2;
            self.alignToGrid(self.group);
            self.layer.draw();

        })();

        self.erase = function () {
            self.group.removeChildren();
            self.layer.draw();
        }

        self.delete = function () {
            self.group.destroy();
        }

        self.move = function (x, y) {
            self.group.move({ x: x * constants.partSize, y: y * constants.partSize });
            self.restrainEdges()
            self.checkBottom();
            self.layer.draw();
        }

        self.rotate = function () {
            self.group.rotateDeg(-90);
            self.alignToGrid(self.group);
            self.restrainEdges();
            self.layer.draw();
        }

        self.restrainEdges = function () {

            //self.borderPoints().each(function (shape) {

            //    if (shape.getAbsolutePosition().x < 0) {
            //        self.group.move({ x: -shape.getAbsolutePosition().x });
            //        self.layer.draw();
            //    }

            //    if (shape.getAbsolutePosition().x > models.canvas.stage.attrs.width) {
            //        self.group.move({ x: models.canvas.stage.attrs.width - shape.getAbsolutePosition().x });
            //        self.layer.draw();
            //    }

            //    if (shape.getAbsolutePosition().y > models.canvas.stage.attrs.height) {
            //        self.group.move({ y: models.canvas.stage.attrs.height - shape.getAbsolutePosition().y });
            //        self.layer.draw();
            //        self.checkBottom();
            //    }

            //});

            self.insidePoints().each(function (shape) {

                if (shape.getAbsolutePosition().x < 0) {
                    self.group.move({ x: -shape.getAbsolutePosition().x * 2 });
                    self.layer.draw();
                }

                if (shape.getAbsolutePosition().x > models.canvas.stage.attrs.width) {
                    self.group.move({ x: (models.canvas.stage.attrs.width - shape.getAbsolutePosition().x) * 2 });
                    self.layer.draw();
                }

                models.session.debris.insidePoints().each(function (debrisShape) {

                    if (shape.overlaps(debrisShape)) {

                        self.group.move({ x: constants.partSize * common.numbers.sign(self.centerPoint().getAbsolutePosition().x - debrisShape.getAbsolutePosition().x) });
                        self.layer.draw();

                    }

                });

                //if (shape.getAbsolutePosition().y > models.canvas.stage.attrs.height) {
                //    self.group.move({ y: models.canvas.stage.attrs.height - shape.getAbsolutePosition().y });
                //    self.layer.draw();
                //    self.checkBottom();
                //}

            });

            //self.insidePoints().some(function (shape) {

            //    return models.session.debris.insidePoints().some(function (debrisShape) {

            //        if (shape.overlaps(debrisShape)) {

            //            return true;

            //        }

            //    });
            //});

        }

        self.checkBottom = function () {

            //if (!self.borderPoints().some(function (shape) {

            //      if (shape.getAbsolutePosition().y == models.canvas.stage.attrs.height) {

            //          models.session.debris.acceptBlock(self);
            //          models.session.spawnBlock();
            //          return true;

            //}

            //})) {

            self.insidePoints().some(function (shape) {

                return models.session.debris.insidePoints().some(function (debrisShape) {

                    if (shape.isAbove(debrisShape)) {

                        models.session.debris.acceptBlock(self);
                        models.session.spawnBlock();
                        return true;

                    }

                });
            });
            //}

        }


    },
    blockType: {

        S: 0,
        Z: 1,
        I: 2,
        L: 3,
        J: 4,
        O: 5,
        T: 6

    }


}