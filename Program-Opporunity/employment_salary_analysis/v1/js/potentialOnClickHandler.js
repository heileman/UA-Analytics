function hide(color) {
  const colorText = color[0].toUpperCase() + color.slice(1);
  d3.selectAll(`#rect-${color}`).style("visibility", "hidden");
  document.getElementById(`${color}-potential-info`).style.display = "none";
  document.getElementById(color).innerText = `Show ${colorText} Potential Jobs`;
}

function show(color) {
  const colorText = color[0].toUpperCase() + color.slice(1);
  d3.selectAll(`#rect-${color}`).style("visibility", "visible");
  document.getElementById(`${color}-potential-info`).style.display = "block";
  document.getElementById(color).innerText = `Hide ${colorText} Potential Jobs`;
}

function setVisibility(color) {
  let rect = document.getElementById(`rect-${color}`);

  if (!rect) {
    document.getElementById("click-before-splited").style.display = "block";
    return;
  }

  document.getElementById("click-before-splited").style.display = "none";

  if (rect.style.visibility === "hidden") {
    show(color);
  } else {
    hide(color);
  }
}

function updateAllButton() {
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

function greenButtonOnClick() {
  setVisibility("green");
  updateAllButton();
}

function redButtonOnClick() {
  setVisibility("red");
  updateAllButton();
}

function whiteButtonOnClick() {
  setVisibility("white");
  updateAllButton();
}

function buttonOnClick() {
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
    colors.map((color) => hide(color));
    document.getElementById("all").innerText = "Show All Potential Jobs";
  } else {
    colors.map((color) => show(color));
    document.getElementById("all").innerText = "Hide All Potential Jobs";
  }
}
