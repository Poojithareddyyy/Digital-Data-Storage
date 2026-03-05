import os
import matplotlib.pyplot as plt

def plot_analysis(original_size, dna_size, encoding_time, gc_content, file_name):

    # Create main folder only once
    base_folder = "analysis_results"
    os.makedirs(base_folder, exist_ok=True)

    # Remove extension (.pdf etc.)
    clean_name = file_name.split(".")[0]

    # 1️⃣ Size Graph
    plt.figure()
    plt.bar(["Original", "DNA"], [original_size, dna_size])
    plt.title(f"Size Comparison - {clean_name}")
    plt.ylabel("Size (bytes)")
    plt.savefig(os.path.join(base_folder, f"{clean_name}_size.png"))
    plt.close()

    # 2️⃣ Encoding Time Graph
    plt.figure()
    plt.bar(["Encoding Time"], [encoding_time])
    plt.title(f"Encoding Time - {clean_name}")
    plt.ylabel("Seconds")
    plt.savefig(os.path.join(base_folder, f"{clean_name}_time.png"))
    plt.close()

    # 3️⃣ GC Content Graph
    plt.figure()
    plt.bar(["GC Content"], [gc_content])
    plt.title(f"GC Content - {clean_name}")
    plt.ylabel("Percentage")
    plt.savefig(os.path.join(base_folder, f"{clean_name}_gc.png"))
    plt.close()

    print("📊 Graphs saved in analysis_results/")
