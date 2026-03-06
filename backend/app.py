from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
import shutil

from encoder_secure import encode_file
from decoder_secure import decode_file


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "storage/uploads"
DNA_FOLDER = "storage/dna_files"
RECON_FOLDER = "storage/reconstructed"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(DNA_FOLDER, exist_ok=True)
os.makedirs(RECON_FOLDER, exist_ok=True)


@app.get("/download/{filename}")
def download(filename: str):

    dna_path = f"{DNA_FOLDER}/{filename}"
    recon_path = f"{RECON_FOLDER}/{filename}"

    if os.path.exists(recon_path):
        return FileResponse(recon_path, filename=filename)

    if os.path.exists(dna_path):
        return FileResponse(dna_path, filename=filename)

    return {"error": "File not found"}


# ---------------- ENCODE ---------------- #

@app.post("/encode")
async def encode(file: UploadFile = File(...)):

    file_path = f"{UPLOAD_FOLDER}/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # run encoder
    encode_file(file_path)

    dna_filename = file.filename + ".dna"

    return {
        "status": "success",
        "dna_file": dna_filename
    }


# ---------------- DECODE ---------------- #

@app.post("/decode")
async def decode(file: UploadFile = File(...)):

    file_path = f"{DNA_FOLDER}/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    decode_file(file.filename)

    output_file = file.filename.replace(".dna", "")

    return {
        "status": "success",
        "file": output_file
    }


# ---------------- LIST FILES ---------------- #

@app.get("/files")
def get_files():

    files = os.listdir(DNA_FOLDER)

    return {"files": files}


# ---------------- DOWNLOAD ---------------- #

@app.get("/download/{filename}")
def download(filename: str):

    path = f"{DNA_FOLDER}/{filename}"

    return FileResponse(path, filename=filename)