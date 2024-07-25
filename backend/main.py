import argparse
from api.util import process_case, process_all, normalize


def main(args):
    data_dir = args.data_dir
    case_name = args.case_name
    process_all_tags = args.all_tags
    normalize_tags = args.norm_tags

    if case_name:
        process_case(data_dir, case_name)
        print(f"Processed case data for: {case_name}")

    if process_all_tags:
        all_cases_data = process_all(data_dir)
        print("Processing all cases.")

    if normalize_tags:
        all_cases_data = process_all(data_dir)
        radar_df = normalize(all_cases_data)
        print("Normalizing all cases.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process and normalize data.")

    parser.add_argument(
        "--data_dir",
        type=str,
        default="./metrics/",
        help="Directory containing the data files.",
    )

    parser.add_argument(
        "--case_name",
        type=str,
        default=None,
        help="Name of the case to process. If not specified, only all cases data will be processed.",
    )

    parser.add_argument("--all_tags", action="store_true", help="Process all tags.")

    parser.add_argument("--norm_tags", action="store_true", help="Normalize tags.")

    args = parser.parse_args()
    main(args)
