import os
from reedsolo import RSCodec
import time
from cloud import upload_file
from security import encrypt_data
from integrity import generate_hash
from analysis import calculate_gc_content, max_homopolymer_length
from analysis_graph import plot_analysis
os.makedirs("storage/dna_files", exist_ok=True)
rsc = RSCodec(10)
CHUNK_SIZE = 200

mapping = {
    "00":"A",
    "01":"C",
    "10":"G",
    "11":"T"
}

def bytes_to_dna(data_bytes):
    binary = ''.join(format(byte, '08b') for byte in data_bytes)
    dna = ""
    for i in range(0, len(binary), 2):
        dna += mapping[binary[i:i+2]]
    return dna

def encode_file(file_path):
    start_time = time.time()

    if not os.path.exists(file_path):
        print("❌ File not found")
        return

    filename = os.path.basename(file_path)

    with open(file_path, "rb") as f:
        file_bytes = f.read()

# Generate hash before encryption
    original_hash = generate_hash(file_bytes)

# Encrypt file
    file_bytes = encrypt_data(file_bytes)


    dna_filename = filename + ".dna"
    dna_path = f"storage/dna_files/{dna_filename}"

    with open(dna_path, "w") as f:
        f.write(f"FILENAME:{filename}\n")
        f.write(f"DATE:{time.strftime('%d-%m-%Y')}\n")
        f.write("---\n")
    
        for i in range(0, len(file_bytes), CHUNK_SIZE):
            chunk = file_bytes[i:i+CHUNK_SIZE]
            encoded = rsc.encode(chunk)

            dna_chunk = bytes_to_dna(encoded)

            # store original chunk length before encoded chunk
            f.write(str(len(chunk)) + "|" + dna_chunk + "\n")

    end_time = time.time()
    encoding_time = round(end_time - start_time, 3)

    # Read full DNA sequence for analysis
    with open(dna_path, "r") as f:
        lines = f.readlines()

    dna_only = ""
    for line in lines:
        if "|" in line:
            dna_only += line.strip().split("|")[1]

    gc_content = calculate_gc_content(dna_only)
    homopolymer = max_homopolymer_length(dna_only)

    original_size = os.path.getsize(file_path)
    dna_size = os.path.getsize(dna_path)
    expansion_ratio = round(dna_size / original_size, 2)

    print("\n📊 PERFORMANCE ANALYSIS")
    print("Original Size:", original_size, "bytes")
    print("DNA Size:", dna_size, "bytes")
    print("Expansion Ratio:", expansion_ratio, "x")
    print("Encoding Time:", encoding_time, "seconds")
    print("GC Content:", gc_content, "%")
    print("Max Homopolymer Length:", homopolymer)

    #upload_file(dna_path, dna_filename)
    #from cloud import upload_backup
   # upload_backup(dna_path, dna_filename)
   # print("☁ Backup stored in secondary bucket")
    plot_analysis(original_size, dna_size, encoding_time, gc_content, filename)


    print("✅ Encoding Complete")
    print("DNA saved at:", dna_path)
    return dna_filename


if __name__ == "__main__":
    file_input = input("Enter file path to encode: ")
    encode_file(file_input)
