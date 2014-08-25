common = {
    geometry: {
        //returns a point in polar coordinates from base
        polar: function (base, angle, length) {
            var result = new Object();
            result.x = base.x + length * Math.cos(angle);
            result.y = base.y + length * Math.sin(angle);

            return result;
        },

        //returns distance between 2 points
        distance: function (x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        },

        //returns increased angle, starts from 0, when angle gets past full circle
        rotate: function (angle, difference) {
            angle = (angle + difference) % (2 * Math.PI);
            if (angle < 0) {
                return 2 * Math.PI + angle;
            }
            else return angle;
        }

    },
    numbers: {
        //returns integer in the interval <0, max>
        random: function (max) {
            return Math.floor(Math.random() * (max + 1));

        },
        //returns sign of the number: -1 for x < 0, 0 for x == 0 and 1 for x > 0
        sign: function (x) {
            return x > 0 ? 1 : x < 0 ? -1 : 0;
        }
    },
    object: {

        getName: function (o) {
            var funcNameRegex = /function (.{1,})\(/;
            var results = (funcNameRegex).exec((o).constructor.toString());
            return (results && results.length > 1) ? results[1] : "";
        }

    },
    array: {

        process: function (a, callback) {
            var l = a.length;
            for (i = 0; i < l; i++) {
                callback(a[0]);
            }
        }

    }

}
