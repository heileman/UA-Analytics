# BubbleChart-Tool
clone the program and repo and open `index.html` in browser.

## Datasets
* all courses with course code offered by the university: <br />
**Active_Courses_with_Enroll_Requirements_4.3.2020.xlsx** (renamed as **all_courses.xlsx** for data processing)
  
* courses offered online: <br />
  **online_courses.xls**
  
* program enrollments and projected demands: <br />
  **data_test.csv** This is extracted from **Academic_Plan_Growth_Analysis_20200403.xlsx (Raw Data sheet)**

## Visualization
* The bubble chart starts with a big bubble for the entire univeristy, when the bubble is clicked, it splits into multiple smaller bubbles. Each splited bubble is a child program. For example, if the university bubble is clicked, it splits into bubbles representing colleges. If a college bubble is clicled, it splits to department bubbles.

* The radian(size) of the bubble is represented the program's enrollment, the percentage of a program online and the projected demand for the program construct the x and y coordinates of the bubble. Colleges are represented by different colors while the color for the university if Navy Blue.

* (median of projected demand, 50) is the origin. The projected demand data is right skewed so median is a good measurement.

## Current Calculation of Percentage of Program Online
* Percentage of program online for a department is computed by the number of online courses offered by a department divided by the total courses offered by the department(graduate and undergraduate degree are separate, if a course number > 500, it's a graduate course). The percentage for a college is the average of the percentages of all departments under this college. The percentage for the university is the average of the percentages of all colleges.

* Note that in the datasets, there are more courses offered online than all active courses in many cases. This may be caused by some onine courses are no longer active, so computing percentages for degree, major, college and univeristy using percentage of a major online could be a better option(in progress).

### In progress
- The percentage of program online for major is still in progress. The approach is to summarize a set of courses needed for a student to finish a degree in a major, then count the number of courses in the set that are offered online. The percentage is calculated as number of courses the student has to take for the major divided by the total number of courses needed for the major. 
