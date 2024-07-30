mport sys
import os
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job
from awsglue.dynamicframe import DynamicFrame
from pyspark.sql.dataframe import DataFrame
from pyspark.sql.functions import trim, split, explode
from pyspark.sql import functions as F
from pyspark.sql.types import StringType, LongType, IntegerType, DecimalType
from pyspark.sql import Window
from datetime import datetime, date
import re
import pandas as pd
from customfunction import *
 
 
## @params: [TempDir, JOB_NAME]
args = getResolvedOptions(sys.argv, ['TempDir', 'JOB_NAME'])
 
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)
dateString = date.today()
 
 
def read_script_from_s3(bucketname, folder, filename):
    s3 = boto3.resource('s3') 
    bucket = s3.Bucket(bucketname)
    obj = bucket.Object(key='{folder}{filename}'.format(folder=folder, filename=filename)) 
    query = obj.get()['Body'].read().decode('utf-8')
    text_content = query[:query.rfind(";")+1]
    print(text_content)
    return text_content

 
bucketname = 'spt1code'
foldername = 'kaoprod/prodsql/'
filename = 'elt_t393_weekly_offtake.sql'
 
query = read_script_from_s3(bucketname, foldername, filename)
 
print(f"query : {query}")
 
#
 
try:
    genericSchema = []
    genericSchema.append(["No Details", dateString, "Success", "weekkly_offtake", "No Details"])

    genericSchema = spark.createDataFrame(genericSchema).toDF("filename","execution date","status","Job", "DBTable")

#    filename    execution date    status    Job               DBTable
#    sadsaddsa   2022-08-16    Success    weekkly_offtake    agadadad
    
    genericSchema = DynamicFrame.fromDF(genericSchema, glueContext, "genericSchema")
 
    loadSuccess = glueContext.write_dynamic_frame.from_jdbc_conf(frame = genericSchema, catalog_connection = "cl2_kao", 
    connection_options = {"preactions": query, "dbtable": "kao_logs.weekly_offtake", "database": "kao"}, 
    redshift_tmp_dir = args["TempDir"], transformation_ctx = "loadSuccess")

except Exception as e:
    genericSchema = []
    genericSchema.append(["No Details", dateString, "Script Failed", "weekkly_offtake", "No Details"])
    genericSchema = spark.createDataFrame(genericSchema).toDF("filename","execution date","status","Job", "DBTable")
    genericSchema = DynamicFrame.fromDF(genericSchema, glueContext, "genericSchema")

    loadFailed = glueContext.write_dynamic_frame.from_jdbc_conf(frame = genericSchema, catalog_connection = "cl2_kao", 
    connection_options = {"dbtable": "kao_logs.weekly_offtake", "database": "kao"}, 
    redshift_tmp_dir = args["TempDir"], transformation_ctx = "loadFailed")
    
    raise Exception("SQL Failure. Check s3://spt1code/kaoprod/prodsql/elt_t393_weekly_offtake.sql")