import json
import csv

data = []

university_total_fall_census_count = 0
university_total_fiscal_year_count = 0
university_total_fiscal_year_NTR = 0
university_total_average_NTR_per_student = 0
university_resident_fall_census_count = 0
university_resident_fiscal_year_count = 0
university_resident_fiscal_year_NTR = 0
university_resident_average_NTR_per_student = 0
university_non_resid_fall_census_count = 0
university_non_resid_fiscal_year_count = 0
university_non_resid_fiscal_year_NTR = 0
university_non_resid_average_NTR_per_student = 0
university_international_fall_count = 0
university_international_fiscal_year_count = 0
university_international_fiscal_year_NTR = 0
university_international_avg_NTR_per_student = 0
university_total_cost = 0
university_EG = 0


with open('cost_NTR.csv', newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    headers = next(reader, None)
    # print(headers)
    for row in reader:
        program_data = {'fiscal_year': row[0],
                        'career_level': row[1],
                        'academic_career': row[2],
                        'primary_program': row[3],
                        'total_fall_census_count': row[4],
                        'total_fiscal_year_count': row[5],
                        'total_fiscal_year_NTR': row[6],
                        'total_average_NTR_per_student': row[7],
                        'resident_fall_census_count': row[8],
                        'resident_fiscal_year_count': row[9],
                        'resident_fiscal_year_NTR': row[10],
                        'resident_average_NTR_per_student': row[11],
                        'non_resid_fall_census_count': row[12],
                        'non_resid_fiscal_year_count': row[13],
                        'non_resid_fiscal_year_NTR': row[14],
                        'non_resid_average_NTR_per_student': row[15],
                        'international_fall_count': row[16],
                        'international_fiscal_year_count': row[17],
                        'international_fiscal_year_NTR': row[18],
                        'international_avg_NTR_per_student': row[19],
                        'total_cost': row[20],
                        'E&G': row[21]}
        data.append(program_data)


with open('data.json', 'w') as outfile:
    json.dump(data, outfile)
