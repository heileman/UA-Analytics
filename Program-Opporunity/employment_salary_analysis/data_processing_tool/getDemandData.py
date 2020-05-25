import pandas as pd


def getData(majors):
    majors = ["Real Estate Development Analysis",
              "Real Estate Development Practice", "Master in Real Estate Development"]
    df = pd.read_csv('../data/Multiple_opportunities.csv')
    df['Salary'] = df['Salary'].astype(int)
    df["Number of Employee"] = df["Number of Employee"].astype(int)
    df['Weighted Salary'] = df['Salary'] * df["Number of Employee"]

    majorData = df[df['Major'].isin(majors)]
    weightedSalaries = majorData['Weighted Salary']
    numEmployee = majorData['Number of Employee']

    averageNumEmployee = weightedSalaries.sum() / numEmployee.sum()
    weightedAverageSalary = numEmployee.sum() / len(numEmployee)
    return (averageNumEmployee, weightedAverageSalary)
