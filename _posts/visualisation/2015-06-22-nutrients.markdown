---
layout: infographic
title:  "Nutrients Database"
date:   2015-06-22 16:58
tags: ["Parallel Coordinates"]
script: [""]
css: 
img: ""
type: "visualisation"
---


Scraper.py
==========

    import requests
    import bs4
    import pprint
    import csv

    pp = pprint.PrettyPrinter(indent=4)

    # Initialise constants
    starting_url = 'http://ndb.nal.usda.gov/ndb/foods?format=&count=&max=9000&sort=&fgcd=&manu=&lfacet=&qlookup=&offset=35&order=desc'
    root_url = 'http://ndb.nal.usda.gov'

    data_file = 'C:\\Users\\bhint_000\\Desktop\\nutrients_db.tsv'

    food = {} #  one food item
    foods = [] # list of all foods
    foods_nutrients = [] # list of all foods with their nutrients
    data = []
    nutrient = {}



    def get_list(page_url):
        response = requests.get(page_url)
        soup = bs4.BeautifulSoup(response.text)

        data = soup.select('.wbox tbody tr')

        print("Foods found: " + str(len(data)))

        for row in data:
            food = {}
            cols = row.find_all('td')
            food['id'] = row.a.string
            food['description'] = cols[1].a.string
            food['group'] = cols[2].string
            food['link'] = row.a['href']

            foods.append(food)



    def get_food_info(food):
        food_url = root_url + food['link']
        food['nutrients'] = []
        response = requests.get(food_url)
        soup = bs4.BeautifulSoup(response.text)

        data = soup.select('tbody .odd')

        for row in data:
            nutrient = {}
            cols = row.find_all('td')
            nutrient['name'] = cols[0].string.strip()
            nutrient['unit'] = cols[1].string
            nutrient['value'] = cols[2].string

            food['nutrients'].append( nutrient)

        print(len(food['nutrients'] ))
        foods_nutrients.append(food)
        write_food(food)

    def write_food(food):
        for nutrient in food['nutrients']:
                writer.writerow([food['id']
                                 ,root_url+food['link']
                                 ,food['description']
                                 ,food['group']
                                 , nutrient['name']
                                 , nutrient['unit']
                                 , nutrient['value']
                                 ])


    get_list(starting_url)

    outcsv = open(data_file, 'w')  
    writer = csv.writer(outcsv, delimiter='\t', quotechar='|', quoting=csv.QUOTE_MINIMAL, lineterminator='\n')
    writer.writerow(['id'
                         ,'link'
                         ,'description'
                         ,'group'
                         ,'name'
                         ,'unit'
                         ,'value'])

    for food in foods:
        get_food_info(food) 

    outcsv.close()

