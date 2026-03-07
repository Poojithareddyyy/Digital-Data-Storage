import matplotlib
matplotlib.use("Agg")

import matplotlib.pyplot as plt

def plot_dna_distribution(dna_sequence, filename):

    counts = {
        "A": dna_sequence.count("A"),
        "T": dna_sequence.count("T"),
        "G": dna_sequence.count("G"),
        "C": dna_sequence.count("C")
    }

    labels = counts.keys()
    values = counts.values()

    plt.figure(figsize=(6,4))
    plt.bar(labels, values)

    plt.title("DNA Base Distribution")
    plt.xlabel("Bases")
    plt.ylabel("Count")

    output_path = f"storage/{filename}_dna_graph.png"
    plt.savefig(output_path)

    plt.close()

    return output_path