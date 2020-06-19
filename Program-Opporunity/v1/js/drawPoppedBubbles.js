// draw all circles splited
const drawPoppedBubbles = (selection, splitedBubbleData) => {
  const circles = selection
    .selectAll("circle")
    .data(splitedBubbleData, (d) => d.id);
  circles
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("r", 0)
    .on("click", handlePoppedBubbleOnClick)
    .merge(circles)
    .attr("cx", 25)
    .attr("cy", (d, i) => {
      return (i + 1) * 15 * 2 + 10;
    })
    .attr("stroke", (d) => {
      return "black";
    })
    .on("mouseover", function (d) {
      if (d.children.length > 0) {
        d3.select(this).style("cursor", "pointer");
      }
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(bubbleTooltipHTML(d))
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
