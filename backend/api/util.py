import numpy as np
import json
import re
import os


def process_case_data(case):
    data_dir = "./metrics"
    subdir_path = os.path.join(data_dir, case)
    if not os.path.isdir(subdir_path):
        raise ValueError(f"Subdirectory '{case}' not found in '{data_dir}'.")

    metric_rename_map = {
        "train_rmse": "train_rmse",
        "train_nrmse": "train_nrmse",
        "train_l1": "train_l1",
        "thermalcollision2d/valid_nrmse": "valid_nrmse",
        "thermalcollision2d/valid_rmse": "valid_rmse",
        "thermalcollision2d/valid_l1": "valid_l1",
        "thermalcollision2d/dens_valid_nrmse": "dens_valid_nrmse",
        "thermalcollision2d/dens_valid_rmse": "dens_valid_rmse",
        "thermalcollision2d/dens_valid_l1": "dens_valid_l1",
        "thermalcollision2d/potentialtemperature_valid_nrmse": "ptemp_valid_nrmse",
        "thermalcollision2d/potentialtemperature_valid_rmse": "ptemp_valid_rmse",
        "thermalcollision2d/potentialtemperature_valid_l1": "ptemp_valid_l1",
        "thermalcollision2d/uwnd_valid_nrmse": "uwnd_valid_nrmse",
        "thermalcollision2d/uwnd_valid_rmse": "uwnd_valid_rmse",
        "thermalcollision2d/uwnd_valid_l1": "uwnd_valid_l1",
        "thermalcollision2d/wwnd_valid_nrmse": "wwnd_valid_nrmse",
        "thermalcollision2d/wwnd_valid_rmse": "wwnd_valid_rmse",
        "thermalcollision2d/wwnd_valid_l1": "wwnd_valid_l1",
    }

    data_dict = {metric: [] for metric in ["epoch"] + list(metric_rename_map.values())}

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
            for original_metric, renamed_metric in metric_rename_map.items():
                data_dict[renamed_metric].append(data.get(original_metric, np.nan))

    with open("sample.json", "w") as outfile:
        json.dump(data_dict, outfile)

    return data_dict


def process_all_cases(data_dir="./metrics"):
    def extract_epoch(filename):
        match = re.search(r"epoch(\d+)", filename)
        return int(match.group(1)) if match else -1

    metric_rename_map = {
        "train_rmse": "train_rmse",
        "train_nrmse": "train_nrmse",
        "train_l1": "train_l1",
        "thermalcollision2d/valid_nrmse": "valid_nrmse",
        "thermalcollision2d/valid_rmse": "valid_rmse",
        "thermalcollision2d/valid_l1": "valid_l1",
        "thermalcollision2d/dens_valid_nrmse": "dens_valid_nrmse",
        "thermalcollision2d/dens_valid_rmse": "dens_valid_rmse",
        "thermalcollision2d/dens_valid_l1": "dens_valid_l1",
        "thermalcollision2d/potentialtemperature_valid_nrmse": "ptemp_valid_nrmse",
        "thermalcollision2d/potentialtemperature_valid_rmse": "ptemp_valid_rmse",
        "thermalcollision2d/potentialtemperature_valid_l1": "ptemp_valid_l1",
        "thermalcollision2d/uwnd_valid_nrmse": "uwnd_valid_nrmse",
        "thermalcollision2d/uwnd_valid_rmse": "uwnd_valid_rmse",
        "thermalcollision2d/uwnd_valid_l1": "uwnd_valid_l1",
        "thermalcollision2d/wwnd_valid_nrmse": "wwnd_valid_nrmse",
        "thermalcollision2d/wwnd_valid_rmse": "wwnd_valid_rmse",
        "thermalcollision2d/wwnd_valid_l1": "wwnd_valid_l1",
    }

    all_data = {}

    for case in os.listdir(data_dir):
        subdir_path = os.path.join(data_dir, case)
        if not os.path.isdir(subdir_path):
            continue

        data_dict = {
            metric: [] for metric in ["epoch"] + list(metric_rename_map.values())
        }

        files = sorted(
            [f for f in os.listdir(subdir_path) if f.endswith(".json")],
            key=extract_epoch,
        )

        if len(files) <= 25:
            continue

        for filename in files[:90]:
            filepath = os.path.join(subdir_path, filename)
            with open(filepath, "r") as file:
                data = json.load(file)
                epoch = extract_epoch(filename)
                data_dict["epoch"].append(epoch)
                for original_metric, renamed_metric in metric_rename_map.items():
                    data_dict[renamed_metric].append(data.get(original_metric, np.nan))

        all_data[case] = data_dict

    with open("all_cases_data.json", "w") as outfile:
        json.dump(all_data, outfile)

    return all_data
