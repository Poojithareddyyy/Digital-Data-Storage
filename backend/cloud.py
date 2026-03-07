import os
import shutil

# This simulates your buckets as local folders on the Render server
STORAGE_DIR = "storage"
BACKUP_DIR = "dna-backup"

# Create folders if they don't exist
for folder in [STORAGE_DIR, BACKUP_DIR]:
    if not os.path.exists(folder):
        os.makedirs(folder)

def create_bucket():
    # No action needed for local simulation
    pass

def upload_file(local_path, cloud_name):
    # Instead of s3.upload, we copy the file to the 'storage' folder
    dest_path = os.path.join(STORAGE_DIR, cloud_name)
    shutil.copy(local_path, dest_path)

def download_file(cloud_name, local_path):
    # Instead of s3.download, we copy it back from 'storage'
    source_path = os.path.join(STORAGE_DIR, cloud_name)
    if os.path.exists(source_path):
        shutil.copy(source_path, local_path)
    else:
        # Fallback for demo: create the file if it's missing
        with open(local_path, 'w') as f:
            f.write("mock_data")

def upload_backup(local_path, object_name):
    dest_path = os.path.join(BACKUP_DIR, object_name)
    shutil.copy(local_path, dest_path)