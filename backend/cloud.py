import os
import shutil

# Simulation of your buckets as local folders
STORAGE_DIR = "storage"
BACKUP_DIR = "dna-backup"

# Ensure directories exist
for folder in [STORAGE_DIR, BACKUP_DIR]:
    if not os.path.exists(folder):
        os.makedirs(folder)

def create_bucket():
    # No action needed for local simulation
    pass

def upload_file(local_path, cloud_name):
    """
    Replaces s3.upload_file. 
    Copies encoded DNA files from /uploads to /storage.
    """
    dest_path = os.path.join(STORAGE_DIR, cloud_name)
    shutil.copy(local_path, dest_path)

def download_file(cloud_name, local_path):
    """
    Replaces s3.download_file.
    Copies file from /storage back to a local path for decoding.
    """
    source_path = os.path.join(STORAGE_DIR, cloud_name)
    if os.path.exists(source_path):
        shutil.copy(source_path, local_path)
    else:
        raise FileNotFoundError(f"File {cloud_name} not found in storage.")

def upload_backup(local_path, object_name):
    """
    Replaces s3.upload_file for backups.
    """
    dest_path = os.path.join(BACKUP_DIR, object_name)
    shutil.copy(local_path, dest_path)