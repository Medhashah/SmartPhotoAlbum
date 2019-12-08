import json
import boto3
import searchKeyword
import requests

s3_resource = boto3.resource('s3')
lexClient = boto3.client('lex-runtime')

def lambda_handler(event, context):
    
    print(event)
    #print(event['isBase64Encoded'])
    print(event['queryStringParameters']['q'])
    response = lexClient.post_text(
        botName = "photoBot",
        botAlias = "$LATEST",
        userId = "admin",
        inputText = event['queryStringParameters']['q']
    )
    print(response)
    final_string = response['slots']
    First_keyword = final_string['query']
    Second_keyword = final_string['querytwo']
    # print("first")
    # print(First_keyword)
    dataFirst = searchKeyword.getRestaurants(First_keyword)
    # print("the data is")
    # print(dataFirst)
    if (Second_keyword != None and Second_keyword.strip() != ""):
        dataSecond = searchKeyword.getRestaurants(Second_keyword)
        print(dataFirst,dataSecond)
        commonList = list(set(dataFirst).union(set(dataSecond)))
        print("commonlist is")
        print(commonList)
    else:
        print(dataFirst)
        commonList = dataFirst
        
    text_sample=""
    
    # if commonList is None or len(commonList) == 0 :
    #     text_sample = "I couldn't find anything for the criterias you specified. Why don't you try with something else?"
    # else :
    if commonList is None or len(commonList) == 0 :
        text_sample = ""
    else:
        text_sample = ",".join(commonList)
    value_to_be_returned = {}
    
    message ={"contentType" : "PlainText", "content" : text_sample}
    
    dialogAction = {"type" : "Close", "fulfillmentState": "Fulfilled" ,"message" : message}
    
    value_to_be_returned["dialogAction"] = dialogAction
    
    print(value_to_be_returned["dialogAction"]["message"]["content"])
    return {
        'statusCode': 200,
        'headers': {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials':True
     },
        'body': value_to_be_returned["dialogAction"]["message"]["content"]#json.dumps('Hello from Lambda!')
    }