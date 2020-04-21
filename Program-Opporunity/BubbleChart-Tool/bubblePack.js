var chartBubbleData = data;
var splitedBubbleData = [];

const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const container = document.querySelector("#bubble").getBoundingClientRect();

const domainwidth = container.width - margin.left - margin.right;
const domainheight = container.height - margin.top - margin.bottom;
var currentTransform = null;
var svg = d3.select("#bubble").append("svg");
var view = svg.append("g").attr("class", "view");

var splited = d3.select("#splited").append("svg").append("g");

// Define the div for the tooltip
var tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

if (currentTransform) view.attr("transform", currentTransform);

// config the scalers for circle color, circle size, x and y axes
const colorScale = d3
  .scaleOrdinal()
  .domain([
    "University of Arizona",
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
    "#002147",
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

demand_median = 44.631006;

// the scaler for the circle size and enrollments
// if the enrollment is greater than 100
const sizeScale = d3
  .scaleLinear()
  .domain(padExtent([0, 20000]))
  .range(padExtent([5, 150]));
// the scaler for x axis and projected demand
// it should cover 1 and 10
const x_min = -600,
  x_max = 800;
const xScale = d3
  .scaleLinear()
  .domain(padExtent([x_min, x_max]))
  .range(padExtent([100, domainwidth - 100]));
// the scaler for y axis and the % program online
// it should cover between 0 and 100 percentage
const yScale = d3
  .scaleLinear()
  .domain(padExtent([-20, 123]))
  .range(padExtent([domainheight, 0]));

// the end arrows of x and y axes
const defs = view
  .append("defs")
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

// x and y axes
const xAxis = d3
  .axisBottom(xScale)
  .ticks(((domainwidth + 2) / (domainheight + 2)) * 20)
  .tickSize(domainheight * 2 - 5)
  .tickPadding(18 - domainheight);
const yAxis = d3
  .axisRight(yScale)
  .ticks(((domainwidth + 2) / (domainheight + 2)) * 20)
  .tickSize(domainwidth)
  .tickPadding(8 - domainwidth);
gX = svg.append("g").attr("class", "axis axis--x").call(xAxis);
gY = svg.append("g").attr("class", "axis axis--y").call(yAxis);
view
  .append("line")
  .attr("x1", xScale(demand_median - (x_max - x_min) / 2))
  .attr("x2", xScale(demand_median + (x_max - x_min) / 2))
  .attr("y1", yScale(50))
  .attr("y2", yScale(50))
  .attr("stroke-width", 2)
  .attr("stroke", "black")
  .attr("marker-end", "url(#arrow)")
  .attr("marker-start", "url(#arrow)");
view
  .append("line")
  .attr("x1", xScale(demand_median))
  .attr("x2", xScale(demand_median))
  .attr("y1", yScale(120))
  .attr("y2", yScale(-20))
  .attr("stroke-width", 2)
  .attr("stroke", "black")
  .attr("marker-end", "url(#arrow)")
  .attr("marker-start", "url(#arrow)");

// texts for x and y axes
view
  .append("text")
  .attr(
    "transform",
    "translate(" +
      xScale(demand_median + (x_max - x_min) / 2) +
      " ," +
      yScale(46) +
      ")"
  )
  .style("text-anchor", "middle")
  .text("Projected");
view
  .append("text")
  .attr(
    "transform",
    "translate(" +
      xScale(demand_median + (x_max - x_min) / 2) +
      " ," +
      yScale(43) +
      ")"
  )
  .style("text-anchor", "middle")
  .text("Demand");
view
  .append("text")
  .attr(
    "transform",
    "translate(" + xScale(-demand_median) + " ," + yScale(120) + ")"
  )
  .style("text-anchor", "middle")
  .text("% of Program");
view
  .append("text")
  .attr(
    "transform",
    "translate(" + xScale(-demand_median) + " ," + yScale(117) + ")"
  )
  .style("text-anchor", "middle")
  .text("Online");

// texts in four quards
view
  .append("text")
  .attr(
    "transform",
    "translate(" + xScale(-(x_max - 100 - x_min) / 4) + " ," + yScale(85) + ")"
  )
  .style("text-anchor", "middle")
  .style("opacity", 0.5)
  .style("font-size", "30px")
  .text("low risk/ low reward");
view
  .append("text")
  .attr(
    "transform",
    "translate(" +
      xScale(((x_max - 100 - x_min) * 3) / 8.5) +
      " ," +
      yScale(85) +
      ")"
  )
  .style("text-anchor", "middle")
  .style("opacity", 0.5)
  .style("font-size", "30px")
  .text("low risk/ high reward");
view
  .append("text")
  .attr(
    "transform",
    "translate(" + xScale(-(x_max - 100 - x_min) / 4) + " ," + yScale(15) + ")"
  )
  .style("text-anchor", "middle")
  .style("opacity", 0.5)
  .style("font-size", "30px")
  .text("high risk/ low reward");
view
  .append("text")
  .attr(
    "transform",
    "translate(" +
      xScale(((x_max - 100 - x_min) * 3) / 8.5) +
      " ," +
      yScale(15) +
      ")"
  )
  .style("text-anchor", "middle")
  .style("opacity", 0.5)
  .style("font-size", "30px")
  .text("high risk/ high reward");

drawChartBubbles(view, chartBubbleData);

// config zoom
var zoom = d3
  .zoom()
  .scaleExtent([0, 10])
  .translateExtent([
    [-domainwidth * 2, -domainheight * 2],
    [domainwidth * 2, domainheight * 2],
  ])
  .on("zoom", () => {
    currentTransform = d3.event.transform;
    view.attr("transform", currentTransform);
    gX.call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
    gY.call(yAxis.scale(d3.event.transform.rescaleY(yScale)));
  });
svg.call(zoom);

// cirlce on clicked events
function circleClicked(d) {
  const children = d.children;

  if (children.length > 0) {
    // add this bubble to the splited bubble list
    splitedBubbleData = splitedBubbleData.concat(d);
    drawSplitedBubbles(splited, splitedBubbleData);

    // remove this bubble and add the children of this bubble to the bubble chart list
    chartBubbleData.splice(chartBubbleData.indexOf(d), 1);
    chartBubbleData = chartBubbleData.concat(children);
    drawChartBubbles(view, chartBubbleData);
  }
}

function splitedCircleClicked(d) {
  deleteChildern(d);

  chartBubbleData = chartBubbleData.concat([d]);
  drawChartBubbles(view, chartBubbleData);
  splitedBubbleData.splice(splitedBubbleData.indexOf(d), 1);
  drawSplitedBubbles(splited, splitedBubbleData);
}

// helper functions
function deleteChildern(d) {
  if (d.children == []) {
    return;
  }
  for (child of d.children) {
    if (chartBubbleData.includes(child)) {
      chartBubbleData.splice(chartBubbleData.indexOf(child), 1);
    }
    if (splitedBubbleData.includes(child)) {
      splitedBubbleData.splice(splitedBubbleData.indexOf(child), 1);
    }
    deleteChildern(child);
  }
}

function padExtent(e, p) {
  if (p === undefined) p = 1;
  return [e[0] - p, e[1] + p];
}
