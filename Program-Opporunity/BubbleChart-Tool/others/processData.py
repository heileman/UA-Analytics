"""

    a python script to put programs into hierarchical structure details in dataStructure.json
    
"""

import pandas as pd
import json
import random

df = pd.read_csv('./data/data.csv')

colleges = df['College Name'].unique()
# print(colleges)

count = 0
college_objects = []
university_size = 0
for college in colleges:
    college_object = {'id': count,
                      'label': college,
                      'university': 'University of Arizona',
                      'percentage': random.randint(0, 100),
                      'demand': random.randint(1, 10),
                      'college': college,
                      'children': []}
    count += 1
    college_size = 0

    departments = df.loc[df['College Name'] ==
                         college]['Department Name'].unique()
    for department in departments:
        department_object = {'id': count,
                             'university': 'University of Arizona',
                             'college': college,
                             'department': department,
                             'label': department,
                             'percentage': random.randint(0, 100),
                             'demand': random.randint(1, 10),
                             'children': []}
        count += 1
        department_size = 0

        majors = df.loc[(df['College Name'] == college) & (
            df['Department Name'] == department)]['Plan Description'].unique()

        for major in majors:
            major_object = {'id': count,
                            'label': major,
                            'university': 'University of Arizona',
                            'college': college,
                            'department': department,
                            'percentage': random.randint(0, 100),
                            'demand': random.randint(1, 10),
                            'children': []}
            count += 1
            major_size = 0

            degrees = df.loc[(df['College Name'] == college) & (
                df['Department Name'] == department) & (
                df['Plan Description'] == major)]['Academic Career'].unique()

            for degree in degrees:
                degree_object = {'id': count,
                                 'label': degree,
                                 'university': 'University of Arizona',
                                 'college': college,
                                 'department': department,
                                 'percentage': random.randint(0, 100),
                                 'demand': random.randint(1, 10),
                                 'children': []}
                count += 1
                degree_size = 0

                campuses = df.loc[(df['College Name'] == college) & (
                    df['Department Name'] == department) & (
                    df['Plan Description'] == major) & (
                    df['Academic Career'] == degree)]['Campus'].unique()
                # print(campuses)

                for campus in campuses:
                    campus_object = {'id': count,
                                     'label': '{} campus'.format(campus),
                                     'university': 'University of Arizona',
                                     'college': college,
                                     'department': department,
                                     'percentage': random.randint(0, 100),
                                     'demand': random.randint(1, 10),
                                     'children': []}
                    count += 1

                    headcounts = campuses = df.loc[(df['College Name'] == college) & (
                        df['Department Name'] == department) & (
                        df['Plan Description'] == major) & (
                        df['Academic Career'] == degree) & (
                        df['Campus'] == campus)]['Headcount'].values
                    program_size = int(sum(headcounts))
                    degree_size += program_size

                    program_object = {'id': count,
                                      "label": campus,
                                      "size": program_size,
                                      'university': 'University of Arizona',
                                      'college': college,
                                      'department': department,
                                      'percentage': random.randint(0, 100),
                                      'demand': random.randint(1, 10),
                                      "children": []}
                    count += 1

                    degree_object['children'].append(program_object)

                degree_object['size'] = degree_size
                major_size += degree_size
                major_object['children'].append(degree_object)

            major_object['size'] = major_size
            department_size += major_size
            department_object['children'].append(major_object)

        department_object['size'] = department_size
        college_size += department_size
        college_object['children'].append(department_object)

    college_object['size'] = college_size
    university_size += college_size
    college_objects.append(college_object)

universities = [{'id': count,
                 'label': 'University of Arizona',
                 'size': university_size,
                 'university': 'University of Arizona',
                 'percentage': random.randint(0, 100),
                 'demand': random.randint(1, 10),
                 'children': college_objects}]

# print(university_size)
with open('./data/data.json', 'w') as json_file:
    json.dump(universities, json_file)
