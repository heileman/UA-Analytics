function handleFilterButtonOnClick(e) {
  const right = document.getElementById("existing-program-filters").style.right;
  console.log(right);
  if (right === "-370px" || right === "") {
    document.getElementById("existing-program-filters").style.right = "0px";
    e.innerHTML = "Hide University Program Filters";
  } else {
    document.getElementById("existing-program-filters").style.right = "-370px";
    e.innerHTML = "Show University Program Filters";
  }
}
