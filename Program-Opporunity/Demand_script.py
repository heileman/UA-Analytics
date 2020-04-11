from bs4 import BeautifulSoup as soup
from urllib.request import urlopen as uReq
myurl="https://www.onetonline.org/find/result?s=CIP%20Code%2052.0101&a=1"
#opening the connection and grab the page
uClinet=uReq(myurl)
page_html=uClinet.read()
uClinet.close()
#parse the html
page_soup=soup(page_html,"html.parser")
#grab each products
containers1=page_soup.findAll("td",{"class":"reportrtd","width":"10%"})
n=len(containers1)
containers2=page_soup.findAll("td",{"class":"report2ed"})

  
import csv
with open("demand.csv",'w',newline='') as f:
    thewriter=csv.writer(f)
    thewriter.writerow(["CIP_Code", "Program", "Minimum_Wage", "Employment", "Projected_Growth", "Projected_Demand"])
    for i in range(n):
        cip=containers1[i].text
        program=containers2[i].text.split('\ ')[0]
        container=containers2[i]
        for link in container.findAll('a', attrs={'href': re.compile("^https://")}):
            myurl1=link.get('href')
            print(myurl1)
            uClinet=uReq(myurl1)
            page_html=uClinet.read()
            uClinet.close()
            page_soup=soup(page_html,"html.parser")
            containers3=page_soup.findAll("td",{"class":"report2","width":"67%"})
            if len(containers3[0].text.split(" "))<4:
                Wage=re.findall(r"[\w']+", containers3[0].text.split(" ")[0])
            else:
                Wage=re.findall(r"[\w']+", containers3[0].text.split(" ")[2])    
            Wage=int("".join(map(str,Wage)))
            Employee=re.findall(r"[\w']+", containers3[1].text.split(" ")[0])
            Employee=int("".join(map(str,Employee)))
            p11=containers3[2].text.split("(")[1].split('%')
            p1=re.findall(r'\d+', p11[0]) 
            p1 = list(map(int, p1))[0]
            if '-' in p11[0]: p1=-1*p1
            p2=re.findall(r'\d+', p11[1]) 
            #p2 = list(map(int, p2))[0]
            if p2==[]: AVG=p1
            else:
                #p2=re.findall(r'\d+', p11[1]) 
                p2 = list(map(int, p2))[0]
                if '-' in p11[1]: p2=-1*p2
                AVG=(p1+p2)/2
        Demand=(1+AVG/100)*Wage*Employee
        print("CIP: "+ cip)
        print("Program name is:{}".format(program))
        print("Wage is: {}".format(Wage))
        print("Employment is:{}".format(Employee))
        print("Percentile is: {}".format(AVG))
        print("Demand is: {}".format(Demand))
        print("\n")
        thewriter.writerow([cip ,program,Wage,Employee,AVG,Demand])
    f.close()
