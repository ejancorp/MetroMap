(function() {

  'use strict'

  var Map = function(element, data) {

    this.element = element;
    this.data = data;
    this.svg = null;

    this.metroRedKey = 'red';

    this.height = 200;
    this.width = 500;

    this.circle = {
      xaxis: 60,
      yaxis: 60,
      radius: 30,
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 7
    };

    this.line = {
      fill: '#fff',
      stroke: '#E10031',
      strokeWidth: 7
    }

    this.fill = '#000';
    this.stroke = '#000';
    this.strokeWidth = 20;
    this.fontFamily = '\'Open Sans\', sans-serif';
    this.fontWeightBold = 'bold';
  };

  Map.prototype.init = function() {

    this.svg = d3.select('#map').append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      //.attr('transform', 'rotate(90)')
      .selectAll('g')
      .data(this.getMetroRed())
      .enter().append('g')
      .attr('transform', function(d, i) {
        document.querySelector(this.element).getElementsByTagName('svg')[0].setAttribute('height', i * 125);
        return 'translate(0,' + i * 120 + ')';
      }.bind(this));

    this.setStationName().setPreviousLine().setNextLine();
    this.setCircles();

    this.svg.append('g');
  };

  Map.prototype.getMetroRed = function() {
    return this.data[this.metroRedKey].map(this.getStationNameFromObject);
  };

  Map.prototype.setCircles = function() {
    this.svg.append('circle')
      .attr('cx', this.circle.xaxis)
      .attr('cy', this.circle.yaxis)
      .attr('r', this.circle.radius)
      .style('fill', this.circle.fill)
      .style('stroke', this.circle.stroke)
      .style('stroke-width', this.circle.strokeWidth)
    return this;
  };

  Map.prototype.setStationName = function() {
    this.svg.append('text')
      .attr('x', 100)
      .attr('y', 50)
      .attr('dy', '1em')
      .attr('font-size', '11px')
      .attr('font-family', this.fontFamily)
      .attr('font-weight', this.fontWeightBold)
      .style('fill', this.fill)
      .text(String);
    return this;
  };

  Map.prototype.setPreviousLine = function() {
    this.svg.append('line')
      .attr('x1', 60)
      .attr('x2', 60)
      .attr('y1', 27)
      .attr('y2', 0)
      .style('fill', this.line.fill)
      .attr('stroke', this.line.stroke)
      .attr('stroke-width', this.line.strokeWidth);
    return this;
  };

  Map.prototype.setNextLine = function() {
    this.svg.append('line')
      .attr('x1', 60)
      .attr('x2', 60)
      .attr('y1', 93)
      .attr('y2', 120)
      .style('fill', this.line.fill)
      .attr('stroke', this.line.stroke)
      .attr('stroke-width', this.line.strokeWidth);
    return this;
  };

  Map.prototype.getStationNameFromObject = function(station) {
    return String(station.name).toUpperCase();
  };

  var app = new Map('#map', window.Metro);
  app.init();

})();
