// draw all circles on the bubble chart
const drawChartBubbles = (selection, { chartBubbleData }) => {
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
      tooltip.transition().duration(200).style("opacity", 0.7);
      tooltip
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
      d3.select(this).style("cursor", "default").style("opacity", 0.8);
      tooltip.transition().duration(500).style("opacity", 0);
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
const drawSplitedBubbles = (selection, { splitedBubbleData }) => {
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
      return d.label;
    });
  text.exit().remove();
  circles.exit().transition().duration(300).attr("r", 0).remove();
};
