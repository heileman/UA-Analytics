var margin = { top: 20, right: 20, bottom: 20, left: 20 };
var containerStyle = document.querySelector("#bubble").getBoundingClientRect();
var svg = null,
  width = containerStyle.width,
  height = containerStyle.height,
  domainwidth = width - margin.left - margin.right,
  domainheight = height - margin.top - margin.bottom,
  gX = null,
  gY = null,
  currentTransform = null,
  svg = d3.select("#bubble").append("svg"),
  view = svg.append("g").attr("class", "view"),
  legend = d3.select("#legend");

var splited = d3.select("#splited").append("svg").append("g");

// Define the div for the tooltip
var div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

if (currentTransform) view.attr("transform", currentTransform);
const colorScale = d3
  .scaleOrdinal()
  .domain([
    "Col Arch Plan & Landscape Arch",
    "College of Agric and Life Sci",
    "College of Applied Sci & Tech",
    "College of Education",
    "College of Engineering",
    "College of Fine Arts",
    "College of Humanities",
    "College of Medicine - Phoenix",
    "College of Medicine - Tucson",
    "College of Nursing",
    "College of Pharmacy",
    "College of Public Health",
    "College of Science",
    "College of Social & Behav Sci",
    "Colleges of Letters Arts & Sci",
    "Eller College of Management",
    "Graduate College",
    "Honors College",
    "James C Wyant Coll Optical Sci",
    "James E Rogers College of Law",
    "Letters Arts & Sci Division",
    "Vice Provost Acad Affrs Div",
  ])
  .range([
    "#A52A2A",
    "#F2C649",
    "#C49102",
    "#ADD8E6",
    "#FFA500",
    "#B2B2B2",
    "#999999",
    "#008000",
    "#228B22",
    "#FBCEB1",
    "#556B2F",
    "#FF9999",
    "#FFDF00",
    "#9FA91F",
    "#C0C0C0",
    "#FAD6A5",
    "#541E1B",
    "#FF0000",
    "#CEB180",
    "#800080",
    "#000000",
    "#001540",
  ]);

const sizeScale = d3
  .scaleLinear()
  .domain(padExtent([0, 58000]))
  .range(padExtent([10, 150]));

var hiddenData = [];

// draw all circles on the bubble chart
const drawCircles = (selection, { data }) => {
  const circles = selection.selectAll("circle").data(data, (d) => d.id);
  circles
    .enter()
    .append("circle")
    .attr("r", 0)
    .on("click", circleClicked)
    // .attr("class", "circle")
    .merge(circles)
    .attr("cx", (d) => {
      return xScale(d.demand);
    })
    .attr("cy", (d) => {
      return yScale(d.percentage);
    })
    .style("fill", (d) => {
      return colorScale(d.college);
    })
    .style("opacity", 0.7)
    .on("mouseover", function (d) {
      if (d.children.length > 0) {
        d3.select(this).style("cursor", "pointer");
      }
      div.transition().duration(200).style("opacity", 0.9);
      div
        .html(
          "Program: " +
            d.label +
            "<br/>Enrollment: " +
            d.size +
            "<br/>Projected Demand: " +
            d.demand +
            "<br/>% of Program online: " +
            d.percentage
        )
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
    })
    .on("mouseout", function (d) {
      d3.select(this).style("cursor", "default");
      div.transition().duration(500).style("opacity", 0);
    })
    .transition()
    .duration(500)
    .attr("r", (d) => {
      if (d.size > 10000) {
        return sizeScale(30000);
      }
      return sizeScale(d.size);
    });

  circles.exit().transition().duration(300).attr("r", 0).remove();
};

// draw all circles splited
const drawSplitedCircle = (selection, { hiddenData }) => {
  const circles = selection.selectAll("circle").data(hiddenData, (d) => d.id);
  circles
    .enter()
    .append("circle")
    .attr("r", 0)
    .on("click", splitedCircleClicked)
    .merge(circles)
    .attr("cx", 25)
    .attr("cy", (d, i) => {
      return (i + 1) * 15 * 2 + 10;
    })
    .on("mouseover", function (d) {
      if (d.children.length > 0) {
        d3.select(this).style("cursor", "pointer");
      }
      div.transition().duration(200).style("opacity", 0.9);
      div
        .html(
          "Program: " +
            d.label +
            "<br/>Enrollment: " +
            d.size +
            "<br/>Projected Demand: " +
            d.demand +
            "<br/>% of Program online: " +
            d.percentage
        )
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
    })
    .on("mouseout", function (d) {
      d3.select(this).style("cursor", "default");
      div.transition().duration(500).style("opacity", 0);
    })
    .transition()
    .attr("r", 8)
    .style("opacity", 0.7)
    .attr("fill", (d) => {
      return colorScale(d.college);
    });

  const text = selection.selectAll("text").data(hiddenData, (d) => d.id);
  text
    .enter()
    .append("text")
    .merge(text)
    .attr("x", 10)
    .attr("y", (d, i) => {
      return (i + 2) * 15 * 2;
    })
    .text(function (d) {
      return d.label;
    });
  text.exit().remove();
  circles.exit().transition().duration(300).attr("r", 0).remove();
};

