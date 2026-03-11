from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

import shutil

from encoder_secure import encode_file
from decoder_secure import decode_file
import os

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI()

# ---------------- STORAGE PATHS ---------------- #

UPLOAD_FOLDER = "storage/uploads"
DNA_FOLDER = "storage/dna_files"
RECON_FOLDER = "storage/reconstructed"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(DNA_FOLDER, exist_ok=True)
os.makedirs(RECON_FOLDER, exist_ok=True)


# ---------------- CORS ---------------- #

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for the demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------- SHOW STORAGE ---------------- #

@app.get("/storage")
def show_storage():
    files = os.listdir(DNA_FOLDER)
    return {"stored_files": files}


# ---------------- LIST FILES ---------------- #

@app.get("/files")
def get_files():
    files = os.listdir(DNA_FOLDER)
    return {"files": files}


# ---------------- DOWNLOAD ---------------- #

@app.get("/download/{filename}")
async def download_file(filename: str):
    # Check Reconstructed folder first (for decoded files)
    recon_path = os.path.join("storage/reconstructed", filename)
    # Check DNA folder (for encoded files)
    dna_path = os.path.join("storage/dna_files", filename)
    
    if os.path.exists(recon_path):
        target_path = recon_path
    elif os.path.exists(dna_path):
        target_path = dna_path
    else:
        return {"error": f"File {filename} not found in storage"}

    return FileResponse(
        path=target_path,
        filename=filename,
        media_type='application/octet-stream'
    )


# ---------------- ENCODE ---------------- #

@app.post("/encode")
async def encode(file: UploadFile = File(...)):

    file_path = f"{UPLOAD_FOLDER}/{file.filename}"

    # Save uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Run encoder
    encode_file(file_path)

    dna_filename = file.filename + ".dna"

    return {
        "status": "success",
        "message": "File encoded successfully",
        "dna_file": dna_filename,
        "download_link": f"/download/{dna_filename}"
    }


# ---------------- DECODE ---------------- #

@app.post("/decode")
async def decode(file: UploadFile = File(...)):

    file_path = f"{DNA_FOLDER}/{file.filename}"

    # Save uploaded DNA file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Run decoder
    decode_file(file.filename)

    output_file = file.filename.replace(".dna", "")

    return {
        "status": "success",
        "message": "DNA decoded successfully",
        "decoded_file": output_file,
        "download_link": f"/download/{output_file}"
    }

@app.get("/graph/{filename}")
def get_graph(filename: str):

    graph_path = f"storage/{filename}_dna_graph.png"

    if os.path.exists(graph_path):
        return FileResponse(graph_path)

    return {"error": "Graph not found"}