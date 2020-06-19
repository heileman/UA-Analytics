const colorScale = d3
  .scaleOrdinal()
  .domain([
    "University of Arizona",
    "Col Arch Plan & Landscape Arch",
    "College of Agric and Life Sci",
    "College of Applied Sci & Tech",
    "College of Education",
    "College of Engineering",
    "College of Fine Arts",
    "College of Humanities",
    "College of Medicine - Phoenix",
    "College of Medicine - Tucson",
    "College of Nursing",
    "College of Pharmacy",
    "College of Public Health",
    "College of Science",
    "College of Social & Behav Sci",
    "Colleges of Letters Arts & Sci",
    "Eller College of Management",
    "Graduate College",
    "Honors College",
    "James C Wyant Coll Optical Sci",
    "James E Rogers College of Law",
    "Letters Arts & Sci Division",
    "Vice Provost Acad Affrs Div",
    "Job with less good median salary and empolyment - don’t' have",
    "Job with good median salary and empolyment - don’t' have",
    "Job with good median salary and empolyment - have",
  ])
  .range([
    "#002147",
    "#A52A2A",
    "#F2C649",
    "#C49102",
    "#ADD8E6",
    "#FFA500",
    "#B2B2B2",
    "#999999",
    "#008000",
    "#228B22",
    "#FBCEB1",
    "#556B2F",
    "#FF9999",
    "#FFDF00",
    "#9FA91F",
    "#C0C0C0",
    "#FAD6A5",
    "#541E1B",
    "#FF0000",
    "#CEB180",
    "#800080",
    "#000000",
    "#001540",
    "#ffffff",
    "#ff0000",
    "#00ff00",
  ]);

// the scaler for the circle size and enrollments
// if the enrollment is greater than 100
const sizeScale = d3
  .scaleLinear()
  .domain(padExtent([0, 50000]))
  .range(padExtent([5, 130]));

let xScale = null;
let yScale = null;
