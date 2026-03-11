import os
from reedsolo import RSCodec
from security import decrypt_data
from integrity import generate_hash
secure_mode = True   # set False if decoding external non-encrypted DNA file

rsc = RSCodec(10)

reverse_map = {
    "A": "00",
    "C": "01",
    "G": "10",
    "T": "11"
}


def dna_to_bytes(dna):
    binary = "".join(reverse_map[b] for b in dna)

    byte_array = bytearray()

    for i in range(0, len(binary), 8):
        byte_array.append(int(binary[i:i+8], 2))

    return bytes(byte_array)


def decode_file(dna_filename):
    local_path = f"storage/dna_files/{dna_filename}"
    if not os.path.exists(local_path): return

    recovered = bytearray()
    with open(local_path, "r") as f:
        lines = f.readlines()

    # Find the data start
    data_start = 0
    original_filename = dna_filename.replace(".dna", "")
    for i, line in enumerate(lines):
        if "FILENAME:" in line:
            original_filename = line.split(":")[1].strip()
        if "---" in line:
            data_start = i + 1
            break

    for line in lines[data_start:]:
        if "|" not in line: continue
        length_str, dna_chunk = line.strip().split("|")
        original_length = int(length_str)
        
        # Binary Reconstruction
        encoded_bytes = dna_to_bytes(dna_chunk)
        decoded_chunk = rsc.decode(encoded_bytes)[0]
        recovered.extend(decoded_chunk[:original_length])

    final_data = bytes(recovered)
    
    # CRITICAL: Decryption can sometimes fail if padding is wrong
    try:
        from security import decrypt_data
        decrypted = decrypt_data(final_data)
        if decrypted:
            final_data = decrypted
    except Exception as e:
        print(f"Decryption error: {e}")

    # Final Save
    os.makedirs("storage/reconstructed", exist_ok=True)
    output_path = f"storage/reconstructed/{original_filename}"
    with open(output_path, "wb") as f:
        f.write(final_data)                               




if __name__ == "__main__":
    dna_input = input("Enter DNA filename to decode: ")
    decode_file(dna_input)
