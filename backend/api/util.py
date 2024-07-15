import numpy as np
import json
import re
import os


def process_data(case):
    data_dir = "./metrics"
    subdir_path = os.path.join(data_dir, case)
    if not os.path.isdir(subdir_path):
        raise ValueError(f"Subdirectory '{case}' not found in '{data_dir}'.")

    metrics = [
        "train_rmse",
        "train_nrmse",
        "train_l1",
        "thermalcollision2d/valid_nrmse",
        "thermalcollision2d/valid_rmse",
        "thermalcollision2d/valid_l1",
        "thermalcollision2d/dens_valid_nrmse",
        "thermalcollision2d/dens_valid_rmse",
        "thermalcollision2d/dens_valid_l1",
        "thermalcollision2d/potentialtemperature_valid_nrmse",
        "thermalcollision2d/potentialtemperature_valid_rmse",
        "thermalcollision2d/potentialtemperature_valid_l1",
        "thermalcollision2d/uwnd_valid_nrmse",
        "thermalcollision2d/uwnd_valid_rmse",
        "thermalcollision2d/uwnd_valid_l1",
        "thermalcollision2d/wwnd_valid_nrmse",
        "thermalcollision2d/wwnd_valid_rmse",
        "thermalcollision2d/wwnd_valid_l1",
    ]

    data_dict = {metric: [] for metric in ["epoch"] + metrics}

    def extract_epoch(filename):
        match = re.search(r"epoch(\d+)", filename)
        return int(match.group(1)) if match else -1

    files = sorted(
        [f for f in os.listdir(subdir_path) if f.endswith(".json")], key=extract_epoch
    )

    for filename in files:
        filepath = os.path.join(subdir_path, filename)
        with open(filepath, "r") as file:
            data = json.load(file)
            epoch = extract_epoch(filename)
            data_dict["epoch"].append(epoch)
            for metric in metrics:
                data_dict[metric].append(data.get(metric, np.nan))

    with open("sample.json", "w") as outfile:
        json.dump(data_dict, outfile)
    json_dict = json.dumps(data_dict)
    return json_dict

#
# case = "ti-64-16"
# print(process_data(case))
