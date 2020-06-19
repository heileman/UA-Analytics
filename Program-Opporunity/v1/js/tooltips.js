const bubbleTooltipHTML = (d) => {
  program = "";
  enrollment = "<br/>Enrollment: " + d.size;
  demand = "<br/>Weighted Average Salary: $" + d.averageSalary.toFixed(1);
  percentage =
    "<br/>Average Number of Employees: " + d.averageNumEmployee.toFixed(0);

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

const potentialProgramTooltipHTML = (d) => {
  return `Job: ${d.Job}<br/>
  Degree Required: ${d.degreeRequired}<br/>
  Median Salary: $${d.medianSalary}<br>
  Number of Employee: ${d.numberEmployee}<br/>
  Percentage of Growth: ${d.percentageGrowth * 100}%<br/>`;
};
