from api.util import process_case, process_all, normalize

data_dir = "./metrics/"
case_data = process_case(data_dir, "b-256-32")
all_cases_data = process_all(data_dir)
radar_df = normalize(all_cases_data)
