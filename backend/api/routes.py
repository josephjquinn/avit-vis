from flask import Blueprint, jsonify
from .util import process_case_data, process_all_cases
import netCDF4 as nc
import zlib

main = Blueprint("main", __name__)


@main.route("/")
def home():
    return "Server is running"


@main.route("/metrics/<case>")
def metrics(case):
    try:
        json_data = process_case_data(case)
        return jsonify(json_data)
    except ValueError as e:
        return str(e), 404


@main.route("/all-metrics")
def all_metrics():
    try:
        json_data = process_all_cases()
        return jsonify(json_data)
    except ValueError as e:
        return str(e), 404


# Example: Load large data from NetCDF and retrieve first 100 timesteps
def load_large_data(file_path):
    dataset = nc.Dataset(file_path, mode="r")

    # Retrieve the 't' dimension (time steps)
    timesteps = min(
        dataset.variables["t"].shape[0], 100
    )  # Ensure not more than 100 timesteps if less available

    # Retrieve only the first 100 timesteps of 'dens' variable
    dens = dataset.variables["dens"][:timesteps]

    dataset.close()
    return dens


@main.route("/send_data", methods=["GET"])
def send_data():
    file_path = "/path/to/your/large_file.nc"
    dens = load_large_data(file_path)

    # Compress the data
    compressed_data = zlib.compress(dens.tobytes())

    # Example parameters to send along with the data
    params = {"param1": "value1", "param2": "value2"}

    # Stream the data as a response
    def generate():
        yield jsonify({"params": params})
        yield compressed_data

    return Response(generate(), content_type="application/json")
