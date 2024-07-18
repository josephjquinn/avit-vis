from flask import Blueprint, jsonify
from .util import process_case_data, process_all_cases

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
