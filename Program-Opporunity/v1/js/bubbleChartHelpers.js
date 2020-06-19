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

function padExtent(e, p) {
  if (p === undefined) p = 1;
  return [e[0] - p, e[1] + p];
}
