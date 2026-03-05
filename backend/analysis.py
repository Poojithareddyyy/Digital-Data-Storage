def calculate_gc_content(dna_sequence):
    total = len(dna_sequence)
    if total == 0:
        return 0

    g_count = dna_sequence.count("G")
    c_count = dna_sequence.count("C")

    gc_percentage = ((g_count + c_count) / total) * 100
    return round(gc_percentage, 2)


def max_homopolymer_length(dna_sequence):
    max_count = 1
    current_count = 1

    for i in range(1, len(dna_sequence)):
        if dna_sequence[i] == dna_sequence[i - 1]:
            current_count += 1
            max_count = max(max_count, current_count)
        else:
            current_count = 1

    return max_count