var xScale = d3
  .scaleLinear()
  .domain(padExtent([0, 10]))
  .range(padExtent([0, domainwidth]));
var yScale = d3
  .scaleLinear()
  .domain(padExtent([0, 100]))
  .range(padExtent([domainheight, 0]));

var xAxis = d3
  .axisBottom(xScale)
  .ticks(((domainwidth + 2) / (domainheight + 2)) * 10)
  .tickSize(domainheight)
  .tickPadding(8 - domainheight);
var yAxis = d3
  .axisRight(yScale)
  .ticks(10)
  .tickSize(domainwidth)
  .tickPadding(8 - domainwidth);
gX = svg.append("g").attr("class", "axis axis--x").call(xAxis);
gY = svg.append("g").attr("class", "axis axis--y").call(yAxis);

var defs = view.append("defs");
defs
  .append("marker")
  .attr("id", "arrow")
  .attr("viewBox", "0 0 10 10")
  .attr("refX", 5)
  .attr("refY", 5)
  .attr("markerWidth", 6)
  .attr("markerHeight", 6)
  .attr("orient", "auto-start-reverse")

  .append("path")
  .attr("d", "M 0 0 L 10 5 L 0 10 z")
  .attr("class", "arrowHead");
// x axis
view
  .append("line")
  .attr("x1", xScale(0))
  .attr("x2", xScale(10))
  .attr("y1", yScale(50))
  .attr("y2", yScale(50))
  .attr("stroke-width", 2)
  .attr("stroke", "black")
  .attr("marker-end", "url(#arrow)")
  .attr("marker-start", "url(#arrow)");
// x axis text
view
  .append("text")
  .attr("transform", "translate(" + xScale(9.8) + " ," + yScale(45) + ")")
  .style("text-anchor", "middle")
  .text("Projected");
view
  .append("text")
  .attr("transform", "translate(" + xScale(9.8) + " ," + yScale(43) + ")")
  .style("text-anchor", "middle")
  .text("Demand");

// y axis
view
  .append("line")
  .attr("x1", xScale(5))
  .attr("x2", xScale(5))
  .attr("y1", yScale(100))
  .attr("y2", yScale(0))
  .attr("stroke-width", 2)
  .attr("stroke", "black")
  .attr("marker-end", "url(#arrow)")
  .attr("marker-start", "url(#arrow)");
// y axis text
view
  .append("text")
  .attr("transform", "translate(" + xScale(4.3) + " ," + yScale(97) + ")")
  .style("text-anchor", "middle")
  .text("% of Program");
view
  .append("text")
  .attr("transform", "translate(" + xScale(4.3) + " ," + yScale(95) + ")")
  .style("text-anchor", "middle")
  .text("Online");

// quards
view
  .append("text")
  .attr("transform", "translate(" + xScale(2.5) + " ," + yScale(75) + ")")
  .style("text-anchor", "middle")
  .style("opacity", 0.5)
  .style("font-size", "30px")
  .text("low risk/ low reward");
view
  .append("text")
  .attr("transform", "translate(" + xScale(7.5) + " ," + yScale(75) + ")")
  .style("text-anchor", "middle")
  .style("opacity", 0.5)
  .style("font-size", "30px")
  .text("low risk/ high reward");
view
  .append("text")
  .attr("transform", "translate(" + xScale(2.5) + " ," + yScale(25) + ")")
  .style("text-anchor", "middle")
  .style("opacity", 0.5)
  .style("font-size", "30px")
  .text("high risk/ low reward");
view
  .append("text")
  .attr("transform", "translate(" + xScale(7.5) + " ," + yScale(25) + ")")
  .style("text-anchor", "middle")
  .style("opacity", 0.5)
  .style("font-size", "30px")
  .text("high risk/ high reward");

var zoom = d3
  .zoom()
  .scaleExtent([0.1, 2.2])
  .translateExtent([
    [-domainwidth * 2, -domainheight * 2],
    [domainwidth * 2, domainheight * 2],
  ])
  .on("zoom", zoomed);

