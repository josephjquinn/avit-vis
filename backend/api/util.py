import numpy as np
import json
import re
import os
import pandas as pd

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
    "time/train_time": "train_time",
}

node_counts = {
    # TI Cases
    "ti-64-32": 4,
    "ti-64-16": 4,
    "ti-64-8": 4,
    "ti-256-32": 4,
    "ti-256-16": 4,
    "ti-256-8": 4,
    "ti-1024-32": 4,
    # S Cases
    "s-64-32": 4,
    "s-64-16": 4,
    "s-64-8": 4,
    "s-256-32": 4,
    "s-256-16": 4,
    "s-256-8": 4,
    # B Cases
    "b-64-32": 4,
    "b-64-16": 4,
    "b-64-8": 4,
    "b-256-32": 4,
    "b-256-16": 4,
    "b-256-8": 4,
}


def process_case(data_dir, case):
    subdir_path = os.path.join(data_dir, case)
    if not os.path.isdir(subdir_path):
        raise ValueError(f"Subdirectory '{case}' not found in '{data_dir}'.")

    data_dict = {metric: [] for metric in ["epoch"] + list(metric_rename_map.values())}

    def extract_epoch(filename):
        match = re.search(r"epoch(\d+)", filename)
        return int(match.group(1)) if match else -1

    files = sorted(
        [f for f in os.listdir(subdir_path) if f.endswith(".json")], key=extract_epoch
    )

    for filename in files[:100]:
        filepath = os.path.join(subdir_path, filename)
        with open(filepath, "r") as file:
            data = json.load(file)
            epoch = extract_epoch(filename)
            data_dict["epoch"].append(epoch)
            for original_metric, renamed_metric in metric_rename_map.items():
                data_dict[renamed_metric].append(data.get(original_metric, np.nan))

    final_training_accuracy = np.nanmin(data_dict["valid_rmse"])

    training_sum = np.nansum(data_dict["train_time"])
    num_nodes = node_counts.get(case, 1)

    data_dict["final_training_acc"] = final_training_accuracy
    data_dict["node_hours"] = (training_sum * num_nodes) / 3600

    with open(f"./output/{case}.json", "w") as outfile:
        json.dump(data_dict, outfile)

    return data_dict


def process_all(data_dir):
    def extract_epoch(filename):
        match = re.search(r"epoch(\d+)", filename)
        return int(match.group(1)) if match else -1

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

        for filename in files[:100]:
            filepath = os.path.join(subdir_path, filename)
            with open(filepath, "r") as file:
                data = json.load(file)
                epoch = extract_epoch(filename)
                data_dict["epoch"].append(epoch)
                for original_metric, renamed_metric in metric_rename_map.items():
                    data_dict[renamed_metric].append(data.get(original_metric, np.nan))

        final_training_accuracy = np.nanmin(data_dict["valid_rmse"])
        training_sum = np.nansum(data_dict["train_time"])
        num_nodes = node_counts.get(case, 1)

        data_dict["final_training_acc"] = final_training_accuracy
        data_dict["node_hours"] = (training_sum * num_nodes) / 3600

        all_data[case] = data_dict

    with open("./output/all_cases.json", "w") as outfile:
        json.dump(all_data, outfile)

    return all_data


def normalize(data_dict):
    radar_data = {}
    metrics = [
        "train_rmse",
        "train_nrmse",
        "train_l1",
        "valid_nrmse",
        "valid_rmse",
        "valid_l1",
        "dens_valid_nrmse",
        "dens_valid_rmse",
        "dens_valid_l1",
        "ptemp_valid_nrmse",
        "ptemp_valid_rmse",
        "ptemp_valid_l1",
        "uwnd_valid_nrmse",
        "uwnd_valid_rmse",
        "uwnd_valid_l1",
        "wwnd_valid_nrmse",
        "wwnd_valid_rmse",
        "wwnd_valid_l1",
        "node_hours",
    ]

    all_metrics = {metric: [] for metric in metrics if metric != "node_hours"}
    node_hours_values = []

    for case, df in data_dict.items():
        if len(df.get("epoch", [])) >= 10:
            avg_last_10 = {}
            for metric in metrics:
                values = df.get(metric, [])

                # Ensure values is a list or array
                if isinstance(values, (np.float64, float, int)):
                    values = [values]
                elif not isinstance(values, (list, np.ndarray)):
                    values = []

                if metric != "node_hours":
                    if len(values) >= 10:
                        avg_last_10[metric] = np.nanmean(values[-10:])
                    else:
                        avg_last_10[metric] = np.nan
                    all_metrics[metric].append(avg_last_10[metric])
                else:
                    avg_last_10[metric] = values[0] if values else np.nan
                    node_hours_values.append(avg_last_10[metric])

            radar_data[case] = avg_last_10

    min_values = {
        metric: min(values) for metric, values in all_metrics.items() if values
    }
    max_values = {
        metric: max(values) for metric, values in all_metrics.items() if values
    }
    if node_hours_values:
        min_node_hours = min(node_hours_values)
        max_node_hours = max(node_hours_values)

    for case, metrics in radar_data.items():
        for metric in metrics:
            if metric in min_values and metric in max_values:
                if "rmse" in metric or "l1" in metric or "nrmse" in metric:
                    radar_data[case][metric] = round(
                        90
                        * (max_values[metric] - metrics[metric])
                        / (max_values[metric] - min_values[metric])
                        + 10,
                        2,
                    )
                else:
                    radar_data[case][metric] = round(
                        90
                        * (metrics[metric] - min_values[metric])
                        / (max_values[metric] - min_values[metric])
                        + 10,
                        2,
                    )
            elif metric == "node_hours":
                radar_data[case][metric] = round(
                    90
                    * (metrics[metric] - min_node_hours)
                    / (max_node_hours - min_node_hours)
                    + 10,
                    2,
                )

    radar_df = pd.DataFrame(radar_data).transpose()
    with open("./output/normalized.json", "w") as outfile:
        json.dump(radar_data, outfile)

    return radar_data


def find_min(data_dict):
    lowest_values_per_case = {}

    for case, metrics_data in data_dict.items():
        case_lowest_values = {}

        for metric, values in metrics_data.items():
            if metric == "epoch":
                continue
            if metric == "final_training_acc":
                continue
            if metric == "train_time":
                continue
            if values:
                case_lowest_values[metric] = np.nanmin(values)
            else:
                case_lowest_values[metric] = np.nan

        lowest_values_per_case[case] = case_lowest_values

    with open("./output/mins.json", "w") as outfile:
        json.dump(lowest_values_per_case, outfile, indent=4)

    return lowest_values_per_case
