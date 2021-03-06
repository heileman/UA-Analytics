let hartData_total = [];
let chartData_resident = [];
let chartData_non_resident = [];
let chartData_international = [];
let chartData_average = [];

const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const container = document.querySelector("#bubble").getBoundingClientRect();
const domainwidth = container.width - margin.left - margin.right + 30;
const domainheight = container.height - margin.top - margin.bottom + 30;
old_choices = ["total"];
var choices = ["total"];
processData();
let globalSizeScale = null;
let scales = getScalers(chartData_average);

const collegeColorScale = d3
  .scaleOrdinal()
  .domain([
    "University of Arizona",
    "College of Architecture, Plan & Lands",
    "College of Agriculture & Life Sciences",
    "College of Applied Science & Tech",
    "College of Education",
    "College of Engineering",
    "College of Fine Arts",
    "College of Humanities",
    "College of Medicine - Phoenix",
    "College of Medicine - Tucson",
    "College of Nursing",
    "College of Pharmacy",
    "Zuckerman College of Public Health",
    "College of Science",
    "College of Social & Behavior Science",
    "Colleges of Letters Arts & Science",
    "Eller College of Management",
    "Graduate College",
    "Honors College",
    "James C Wyant College of Optical Sci",
    "James E. Rogers College of Law",
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

const typeColorScale = d3
  .scaleOrdinal()
  .domain(["total", "resident", "non_resident", "international"])
  .range(["#ff0000", "#FFFF00", "#00ff00", "#000fff"]);

var svg = d3.select("#bubble").append("svg");
var view = svg.append("g").attr("class", "view");

var tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// x and y axes
const xAxis = d3
  .axisBottom(scales.xScale)
  .ticks(15)
  .tickSize(domainheight * 2 - 30)
  .tickPadding(30 - domainheight);
const yAxis = d3
  .axisRight(scales.yScale)
  .ticks(15)
  .tickSize(domainwidth - 10)
  .tickPadding(30 - domainwidth);
let gX = svg.append("g").attr("class", "axis axis--x").call(xAxis);
let gY = svg.append("g").attr("class", "axis axis--y").call(yAxis);

const drawCircle = (selection, dataSet, { xScale, yScale, sizeScale }) => {
  var id = 0;
  const circles = selection
    .selectAll("circle")
    .attr("class", "circle")
    .data(
      // enter the data in descending order so that big bubbles wouldn't cover little ones
      dataSet.sort((first, second) => {
        return second.count - first.count;
      }),
      () => {
        id++;
        return id;
      }
    );
  circles
    .enter()
    .append("circle")
    .attr("r", 0)
    .attr("class", "circle")
    .merge(circles)
    .attr("cx", (d) => {
      if (d.count === 0) {
        return 0;
      }
      return xScale(d.cost / d.count);
    })
    .attr("cy", (d) => {
      if (d.count === 0) {
        return 0;
      }
      return yScale(d.averageNTR);
    })
    .attr("stroke", (d) => {
      if (d.count === 0) {
        return "white";
      }
      return "black";
    })
    .attr("stroke-width", (d) => {
      if (d.count > 0 && d.totalNTR > 0) {
        return 1.5;
      }
      return 0;
    })
    .style("fill", (d) => {
      return collegeColorScale(d.college);
    })
    .style("opacity", 0.75)
    .on("mouseover", function (d) {
      d3.select(this).style("opacity", 1);
      tooltip.transition().duration(200).style("opacity", 1);
      tooltip
        .html(tooltipHTML(d))
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
    })
    .on("mouseout", function (d) {
      d3.select(this).style("cursor", "default").style("opacity", 0.75);
      tooltip.transition().duration(500).style("opacity", 0);
    })
    .transition()
    .duration(400)
    .attr("r", (d) => {
      return sizeScale(d.count);
    });

  circles.exit().transition().duration(300).attr("r", 0).remove();
};

var zoom = d3.zoom().on("zoom", () => {
  view.attr("transform", d3.event.transform);
  gX.call(xAxis.scale(d3.event.transform.rescaleX(scales.xScale)));
  gY.call(yAxis.scale(d3.event.transform.rescaleY(scales.yScale)));
});
svg.call(zoom);

d3.selectAll(".checkbox").on("change", update);
update();

function processData() {
  chartData_average = [];
  data.forEach((program) => {
    let ntr = 0;
    let count = 0;
    college = program.primary_program;
    choices.forEach((choice) => {
      switch (choice) {
        case "resident":
          ntr += Number(program.resident_fiscal_year_NTR);
          count += Number(program.resident_fiscal_year_count);
          break;
        case "non_resident":
          ntr += Number(program.non_resid_fiscal_year_NTR);
          count += Number(program.non_resid_fiscal_year_count);
          break;
        case "international":
          ntr += Number(program.international_fiscal_year_NTR);
          count += Number(program.international_fiscal_year_count);
          break;
        default:
          ntr += Number(program.total_fiscal_year_NTR);
          count += Number(program.total_fiscal_year_count);
      }
    });

    if (count !== 0) {
      college = program.primary_program;
      type = "average";
      cost = program.total_cost;

      chartData_average.push(
        addData(college, type, count, cost, ntr / count, ntr)
      );
    }
  });
}

function addData(college, type, count, cost, avrageNtr, ntr) {
  tmpData = {
    college: college,
    cost: cost,
    count: count,
    averageNTR: avrageNtr,
    totalNTR: ntr,
    type: type,
  };
  return tmpData;
}

function update() {
  old_choices = [];
  choices.forEach((choice) => {
    old_choices.push(choice);
  });
  d3.selectAll(".checkbox").each((d) => {
    cb = d3.select(this);
    if (cb.property("checked")) {
      if (!choices.includes(cb.property("value"))) {
        choices.push(cb.property("value"));
      }
    } else {
      const index = choices.indexOf(cb.property("value"));
      if (index > -1) {
        choices.splice(index, 1);
      }
    }
  });

  // checked total, then uncheck everything else
  if (choices.includes("total") && !old_choices.includes("total")) {
    choices = ["total"];
    document.getElementById("resident").checked = false;
    document.getElementById("non-resident").checked = false;
    document.getElementById("international").checked = false;
  } else if (
    // total is already checked, checked another one
    old_choices.includes("total") &&
    choices.includes("total") &&
    choices.length > 1
  ) {
    const index = choices.indexOf("total");
    if (index > -1) {
      choices.splice(index, 1);
    }
    document.getElementById("total").checked = false;
  }
  processData();

  scales = getScalers(chartData_average);
  if (chartData_average.length !== 0) {
    svg.transition().duration(300).call(zoom.transform, d3.zoomIdentity); // reset zoom
    gX.transition().duration(100).call(xAxis.scale(scales.xScale));
    gY.transition().duration(100).call(yAxis.scale(scales.yScale));
  }
  drawCircle(view, chartData_average, scales);
}

function findMinMax(dataSet) {
  if (dataSet.length === 0) {
    return {};
  }
  const first_average_cost =
    dataSet[0].count === 0
      ? dataSet[0].cost
      : dataSet[0].cost / dataSet[0].count;
  let min_cost = (max_cost = first_average_cost);
  let min_count = (max_count = dataSet[0].count);
  let min_NTR = (max_NTR = dataSet[0].averageNTR);
  dataSet.forEach((item) => {
    const average_cost = item.count === 0 ? item.cost : item.cost / item.count;
    min_cost = average_cost < min_cost ? average_cost : min_cost;
    max_cost = average_cost > max_cost ? average_cost : max_cost;

    min_count = item.count < min_count ? item.count : min_count;
    max_count = item.count > max_count ? item.count : max_count;

    min_NTR = item.averageNTR < min_NTR ? item.averageNTR : min_NTR;
    max_NTR = item.averageNTR > max_NTR ? item.averageNTR : max_NTR;
  });

  return {
    min_cost: min_cost,
    max_cost: max_cost,
    min_count: min_count,
    max_count: max_count,
    min_NTR: min_NTR,
    max_NTR: max_NTR,
  };
}

function getScalers(dataSet) {
  if (dataSet.length === 0) {
    return {};
  }
  const {
    min_cost,
    max_cost,
    min_count,
    max_count,
    min_NTR,
    max_NTR,
  } = findMinMax(dataSet);

  const tmpCostMin =
    choices.length === 1 && choices[0] === "international" ? -600000 : -16000;
  const xScale = d3
    .scaleLinear()
    .domain(padExtent([tmpCostMin, max_cost * 1.05]))
    .range(padExtent([1, domainwidth]));
  const yScale = d3
    .scaleLinear()
    .domain(padExtent([min_NTR - 3000, max_NTR + 3000]))
    .range(padExtent([domainheight, 1]));

  // compute sizeScale only once for all students
  if (!globalSizeScale) {
    globalSizeScale = d3
      .scaleLinear()
      .domain(padExtent([min_count * 2.5, max_count * 2.5]))
      .range(padExtent([5, 150]));
  }
  return { xScale: xScale, yScale: yScale, sizeScale: globalSizeScale };
}

const tooltipHTML = (d) => {
  return `College: ${d.college}<br>
  Student: ${getStudent(d.type)}<br>
  Fiscal Year Count: ${d.count}<br>
  Total Cost: $${convertMillion(d.cost)}<br>
  Cost Per Student: $${(d.cost / d.count).toFixed(1)}<br>
  Net Tuition Revenue: $${convertMillion(d.totalNTR)}<br>
  Average Net Tuition Revenue: $${d.averageNTR.toFixed(1)}`;
};
function padExtent(e, p) {
  if (p === undefined) p = 1;
  return [e[0] - p, e[1] + p];
}

function convertMillion(num) {
  const n = num >= 1000000 ? `${(num / 1000000).toFixed(1)} million` : `${num}`;
  return n;
}

function getStudent(str) {
  switch (str) {
    case "resident":
      return "Arizona Residents";
    case "non_resident":
      return "Domestic Non-Residents";
    case "international":
      return "International Non-Residents";
    default:
      return "All Students";
  }
}
