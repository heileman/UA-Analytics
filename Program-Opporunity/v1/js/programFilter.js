let hiddenObjects = [];

// university => college => department => degree => major

// the checkbox for the first bubble
function initiateCheckBox(program) {
  let programCheckboxes = document.getElementById(constructDivID(program.id));
  programCheckboxes.innerHTML = "";
  let childDiv = "";
  for (child of program.children) {
    childDiv += `<div id="${constructDivID(child.id)}"></div>`;
  }
  const programID = constructCheckBoxID(program.id);
  let check = "";
  if (isVisible(program.id)) {
    check = "checked";
  }
  let collegeStyle = "";
  if (program.level === "college") {
    collegeStyle = "border-top";
  }
  programCheckboxes.innerHTML += `
        <div class=${collegeStyle}>
            <fieldset>
                <legend>
                    <div class="ui checkbox">
                        <input type="checkbox" id="${programID}" name="${programID}" ${check} onchange="handleCheckBoxOnChange(this)" />
                        <label>${program[program.level]}</label>
                    </div>
                </legend>
                ${childDiv}
            </fieldset>
        </div>`;
}

// once a bubble is popped, add checkboxes for new bubbles
function addCheckBoxes(program) {
  disableCheckBox(program, true);
  const children = program.children;
  for (child of children) {
    initiateCheckBox(child);
  }
}

// once a popped bubbles is click, remove child bubbles, add parent bubble
function deleteCheckBoxes(program) {
  disableCheckBox(program, false);
  initiateCheckBox(program);
}

function disableCheckBox(program, status) {
  document.getElementById(constructCheckBoxID(program.id)).disabled = status;
}

function isVisible(program) {
  if (hiddenObjects.includes(program)) {
    return false;
  }
  return true;
}

function constructCheckBoxID(id) {
  return id + "-checkbox";
}

function constructDivID(id) {
  return id + "-div";
}
