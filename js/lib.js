(function(d3, _) {

    "use strict";

    function Map(data, grid, color) {

        this.data = data;
        this.grid = grid;
        this.color = color;

        this.plots = null;
        this.dataCells = [];

        this.circleFill = "#FFF";
        this.circleStroke = "#000";
        this.circleStrokeWidth = 10;
        this.circleRadius = 30;

        this.direction = {
            "left": 0,
            "right": 1,
        };
    }

    Map.prototype.init = function() {

        this.dataCells = _.map(this.data, this.forEachStation.bind(this));

        //_.each(this.dataCells, this.setDiagonalLine.bind(this));
        _.each(this.dataCells, this.setCellPolyline.bind(this));
        _.each(this.dataCells, this.setCellCircle.bind(this));
    };

    Map.prototype.forEachStation = function(station) {
        station.element = this.grid.svg.select("#" + this.grid.cellClass + String(station.position.x) + String(station.position.y));
        return station;
    };

    Map.prototype.setCellCircle = function(cell) {
        cell.element.append("circle")
            .attr("cx", this.grid.getObjectXpos)
            .attr("cy", this.grid.getObjectYpos)
            .attr("r", this.circleRadius)
            .style("fill", this.circleFill)
            .style("stroke", this.circleStroke)
            .style("stroke-width", this.circleStrokeWidth)
            .attr("transform", this.getCircleTranslateCenter);
    };

    Map.prototype.setDiagonalLine = function(cell) {
        cell.element.append("line")
            .attr('x1', this.getLineXone.bind(this, cell))
            .attr('x2', this.getLineXtwo.bind(this, cell))
            .attr('y1', this.getLineYone.bind(this, cell))
            .attr('y2', this.getLineYtwo.bind(this, cell))
            .style('stroke', this.color)
            .style('stroke-width', 10)
    };

    Map.prototype.setCellPolyline = function(cell) {
        cell.element.append("polyline")
            .style("stroke", "black")
            .style("fill", "none")
            .style("stroke-width", 10)
            .attr("points", this.getLinePoints.bind(this, cell));
    };

    Map.prototype.getLinePoints = function(cell, data) {
        var x = [data.x, data.y + data.height];
        var y = [data.x + data.width, data.y];
        return x.join(", ") + " " + y.join(", ");
    }

    Map.prototype.getLineYone = function(cell, data) {
        if (!this.direction[cell.direction])
            return data.y + data.height;
        return data.y;
    };

    Map.prototype.getLineYtwo = function(cell, data) {
        if (!this.direction[cell.direction])
            return data.y;
        return data.y + data.height;
    };

    Map.prototype.getLineXone = function(cell, data) {
        return data.x;
    };

    Map.prototype.getLineXtwo = function(cell, data) {
        return data.x + data.width;
    };

    Map.prototype.getCircleTranslateCenter = function(data) {
        return "translate(" + data.width / 2 + "," + data.height / 2 + ")";
    };

    var app = new Map(window.Red, window.Map.Grid, "#EA4335");
    app.init();

})(d3, _);
