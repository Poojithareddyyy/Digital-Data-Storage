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

    if not os.path.exists(local_path):
        print("❌ DNA file not found")
        return

    recovered = bytearray()

    with open(local_path, "r") as f:
        first_line = f.readline().strip()

        # Check if file contains metadata header
        if first_line.startswith("FILENAME:"):
            original_filename = first_line.replace("FILENAME:", "")
            hash_line = f.readline().strip()
            original_hash = hash_line.replace("HASH:", "")
            f.readline()  # skip ---
            lines = f.readlines()
            header_present = True
        else:
            # No header → external DNA file
            original_filename = dna_filename.replace(".dna", "")
            lines = [first_line] + f.readlines()
            header_present = False

    for line in lines:
        if "|" not in line:
            continue

        length_str, dna_chunk = line.strip().split("|")
        original_length = int(length_str)

        encoded_bytes = dna_to_bytes(dna_chunk)
        decoded_chunk = rsc.decode(encoded_bytes)[0]

        recovered.extend(decoded_chunk[:original_length])

    # If secure mode enabled, try decrypt
    try:
        from security import decrypt_data
        recovered = decrypt_data(bytes(recovered))
    except:
        pass

    output_path = f"storage/reconstructed/{original_filename}"

    with open(output_path, "wb") as f:
        f.write(recovered)

    print("✅ Decoding Complete")
    print("Recovered file saved at:", output_path)





if __name__ == "__main__":
    dna_input = input("Enter DNA filename to decode: ")
    decode_file(dna_input)
