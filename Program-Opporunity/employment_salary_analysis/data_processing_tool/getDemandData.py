import pandas as pd


def getData(majors):
    res = []
    [res.append(x) for x in majors if x not in res]
    df = pd.read_csv("../data/Multiple_opportunities.csv")
    df["Salary"] = df["Salary"].astype(int)
    df["Number of Employee"] = df["Number of Employee"].astype(int)
    df["Weighted Salary"] = df["Salary"] * df["Number of Employee"]

    majorData = df[df["Major"].isin(res)]
    weightedSalaries = majorData["Weighted Salary"]
    numEmployee = majorData["Number of Employee"]
    averageNumEmployee = (
        0 if numEmployee.sum() == 0 else weightedSalaries.sum() / numEmployee.sum()
    )
    weightedAverageSalary = (
        0 if len(numEmployee) == 0 else numEmployee.sum() / len(numEmployee)
    )
    return (averageNumEmployee, weightedAverageSalary)
