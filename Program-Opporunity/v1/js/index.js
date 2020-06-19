let chartBubbleData = data;
let splitedBubbleData = [];

const margin = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20,
};
const container = document
  .querySelector("#chart-bubbles")
  .getBoundingClientRect();
const domainwidth = container.width - margin.left - margin.right + 30;
const domainheight = container.height - margin.top - margin.bottom + 30;

const svg = d3.select("#chart-bubbles").append("svg");
const view = svg.append("g").attr("class", "view");
const poppedSection = d3.select("#popped-bubbles").append("svg").append("g");

const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

const tickGapSize = ((domainwidth + 2) / (domainheight + 2)) * 10;

getScales();

const xAxis = d3
  .axisBottom(xScale)
  .ticks(tickGapSize)
  .tickSize(domainheight * 2 - 29)
  .tickPadding(30 - domainheight);
const yAxis = d3
  .axisRight(yScale)
  .ticks(tickGapSize)
  .tickSize(domainwidth)
  .tickPadding(-domainwidth);

const gX = svg.append("g").attr("class", "axis axis--x").call(xAxis);
const gY = svg.append("g").attr("class", "axis axis--y").call(yAxis);

const zoom = d3
  .zoom()
  .scaleExtent([0, 10])
  .on("zoom", () => {
    view.attr("transform", d3.event.transform);
    gX.call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
    gY.call(yAxis.scale(d3.event.transform.rescaleY(yScale)));
  });

initiateCheckBox(chartBubbleData[0]);
drawChartBubbles(view, chartBubbleData);

svg.call(zoom);
