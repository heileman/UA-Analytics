var chartBubbleData = data;
var splitedBubbleData = [];

const margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
};
const container = document.querySelector("#bubble").getBoundingClientRect();

const domainwidth = container.width - margin.left - margin.right + 30;
const domainheight = container.height - margin.top - margin.bottom + 30;
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
        "Job with less good median salary and empolyment - don’t' have",
        "Job with good median salary and empolyment - don’t' have",
        "Job with good median salary and empolyment - have",
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
        "#ffffff",
        "#ff0000",
        "#00ff00",
    ]);

// the scaler for the circle size and enrollments
// if the enrollment is greater than 100
const sizeScale = d3
    .scaleLinear()
    .domain(padExtent([0, 50000]))
    .range(padExtent([5, 130]));

let xScale = null;
let yScale = null;

getScales();

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
    .ticks(((domainwidth + 2) / (domainheight + 2)) * 10)
    .tickSize(domainheight * 2 - 29)
    .tickPadding(30 - domainheight);
const yAxis = d3
    .axisRight(yScale)
    .ticks(((domainwidth + 2) / (domainheight + 2)) * 10)
    .tickSize(domainwidth)
    .tickPadding(-domainwidth);
gX = svg.append("g").attr("class", "axis axis--x").call(xAxis);
gY = svg.append("g").attr("class", "axis axis--y").call(yAxis);

// const {
//   salary_min,
//   salary_max,
//   employment_min,
//   employment_max
// } = findMinMax()
// var axes = [{
//     id: 0,
//     x1: domainwidth,
//     x2: 20,
//     y1: yScale(50),
//     y2: yScale(50),
//     strokeWidth: 2,
//   },
//   {
//     id: 1,
//     x1: xScale(demand_median),
//     x2: xScale(demand_median),
//     y1: domainheight,
//     y2: 5,
//     strokeWidth: 2,
//   },
// ];

// const textLocations = {
//   txx: domainwidth * 0.97,
//   tyy: 20,
//   size: 18,
// };

// var texts = [{
//     id: 0,
//     tx: axes[0].x1 - 50,
//     ty: axes[0].y1 + 20,
//     text: "Weighted Average",
//     size: textLocations.size,
//   },
//   {
//     id: 1,
//     tx: axes[0].x1 - 50,
//     ty: axes[0].y1 + 35,
//     text: "Salary ($)",
//     size: textLocations.size,
//   },
//   {
//     id: 2,
//     tx: axes[1].x2 - 60,
//     ty: axes[1].y2 + 13,
//     text: "Average Number",
//     size: textLocations.size,
//   },
//   {
//     id: 3,
//     tx: axes[1].x2 - 60,
//     ty: axes[1].y2 + 28,
//     text: "of Employee",
//     size: textLocations.size,
//   },
// ];
const drawAxes = (selection, axes, texts) => {
    const twoAxes = selection.selectAll("line").data(axes, (d) => d.id);
    twoAxes
        .enter()
        .append("line")
        .attr("stroke", "black")
        .attr("marker-end", "url(#arrow)")
        .attr("marker-start", "url(#arrow)")
        .merge(twoAxes)
        .attr("x1", (d) => d.x1)
        .attr("x2", (d) => d.x2)
        .attr("y1", (d) => d.y1)
        .attr("y2", (d) => d.y2)
        .attr("stroke-width", (d) => d.strokeWidth);

    twoAxes.exit().remove();

    const axisTexts = selection.selectAll("text").data(texts, (d) => d.id);
    axisTexts
        .enter()
        .append("text")
        .text((d) => d.text)
        .style("text-anchor", "middle")
        .merge(axisTexts)
        .style("font-size", (d) => d.size)
        .attr("transform", (d) => `translate(${d.tx},${d.ty})`);

    axisTexts.exit().remove();
};

// drawAxes(view, axes, texts);
drawChartBubbles(view, chartBubbleData);

// config zoom
var zoom = d3
    .zoom()
    .scaleExtent([0, 10])
    .on("zoom", () => {
        // xTransform = d3.event.transform.x;
        // yTransform = d3.event.transform.y;
        // kTransform = d3.event.transform.k;

        view.attr("transform", d3.event.transform);
        gX.call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
        gY.call(yAxis.scale(d3.event.transform.rescaleY(yScale)));

        // axes[0].x1 = (domainwidth - xTransform) / kTransform;
        // axes[0].x2 = (20 - xTransform) / kTransform;
        // axes[0].strokeWidth = 2 / kTransform;
        // axes[1].y1 = (domainheight - yTransform) / kTransform;
        // axes[1].y2 = (5 - yTransform) / kTransform;
        // axes[1].strokeWidth = 2 / kTransform;

        // texts[0].tx = axes[0].x1 - 50 / kTransform;
        // texts[0].ty = axes[0].y1 + 20 / kTransform;

        // texts[1].tx = axes[0].x1 - 50 / kTransform;
        // texts[1].ty = axes[0].y1 + 35 / kTransform;

        // texts[2].tx = axes[1].x2 - 60 / kTransform;
        // texts[2].ty = axes[1].y2 + 13 / kTransform;

        // texts[3].tx = axes[1].x2 - 60 / kTransform;
        // texts[3].ty = axes[1].y2 + 28 / kTransform;

        // for (i = 0; i < texts.length; i++) {
        //   texts[i].size = textLocations.size / kTransform;
        // }

        // drawAxes(view, axes, texts);
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

        bubbleChartRescale();
    }
}

function splitedCircleClicked(d) {
    deleteChildern(d);

    chartBubbleData = chartBubbleData.concat([d]);
    splitedBubbleData.splice(splitedBubbleData.indexOf(d), 1);
    drawSplitedBubbles(splited, splitedBubbleData);
    bubbleChartRescale();
}

function bubbleChartRescale() {
    getScales();
    if (chartBubbleData.length !== 0) {
        svg.transition().duration(300).call(zoom.transform, d3.zoomIdentity); // reset zoom
        gX.transition().duration(100).call(xAxis.scale(xScale));
        gY.transition().duration(100).call(yAxis.scale(yScale));
    }
    drawChartBubbles(view, chartBubbleData);
    drawSquares(view, potentialProgramData);
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

function getScales() {
    const {
        salary_min,
        salary_max,
        employment_min,
        employment_max,
    } = findMinMax();

    xScale = d3
        .scaleLinear()
        .domain(padExtent([salary_min - 200, salary_max + 200]))
        .range(padExtent([10, domainwidth]));
    yScale = d3
        .scaleLinear()
        .domain(padExtent([employment_min - 20000, employment_max + 20000]))
        .range(padExtent([domainheight, 10]));
}

function findMinMax() {
    let optimas = {
        salary_min: chartBubbleData[0].averageSalary,
        salary_max: chartBubbleData[0].averageSalary,
        employment_min: chartBubbleData[0].averageNumEmployee,
        employment_max: chartBubbleData[0].averageNumEmployee,
    };
    for (element of chartBubbleData) {
        const salary = element.averageSalary;
        const employee = element.averageNumEmployee;
        optimas.salary_max =
            salary > optimas.salary_max ? salary : optimas.salary_max;
        optimas.salary_min =
            salary < optimas.salary_min ? salary : optimas.salary_min;
        optimas.employment_max =
            employee > optimas.employment_max ? employee : optimas.employment_max;
        optimas.employment_min =
            employee < optimas.employment_min ? employee : optimas.employment_min;
    }
    return optimas;
}

function padExtent(e, p) {
    if (p === undefined) p = 1;
    return [e[0] - p, e[1] + p];
}