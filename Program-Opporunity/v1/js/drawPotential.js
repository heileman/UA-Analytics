const drawSquares = (selection, potentialJobData) => {
  const squares = selection
    .selectAll("rect")
    .attr("class", "rect")
    .data(potentialJobData);
  squares
    .enter()
    .append("rect")
    .attr("class", "rect")
    .attr("id", (d) => {
      switch (d.color) {
        case "green":
          return "rect-green";
        case "red":
          return "rect-red";
        case "white":
          return "rect-white";
        default:
          return "rect";
      }
    })
    .style("visibility", "hidden")
    .merge(squares)
    .attr("x", (d) => {
      return xScale(d.medianSalary);
    })
    .attr("y", (d) => {
      return yScale(d.numberEmployee);
    })
    .attr("width", 15)
    .attr("height", 15)
    .attr("stroke", "black")
    .style("fill", (d) => d.color)
    .on("mouseover", function (d) {
      tooltip.transition().duration(200).style("opacity", 0.95);
      tooltip
        .html(potentialProgramTooltipHTML(d))
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
    })
    .on("mouseout", function (d) {
      d3.select(this)
        .style("cursor", "default")
        .style("opacity", 0.8)
        .style("stroke-width", 1);
      tooltip.transition().duration(500).style("opacity", 0);
    });
};
