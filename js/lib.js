(function(d3, _) {

  "use strict";

  function Map(data, grid, color) {

    this.data = data;
    this.grid = grid;
    this.color = color;

    this.plots = null;
    this.dataCells = [];

    this.circleFill = this.color;
    this.circleStroke = "#FFF";
    this.circleStrokeWidth = 5;
    this.circleRadius = 30;

    this.lineStrokeWidth = 20;
    this.lineFill = "none";

    this.fontFamily = '\'Open Sans\', sans-serif';
    this.fontWeightBold = 'bold';
    this.fontFill = "#FFF";
    this.fontSize = "35px";

    this.altFontSize = "20px";
    this.altFontFill = "#000";
    this.altFontWeightBold = "bolder";

    this.direction = {
      "left": 0,
      "right": 1,
      "vertical": 2,
      "horizontal": 3,
    };

    this.curve = {
      "top": 0,
      "left": 1,
      "bottom": 2,
      "right": 3,
      "bottomRight": 4
    };
  }

  Map.prototype.init = function() {

    this.dataCells = _.map(this.data, this.forEachStation.bind(this));

    _.each(this.dataCells, this.setCellPolyline.bind(this));
    _.each(this.dataCells, this.setCellCircle.bind(this));
    _.each(this.dataCells, this.setStationNumber.bind(this));
    _.each(this.dataCells, this.setStationName.bind(this));
    _.each(this.dataCells, this.setStationClickEvent.bind(this));
  };

  Map.prototype.forEachStation = function(station) {
    station.pulse = false;
    station.element = this.grid.svg.select("#" + this.grid.cellClass + String(station.position.x) + String(station.position.y));
    return station;
  };

  Map.prototype.setStationNumber = function(cell) {
    cell.element.append("text")
      .attr('x', this.grid.getObjectXpos)
      .attr('y', this.grid.getObjectYpos)
      .attr('font-size', this.fontSize)
      .attr('font-family', this.fontFamily)
      .attr('font-weight', this.fontWeightBold)
      .style('fill', this.fontFill)
      .text(this.getStationNumber.bind(this, cell))
      .attr('transform', this.getNumberTransformTranslate);
  };

  Map.prototype.setStationName = function(cell) {
    cell.element.append("text")
      .attr('x', this.grid.getObjectXpos)
      .attr('y', this.grid.getObjectYpos)
      .attr('font-size', this.altFontSize)
      .attr('font-family', this.fontFamily)
      .attr('font-weight', this.altFontWeightBold)
      .style('fill', this.altFontFill)
      .text(this.getStationName.bind(this, cell))
      .attr('transform', this.getNameTransformTranslate.bind(this, cell));
  };

  Map.prototype.setCellCircle = function(cell) {
    cell.element.append("circle")
      .attr("cx", this.grid.getObjectXpos)
      .attr("cy", this.grid.getObjectYpos)
      .attr("r", this.circleRadius)
      .style("fill", this.circleFill)
      .style("stroke", this.circleStroke)
      .style("stroke-width", this.circleStrokeWidth)
      .attr("transform", this.getCircleTranslateCenter)
      .style('visibility', function(d) {
        return cell.name ? 'visible' : 'hidden';
      });
  };

  Map.prototype.setCellPolyline = function(cell) {
    cell.element.append("polyline")
      .style('stroke', this.color)
      .style('fill', this.lineFill)
      .style('stroke-width', this.lineStrokeWidth)
      .attr("points", this.getLinePoints.bind(this, cell))
  };

  Map.prototype.setStationClickEvent = function(cell) {
    cell.element.select("circle")
      .on("click", function(d) {
        d.pulse = !d.pulse;
        if (d.pulse) {
          
        }
      });
  };

  Map.prototype.getStationNumber = function(cell, data) {
    return cell.number;
  };

  Map.prototype.getStationName = function(cell, data) {
    return cell.name;
  };

  Map.prototype.getNumberTransformTranslate = function(data) {
    return "translate(" + ((data.width / 2) - 20) + "," + ((data.height / 2) + 12) + ")";
  }

  Map.prototype.getNameTransformTranslate = function(cell, data) {
    var width = data.width;

    if (!this.direction[cell.direction])
      width = 0 - (data.width * 2);

    if (this.direction[cell.direction] === this.direction.vertical)
      width = 0 - (data.width * 2);

    return "translate(" + width + "," + (data.height / 2) + ")";
  }

  Map.prototype.getLinePoints = function(cell, data) {
    var x, y, z = [];
    switch (this.curve[cell.curve]) {
      case this.curve.top:
        x = [data.x, data.y];
        y = [data.x + (data.width / 2), data.y + (data.height / 2)];
        z = [data.x + data.width, data.y];
        return x.join(", ") + " " + y.join(", ") + " " + z.join(", ");
        break;
      case this.curve.left:
        x = [data.x, data.y];
        y = [data.x + (data.width / 2), data.y + (data.height / 2)];
        z = [data.x, data.y + data.height];
        return x.join(", ") + " " + y.join(", ") + " " + z.join(", ");
        break;
      case this.curve.bottom:
        x = [data.x, data.y + data.height];
        y = [data.x + (data.width / 2), data.y + (data.height / 2)];
        z = [data.x + data.width, data.y + data.height];
        return x.join(", ") + " " + y.join(", ") + " " + z.join(", ");
        break;
      case this.curve.right:
        x = [data.x + data.width, data.y];
        y = [data.x + (data.width / 2), data.y + (data.height / 2)];
        z = [data.x + data.width, data.y + data.height];
        return x.join(", ") + " " + y.join(", ") + " " + z.join(", ");
        break;
      case this.curve.bottomRight:
        x = [data.x + data.width, data.y];
        y = [data.x + (data.width / 2), data.y + (data.height / 2)];
        z = [data.x + (data.width / 2), data.y + data.height];
        return x.join(", ") + " " + y.join(", ") + " " + z.join(", ");
        break;
      default:

        if (this.direction[cell.direction]) {
          x = [data.x, data.y]
          y = [data.x + data.width, data.y + data.height];
        } else {
          x = [data.x, data.y + data.height];
          y = [data.x + data.width, data.y]
        }

        switch (this.direction[cell.direction]) {
          case this.direction.left:
            x = [data.x, data.y + data.height];
            y = [data.x + data.width, data.y]
            break;
          case this.direction.right:
            x = [data.x, data.y]
            y = [data.x + data.width, data.y + data.height];
            break;
          case this.direction.vertical:
            x = [data.x + (data.width / 2), data.y]
            y = [data.x + (data.width / 2), data.y + data.height];
            break;
          case this.direction.horizontal:
            x = [data.x, data.y]
            y = [data.x + data.width, data.y + data.height];
            break;
          default:

        }

        return x.join(", ") + " " + y.join(", ")
        break;
    }
  };

  Map.prototype.getCircleTranslateCenter = function(data) {
    return "translate(" + data.width / 2 + "," + data.height / 2 + ")";
  };

  var RedLine = new Map(window.Red, window.Map.Grid, "#DA262F");
  RedLine.init();

  var GreenLine = new Map(window.Green, window.Map.Grid, "#45A247");
  GreenLine.init();

})(d3, _);
