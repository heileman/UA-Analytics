let hartData_total = [];
let chartData_resident = [];
let chartData_non_resident = [];
let chartData_international = [];

const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const container = document.querySelector("#bubble").getBoundingClientRect();
const domainwidth = container.width - margin.left - margin.right + 30;
const domainheight = container.height - margin.top - margin.bottom + 30;

var choices = ["total", "resident", "non_resident", "international"];
processData();
let scales = getScalers(
  [].concat(
    chartData_total,
    chartData_resident,
    chartData_non_resident,
    chartData_international
  )
);
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
    .attr("stroke-width", 1.5)
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
    .attr("r", (d) => {
      return sizeScale(d.count);
    });

  circles.exit().remove();
};

const drawRectangle = (selection, dataSet, { xScale, yScale, sizeScale }) => {
  let id = 0;
  let height = (width = 0);
  const rects = selection
    .selectAll("rect")
    .attr("class", "rect")
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
  rects
    .enter()
    .append("rect")
    .attr("class", "rect")
    .merge(rects)
    .style("fill", (d) => {
      return collegeColorScale(d.college);
    })
    .attr("stroke", (d) => {
      return "black";
    })
    .attr("stroke-width", 1.5)
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
    .attr("width", (d) => {
      if (d.count === 0) {
        return 0;
      }
      if (d.type === "international") {
        width = Math.sqrt(Math.PI * sizeScale(d.count) * sizeScale(d.count));
      } else {
        width = Math.sqrt(
          (Math.PI * sizeScale(d.count) * sizeScale(d.count)) / 2
        );
      }
      width = d.type === "resident" ? width * 2 : width;
      return width;
    })
    .attr("height", (d) => {
      if (d.count === 0) {
        return 0;
      }
      if (d.type === "international") {
        height = Math.sqrt(Math.PI * sizeScale(d.count) * sizeScale(d.count));
      } else {
        height = Math.sqrt(
          (Math.PI * sizeScale(d.count) * sizeScale(d.count)) / 2
        );
      }
      height = d.type === "non_resident" ? height * 2 : height;
      return height;
    })
    .attr("x", (d) => {
      if (d.count === 0) {
        return 0;
      }
      return xScale(d.cost / d.count);
    })
    .attr("y", (d) => {
      return yScale(d.averageNTR);
    });

  rects.exit().remove();
};

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
gX = svg.append("g").attr("class", "axis axis--x").call(xAxis);
gY = svg.append("g").attr("class", "axis axis--y").call(yAxis);

var zoom = d3.zoom().on("zoom", () => {
  view.attr("transform", d3.event.transform);
  gX.call(xAxis.scale(d3.event.transform.rescaleX(scales.xScale)));
  gY.call(yAxis.scale(d3.event.transform.rescaleY(scales.yScale)));
});
svg.call(zoom);

d3.selectAll(".checkbox").on("change", update);
update();

function processData() {
  chartData_total = [];
  chartData_resident = [];
  chartData_non_resident = [];
  chartData_international = [];
  choices.forEach((choice) => {
    data.forEach((program) => {
      college = program.primary_program;
      cost = program.total_cost;
      switch (choice) {
        case "resident":
          tmpData = addData(
            college,
            "resident",
            program.resident_fiscal_year_count,
            cost,
            program.resident_average_NTR_per_student,
            program.resident_fiscal_year_NTR
          );
          chartData_resident.push(tmpData);
          break;
        case "non_resident":
          tmpData = addData(
            college,
            "non_resident",
            program.non_resid_fiscal_year_count,
            cost,
            program.non_resid_average_NTR_per_student,
            program.non_resid_fiscal_year_NTR
          );
          chartData_non_resident.push(tmpData);
          break;
        case "international":
          tmpData = addData(
            college,
            "international",
            program.international_fiscal_year_count,
            cost,
            program.international_avg_NTR_per_student,
            program.international_fiscal_year_NTR
          );
          chartData_international.push(tmpData);
          break;
        default:
          tmpData = addData(
            college,
            "total",
            program.total_fiscal_year_count,
            cost,
            program.total_average_NTR_per_student,
            program.total_fiscal_year_NTR
          );
          chartData_total.push(tmpData);
      }
    });
  });
}

function addData(college, type, count, cost, avrageNtr, ntr) {
  tmpData = {
    college: college,
    cost: Number(cost),
    count: Number(count),
    averageNTR: Number(avrageNtr),
    totalNTR: Number(ntr),
    type: type,
  };
  return tmpData;
}

function update() {
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
  console.log(choices);

  processData();
  console.log(chartData_resident);
  console.log(chartData_non_resident);
  console.log(chartData_international);

  drawCircle(view, chartData_total, scales);
  drawRectangle(
    view,
    chartData_resident.concat(chartData_non_resident, chartData_international),
    scales
  );
  //   drawRectangle(view, chartData_non_resident, scales);
  //   drawRectangle(view, chartData_international, scales);
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
  const {
    min_cost,
    max_cost,
    min_count,
    max_count,
    min_NTR,
    max_NTR,
  } = findMinMax(dataSet);
  console.log(min_cost);

  const xScale = d3
    .scaleLinear()
    .domain(padExtent([min_cost, , max_cost]))
    .range(padExtent([1, domainwidth]));
  const yScale = d3
    .scaleLinear()
    .domain(padExtent([min_NTR, max_NTR]))
    .range(padExtent([domainheight, 1]));
  const sizeScale = d3
    .scaleLinear()
    .domain(padExtent([min_count * 2.5, max_count * 2.5]))
    .range(padExtent([5, 150]));
  return { xScale: xScale, yScale: yScale, sizeScale: sizeScale };
}

const tooltipHTML = (d) => {
  return `College: ${d.college}<br>
  Student: ${getStudent(d.type)}<br>
  Fiscal Year Count: ${d.count}<br>
  Total Cost: $${convertMillion(d.cost)}<br>
  Cost Per Student: $${(d.cost / d.count).toFixed(1)}<br>
  Net Tuition Revenue: $${convertMillion(d.totalNTR)}<br>
  Average Net Tuition Revenue: $${d.averageNTR}`;
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
