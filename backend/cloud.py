# backend/cloud.py

import boto3

s3 = boto3.client(
    's3',
    aws_access_key_id='minioadmin',
    aws_secret_access_key='minioadmin',
    endpoint_url='http://127.0.0.1:9000'
)

BUCKET = "dna-storage"
BACKUP_BUCKET = "dna-backup"


def create_bucket():
    try:
        s3.create_bucket(Bucket=BUCKET)
    except:
        pass


def upload_file(local_path, cloud_name):
    s3.upload_file(local_path, BUCKET, cloud_name)


def download_file(cloud_name, local_path):
    s3.download_file(BUCKET, cloud_name, local_path)


def upload_backup(local_path, object_name):
    s3.upload_file(local_path, BACKUP_BUCKET, object_name)