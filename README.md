# Net-Vis

Net-Vis is an application designed for interactive visualization of performance metrics from machine learning models used in physics simulations. Built from scratch using React, TypeScript, and Python, this tool serves as a foundational component for machine learning research and can be extended for various applications.

## Screenshots

<img width=600 src="./imgs/demo1.png" alt="Demo 1">
<img width=600 src="./imgs/demo2.png" alt="Demo 2">
<img width=600 src="./imgs/demo3.png" alt="Demo 3">

## Data Processing CLI

`--data_dir`: Specifies the directory containing data files (default is ./metrics/).

`--case_name`: Defines the name of a specific case to process. If not provided, the script will process all cases.

`--all`: Processes all cases in the specified directory.

`--norm`: Normalizes metrics for all cases.

`--min`: Finds the minimum values for all metrics across cases.

## Flask Server

The project contains an optional Flask server with provided API's for managing and processing training metrics.

Routes

- `GET /metrics/<case>/`: Extracts and processes training metrics from JSON files for a specific parameter case.
- `GET /all/<case>/`: Aggregates and processes metrics from all cases in the metrics directory.
- `GET /all` Normalizes all metrics to a relative scale (0-100) suitable for radar charts.
- `GET /norm`: Extracts the minimum values from each metric across all cases.

### Installation

1. Clone the repository:

```sh
git clone https://github.com/josephjquinn/net-vis.git
```

2. Change to client directory:

```sh
cd client
```

3. Install dependencies

```sh
npm i
```

4. Start app

```sh
npm run dev
```

### Data Processing

1. Change to the server directory:

```sh
cd server
```

2. Install the dependencies:

```sh
pip install -r requirements
```

3. Main script

```sh
python main.py [flags]
```

### Optional Flask Server

1. Start Server

```sh
python run.sh
```
