# Revenue and Cost Bubble Chart
[**Demo**](https://heileman.github.io/UA-Analytics/Cost-NTR/index-v2.html)

## Datasets
Original Dataset:
* NTR<br/>
[**FY2019_NTR_By_Career_Level_Program_Plan_Residency[1].xlsx**]()<br/>
This dataset contains data among different(in-state, out-of-state and international) students at different colleges, including `Fall Census Count`, `Fiscal Year Count`, `Fiscal Year NTR` and `Average NTR Per Student`.
* Cost<br/>
[**JLBC Cost Study Last Updated 11.10.17_excel for ABOR.xlsx**]()<br/>
This dataset contains data of `Total Cost` at different colleges at year of 2016.

## Data Preprocessing
### Dataset Entries
* `Fiscal Year`: Year of the dataset<br/>
* `Career Level`: Graduate or Undergraduate<br/>
* `Primary Program`: College Name<br/>
* `< *TYPE* >_fall_census_count`: Census Count of Students Enrolled in Fall<br/>
* `< *TYPE* >_fiscal_year_count`: Census Count of Students Enrolled in the Academic Year<br/>
* `< *TYPE* >_fiscal_year_NTR`: Total Net Tuition Revenue of the Year<br/>
* `< *TYPE* >_average_NTR_per_student`: Net Tuition Revenue per Student<br/>
* `total_cost`: Total Cost(Instruction, Public Service, Academic Support, etc.) of a college at year of 2016<br/>
* `E&G`<br/>

Note: `< *TYPE* >` can be replaced by `total`(all type of students), `resident`(AZ Resident), `non-resident`(Out-of-State) and `international`(International Student)

### Merge Cost and NTR Datasets
Fill the entries using original cost and NTR datasets. It yields a workable dataset [**cost_NTR.csv**](https://github.com/heileman/UA-Analytics/blob/master/Cost-NTR/data/cost_NTR.csv)

### Generate the Dataset for Visualization
Place [**processData.py**](https://github.com/heileman/UA-Analytics/blob/master/Cost-NTR/data/processData.py) and [**cost_NTR.csv**](https://github.com/heileman/UA-Analytics/blob/master/Cost-NTR/data/cost_NTR.csv) under the same directory, run `python processData.py` in Terminal to generate ```data.json``` which is the dataset the visualization program is using.


## Visualization
`Cost Per Student`(x-axis) equals to `total_cost / < *TYPE* >_fiscal_year_count`, `Average NTR Per Student`(y-axis) equals to `< *TYPE* >_average_NTR_per_student` and `< *TYPE* >_fiscal_year_count`is the circle size.</br></br>
There are four checkboxes. Each checkbox represents one type of students or all types of students. The "All Students"(AZ Residents, Out of State Students and International Students) option is selected by default. When a single option is selected(besides "All Students"), the chart displays `Cost Per Student` vs `Average NTR Per Student` with circle size being the number of students for different colleges in terms of selected student type. When multiple student types are selected(except "All Students"), `Average NTR Per Student` is computed by total NTR of all selected types of students being divided by the total number of students in selected types, `Cost Per Student` is computed as the college's total cost being divided by the total number of students in selected types and the total number of students is the sum of students in each type.</br></br>
An user can select either "All Students" or one or more any other options. If the user selects nothing, it displays nothing.</br></br>


## In progress
- For some reason, only data of undergraduate programs are processed, working on processing data of graduate and certificate programs.
- Make bubbles splitable, click a bubble then it splited into small bubbles which are its sub-programs.
