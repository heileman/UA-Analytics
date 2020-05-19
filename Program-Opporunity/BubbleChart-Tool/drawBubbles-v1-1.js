// draw all circles on the bubble chart
const drawChartBubbles = (selection, chartBubbleData, demandSelection) => {
  const circles = selection
    .selectAll("circle")
    .attr("class", "circle")
    .data(
      // enter the data in descending order so that big bubbles wouldn't cover little ones
      chartBubbleData.sort((first, second) => {
        return second.size - first.size;
      }),
      (d) => d.id
    );
  circles
    .enter()
    .append("circle")
    .attr("r", 0)
    .on("click", circleClicked)
    .attr("class", "circle")
    .merge(circles)
    .attr("cx", (d) => {
      if (demandSelection == "future-demand") {
        return xScale(d.future_demand);
      }
      return xScale(d.demand);
    })
    .attr("cy", (d) => {
      return yScale(d.percentage);
    })
    .style("fill", (d) => {
      return colorScale(d.college);
    })
    .style("opacity", 0.8)
    .on("mouseover", function (d) {
      if (d.children.length > 0) {
        d3.select(this)
          .style("cursor", "pointer")
          .style("opacity", 0.95)
          .style("stroke-width", 3);
      }
      tooltip.transition().duration(200).style("opacity", 0.95);
      tooltip
        .html(tooltipHTML(d))
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
    })
    .on("mouseout", function (d) {
      d3.select(this).style("cursor", "default").style("opacity", 0.8);
      tooltip.transition().duration(500).style("opacity", 0);
    })
    .transition()
    .duration(500)
    .attr("r", (d) => {
      // if (d.size > 10000) {
      //   return sizeScale(10000);
      // }
      return sizeScale(d.size);
    });

  circles.exit().transition().duration(300).attr("r", 0).remove();
};

// draw all circles splited
const drawSplitedBubbles = (selection, splitedBubbleData) => {
  const circles = selection
    .selectAll("circle")
    .data(splitedBubbleData, (d) => d.id);
  circles
    .enter()
    .append("circle")
    .attr("class", "circle")
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
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(tooltipHTML(d))
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
    })
    .on("mouseout", function (d) {
      d3.select(this).style("cursor", "default");
      tooltip.transition().duration(500).style("opacity", 0);
    })
    .transition()
    .attr("r", 8)
    .style("opacity", 0.7)
    .attr("fill", (d) => {
      return colorScale(d.college);
    });

  const text = selection.selectAll("text").data(splitedBubbleData, (d) => d.id);
  text
    .enter()
    .append("text")
    .merge(text)
    .attr("x", 10)
    .attr("y", (d, i) => {
      return (i + 2) * 15 * 2;
    })
    .text(function (d) {
      if (d.level == "university") {
        return d.university;
      }
      if (d.level == "college") {
        return d.college;
      }
      if (d.level == "department") {
        return d.department;
      }
      if (d.level == "degree") {
        return d.degree;
      }
      if (d.level == "major") {
        return d.major;
      }
    });
  text.exit().remove();
  circles.exit().transition().duration(300).attr("r", 0).remove();
};

const tooltipHTML = (d) => {
  program = "";
  enrollment = "<br/>Enrollment: " + d.size;
  demand = "<br/>Projected Demand: " + d.demand;
  percentage = "<br/>% of Program online: " + d.percentage;

  if (d.level == "university") {
    program = "University: " + d.university;
  }
  if (d.level == "college") {
    program = "University: " + d.university + "<br/>College: " + d.college;
  }
  if (d.level == "department") {
    program =
      "University: " + d.university + "<br/>Department: " + d.department;
  }
  if (d.level == "degree") {
    program =
      "University: " +
      d.university +
      "<br/>College: " +
      d.college +
      "<br/>Department: " +
      d.department +
      "<br/>Degree: " +
      d.degree;
  }
  if (d.level == "major") {
    program =
      "University: " +
      d.university +
      "<br/>College: " +
      d.college +
      "<br/>Department: " +
      d.department +
      "<br/>Degree: " +
      d.degree +
      "<br/>Major: " +
      d.major;
  }
  return program + enrollment + demand + percentage;
};
