import numpy as np
import json
import re
import os
import pandas as pd


def process_case_data(case):
    data_dir = "/Users/jquinn/Downloads/datadim pre/"
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
        "time/train_time": "train_time",
    }

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

    if len(data_dict["epoch"]) >= 10:
        last_10_epochs_rmse = data_dict["valid_rmse"][-10:]
        final_training_accuracy = np.nanmean(last_10_epochs_rmse)
    else:
        final_training_accuracy = np.nan

    training_sum = np.nansum(data_dict["train_time"])

    data_dict["final_training_acc"] = final_training_accuracy
    data_dict["total_training_time"] = training_sum

    with open(f"{case}_data.json", "w") as outfile:
        json.dump(data_dict, outfile)

    return data_dict


def process_all_cases(data_dir="/Users/jquinn/Downloads/datadim pre/"):
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
        "time/train_time": "train_time",
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

        for filename in files[:100]:  # Process only the first 90 epochs
            filepath = os.path.join(subdir_path, filename)
            with open(filepath, "r") as file:
                data = json.load(file)
                epoch = extract_epoch(filename)
                data_dict["epoch"].append(epoch)
                for original_metric, renamed_metric in metric_rename_map.items():
                    data_dict[renamed_metric].append(data.get(original_metric, np.nan))

        if len(data_dict["epoch"]) >= 10:
            last_10_epochs_rmse = data_dict["valid_rmse"][-10:]
            final_training_accuracy = np.nanmean(last_10_epochs_rmse)

        else:
            final_training_accuracy = np.nan

        training_sum = np.nansum(data_dict["train_time"])

        data_dict["final_training_acc"] = final_training_accuracy
        data_dict["total_training_time"] = training_sum

        all_data[case] = data_dict

    with open("all_cases_data.json", "w") as outfile:
        json.dump(all_data, outfile)

    return all_data


def process_radar_data(data_dict):
    radar_data = {}

    # Initialize lists to collect values for normalization
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
        "train_time",
    ]

    all_metrics = {metric: [] for metric in metrics}

    # Collect all metric values from each case
    for case, df in data_dict.items():
        if len(df.get("epoch", [])) >= 10:
            # Calculate average of the last 10 epochs for each metric
            avg_last_10 = {}
            for metric in metrics:
                values = df.get(metric, [])
                if len(values) >= 10:
                    avg_last_10[metric] = np.nanmean(values[-10:])
                else:
                    avg_last_10[metric] = np.nan

            radar_data[case] = avg_last_10

            # Append metrics for normalization
            for metric in metrics:
                all_metrics[metric].append(avg_last_10[metric])

    # Normalize the metrics
    min_values = {metric: min(values) for metric, values in all_metrics.items()}
    max_values = {metric: max(values) for metric, values in all_metrics.items()}

    for case, metrics in radar_data.items():
        for metric in metrics:
            if metric in min_values and metric in max_values:
                if "rmse" in metric or "l1" in metric or "nrmse" in metric:
                    radar_data[case][metric] = (
                        90
                        * (max_values[metric] - metrics[metric])
                        / (max_values[metric] - min_values[metric])
                        + 10
                    )
                else:
                    radar_data[case][metric] = (
                        90
                        * (metrics[metric] - min_values[metric])
                        / (max_values[metric] - min_values[metric])
                        + 10
                    )

    # Convert the radar data to a DataFrame
    radar_df = pd.DataFrame(radar_data).transpose()
    print(radar_df)
    with open("radar_data.json", "w") as outfile:
        json.dump(radar_data, outfile)

    return radar_data


case_data = process_case_data("b-256-32")
all_cases_data = process_all_cases()

radar_df = process_radar_data(all_cases_data)
