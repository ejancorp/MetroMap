(function(d3, _) {

  "use strict";

  function Map(data, grid) {

    this.data = data;
    this.grid = grid;

    this.plots = null;
    this.dataCells = [];
  }

  Map.prototype.init = function() {

    this.dataCells = _.map(this.data, this.forEachStation.bind(this));

    _.each(this.dataCells, this.setCellCircle.bind(this));
  };

  Map.prototype.forEachStation = function(station) {
    station.element = this.grid.svg.select("#" + this.grid.cellClass + String(station.position.x) + String(station.position.y));
    return station;
  };

  Map.prototype.setCellCircle = function(cell) {
    console.log(cell.element);
    cell.element
      .append("circle")
      .attr("cx", 60)
      .attr("cy", 60)
      .attr("r", 30)
      .style("fill", "#000")
      .style("stroke", "#000")
      .style("stroke-width", 20)
  };

  var app = new Map(window.Red, window.Map.Grid);
  app.init();

})(d3, _);
