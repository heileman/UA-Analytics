function handleChartBubbleOnClick(d) {
  const children = d.children;

  if (children.length > 0) {
    // add this bubble to the splited bubble list
    splitedBubbleData = splitedBubbleData.concat(d);
    drawPoppedBubbles(poppedSection, splitedBubbleData);

    // remove this bubble and add the children of this bubble to the bubble chart list
    chartBubbleData.splice(chartBubbleData.indexOf(d), 1);
    chartBubbleData = chartBubbleData.concat(children);

    addCheckBoxes(d);
    bubbleChartRescale();
  }
}

function handlePoppedBubbleOnClick(d) {
  deleteChildern(d);

  chartBubbleData = chartBubbleData.concat([d]);
  splitedBubbleData.splice(splitedBubbleData.indexOf(d), 1);

  drawPoppedBubbles(poppedSection, splitedBubbleData);
  deleteCheckBoxes(d);
  bubbleChartRescale();
}

function handleFilterButtonOnClick(e) {
  const right = document.getElementById("existing-program-filters").style.right;

  if (right === "-370px" || right === "") {
    document.getElementById("existing-program-filters").style.right = "0px";
    e.innerHTML = "Hide University Program Filters";
  } else {
    document.getElementById("existing-program-filters").style.right = "-370px";
    e.innerHTML = "Show University Program Filters";
  }
}

function handleCheckBoxOnChange(e) {
  const id = e.id.replace("-checkbox", "");

  if (e.checked) {
    document.getElementById(id).style.visibility = "visible";
    const index = hiddenObjects.indexOf(id);
    if (index > -1) {
      hiddenObjects.splice(index, 1);
    }
  } else {
    document.getElementById(id).style.visibility = "hidden";
    hiddenObjects.push(id);
  }
}

function handleColoredPotentialButtonOnClick(color) {
  setPotentialProgramInfoVisibility(color);
  updateAllPotentialProgramButtons();
}

function handleShowAllPotentialButtonOnClick() {
  const colors = ["green", "white", "red"];
  // check if there are rect
  let noRect = true;

  colors.map((color) => {
    noRect = noRect && !document.getElementById(`rect-${color}`);
  });

  if (noRect) {
    document.getElementById("click-before-splited").style.display = "block";
    return;
  }

  document.getElementById("click-before-splited").style.display = "none";

  const currentButtonText = document.getElementById("all").innerText;
  if (currentButtonText === "Hide All Potential Jobs") {
    colors.map((color) => hidePotentialProgramInfo(color));
    document.getElementById("all").innerText = "Show All Potential Jobs";
  } else {
    colors.map((color) => showPotentialProgramInfo(color));
    document.getElementById("all").innerText = "Hide All Potential Jobs";
  }
}
