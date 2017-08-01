(function(d3, _) {

  'use strict';

  var Strategy = {
    red: [

      function(d, i, s) {
        return this.setTranslatePosition({
          xpos: (this.width * s.length) - ((i + 1) * this.width),
          ypos: (this.height * s.length) - ((i + 1) * this.height)
        });
      },
      function(d, i, s) {
        return this.setTranslatePosition({
          xpos: (this.width * s.length) - ((i + 1) * this.width),
          ypos: i * this.height,
        });
      },
      function(d, i, s) {
        return this.setTranslatePosition({
          xpos: (this.width * s.length) - ((i + 1) * this.width),
          ypos: i * this.height,
        });
      },

    ],
  };

  var Map = function(element, data, options) {

    this.element = element;
    this.data = data;
    this.options = options;

    this.svg = null;
    this.height = 120;
    this.width = 120;

  };

  Map.prototype = {

    init: function() {

      this.setSvg();
      this.countStations();
      this.discoverLines();
      this.setData();
    },

    setSvg: function() {
      this.svg = d3.select(this.element)
        .append("svg")
        .attr("height", this.height * this.countStations())
        .attr("width", this.width * this.countStations());
    },

    setData: function() {
      this.discoverLines().forEach(function(v) {
        this.data[v].forEach(function(value, index) {

          var station = this.svg.selectAll('g')
            .data(value)
            .enter()
            .append('g')
            .attr('transform', Strategy[v][index].bind(this));

          this.setCircles(v, station);

        }.bind(this));
      }.bind(this));

      this.svg.append('g');
    },

    setCircles: function(value, station) {
      var options = this.getOptionAttr(value, "circle");
      station.append('circle')
        .attr("cx", options.attr.cx)
        .attr("cy", options.attr.cy)
        .attr("r", options.attr.r)
        .style("fill", options.style.fill)
        .style("stroke", options.style.stroke)
        .style("stroke-width", options.style.strokeWidth)
    },

    getOptionAttr: function(line, shape) {
      return this.options[line][shape];
    },

    getOption: function(value, shape, key) {
      return this.options[value][shape][key];
    },

    setTranslatePosition: function(coords) {
      return 'translate(' + coords.xpos.toString() + ',' + coords.ypos.toString() + ')';
    },

    discoverLines: function() {
      return Object.keys(this.data);
    },

    countStations: function() {
      var total = 0;
      this.discoverLines().forEach(function(v) {
        this.data[v].forEach(function(value) {
          total += this.fillEmptyStations(value).length;
        }.bind(this));
      }.bind(this));
      return total;
    },

    fillEmptyStations: function(stations) {
      var range = this.createRange(parseInt(stations[0].number), parseInt(stations.slice(-1)[0].number));
      return range.map(this.generateMissingStation.bind({
        stations: stations,
        numbers: stations.map(this.getStationNumberFromObject)
      }));
    },

    createRange: function(start, end) {
      return Array
        .apply(null, Array((end - start) + 1))
        .map(function(discard, n) {
          return n + start;
        });
    },

    generateMissingStation: function(val, index) {
      if (this.numbers.indexOf(val) !== -1)
        return this.stations[this.numbers.indexOf(val)];

      return {
        name: '',
        number: val
      };
    },

    getStationNumberFromObject: function(station) {
      return parseInt(station.number);
    },

  };


  var app = new Map('#map', window.MetroDB, window.Options);
  app.init();

})(d3, _);
