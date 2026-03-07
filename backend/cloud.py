import os
import shutil

# Local simulation of MinIO buckets
STORAGE_DIR = os.path.join(os.getcwd(), "storage")
BACKUP_DIR = os.path.join(os.getcwd(), "dna-backup")

# Create directories on startup
for folder in [STORAGE_DIR, BACKUP_DIR]:
    if not os.path.exists(folder):
        os.makedirs(folder, exist_ok=True)

def create_bucket():
    pass # Not needed for local folders

def upload_file(local_path, cloud_name):
    dest_path = os.path.join(STORAGE_DIR, cloud_name)
    shutil.copy(local_path, dest_path)
    return True

def download_file(cloud_name, local_path):
    source_path = os.path.join(STORAGE_DIR, cloud_name)
    if os.path.exists(source_path):
        shutil.copy(source_path, local_path)
        return True
    raise FileNotFoundError(f"File {cloud_name} not found.")

def upload_backup(local_path, object_name):
    dest_path = os.path.join(BACKUP_DIR, object_name)
    shutil.copy(local_path, dest_path)
    return True