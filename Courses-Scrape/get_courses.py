import os
import re
import json
import copy
import csv

possible_variables = ['Honors Course: ',
                      'General Education: ',
                      'Concurrent Enrollment: ',
                      'Writing Emphasis: ',
                      'Humanity: ',
                      'Description: ',
                      'Grading basis: ',
                      'Main Campus: ',
                      'Enrollment requirement: ',
                      'Interdisciplinary Interest Area: ',
                      'Field trip: ',
                      'Home department: ',
                      'Recommendations and additional information: ',
                      'Career: ',
                      'Repeatable: ',
                      'Course Components:',
                      'Course typically offered:',
                      'Equivalent to: ',
                      'Also offered as: ',
                      'Co-convened with: ']


def get_colleges(path):
    """ Get the college, department codes

    Load the college, departement codes json file,
    in the file, college codes are keys of a json object, 
    and the values of the json object is a json object of department codes
    with the department codes being keys a list of course codes offered 
    by the department.
    """
    f = open(path)
    data = json.load(f)
    f.close()
    return data


def count_whitespace(line):
    """ Count the number of white space in a line

    Count the number of white space in a line
    """
    count = 0
    for i in line:
        if i.isspace():
            count = count+1
    return count


def peek_line(f):
    """ Peek the next line

    Return the next line but the line pointer doesn't move.
    """
    pos = f.tell()
    line = f.readline()
    f.seek(pos)
    return line


def not_contain_variables(line, variables):
    """ Check if the line contains one of the given variables 

    If the given line not empty, and the all given variables cannot
    be found in the line, return true; otherwise, return false.
    """
    result = line.replace(' ', '') != '\n'
    for v in variables:
        result = result and re.findall(r"\A{}".format(v), line) == []
    return result


def course_info_capturer(course, info_str, save_info, fp, college_code, department_code):
    """ Capture the course information from the given string

    First, check whether the information is continuing in next line, if it doesn't,
    save the information into course using the given save_info function,
    and reset the information string. If the information is not continueing in next line,
    simply return the original inputs.
    """
    in_next_line = not_contain_variables(peek_line(fp), possible_variables)
    if not in_next_line:
        course = save_info(info_str.strip(), course,
                           college_code, department_code)
        info_str = ''

    return course, info_str, in_next_line


def save_basic_info(info_str, course, college_code, department_code):
    """ Save college_code, department_code, course code, number, title, credits information

    The format of course basic information string is following,
    <course prefix> <course number>: <course name> (<creidt hour> units)

    The information string is splitted into two parts by ':', then split the first part by space
    to extract course code and course number, subtract (<creidt hour>) from the second part to
    extract course title, and the rest is course credits. The credit information may be in a form
    of a range, the first digit is the mim credit, the rest of the digit(s) are the max credit.

    If the course number is greater than 500, return None, which is an indication of stopping for 
    get_courses function.
    """
    strs = re.split(":", info_str, 1)

    # save college code and department code
    course['college_code'] = college_code
    course['department_code'] = department_code

    # extract course code, course number and course title
    course['course_code'] = re.split(' ', info_str, 1)[0]
    course['course_number'] = strs[0].strip().split(" ")[1]

    if int(course['course_number'][0]) >= 5:
        return None

    course['course_title'] = re.sub(
        r"[\(\[].*?[\)\]]", "", ' '.join(strs[1:]).strip()).strip()

    # extract course credits
    credit_group = re.findall(
        r"\((\w+)\)", info_str.replace(' ', '').replace('-', ''))
    credit_str = credit_group[-1]
    course['credits_min'] = credit_str[0]
    if credit_str[1].isnumeric():
        credit = credit_str[1]
        if credit_str[2].isnumeric():
            course['credits_max'] = credit + credit_str[2]
        else:
            course['credits_max'] = credit
    else:
        course['credits_max'] = credit_str[0]
    return course


def save_description(info_str, course, college_code, department_code):
    """ Save the course description from the information string

    Description of the course can be obtained by spliting the 
    information string by the first 'Description: ' a list,
    then join the rest of the list, then strip extra white spaces.
    """
    description = ' '.join(re.split('Description: ', info_str, 1)[1:])
    course['description'] = description.replace('  ', ' ').strip()
    return course


def get_terms(line, year):
    """ Return the terms as a list

    Convert the line containing sessions to a list of terms.
    Each term in the form of < Session > < Year >.
    If the line says the course is offered odd/even years only, then increment
    the year by one if the course is offered in odd year and the year is even, 
    or if the course is offered in even year and the year is odd.
    """
    term_str = ' '.join(re.split("Main Campus: ", line)[1:])
    if 'even' in term_str:
        if year % 2 != 0:
            year += 1
    elif 'odd' in term_str:
        if year % 2 == 0:
            year += 1
    term_str = re.sub(r"[\(\[].*?[\)\]]", "", term_str)
    return ['{} {}'.format(t, year).replace('  ', ' ') for t in term_str.split(', ')]


def save_course(courses, course, terms):
    """ Save the course into the course list

    Append the course by terms. If a course is offered in multiple terms,
    save each of the term into the course separately, then append the course into the course list.
    i.e. terms = ["Fall 2020", "Spring 2020"], course = { ... }, courses = [], after the function finishes, 
    courses = [{ ..., "academic_period": "Fall 2020"}, { ..., "academic_period": "Spring 2020"}]
    """
    for term in terms:
        course_tmp = copy.deepcopy(course)
        course_tmp['academic_period'] = term
        courses.append(course_tmp)
    return courses, {}


