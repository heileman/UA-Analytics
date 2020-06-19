function hidePotentialProgramInfo(color) {
  const colorText = color[0].toUpperCase() + color.slice(1);
  d3.selectAll(`#rect-${color}`).style("visibility", "hidden");
  document.getElementById(`${color}-potential-info`).style.display = "none";
  document.getElementById(color).innerText = `Show ${colorText} Potential Jobs`;
}

function showPotentialProgramInfo(color) {
  const colorText = color[0].toUpperCase() + color.slice(1);
  d3.selectAll(`#rect-${color}`).style("visibility", "visible");
  document.getElementById(`${color}-potential-info`).style.display = "block";
  document.getElementById(color).innerText = `Hide ${colorText} Potential Jobs`;
}

function setPotentialProgramInfoVisibility(color) {
  let rect = document.getElementById(`rect-${color}`);

  if (!rect) {
    document.getElementById("click-before-splited").style.display = "block";
    return;
  }

  document.getElementById("click-before-splited").style.display = "none";

  if (rect.style.visibility === "hidden") {
    showPotentialProgramInfo(color);
  } else {
    hidePotentialProgramInfo(color);
  }
}

function updateAllPotentialProgramButtons() {
  const greenButtonText = document.getElementById("green").innerText;
  const redButtonText = document.getElementById("red").innerText;
  const whiteButtonText = document.getElementById("white").innerText;

  if (
    greenButtonText === "Show Green Potential Jobs" &&
    redButtonText === "Show Red Potential Jobs" &&
    whiteButtonText === "Show White Potential Jobs"
  ) {
    document.getElementById("all").innerText = "Show All Potential Jobs";
  } else if (
    greenButtonText === "Hide Green Potential Jobs" &&
    redButtonText === "Hide Red Potential Jobs" &&
    whiteButtonText === "Hide White Potential Jobs"
  ) {
    document.getElementById("all").innerText = "Hide All Potential Jobs";
  }
}
