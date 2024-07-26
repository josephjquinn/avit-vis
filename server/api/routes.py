from flask import Blueprint, jsonify
from .util import process_case, process_all, normalize


metrics_dir = "./metrics/"

main = Blueprint("main", __name__)


@main.route("/")
def home():
    return "Server is running"


@main.route("/metrics/<case>")
def metrics(case):
    try:
        json_data = process_case(metrics_dir, case)
        return jsonify(json_data)
    except ValueError as e:
        return str(e), 404


@main.route("/all")
def all_metrics():
    try:
        json_data = process_all(metrics_dir)
        return jsonify(json_data)
    except ValueError as e:
        return str(e), 404


@main.route("/norm")
def normalization():
    try:
        proc = process_all(metrics_dir)
        norm = normalize(proc)
        return jsonify(norm)
    except ValueError as e:
        return str(e), 404
