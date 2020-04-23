import pandas as pd
import json


def count_courses(courses_df):
    is_undgrad = courses_df['Career'] == 'UGRD'
    undgrad = courses_df[is_undgrad]
    undgrad_count = dict(undgrad['Subject'].value_counts())

    is_grad = courses_df['Career'] != 'UGRD'
    grad = courses_df[is_grad]
    grad_count = dict(grad['Subject'].value_counts())

    return (undgrad_count, grad_count)


def get_percentages():
    courses_online_df = pd.read_excel(
        '../data/online_courses.xls', index_col=0)
    all_courses_df = pd.read_excel('../data/all_courses.xlsx', index_col=0)
    all_courses = all_courses_df.drop_duplicates(subset=['Subject', 'Catalog'])

    undgrad_count_online, grad_count_online = count_courses(courses_online_df)
    undgrad_count, grad_count = count_courses(all_courses)

    undgrad_percentages = {
        k: undgrad_count_online[k] / undgrad_count[k] if k in undgrad_count_online else 0 for k in undgrad_count}
    grad_percentages = {
        k: grad_count_online[k] / grad_count[k] if k in grad_count_online else 0 for k in grad_count}

    return undgrad_percentages, grad_percentages
