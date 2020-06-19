// draw all circles on the bubble chart
const drawChartBubbles = (selection, chartBubbleData) => {
  //   showCheckBoxes(chartBubbleData);
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
    .on("click", handleChartBubbleOnClick)
    .merge(circles)
    .attr("id", (d) => {
      return `${d.id}`;
    })
    .attr("cx", (d) => {
      return xScale(d.averageSalary);
    })
    .attr("cy", (d) => {
      return yScale(d.averageNumEmployee);
    })
    .style("fill", (d) => {
      return colorScale(d.college);
    })
    .attr("stroke", (d) => {
      return "black";
    })
    .style("opacity", 0.8)
    .on("mouseover", function (d) {
      if (d.children.length > 0) {
        d3.select(this)
          .style("cursor", "pointer")
          .style("opacity", 0.95)
          .style("stroke-width", 1.5);
      }
      tooltip.transition().duration(200).style("opacity", 0.95);
      tooltip
        .html(bubbleTooltipHTML(d))
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
    })
    .on("mouseout", function (d) {
      d3.select(this)
        .style("cursor", "default")
        .style("opacity", 0.8)
        .style("stroke-width", 1);
      tooltip.transition().duration(500).style("opacity", 0);
    })
    .transition()
    .duration(500)
    .attr("r", (d) => {
      return sizeScale(d.size);
    });

  circles.exit().transition().duration(300).attr("r", 0).remove();
};
