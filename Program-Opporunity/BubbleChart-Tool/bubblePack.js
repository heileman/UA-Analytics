// import { groupBy } from "processData";

var svg = d3.select("#bubble"),
  margin = { top: 20, right: 20, bottom: 20, left: 20 },
  width = +svg.attr("width"),
  height = +svg.attr("height"),
  domainwidth = width - margin.left - margin.right,
  domainheight = height - margin.top - margin.bottom;

var splited = d3.select("#splited").append("g");

// Define the div for the tooltip
var div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// scalers
var x = d3
  .scaleLinear()
  .domain(padExtent([0, 10]))
  .range(padExtent([0, domainwidth]));
var y = d3
  .scaleLinear()
  .domain(padExtent([0, 100]))
  .range(padExtent([domainheight, 0]));

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

var g = svg
  .append("g")
  .attr("transform", "translate(" + margin.top + "," + margin.top + ")");

var hiddenData = [];

var defs = g.append("defs");
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
g.append("line")
  .attr("x1", 0)
  .attr("x2", domainwidth)
  .attr("y1", domainheight / 2)
  .attr("y2", domainheight / 2)
  .attr("stroke-width", 2)
  .attr("stroke", "black")
  .attr("marker-end", "url(#arrow)")
  .attr("marker-start", "url(#arrow)");
// x axis text
svg
  .append("text")
  .attr("transform", "translate(" + domainwidth + " ," + domainheight / 2 + ")")
  .style("text-anchor", "middle")
  .text("Projected");
svg
  .append("text")
  .attr(
    "transform",
    "translate(" + domainwidth + " ," + (domainheight / 2 + 15) + ")"
  )
  .style("text-anchor", "middle")
  .text("Demand");

// y axis
g.append("line")
  .attr("x1", domainwidth / 2)
  .attr("x2", domainwidth / 2)
  .attr("y1", domainheight)
  .attr("y2", 0)
  .attr("stroke-width", 2)
  .attr("stroke", "black")
  .attr("marker-end", "url(#arrow)")
  .attr("marker-start", "url(#arrow)");
// y axis text
svg
  .append("text")
  .attr(
    "transform",
    "translate(" + (domainwidth / 3 + 10) + " ," + margin.top + ")"
  )
  .style("text-anchor", "middle")
  .text("% of programs");
svg
  .append("text")
  .attr(
    "transform",
    "translate(" + (domainwidth / 3 + 10) + " ," + (margin.top + 15) + ")"
  )
  .style("text-anchor", "middle")
  .text("online");

// draw all circles on the bubble chart
const drawCircles = (selection, { data }) => {
  const circles = selection.selectAll("circle").data(data, (d) => d.id);
  circles
    .enter()
    .append("circle")
    .attr("r", 0)
    .on("click", circleClicked)
    .merge(circles)
    .attr("cx", (d) => {
      return x(d.demand);
    })
    .attr("cy", (d) => {
      return y(d.percentage);
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
      return (i + 1) * 15 * 2;
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
    .attr("r", 10)
    .style("opacity", 0.7)
    .attr("fill", (d) => {
      return colorScale(d.college);
    });

  circles.exit().transition().duration(300).attr("r", 0).remove();
};

drawCircles(g, { data });

function circleClicked(d) {
  i = data.indexOf(d);
  const children = d.children;

  if (children.length > 0) {
    // update buttons
    hiddenData = hiddenData.concat(data.splice(i, 1));
    drawSplitedCircle(splited, { hiddenData });

    // update circles
    data = data.concat(children);
    drawCircles(g, { data });
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
  drawCircles(g, { data });
}

function padExtent(e, p) {
  if (p === undefined) p = 1;
  return [e[0] - p, e[1] + p];
}
