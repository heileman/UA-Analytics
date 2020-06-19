<h1 align="center">Bubble Chart - Salary vs Number of Jobs</h1>
<h3 align="center"><a href="https://heileman.github.io/UA-Analytics/Program-Opporunity/v1/index.html"><strong>Demo</strong></a>
</h3>

### Introduction
A visualization of the median salary and number of jobs for university programs using [D3.js](https://d3js.org/).

### Datasets
* [**Student Census Data**](https://github.com/heileman/UA-Analytics/blob/master/Program-Opporunity/data/Programs_data.csv) is extracted from [**Academic_Plan_Growth_Analysis_20200403.xlsx (Raw Data sheet)**](https://github.com/heileman/UA-Analytics/blob/master/Program-Opporunity/old/data/Academic%20Plan%20Growth%20Analysis%2020200403%5B1%5D.xlsx) directly.
* [**Number of Jobs and Salary Data**](https://github.com/heileman/UA-Analytics/blob/master/Program-Opporunity/data/Multiple_opportunities.csv) uses data from [**O*NET**](https://www.onetonline.org/). See [**Projected_Demand_calculation.pdf**](https://github.com/heileman/UA-Analytics/blob/master/Program-Opporunity/doc/Projected_Demand_calculation.pdf) for calculation details.

### Data Preprocessing
Scripts of generating data files that are used by the application are in [**data_processing_tool**](https://github.com/heileman/UA-Analytics/tree/master/Program-Opporunity/data_processing_tool). Obtaining the files by `python3 process_Data_salary.py`. Make sure that `pandas` is installed, and [**Programs_data.csv**](https://github.com/heileman/UA-Analytics/blob/master/Program-Opporunity/data/Programs_data.csv) and [**Multiple_opportunities.csv**](https://github.com/heileman/UA-Analytics/blob/master/Program-Opporunity/data/Multiple_opportunities.csv) are in the [**data**](https://github.com/heileman/UA-Analytics/tree/master/Program-Opporunity/data) folder.

### Visualization
* Each bubble is a program. The bubble size represents the number of student enrolled in a program. x and y axes are median salary and number of jobs corresponding to the program. The bubble starts from a big univeristy bubble. As the bubble being popped, it's splited into college bubbles, then department/school bubbles, then degree, then major bubbles. Popped bubbles are listed under Popped Bubbles section.
* Show outstanding job opportunities by clicked potential jobs buttons.
* Click the red vertial `Show University Program Filters` button on the right hand side of the window. Initially, there's only one checkbox which is for the university, more and more checkboxes will show up as bubbles are popped. Scroll down the side window to see all checkboxes as the number goes up.


### Previous Versions
See previous versions [**here**](https://github.com/heileman/UA-Analytics/tree/master/Program-Opporunity/old)