function zoomed() {
  currentTransform = d3.event.transform;
  view.attr("transform", currentTransform);
  gX.call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
  gY.call(yAxis.scale(d3.event.transform.rescaleY(yScale)));
  slider.property("value", d3.event.scale);
}

drawCircles(view, { data });

function circleClicked(d) {
  i = data.indexOf(d);
  const children = d.children;

  if (children.length > 0) {
    // update buttons
    hiddenData = hiddenData.concat(data.splice(i, 1));
    drawSplitedCircle(splited, { hiddenData });

    // update circles
    data = data.concat(children);
    drawCircles(view, { data });
  }
}

function splitedCircleClicked(d) {
  const children = d.children;

  // update buttons
  hiddenData.splice(hiddenData.indexOf(d), 1);
  drawSplitedCircle(splited, { hiddenData });

  // update the circles
  for (i of children) {
    data.splice(data.indexOf(i), 1);
  }
  data = data.concat([d]);
  drawCircles(view, { data });
}

var previousDraggedPosition = null,
  selected = null;
// snap to grid is simply rounding to the nearest resolution of the square
function snapToGrid(p, r) {
  return Math.round(p / r) * r;
}
// we'll use a resolution of 50 here
var cubeResolution = 20;
// randomly generate points, but make sure they snap to grid
var points = d3.range(10).map(() => {
  return {
    x: snapToGrid(Math.random() * 500, cubeResolution),
    y: snapToGrid(Math.random() * 500, cubeResolution),
  };
});
var itemContainer = view
  .selectAll("g")
  .attr("class", "itemContainer")
  // add group to view
  .data(points)
  .enter()
  .append("g")
  // and center the group in the middle
  .attr("transform", () => "translate(" + xScale(0) + "," + yScale(0) + ")")
  .append("g")
  // make this entire group draggable - this is useful for adding text elements later
  .call(
    d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
  );

function dragged(d) {
  selected = this;
  // update the position of the rect (square) and snap to grid
  var el = d3
    .select(this)
    .select(".table-graphic")
    .attr("x", (d) => snapToGrid(d3.event.x, cubeResolution))
    .attr("y", () => snapToGrid(d3.event.y, cubeResolution));
  // get center point and make sure rotation is correct on drag.
  var center = getCenter(
    el.attr("x"),
    el.attr("y"),
    cubeResolution,
    cubeResolution
  );
  el.attr("transform", () => {
    return (
      "rotate(" +
      el.attr("data-rotation") +
      "," +
      center.x +
      "," +
      center.y +
      ")"
    );
  });
}
function dragended(d) {
  d3.select(this).classed("dragging", false);
  var newEl = d3.select(this).select(".table-graphic");
  var newPt = {
    x: newEl.attr("x"),
    y: newEl.attr("y"),
  };
  // save and update position for redraw
  var pt = findAndUpdate(coorNum(previousDraggedPosition), coorNum(newPt));
  if (pt) {
    previousDraggedPosition = pt;
  }
}
function dragstarted(d) {
  var el = d3.select(this);
  // save previous drag point for collisions and redraws
  savePreviousDragPoint(el);
  // raise the z-index to the top and set class to dragging
  el.raise().classed("dragging", true);
}
// helper to convert strings to integers
function coorNum(pt) {
  return {
    x: parseInt(pt.x, 10),
    y: parseInt(pt.y, 10),
  };
}
function savePreviousDragPoint(el) {
  var elBox = el.nodes()[0].getBBox();
  if (!el.nodes()[0].classList.contains("dragging")) {
    previousDraggedPosition = {
      x: elBox.x,
      y: elBox.y,
    };
  }
}
// helper for drag recentering
function getCenter(x, y, w, h) {
  return {
    x: parseInt(x, 10) + parseInt(w, 10) / 2,
    y: parseInt(y, 10) + parseInt(h) / 2,
  };
}
// add slider instead of mousewheel zoom to improve user experience
// have it start at min 50% and max out at 5x the amount.
var slider = d3
  .select("#slidebar")
  .append("input")
  .datum({})
  .attr("type", "range")
  .attr("value", 1)
  .attr("class", "p-2 custom-range align-self-center")
  .attr("min", zoom.scaleExtent()[0])
  .attr("max", zoom.scaleExtent()[1])
  .attr("step", (zoom.scaleExtent()[1] - zoom.scaleExtent()[0]) / 100)
  .on("input", slided);

function slided(d) {
  zoom.scaleTo(svg, d3.select(this).property("value"));
}
// disable zoom on mousewheel and double click
svg.call(zoom).on("wheel.zoom", null).on("dblclick.zoom", null);

function padExtent(e, p) {
  if (p === undefined) p = 1;
  return [e[0] - p, e[1] + p];
}
