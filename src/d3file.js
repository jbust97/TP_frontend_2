import rd3 from 'react-d3-library';
import * as d3 from "d3";

var node = document.createElement('div');

var diameter = 30,
    format = d3.format(",d"),
    color = "orange";


var svg = d3.select(node).append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "circle");

export default node;