(function() {

    'use strict'

    var Map = function(element, data) {

        this.element = element;
        this.data = data;
        this.svg = null;

        this.metroRedKey = 'red';

        this.height = 120;
        this.width = 120;

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
            .attr('width', this.width * this.getMetroRed().length)
            .attr('height', this.height)
            .selectAll('g')
            .data(this.getMetroRed())
            .enter().append('g')
            .attr('transform', function(d, i) {
                var xpos = (this.width * this.getMetroRed().length) - ((i + 1) * this.width);
                document.querySelector(this.element).getElementsByTagName('svg')[0].setAttribute('height', (i + 1) * this.height);
                return 'translate(' + xpos.toString() + ',' + i * this.height + ')';
            }.bind(this));

        this.setPreviousLine().setNextLine();
        this.setCircles().setStationName();

        this.svg.append('g');
    };

    Map.prototype.setCircles = function() {
        this.svg.append('circle')
            .attr('cx', this.circle.xaxis)
            .attr('cy', this.circle.yaxis)
            .attr('r', this.circle.radius)
            .style('fill', this.circle.fill)
            .style('stroke', this.circle.stroke)
            .style('stroke-width', this.circle.strokeWidth)
            .style('visibility', function(d) {
                return d.name ? 'visible' : 'hidden';
            });
        return this;
    };

    Map.prototype.setStationName = function() {
        this.svg.append('text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('dy', '1em')
            .attr('font-size', '11px')
            .attr('font-family', this.fontFamily)
            .attr('font-weight', this.fontWeightBold)
            .style('fill', this.fill)
            .text(function(d) {
                return d.name;
            })
            .style('visibility', function(d) {
                return d.name ? 'visible' : 'hidden';
            });
        return this;
    };

    Map.prototype.setPreviousLine = function() {
        this.svg.append('line')
            .attr('x1', 60)
            .attr('x2', 120)
            .attr('y1', 60)
            .attr('y2', 0)
            .style('fill', this.line.fill)
            .attr('stroke', this.line.stroke)
            .attr('stroke-width', this.line.strokeWidth);
        return this;
    };

    Map.prototype.setNextLine = function() {
        this.svg.append('line')
            .attr('x1', 60)
            .attr('x2', 0)
            .attr('y1', 60)
            .attr('y2', 120)
            .style('fill', this.line.fill)
            .attr('stroke', this.line.stroke)
            .attr('stroke-width', this.line.strokeWidth);
        return this;
    };

    /**
     * [description]
     */

    Map.prototype.fillEmptyStations = function(stations) {
        var range = this.createRange(parseInt(stations[0].number), parseInt(stations.slice(-1)[0].number));
        return range.map(this.generateMissingStation.bind({
            stations: stations,
            numbers: stations.map(this.getStationNumberFromObject)
        }));
    };

    Map.prototype.createRange = function(start, end) {
        return Array
            .apply(null, Array((end - start) + 1))
            .map(function(discard, n) {
                return n + start;
            });
    }

    Map.prototype.sortStations = function(a, b) {
        return a.number - b.number;
    };

    Map.prototype.getFormattedMetro = function(line) {
        return this.data[line].map(this.getStationDataFromObject);
    };

    Map.prototype.getMetroRed = function() {
        return this.fillEmptyStations(this.getFormattedMetro(this.metroRedKey).sort(this.sortStations));
    };

    Map.prototype.getStationDataFromObject = function(station) {
        return {
            name: station.name,
            number: parseInt(station.number)
        };
    };

    Map.prototype.getStationNumberFromObject = function(station) {
        return parseInt(station.number);
    };

    Map.prototype.generateMissingStation = function(val, index) {
        if (this.numbers.indexOf(val) !== -1)
            return this.stations[this.numbers.indexOf(val)];

        return {
            name: '',
            number: val
        };
    }

    var app = new Map('#map', window.Metro);
    app.init();

})();
