"""
    a python script to put programs into hierarchical structure details in dataStructure.json
"""

import pandas as pd
from statistics import mean
import json
import random

from online_courses_percentages import get_percentages


def get_percentages_by_department(college_code, department_code, college_mappings, percentages):
    courses = college_mappings[college_code][department_code]
    percentage_list = []
    for course in courses:
        percentage = 0
        if course in percentages:
            percentage = percentages[course]
            if percentage > 1:
                percentage = 1
        percentage_list.append(percentage)
    return percentage_list


undgrad_percentages, grad_percentages = get_percentages()

with open('../data/colleges.json') as f:
    college_mappings = json.load(f)


df = pd.read_csv('../data/data_test.csv')

colleges = df['College Name'].unique()


count = 0
college_objects = []

university_size = 0

university_demands = []
university_percentages = []
for college in colleges:
    college_object = {'id': count,
                      'level': 'college',
                      'college': college,
                      'university': 'University of Arizona',
                      'demand': 0,
                      'percentage': 0,
                      'size': 0,
                      'children': []}
    count += 1

    college_size = 0

    college_demands = []
    college_percentages = []

    college_code = df.loc[(df['College Name'] == college)
                          ]['College Code'].unique()[0]

    departments = df.loc[df['College Name'] ==
                         college]['Department Name'].unique()

    # for each department of current college
    for department in departments:
        department_object = {'id': count,
                             'level': 'department',
                             'university': 'University of Arizona',
                             'college': college,
                             'department': department,
                             'demand': 0,
                             'percentage': 0,
                             'size': 0,
                             'children': []}
        count += 1

        department_size = 0

        department_demands = []
        department_percentages = []

        department_code = df.loc[(df['College Name'] == college) & (
            df['Department Name'] == department)]['Department Code'].unique()[0]

        degrees = df.loc[(df['College Name'] == college) & (
            df['Department Name'] == department)]['Academic Career'].unique()

        # for each degree offered by the department
        for degree in degrees:

            degree_percentages = []
            if degree == 'Undergraduate':
                degree_percentages = get_percentages_by_department(
                    college_code, department_code, college_mappings, undgrad_percentages)
            else:
                degree_percentages = get_percentages_by_department(
                    college_code, department_code, college_mappings, grad_percentages)

            department_percentages += degree_percentages
            college_percentages += degree_percentages
            university_percentages += degree_percentages

            degree_object = {'id': count,
                             'level': 'degree',
                             'degree': degree,
                             'university': 'University of Arizona',
                             'college': college,
                             'department': department,
                             'demand': 0,
                             'percentage': mean(degree_percentages) * 100,
                             'size': 0,
                             'children': []}
            count += 1

            degree_size = 0

            degree_demands = []
            # degree_percentages = []
            majors = df.loc[(df['College Name'] == college) & (
                df['Department Name'] == department) & (
                df['Academic Career'] == degree)]['Plan Description'].unique()

            # for each major
            for major in majors:

                headcounts = df.loc[(df['College Name'] == college) & (
                    df['Department Name'] == department) & (
                    df['Plan Description'] == major) & (
                    df['Academic Career'] == degree)]['Headcount'].values

                demands = df.loc[(df['College Name'] == college) & (
                    df['Department Name'] == department) & (
                    df['Plan Description'] == major) & (
                    df['Academic Career'] == degree)]['Demand'].values

                major_size = int(sum(headcounts))
                major_demand = demands[0]
                major_percentage = random.random() * 100

                # store demands for each level
                degree_demands.append(major_demand)
                department_demands.append(major_demand)
                college_demands.append(major_demand)
                university_demands.append(major_demand)

                # store percentages for each level
                # degree_percentages.append(major_percentage)
                # department_percentages.append(major_percentage)
                # college_percentages.append(major_percentage)
                # university_percentages.append(major_percentage)

                major_object = {'id': count,
                                'level': 'major',
                                'university': 'University of Arizona',
                                'college': college,
                                'department': department,
                                'degree': degree,
                                'major': major,
                                'demand': major_demand,
                                'percentage': major_percentage,
                                'size': major_size,
                                'children': []}
                count += 1
                degree_size += major_size
                degree_object['children'].append(major_object)

            # degree_object['percentage'] = mean(degree_percentages)
            degree_object['demand'] = mean(degree_demands)
            degree_object['size'] = degree_size
            department_size += degree_size
            department_object['children'].append(degree_object)

        department_object['percentage'] = mean(department_percentages) * 100
        department_object['demand'] = mean(department_demands)
        department_object['size'] = department_size
        college_size += department_size
        college_object['children'].append(department_object)

    college_object['percentage'] = mean(college_percentages) * 100
    college_object['demand'] = mean(college_demands)
    college_object['size'] = college_size
    university_size += college_size
    college_objects.append(college_object)

universities = [{'id': count,
                 'level': 'university',
                 'university': 'University of Arizona',
                 'size': university_size,
                 'percentage': mean(university_percentages) * 100,
                 'demand': mean(university_demands),
                 'children': college_objects}]

with open('../data/data.json', 'w') as json_file:
    json.dump(universities, json_file)
