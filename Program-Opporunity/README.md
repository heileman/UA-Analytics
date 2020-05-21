# BubbleChart-Tool (v1-1)
[Demo of the Current Version](https://heileman.github.io/UA-Analytics/Program-Opporunity/v1-1/index-v1-1.html)<br/>
#### Old Versions with data computed using old metrics
* Old metrics, Demand vs Percentage Online with Enrollment as the Bubble Size
  * [Linear Scale](https://heileman.github.io/UA-Analytics/Program-Opporunity/v0-1/index.html)
* Old metrics, Demand vs Enrollment with Percentage Online as the Bubble size
  * [Linear Scale](https://heileman.github.io/UA-Analytics/Program-Opporunity/v2-1/index-v2-1.html)
  * [Power Scale (k = 0.5)](https://heileman.github.io/UA-Analytics/Program-Opporunity/v2-2/index-v2-2.html)


## Datasets
* all courses with course code offered by the university: <br />
[**Active_Courses_with_Enroll_Requirements_4.3.2020.xlsx**](https://github.com/heileman/UA-Analytics/blob/master/Program-Opporunity/data/Active_Courses_with_Enroll_Requirements_4.3.2020.xlsx) (renamed as [**all_courses.xlsx**](https://github.com/heileman/UA-Analytics/blob/master/Program-Opporunity/data/all_courses.xlsx) for data processing)
  
* courses offered online: <br />
  [**online_courses.xls**](https://github.com/heileman/UA-Analytics/blob/master/Program-Opporunity/data/online_courses.xls)
  
* program enrollments and projected demands: <br />
  [**data_test.csv**](https://github.com/heileman/UA-Analytics/blob/master/Program-Opporunity/data/data_test.csv) This is extracted from [**Academic_Plan_Growth_Analysis_20200403.xlsx (Raw Data sheet)**](https://github.com/heileman/UA-Analytics/blob/master/Program-Opporunity/data/Academic%20Plan%20Growth%20Analysis%2020200403%5B1%5D.xlsx)

## Data Preprocessing
The processes follow the rules of,
* If a same program (same Plan Description) is offered at different campuses, combine the Headcounts. For example, if the Computer Science is offered at Main, Online and UA South, and has headcount of 300, 200, 100 accordingly, then the headcount for computer scinece is 600.
* If a program is offered through Online or/and Distance campus, then the percentage of the program is 100% (if a program is not offered online or through distance campus, the percentage is random for now).

* Append `College Code`, `Department Code`, `Current Demand` and `Future Demand` into the dataset.

* Run `python process_Data.py` under [data_processing_tools](https://github.com/heileman/UA-Analytics/tree/master/Program-Opporunity/data_processing_tools) in Terminal to generate ```data.json``` which is the dataset the visualization program is using. (May need to declare that as a JavaScript variable)

* Note that the College of Public Health is not included in visualization since can't compute percentage of courses online due to not knowing what courses are offered under the college

## Visualization
* The bubble chart starts with a big bubble for the entire univeristy, when the bubble is clicked, it splits into multiple smaller bubbles. Each splited bubble is a child program. For example, if the university bubble is clicked, it splits into bubbles representing colleges. If a college bubble is clicled, it splits to department bubbles, etc. Majors(Plan Decriptions) are the smallest bubbles.

* There are two radio buttons on the right for choosing between `Current Demand` and `Future Demand` options. The default option is `Current Demand`.

* The radian(size) of the bubble is represented the program's enrollment, the percentage of a program online and the demand(Billion $) for the program construct the x and y coordinates of the bubble. Colleges are represented by different colors while the color for the university if Navy Blue.

* The point (median of the demand, 50%) is the origin. The demand data is right skewed so median is a good measurement for x-axis.

## Current Calculation of Percentage of Program Online
* Percentage of program online for a department is computed by the number of online courses offered by a department divided by the total courses offered by the department(graduate and undergraduate degree are separate, if a course number > 500, it's a graduate course). The percentage for a college is the average of the percentages of all departments under this college. The percentage for the university is the average of the percentages of all colleges.

* Note that in the datasets, there are more courses offered online than all active courses in many cases. This may be caused by some onine courses are no longer active, so computing percentages for degree, major, college and univeristy using percentage of a major online could be a better option(in progress).

## Calculation of Program Demands (update this)
* Source: [O*NET](https://www.onetonline.org/)
-The demand data is taken from the [O*NET](https://www.onetonline.org/). For a specific program, there may be more than one category of a profession. For these cases, we are taking a weighted average demand for that program. If the annual median/mean salary of demand is W, the number of employees currently working is N, then the Current demand is =W*N, and for i% projectile growth, the projected growth demand is= (1+i)*W*N. As for the multiple categories of demand for a program, we replace these estimates with the weighted average values. 

### In progress
- The percentage of program online for major is still in progress. The approach is to summarize a set of courses needed for a student to finish a degree in a major, then count the number of courses in the set that are offered online. The percentage is calculated as number of courses the student has to take for the major divided by the total number of courses needed for the major. 

### Current Challenge(s)
- No good metrics for percentage of a program online. Possible solutions could be,<br/>
  1. Go through all degree plans among colleges and campuses, compute the percentage of courses online in the degree plan(Very time consuming, and may need degree plan infrastructure being set up first).
  2. More suitable datasets (Don't know if there are any).
  3. Use `Median/Mean Salary` vs `Number of Jobs Occupied/Avaliable` as the coordinate system instead, then no needs for percentage of program online (Doable but no percentage visualization).
