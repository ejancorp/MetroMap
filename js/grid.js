(function(d3, _) {

    "use strict";

    /**
     * Script to create grid
     * @param       {Object} options Grid params
     * @param       {Number} options.cols column count
     * @param       {Number} options.rows row count
     * @param       {Number} options.width cell width
     * @param       {Number} options.height cell height
     * @param       {Boolean} options.border show/hide cell border
     * @constructor
     */
    function Grid(element, options) {

        this.default = {
            cols: 10,
            rows: 10,
            width: 100,
            height: 100,
            border: false
        };

        this.element = element;
        this.options = _.extend(this.default, options)

        this.svg = null;
        this.row = null;
        this.column = null;
        this.cell = null;

        this.cellClass = "cell";
        this.fill = "none";
        this.fillOpacity = "1";
        this.stroke = "#000";
    };

    /**
     * Initialize Grid, rows, columns
     * @return {Void} No Return
     */
    Grid.prototype.init = function() {
        this.svg = d3.select(this.element)
            .append("svg");

        this.row = this.svg.selectAll(".row")
            .data(this.generateCellArray())
            .enter()
            .append("g")
            .attr("class", "row");


        this.column = this.row.selectAll(".box")
            .data(this.getObjectData)
            .enter()
            .append("g")
            .attr("class", this.cellClass)
            .attr("id", this.getObjectId.bind(this))
            .append("rect")
            .attr("x", this.getObjectXpos)
            .attr("y", this.getObjectYpos)
            .attr("width", this.getObjectWidth)
            .attr("height", this.getObjectHeight);

        this.setCellStyle();
        this.setGridSize();
    };

    /**
     * Get grid svg
     * @return {Object} Grid SVG instance
     */
    Grid.prototype.getGrid = function() {
        return this;
    };

    /**
     * Set grid size
     * @return {Void} No return
     */
    Grid.prototype.setGridSize = function() {
        this.svg.attr("width", this.getFullWidth.bind(this));
        this.svg.attr("height", this.getFullHeight.bind(this));
    };

    /**
     * Set cell style base on border
     * @return {Void} No return
     */
    Grid.prototype.setCellStyle = function() {
        this.column
            .style("fill", this.fill)
            .style("fill-opacity", this.fillOpacity);

        if (this.options.border && this.column)
            this.column.style("stroke", this.stroke);
    };

    /**
     * Get cell id
     * @param  {Object} data Cell attributes
     * @return {String}      Cell Id
     */
    Grid.prototype.getObjectId = function(data) {
        return String(this.cellClass) + String(data.x) + String(data.y);
    }

    /**
     * Get object data
     * @param  {Object} data Cell attributes
     * @return {Object}      Cell attribute
     */
    Grid.prototype.getObjectData = function(data) {
        return data;
    }

    /**
     * Get cell X position
     * @param  {Object} data Cell attributes
     * @return {Number} Cell X axis position
     */
    Grid.prototype.getObjectXpos = function(data) {
        return data.x;
    };

    /**
     * Get cell Y position
     * @param  {Object} data Cell attributes
     * @return {Number} Cell Y axis position
     */
    Grid.prototype.getObjectYpos = function(data) {
        return data.y;
    };

    /**
     * Get cell width
     * @param  {Object} data Cell attributes
     * @return {Number} Cell width
     */
    Grid.prototype.getObjectWidth = function(data) {
        return data.width;
    };

    /**
     * Get cell height
     * @param  {Object} data Cell attributes
     * @return {Number} Cell height
     */
    Grid.prototype.getObjectHeight = function(data) {
        return data.height;
    };

    /**
     * Generate cell array based on cols and rows
     * @return {Array} container
     */
    Grid.prototype.generateCellArray = function() {
        var arr = [],
            xpos = 0,
            ypos = 0;
        for (var row = 0; row < this.options.rows; row++) {
            arr.push([]);
            for (var col = 0; col < this.options.cols; col++) {
                arr[row].push({
                    x: xpos,
                    y: ypos,
                    width: this.options.width,
                    height: this.options.height,
                });
                xpos += this.options.width;
            }
            xpos = 0;
            ypos += this.options.height;
        }
        return arr;
    };

    /**
     * Cell Count base on cols and rows
     * @return {Number} cell count
     */
    Grid.prototype.getCellCount = function() {
        return this.options.cols * this.options.rows;
    };

    /**
     * Get the full height base on row count and cell height
     * @return {Number} Element full height
     */
    Grid.prototype.getFullHeight = function() {
        return this.options.rows * this.options.height;
    };

    /**
     * Get the full width base on column count and cell width
     * @return {Number} Element full width
     */
    Grid.prototype.getFullWidth = function() {
        return this.options.cols * this.options.width;
    };

    window || (window = {});
    window.Map || (window.Map = {});
    window.Map.Grid || (window.Map.Grid = {});
    window.Map.Grid = new Grid("#map", {
        cols: 50,
        rows: 50,
        border: true,
    });
    window.Map.Grid.init();

})(d3, _)
