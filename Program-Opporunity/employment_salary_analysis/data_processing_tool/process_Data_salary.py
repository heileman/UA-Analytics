"""
    a python script to put programs into hierarchical structure details in dataStructure.json
"""

import pandas as pd
import json
from getDemandData import getData


df = pd.read_csv('../data/Programs_data.csv')
df['Major at Campus'] = df['Campus'] + " - " + df['Plan Description']

colleges = df['College Name'].unique()

count = 0
college_objects = []

university_size = 0
university_majors = []

for college in colleges:
    college_object = {'id': count,
                      'level': 'college',
                      'college': college,
                      'university': 'University of Arizona',
                      'averageSalary': 0,
                      'averageNumEmployee': 0,
                      'size': 0,
                      'children': []}
    count += 1

    college_size = 0
    college_majors = []

    departments = df.loc[df['College Name'] ==
                         college]['Department Name'].unique()

    # for each department of current college
    for department in departments:
        department_object = {'id': count,
                             'level': 'department',
                             'university': 'University of Arizona',
                             'college': college,
                             'department': department,
                             'averageSalary': 0,
                             'averageNumEmployee': 0,
                             'size': 0,
                             'children': []}
        count += 1

        department_size = 0
        department_majors = []

        degrees = df.loc[(df['College Name'] == college) & (
            df['Department Name'] == department)]['Academic Career'].unique()

        # for each degree offered by the department
        for degree in degrees:

            degree_object = {'id': count,
                             'level': 'degree',
                             'degree': degree,
                             'university': 'University of Arizona',
                             'college': college,
                             'department': department,
                             'averageSalary': 0,
                             'averageNumEmployee': 0,
                             'size': 0,
                             'children': []}
            count += 1

            degree_size = 0
            degree_majors = []

            majors = df.loc[(df['College Name'] == college) & (
                df['Department Name'] == department) & (
                df['Academic Career'] == degree)]['Major at Campus'].unique()

            # for each major
            for major in majors:

                headcounts = df.loc[(df['College Name'] == college) & (
                    df['Department Name'] == department) & (
                    df['Major at Campus'] == major) & (
                    df['Academic Career'] == degree)]['Headcount'].values

                major_size = int(sum(headcounts))
                (numEmployee, averageSalary) = getData([major])

                # store demands for each level
                degree_majors.append(major)
                department_majors.append(major)
                college_majors.append(major)
                university_majors.append(major)

                major_object = {'id': count,
                                'level': 'major',
                                'university': 'University of Arizona',
                                'college': college,
                                'department': department,
                                'degree': degree,
                                'major': major,
                                'averageSalary': averageSalary,
                                'averageNumEmployee': numEmployee,
                                'size': major_size,
                                'children': []}
                count += 1
                degree_size += major_size
                degree_object['children'].append(major_object)

            (numEmployee, averageSalary) = getData(degree_majors)
            degree_object['averageSalary'] = averageSalary
            degree_object['averageNumEmployee'] = numEmployee
            degree_object['size'] = degree_size
            department_size += degree_size
            department_object['children'].append(degree_object)

        (numEmployee, averageSalary) = getData(department_majors)
        department_object['averageSalary'] = averageSalary
        department_object['averageNumEmployee'] = numEmployee
        department_object['size'] = department_size
        college_size += department_size
        college_object['children'].append(department_object)

    (numEmployee, averageSalary) = getData(college_majors)
    college_object['averageSalary'] = averageSalary
    college_object['averageNumEmployee'] = numEmployee
    college_object['size'] = college_size
    university_size += college_size
    college_objects.append(college_object)

(numEmployee, averageSalary) = getData(university_majors)
universities = [{'id': count,
                 'level': 'university',
                 'university': 'University of Arizona',
                 'size': university_size,
                 'averageSalary': averageSalary,
                 'averageNumEmployee': numEmployee,
                 'children': college_objects}]

with open('../data/data.json', 'w') as json_file:
    json.dump(universities, json_file)