def get_courses(year, pdf, pdfs_path, college_code, department_code, tmp_output_path):
    """ Scan the PDF file line by line, save the information needed

    Check the file line by line, if the line contains course basic (prefix, number, title, credit),
    description and term information, save it to the course dictionary, if the all needed information
    of a course is captured, append the course into the course list. Once the entire file is finished,
    or a course above 500 level is encountered, return the course list.

    This course list should only contain the courses having the same prefix.
    """
    print('Extracting file: ' + pdf)

    # convert pdf to text
    cmd = 'pdf2txt.py ./{}/{} > {}'.format(pdfs_path, pdf, tmp_output_path)
    os.system(cmd)

    # course prefix, major name and term list
    prefix = ''
    major_name = ''

    # course list and course dictionary
    courses = []
    course = {}

    # temp strings for saving basic information and description
    basic_info_str = ''
    description_info_str = ''

    # temp flags for indicating if there are information continuing in next line
    basic_info_in_next_line = False
    description_in_next_line = False

    with open(tmp_output_path) as fp:
        line = fp.readline()
        while line:

            line = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\xff]',
                          '', line).replace('\n', '').strip()

            # check if the line is a course prefix
            # this is in a format of "<major name> (<major/course prefix>)"
            if prefix == '' and re.findall(r"\((\w+)\)", line):
                prefix = re.search(r"\((\w+)\)", line).group(1)
                major_name = re.split(r'\(', line)[0].strip()
                continue

            # if the course prefix is captured
            if prefix != '':
                # check if the line is the first line of course information paragraph
                # <course prefix> <course number>: <course name> (<creidt hour> units)
                if basic_info_in_next_line or \
                        not_contain_variables(line, possible_variables) and \
                        re.findall(r"\A{}.+:".format(prefix), line) and \
                        count_whitespace(re.split(":", line, 1)[0]) == 1:

                    # check if a course is saved already,
                    # in this case, the course doesn't have academic period info
                    if course != {}:
                        course = {}
                        continue

                    basic_info_str += line
                    course, basic_info_str, basic_info_in_next_line = course_info_capturer(
                        course, basic_info_str, save_basic_info, fp, college_code, department_code)

                    # if course_info_capturer returns None as course,
                    # it means a 500 level course is encountered, then this file is finished, break
                    if course is None:
                        break

                # Check if the line is about the description
                # if the previous line is a description and
                # this line was detected not containing one of the variables (description_in_next_line = True)
                # or if it has the format of "Description: < Content >"
                elif description_in_next_line or re.findall(r"\ADescription: ", line):
                    description_info_str += line
                    course, description_info_str, description_in_next_line = course_info_capturer(
                        course, description_info_str, save_description, fp, college_code, department_code)

                # check if the next line is about the academic period
                elif re.findall(r"\AMain Campus: ", line):
                    terms = get_terms(line, year)
                    courses, course = save_course(
                        courses, course, terms)

            line = fp.readline()

    return courses, major_name, prefix


def save(output_path, major_name, courses_by_major, output_json_file):
    """ Output the course list as JSON and CSV files

    Output the course list as JSON and CSV files
    """
    if os.path.isdir(output_path) == False:
        os.mkdir(output_path)

    csv_path = "{}/{}.csv".format(output_path, major_name)

    if output_json_file:
        if os.path.isdir("{}/JSON/".format(output_path)) == False:
            os.mkdir("{}/JSON/".format(output_path))

        if os.path.isdir("{}/CSV/".format(output_path)) == False:
            os.mkdir("{}/CSV/".format(output_path))

        with open('{}/JSON/{}.json'.format(output_path, major_name), 'w') as f:
            json.dump(courses_by_major, f)

        csv_path = '{}/CSV/{}.csv'.format(output_path, major_name)

    csv_columns = ['college_code', 'department_code', 'course_code',
                   'course_number', 'course_title', 'credits_min',
                   'credits_max', 'academic_period', 'description']
    with open(csv_path, 'w') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=csv_columns)
        writer.writeheader()
        for data in courses_by_major:
            writer.writerow(data)


# current year
year = 2020

# paths
college_data_path = './data/college_department_programs/colleges.json'
pdfs_path = './data/course_pdfs/'
output_path = './outputs_by_course_codes/'

tmp_output_path = 'tmp.txt'
pdfs = os.listdir(pdfs_path)

output_courses_by_code = False
output_json_file = False
convert_json_to_csv = True
course_codes = []


all_courses = []

# for each college, for each department and each program
# extract the information from PDF
colleges = get_colleges(college_data_path)
college_codes = colleges.keys()
for college_code in college_codes:
    departments = colleges[college_code]
    department_codes = departments.keys()
    for department_code in department_codes:
        for prefix in departments[department_code]:
            pdf = "{}.pdf".format(prefix)
            if os.path.exists("{}/{}".format(pdfs_path, pdf)):
                courses_by_major, major_name, prefix = get_courses(
                    year, pdf, pdfs_path, college_code, department_code, tmp_output_path)

                all_courses += courses_by_major

                if output_courses_by_code:
                    save(output_path, major_name, courses_by_major, output_json_file)

                if convert_json_to_csv:
                    course_codes.append(
                        {"course_code": prefix,
                         "college_code": college_code,
                         "department_code": department_code})
            else:
                print("{} not found.".format(pdf))

save('./', "course", all_courses, output_json_file)

os.remove(tmp_output_path)

if convert_json_to_csv:
    csv_columns = ['course_code', 'college_code', 'department_code']
    with open('./data/college_department_programs/course_codes.csv', 'w') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=csv_columns)
        writer.writeheader()
        for data in course_codes:
            writer.writerow(data)
