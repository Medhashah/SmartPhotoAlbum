import json
import boto3
import json
import requests

def getRestaurants(keyword):
    
    host = 'https://vpc-photo-53ylcjt23vag6gbxhl3pvzwl4i.us-east-1.es.amazonaws.com' 
    index = 'photos'
    url = host + '/' + index + '/_search/?q=' + keyword
    print(url)
    response = {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": '*'
        },
        "isBase64Encoded": False
    }
    response['body'] = r.text
    data = r.json()
    # print(data)
    final_list=[]
    for photos in data["hits"]["hits"]:
        print("phptos", photos)
        bucket = photos["_source"]["bucket"]
        key = photos["_source"]["objectKey"]
        final_list.append("https://s3.amazonaws.com/"+bucket+"/"+key)
        
    return final_list